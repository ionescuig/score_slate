import { onMounted } from 'vue'

/**
 * Prefer landscape: CSS handles layout; optionally lock orientation where supported.
 */
export function useLandscapePresentation() {
  onMounted(() => {
    if (!import.meta.client) {
      return
    }
    const o = screen.orientation as ScreenOrientation & {
      lock?: (orientation: OrientationLockType) => Promise<void>
    }
    if (typeof o?.lock === 'function') {
      o.lock('landscape').catch(() => {
        /* user gesture or unsupported */
      })
    }
  })
}
