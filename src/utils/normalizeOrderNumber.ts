export function normalizeOrderNumber(value: string): string {
  return value
    .replace("#", "")
    .replace(/\s/g, "")
    .trim()
    .toUpperCase();
}