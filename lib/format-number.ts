/**
 * Formats bitrate in bps (e.g. 320000 → "320 kbps").
 */
export function formatBitrateBps(bps: number): string {
  if (!Number.isFinite(bps) || bps < 0) return String(bps);
  if (bps >= 1_000_000) return `${(bps / 1_000_000).toFixed(1)} Mbps`;
  if (bps >= 1000) return `${Math.round(bps / 1000)} kbps`;
  return `${bps} bps`;
}

/**
 * Formats sample rate in Hz (e.g. 44100 → "44.1 kHz").
 */
export function formatSampleRateHz(hz: number): string {
  if (!Number.isFinite(hz) || hz < 0) return String(hz);
  if (hz >= 1_000_000) return `${(hz / 1_000_000).toFixed(1)} MHz`;
  if (hz >= 1000) return `${(hz / 1000).toFixed(1)} kHz`;
  return `${hz} Hz`;
}

/**
 * Formats file size in bytes (e.g. 7408677 → "7.1 MB").
 */
export function formatFileSizeBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return String(bytes);
  const units = ["B", "KB", "MB", "GB"];
  let u = 0;
  let n = bytes;
  while (n >= 1024 && u < units.length - 1) {
    n /= 1024;
    u += 1;
  }
  const value = u === 0 ? n : n.toFixed(1).replace(/\.0$/, "");
  return `${value} ${units[u]}`;
}
