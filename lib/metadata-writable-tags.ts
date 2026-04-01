export type WritableTagFormState = {
  title: string;
  artistsNames: string[];
  albumName: string;
  albumArtistsNames: string[];
  genresNames: string[];
  rating: string;
  language: string;
};

export function emptyWritableTagFormState(): WritableTagFormState {
  return {
    title: "",
    artistsNames: [""],
    albumArtistsNames: [""],
    genresNames: [""],
    albumName: "",
    rating: "",
    language: "",
  };
}

function normalizeListField(val: unknown): string[] {
  if (Array.isArray(val)) {
    const parts = val
      .map((v) => (v == null ? "" : String(v).trim()))
      .filter((s) => s.length > 0);
    return parts.length > 0 ? parts : [""];
  }
  if (typeof val === "string" && val.trim()) return [val.trim()];
  return [""];
}

function pickString(raw: Record<string, unknown>, camel: string, snake: string) {
  const v = raw[camel] ?? raw[snake];
  if (v == null) return "";
  return typeof v === "string" ? v : String(v);
}

function pickList(raw: Record<string, unknown>, camel: string, snake: string) {
  return normalizeListField(raw[camel] ?? raw[snake]);
}

function tryUnifiedMetadataFallback(
  raw: Record<string, unknown>,
): Partial<WritableTagFormState> | null {
  const u = raw.unifiedMetadata ?? raw.unified_metadata;
  if (u == null || typeof u !== "object" || Array.isArray(u)) return null;
  const o = u as Record<string, unknown>;
  const out: Partial<WritableTagFormState> = {};
  const t = o.title ?? o.TITLE;
  if (typeof t === "string" && t) out.title = t;
  const artists = o.artists ?? o.artistsNames ?? o.artists_names ?? o.ARTISTS;
  if (artists != null) out.artistsNames = normalizeListField(artists);
  const album = o.album ?? o.albumName ?? o.album_name ?? o.ALBUM;
  if (typeof album === "string" && album) out.albumName = album;
  const aa =
    o.albumArtists ??
    o.albumArtistsNames ??
    o.album_artists_names ??
    o.ALBUM_ARTISTS;
  if (aa != null) out.albumArtistsNames = normalizeListField(aa);
  const genres = o.genresNames ?? o.genres_names ?? o.genres ?? o.GENRES_NAMES;
  if (genres != null) out.genresNames = normalizeListField(genres);
  const r = o.rating ?? o.RATING;
  if (typeof r === "number" && Number.isFinite(r)) out.rating = String(r);
  else if (typeof r === "string" && r.trim()) out.rating = r.trim();
  const lang = o.language ?? o.LANGUAGE;
  if (typeof lang === "string" && lang) out.language = lang;
  return Object.keys(out).length > 0 ? out : null;
}

export function writableTagsFromSessionJson(
  raw: Record<string, unknown>,
): WritableTagFormState {
  const base: WritableTagFormState = {
    title: pickString(raw, "title", "title"),
    artistsNames: pickList(raw, "artistsNames", "artists_names"),
    albumName: pickString(raw, "albumName", "album_name"),
    albumArtistsNames: pickList(raw, "albumArtistsNames", "album_artists_names"),
    genresNames: pickList(raw, "genresNames", "genres_names"),
    language: pickString(raw, "language", "language"),
    rating: "",
  };
  const ratingVal = raw.rating ?? raw.RATING;
  if (typeof ratingVal === "number" && Number.isFinite(ratingVal)) {
    base.rating = String(ratingVal);
  } else if (typeof ratingVal === "string" && ratingVal.trim()) {
    base.rating = ratingVal.trim();
  }

  const hasRoot =
    base.title.trim() !== "" ||
    base.albumName.trim() !== "" ||
    base.language.trim() !== "" ||
    base.rating !== "" ||
    base.artistsNames.some((s) => s.trim() !== "") ||
    base.albumArtistsNames.some((s) => s.trim() !== "") ||
    base.genresNames.some((s) => s.trim() !== "");

  if (!hasRoot) {
    const fb = tryUnifiedMetadataFallback(raw);
    if (fb) {
      return {
        title: fb.title ?? base.title,
        artistsNames: fb.artistsNames ?? base.artistsNames,
        albumName: fb.albumName ?? base.albumName,
        albumArtistsNames: fb.albumArtistsNames ?? base.albumArtistsNames,
        genresNames: fb.genresNames ?? base.genresNames,
        rating: fb.rating ?? base.rating,
        language: fb.language ?? base.language,
      };
    }
  }

  return base;
}

export function cloneWritableTagFormState(s: WritableTagFormState): WritableTagFormState {
  return {
    title: s.title,
    artistsNames: [...s.artistsNames],
    albumArtistsNames: [...s.albumArtistsNames],
    genresNames: [...s.genresNames],
    albumName: s.albumName,
    rating: s.rating,
    language: s.language,
  };
}

export function buildWritableMetadataDownloadBody(
  state: WritableTagFormState,
): Record<string, unknown> {
  const artistsNames = state.artistsNames.map((s) => s.trim()).filter(Boolean);
  const albumArtistsNames = state.albumArtistsNames
    .map((s) => s.trim())
    .filter(Boolean);
  const genresNames = state.genresNames.map((s) => s.trim()).filter(Boolean);
  const body: Record<string, unknown> = {
    title: state.title.trim(),
    artistsNames,
    albumName: state.albumName.trim(),
    albumArtistsNames,
    genresNames,
    language: state.language.trim(),
  };
  const r = state.rating.trim();
  if (r === "") {
    body.rating = null;
  } else {
    const n = Number(r);
    if (Number.isFinite(n)) body.rating = Math.min(100, Math.max(0, Math.trunc(n)));
    else body.rating = null;
  }
  return body;
}
