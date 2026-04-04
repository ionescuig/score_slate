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
      backgroundImage: {
        /** Resume Optimiser btn-primary — cyan → cyan-light, light UI only */
        'ro-primary': 'linear-gradient(to right, #00cfc8, #03fff6)',
        /** Destructive hover — same shape as ro-primary: saturated → brighter/lighter (no dark stop) */
        'ro-danger': 'linear-gradient(to right, #f87171, #fda4af, #fecaca)',
      },
      boxShadow: {
        soft:
          '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        lift:
          '0 4px 6px -1px rgb(0 207 200 / 0.18), 0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -2px rgb(0 0 0 / 0.04)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      colors: {
        slate: {
          /** Resume Optimiser :root — https://resumeoptimiser.snest.icu/ (main.css) */
          accent: '#00cfc8',
          accentDeep: '#00b8b0',
          accentBright: '#03fff6',
          ink: '#0f2942',
          inkMuted: '#19436b',
          /** App shell — RO default layout bg-gray-50, cards white */
          page: '#f9fafb',
          rail: '#ffffff',
          /** Cyan / blue washes (RO hero overlays + tailwind primary/brand 50) */
          mint: '#ecfeff',
          frost: '#e6f3ff',
          ice: '#eff6ff',
          skyTint: '#e0f2fe',
          /** Tables — cyan-tinted grid on white (RO pricing border uses --color-cyan) */
          gridline: '#7ec9c5',
          headFill: '#e6fffd',
          footFill: '#ccfbf7',
          dealerFill: '#f0fdfa',
        },
      },
    },
  },
} satisfies Config
