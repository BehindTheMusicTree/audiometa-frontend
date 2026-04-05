export type UnifiedFieldDescriptor = {
  id: string;
  label: string;
  multiple: boolean;
  valueType?: string;
  optionalValue?: boolean;
};

export type UnifiedFormValues = Record<
  string,
  string | string[] | number | ""
>;

export type UnifiedFormState = {
  schema: UnifiedFieldDescriptor[];
  schemaById: Map<string, UnifiedFieldDescriptor>;
  supported: Set<string>;
  visibleFieldIds: string[];
  values: UnifiedFormValues;
};

/** Map unified snake_case ids to JSON keys (camelCase) for API request/response. */
export function unifiedFieldIdToJsonKey(id: string): string {
  return id.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

function isNonEmptyUnifiedValue(v: unknown): boolean {
  if (v === null || v === undefined) return false;
  if (typeof v === "string") return v.trim() !== "";
  if (typeof v === "number") return Number.isFinite(v);
  if (Array.isArray(v)) {
    return v.some((x) => x != null && String(x).trim() !== "");
  }
  return true;
}

function normalizeDescriptor(row: Record<string, unknown>): UnifiedFieldDescriptor | null {
  const id = String(row.id ?? "");
  if (!id) return null;
  return {
    id,
    label: String(row.label ?? id),
    multiple: Boolean(row.multiple),
    valueType:
      row.valueType != null
        ? String(row.valueType)
        : row.value_type != null
          ? String(row.value_type)
          : undefined,
    optionalValue:
      row.optionalValue != null
        ? Boolean(row.optionalValue)
        : row.optional_value != null
          ? Boolean(row.optional_value)
          : undefined,
  };
}

export function extractSchemaAndSupported(meta: Record<string, unknown>): {
  schema: UnifiedFieldDescriptor[];
  supported: Set<string>;
} {
  const rawSchema =
    meta.unifiedMetadataFieldSchema ?? meta.unified_metadata_field_schema;
  const rawSupported =
    meta.supportedUnifiedMetadataFieldIds ??
    meta.supported_unified_metadata_field_ids;
  const schemaArr = Array.isArray(rawSchema)
    ? (rawSchema as Record<string, unknown>[])
    : [];
  const schema = schemaArr
    .map((row) => normalizeDescriptor(row))
    .filter((d): d is UnifiedFieldDescriptor => d != null);
  const supportedList = Array.isArray(rawSupported)
    ? (rawSupported as string[])
    : [];
  return { schema, supported: new Set(supportedList) };
}

const DEFAULT_START_FIELDS = [
  "title",
  "artists",
  "album",
  "album_artists",
  "genres_names",
  "rating",
  "language",
] as const;

export function initialVisibleFieldIds(
  unifiedMetadata: Record<string, unknown>,
  supported: Set<string>,
): string[] {
  const withValues: string[] = [];
  for (const id of supported) {
    const k = unifiedFieldIdToJsonKey(id);
    const raw = unifiedMetadata[k] ?? unifiedMetadata[id];
    if (isNonEmptyUnifiedValue(raw)) withValues.push(id);
  }
  if (withValues.length > 0) {
    return [...new Set(withValues)].sort((a, b) => a.localeCompare(b));
  }
  return DEFAULT_START_FIELDS.filter((id) => supported.has(id));
}

function normalizeStringList(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    const parts = raw
      .map((x) => (x == null ? "" : String(x).trim()))
      .filter((s) => s.length > 0);
    return parts.length > 0 ? parts : [];
  }
  if (typeof raw === "string" && raw.trim()) return [raw.trim()];
  return [];
}

