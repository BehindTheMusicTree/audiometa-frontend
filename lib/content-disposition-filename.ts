export function parseContentDispositionFilename(
  header: string | null,
): string | null {
  if (!header) return null;
  const star = /filename\*\s*=\s*([^']*)''([^;\s]+)/i.exec(header);
  if (star?.[2]) {
    try {
      return decodeURIComponent(star[2].replace(/\+/g, " "));
    } catch {
      return star[2];
    }
  }
  const quoted = /filename\s*=\s*"([^"]+)"/i.exec(header);
  if (quoted?.[1]) return quoted[1];
  const unquoted = /filename\s*=\s*([^;\s]+)/i.exec(header);
  if (unquoted?.[1]) return unquoted[1].replace(/^["']|["']$/g, "");
  return null;
}
