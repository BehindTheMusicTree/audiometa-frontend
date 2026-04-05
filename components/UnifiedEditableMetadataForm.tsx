"use client";

import { useTranslations } from "next-intl";
import type {
  UnifiedFieldDescriptor,
  UnifiedFormValues,
} from "@/lib/unified-metadata-form";
import { emptyValueForField } from "@/lib/unified-metadata-form";

type Props = {
  schemaById: Map<string, UnifiedFieldDescriptor>;
  supportedIds: string[];
  visibleFieldIds: string[];
  values: UnifiedFormValues;
  onValuesChange: (next: UnifiedFormValues) => void;
  onVisibleChange: (next: string[]) => void;
  disabled?: boolean;
};

function updateStringList(
  list: string[],
  index: number,
  item: string,
): string[] {
  const next = [...list];
  next[index] = item;
  return next;
}

function removeStringListIndex(list: string[], index: number): string[] {
  if (list.length <= 1) return [""];
  return list.filter((_, i) => i !== index);
}

function addStringListRow(list: string[]): string[] {
  return [...list, ""];
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

export default function UnifiedEditableMetadataForm({
  schemaById,
  supportedIds,
  visibleFieldIds,
  values,
  onValuesChange,
  onVisibleChange,
  disabled = false,
}: Props) {
  const t = useTranslations("WritableTags");

  function patchValues(partial: Partial<UnifiedFormValues>) {
    onValuesChange({ ...values, ...partial });
  }

  const addableIds = supportedIds
    .filter((id) => !visibleFieldIds.includes(id))
    .sort((a, b) => {
      const la = schemaById.get(a)?.label ?? a;
      const lb = schemaById.get(b)?.label ?? b;
      return la.localeCompare(lb);
    });

  function addField(fieldId: string) {
    if (!fieldId || visibleFieldIds.includes(fieldId)) return;
    const desc = schemaById.get(fieldId);
    const init = emptyValueForField(desc);
    onVisibleChange([...visibleFieldIds, fieldId].sort((a, b) => a.localeCompare(b)));
    patchValues({ [fieldId]: init });
  }

  function removeField(fieldId: string) {
    onVisibleChange(visibleFieldIds.filter((x) => x !== fieldId));
    const next = { ...values };
    delete next[fieldId];
    onValuesChange(next);
  }

  const sortedVisible = [...visibleFieldIds].sort((a, b) => {
    const la = schemaById.get(a)?.label ?? a;
    const lb = schemaById.get(b)?.label ?? b;
    return la.localeCompare(lb);
  });

  return (
    <div className="flex flex-col gap-4">
      {sortedVisible.map((fieldId) => {
        const desc = schemaById.get(fieldId);
        const label = desc?.label ?? fieldId;
        const multi =
          desc?.multiple === true || desc?.valueType === "strings";
        const vt = desc?.valueType;

        if (multi) {
          const list = Array.isArray(values[fieldId])
            ? (values[fieldId] as string[])
            : [""];
          return (
            <fieldset
              key={fieldId}
              className="m-0 flex flex-col gap-2 border-0 p-0"
            >
              <legend className="mb-1 flex w-full items-center justify-between gap-2 text-sm font-medium text-slate-700">
                <span>{label}</span>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => removeField(fieldId)}
                  className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("removeField")}
                </button>
              </legend>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {list.map((item, index) => (
                  <li
                    key={`${fieldId}-${index}`}
                    className="flex flex-wrap items-center gap-2"
                  >
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        patchValues({
                          [fieldId]: updateStringList(
                            list,
                            index,
                            e.target.value,
                          ),
                        })
                      }
                      disabled={disabled}
                      aria-label={t("listItemAria", {
                        label,
                        index: index + 1,
                      })}
                      autoComplete="off"
                      className={`min-w-0 flex-1 ${inputClass}`}
                    />
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() =>
                        patchValues({
                          [fieldId]: removeStringListIndex(list, index),
                        })
                      }
                      className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t("remove")}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={disabled}
                onClick={() =>
                  patchValues({ [fieldId]: addStringListRow(list) })
                }
                className="self-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("addRow")}
              </button>
            </fieldset>
          );
        }

        if (vt === "integer" || vt === "number") {
          const v = values[fieldId];
          const numVal =
            typeof v === "number"
              ? v
              : typeof v === "string" && v !== ""
                ? Number(v)
                : "";
          return (
            <div key={fieldId} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor={`uf-${fieldId}`}
                  className="text-sm font-medium text-slate-700"
                >
                  {label}
                </label>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => removeField(fieldId)}
                  className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("removeField")}
                </button>
              </div>
              <input
                id={`uf-${fieldId}`}
                type="number"
                min={fieldId === "rating" ? 0 : undefined}
                max={fieldId === "rating" ? 100 : undefined}
                step={vt === "integer" || fieldId === "rating" ? 1 : "any"}
                value={numVal === "" ? "" : numVal}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === "") patchValues({ [fieldId]: "" });
                  else {
                    const n = Number(raw);
                    patchValues({
                      [fieldId]: Number.isFinite(n) ? n : "",
                    });
                  }
                }}
                disabled={disabled}
                placeholder={
                  fieldId === "rating" ? t("optionalPlaceholder") : undefined
                }
                className={inputClass}
              />
            </div>
          );
        }

        const strVal =
          typeof values[fieldId] === "string" ? values[fieldId] : "";
        return (
          <div key={fieldId} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor={`uf-${fieldId}`}
                className="text-sm font-medium text-slate-700"
              >
                {label}
              </label>
              <button
                type="button"
                disabled={disabled}
                onClick={() => removeField(fieldId)}
                className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("removeField")}
              </button>
            </div>
            <input
              id={`uf-${fieldId}`}
              type="text"
              value={strVal}
              onChange={(e) => patchValues({ [fieldId]: e.target.value })}
              disabled={disabled}
              autoComplete="off"
              className={inputClass}
            />
          </div>
        );
      })}

      {addableIds.length > 0 && (
        <div className="flex flex-col gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-3">
          <label htmlFor="unified-add-field" className="text-sm font-medium text-slate-700">
            {t("addField")}
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <select
              id="unified-add-field"
              disabled={disabled}
              defaultValue=""
              onChange={(e) => {
                const v = e.target.value;
                if (v) {
                  addField(v);
                  e.target.value = "";
                }
              }}
              className={`max-w-full min-w-[12rem] ${inputClass}`}
            >
              <option value="">{t("fieldToAddPlaceholder")}</option>
              {addableIds.map((id) => (
                <option key={id} value={id}>
                  {schemaById.get(id)?.label ?? id}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
