import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'ui-serif', 'serif'],
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-sm': ['2rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        display: ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
      },
      boxShadow: {
        soft: '0 1px 2px rgb(15 41 66 / 0.04), 0 4px 12px rgb(15 41 66 / 0.06)',
        lift: '0 2px 4px rgb(15 41 66 / 0.04), 0 12px 24px rgb(0 207 200 / 0.08)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      colors: {
        slate: {
          accent: '#00CFC8',
          accentDeep: '#00B8B0',
          accentBright: '#02E6E0',
          ink: '#0f2942',
          inkMuted: '#19436b',
          /** Dashboard canvas — cool gray-blue (Resume Optimiser–style shell) */
          page: '#f4f6f9',
          /** Sidebar / inset strip */
          rail: '#f8fafc',
          /** Resume Optimiser — light blue washes (banners, subtle fills only) */
          mint: '#ecfeff',
          frost: '#dbeafe',
          ice: '#eff6ff',
          skyTint: '#e0f2fe',
        },
      },
    },
  },
} satisfies Config
