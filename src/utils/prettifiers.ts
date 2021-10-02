/** A collection of utilities for creating human-readable strings. */

/** Display a file size using metric units. */
export function prettyFileSize(bytes: number): string {
  if (bytes < 1000) return `${bytes} bytes`;
  const units = "kMGTPEZY";
  let power = -1;
  do {
    bytes /= 1000;
    power++;
  } while (bytes >= 1000 && power < units.length - 1);
  return `${bytes.toFixed(2)} ${units[power]}B`;
}
