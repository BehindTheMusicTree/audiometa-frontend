/**
 * Converts a camelCase or PascalCase key to a human-readable label
 * (e.g. "sampleRate" → "Sample rate", "bitDepth" → "Bit depth").
 */
export function camelToLabel(key: string): string {
  if (!key) return key;
  const withSpaces = key.replace(/([A-Z])/g, " $1").trim();
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1).toLowerCase();
}
