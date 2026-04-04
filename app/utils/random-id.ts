/** Prefer UUID v4; fall back when `crypto.randomUUID` is unavailable (e.g. HTTP on LAN). */
export function randomId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID()
    } catch {
      /* non-secure context or runtime limits */
    }
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`
}
