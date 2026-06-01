/** Fixed locale/timezone so SSR and client hydration produce the same string. */
export function formatPublishedAt(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });
}
