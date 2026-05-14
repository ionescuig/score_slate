// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  runtimeConfig: {
    public: {
      /** Production origin, no trailing slash (e.g. https://scoreslate.example.com). Enables canonical + og:url. */
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL ?? '',
      /** Absolute URL to default Open Graph image (e.g. 1200×630). Optional until you host one. */
      ogImageUrl: process.env.NUXT_PUBLIC_OG_IMAGE_URL ?? '',
      /** Full URL to Umami `script.js` (e.g. https://umami.example.com/script.js). Empty = no tracker. */
      umamiScriptUrl: process.env.NUXT_PUBLIC_UMAMI_SCRIPT_URL ?? '',
      /** Umami site `data-website-id`. Empty = no tracker. */
      umamiWebsiteId: process.env.NUXT_PUBLIC_UMAMI_WEBSITE_ID ?? '',
    },
  },
  routeRules: {
    '/play': { ssr: false },
  },
  devServer: {
    host: '0.0.0.0',
  },
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxt/eslint'],
  typescript: {
    strict: true,
  },
  imports: {
    dirs: ['composables/**', 'utils/**'],
  },
  app: {
    head: {
      title: 'Score Slate',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        {
          name: 'description',
          content:
            'Local-first scorekeeping for tabletop games in your browser — no account, works offline after load.',
        },
        { name: 'theme-color', content: '#00cfc8' },
        { name: 'apple-mobile-web-app-title', content: 'Score Slate' },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700&display=swap',
        },
      ],
    },
  },
})
