/**
 * Self-hosted Umami — loads only when both public runtime vars are set
 * (`NUXT_PUBLIC_UMAMI_SCRIPT_URL`, `NUXT_PUBLIC_UMAMI_WEBSITE_ID`).
 */
export default defineNuxtPlugin(() => {
  const pub = useRuntimeConfig().public
  const src = typeof pub.umamiScriptUrl === 'string' ? pub.umamiScriptUrl.trim() : ''
  const websiteId =
    typeof pub.umamiWebsiteId === 'string' ? pub.umamiWebsiteId.trim() : ''
  if (!src || !websiteId) {
    return
  }

  useHead({
    script: [
      {
        defer: true,
        src,
        'data-website-id': websiteId,
      },
    ],
  })
})