export function unifiedMetadataToFormValues(
  unifiedMetadata: Record<string, unknown>,
  fieldIds: string[],
  schemaById: Map<string, UnifiedFieldDescriptor>,
): UnifiedFormValues {
  const out: UnifiedFormValues = {};
  for (const id of fieldIds) {
    const desc = schemaById.get(id);
    const k = unifiedFieldIdToJsonKey(id);
    const raw = unifiedMetadata[k] ?? unifiedMetadata[id];
    const multi =
      desc?.multiple === true || desc?.valueType === "strings";
    if (multi) {
      const list = normalizeStringList(raw);
      out[id] = list.length > 0 ? list : [""];
    } else if (desc?.valueType === "integer" || desc?.valueType === "number") {
      if (raw == null || raw === "") out[id] = "";
      else if (typeof raw === "number") out[id] = raw;
      else {
        const n = Number(raw);
        out[id] = Number.isFinite(n) ? n : "";
      }
    } else {
      if (raw == null) out[id] = "";
      else if (typeof raw === "number") out[id] = String(raw);
      else out[id] = String(raw);
    }
  }
  return out;
}

export function emptyValueForField(
  desc: UnifiedFieldDescriptor | undefined,
): string | string[] | "" {
  if (!desc) return "";
  if (desc.multiple || desc.valueType === "strings") return [""];
  if (desc.valueType === "integer" || desc.valueType === "number") return "";
  return "";
}

export function buildUnifiedMetadataDownloadBody(
  fieldIds: string[],
  values: UnifiedFormValues,
  schemaById: Map<string, UnifiedFieldDescriptor>,
): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  for (const id of fieldIds) {
    const desc = schemaById.get(id);
    const jsonKey = unifiedFieldIdToJsonKey(id);
    const v = values[id];
    if (!desc) {
      body[jsonKey] = v === undefined ? "" : String(v).trim();
      continue;
    }
    const multi =
      desc?.multiple === true || desc?.valueType === "strings";
    if (multi) {
      const arr = Array.isArray(v)
        ? v.map((s) => String(s).trim()).filter(Boolean)
        : [];
      body[jsonKey] = arr;
    } else if (desc?.valueType === "integer") {
      if (v === "" || v === undefined) {
        body[jsonKey] = null;
      } else {
        const n = typeof v === "number" ? v : Number(v);
        if (Number.isFinite(n)) body[jsonKey] = Math.trunc(n);
        else body[jsonKey] = null;
      }
    } else if (desc?.valueType === "number" && id === "rating") {
      if (v === "" || v === undefined) body[jsonKey] = null;
      else {
        const n = typeof v === "number" ? v : Number(v);
        if (Number.isFinite(n)) {
          body[jsonKey] = Math.min(100, Math.max(0, Math.trunc(n)));
        } else body[jsonKey] = null;
      }
    } else if (desc?.valueType === "number") {
      if (v === "" || v === undefined) {
        body[jsonKey] = null;
      } else {
        const n = typeof v === "number" ? v : Number(v);
        if (Number.isFinite(n)) body[jsonKey] = n;
        else body[jsonKey] = null;
      }
    } else {
      body[jsonKey] = v === undefined ? "" : String(v).trim();
    }
  }
  return body;
}

export function buildUnifiedFormStateFromSession(
  rawMetadata: Record<string, unknown>,
): UnifiedFormState | null {
  const { schema, supported } = extractSchemaAndSupported(rawMetadata);
  if (schema.length === 0 || supported.size === 0) return null;
  const schemaById = new Map(schema.map((d) => [d.id, d]));
  const um = (rawMetadata.unifiedMetadata ??
    rawMetadata.unified_metadata ??
    {}) as Record<string, unknown>;
  const visibleFieldIds = initialVisibleFieldIds(um, supported);
  const values = unifiedMetadataToFormValues(um, visibleFieldIds, schemaById);
  return { schema, schemaById, supported, visibleFieldIds, values };
}

export function cloneUnifiedFormState(s: UnifiedFormState): UnifiedFormState {
  const values: UnifiedFormValues = {};
  for (const [k, v] of Object.entries(s.values)) {
    values[k] = Array.isArray(v) ? [...v] : v;
  }
  return {
    schema: s.schema,
    schemaById: s.schemaById,
    supported: s.supported,
    visibleFieldIds: [...s.visibleFieldIds],
    values,
  };
}
