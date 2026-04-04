import { onMounted, onUnmounted, ref, type Ref } from 'vue'

function syncPortraitAndLockSupport(
  isPortrait: Ref<boolean>,
  canLockOrientation: Ref<boolean>,
) {
  if (!import.meta.client) {
    return
  }
  isPortrait.value = window.matchMedia('(orientation: portrait)').matches
  const o = screen.orientation as ScreenOrientation & {
    lock?: (orientation: OrientationLockType) => Promise<void>
  }
  canLockOrientation.value = typeof o?.lock === 'function'
}

/**
 * Request landscape lock where the Screen Orientation API allows it.
 * Many browsers (especially mobile Chrome) only allow lock() after a user gesture —
 * calling from onMounted alone fails silently, so we also try on first pointerdown.
 */
export function tryLockLandscape(): void {
  if (!import.meta.client) {
    return
  }
  const o = screen.orientation as ScreenOrientation & {
    lock?: (orientation: OrientationLockType) => Promise<void>
  }
  if (typeof o?.lock !== 'function') {
    return
  }
  void o.lock('landscape').catch(() => {
    /* needs user gesture, fullscreen, insecure context, or unsupported */
  })
}

/**
 * Stronger lock for an explicit tap (e.g. "Use landscape"). Some Android Chrome
 * builds only allow lock after entering fullscreen; we try lock first, then fullscreen + lock.
 */
export async function requestLandscapeLock(): Promise<void> {
  if (!import.meta.client) {
    return
  }
  const o = screen.orientation as ScreenOrientation & {
    lock?: (orientation: OrientationLockType) => Promise<void>
  }
  if (typeof o?.lock !== 'function') {
    return
  }
  try {
    await o.lock('landscape')
    return
  } catch {
    /* try fullscreen then lock */
  }
  try {
    const el = document.documentElement
    if (el.requestFullscreen) {
      await el.requestFullscreen()
    }
    await o.lock('landscape')
  } catch {
    /* insecure context, denied fullscreen, or unsupported */
  }
}

/**
 * Prefer landscape: CSS handles layout; lock orientation where supported.
 * Returns refs for optional UI (e.g. portrait hint on play).
 */
export function useLandscapePresentation() {
  const isPortrait = ref(false)
  const canLockOrientation = ref(false)

  function sync() {
    syncPortraitAndLockSupport(isPortrait, canLockOrientation)
  }

  function onOrientationOrResize() {
    sync()
  }

  onMounted(() => {
    if (!import.meta.client) {
      return
    }
    sync()
    tryLockLandscape()

    const onFirstPointer = () => {
      tryLockLandscape()
    }
    window.addEventListener('pointerdown', onFirstPointer, {
      passive: true,
      once: true,
    })

    window.addEventListener('orientationchange', onOrientationOrResize)
    window.addEventListener('resize', onOrientationOrResize)
  })

  onUnmounted(() => {
    if (!import.meta.client) {
      return
    }
    window.removeEventListener('orientationchange', onOrientationOrResize)
    window.removeEventListener('resize', onOrientationOrResize)
  })

  return { isPortrait, canLockOrientation, tryLockLandscape, requestLandscapeLock }
}
