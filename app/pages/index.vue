<script setup lang="ts">
import { displayTitleForGameType } from '~/utils/game/game-types'
import type { GameType } from '~/utils/game/game-types'

const game = useGameStore()

/** After mount only — Pinia + localStorage restore phase before first client paint, so SSR is idle but client can be playing (hydration mismatch without this). */
const homeMounted = ref(false)

onMounted(() => {
  homeMounted.value = true
})

function goSetup(g: GameType) {
  navigateTo(`/setup/${g}`)
}

function continueGame() {
  navigateTo('/play')
}

function newGame() {
  game.resetSession()
}
</script>

<template>
  <div class="w-full py-10 md:py-14">
    <header
      class="relative rounded-2xl border border-gray-200/90 bg-white p-6 shadow-soft sm:p-8"
    >
      <p
        class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-inkMuted"
      >
        Local-first
      </p>
      <h1
        class="font-display mt-6 text-display text-slate-ink md:text-[2.75rem] md:leading-[1.08]"
      >
        Score Slate
      </h1>
      <div
        class="mt-6 h-px w-16 rounded-full bg-gradient-to-r from-slate-accent via-slate-accentBright to-slate-accentDeep"
        aria-hidden="true"
      />
      <p
        class="mt-6 max-w-full text-base leading-relaxed text-slate-inkMuted md:text-lg md:whitespace-nowrap"
      >
        Local score sheets for Rummy, Mexican Train, and Whist — no accounts.
      </p>
      <ClientOnly>
        <p class="mt-2 text-sm text-slate-600">
          Works offline after the first load.
        </p>
      </ClientOnly>
    </header>

    <div
      v-if="
        homeMounted &&
        (game.phase === 'playing' || game.phase === 'finished')
      "
      class="mt-10 flex flex-wrap gap-3"
    >
      <button
        type="button"
        class="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-slate-accent px-5 text-sm font-semibold text-slate-ink shadow-soft transition-all duration-200 ease-out-expo hover:bg-slate-accentDeep motion-safe:hover:shadow-lift motion-safe:active:scale-[0.98]"
        @click="continueGame"
      >
        Continue game
      </button>
      <button
        type="button"
        class="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-300/90 bg-white/80 px-5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-200 ease-out-expo hover:border-slate-accent hover:bg-slate-accent/10 motion-safe:active:scale-[0.98]"
        @click="newGame"
      >
        Discard session
      </button>
    </div>

    <h2
      class="mt-14 text-xs font-semibold uppercase tracking-[0.2em] text-slate-inkMuted"
    >
      Start a game
    </h2>
    <ul class="mt-6 flex flex-col gap-3 md:flex-row md:items-stretch md:gap-4">
      <li class="md:min-w-0 md:flex-1">
        <button
          type="button"
          class="group h-full w-full min-h-[44px] rounded-2xl border border-gray-200/90 bg-white p-4 text-left shadow-soft transition-all duration-200 ease-out-expo hover:border-slate-accent hover:bg-slate-accent/10 hover:shadow-lift motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0"
          @click="goSetup('rummy')"
        >
          <span class="font-semibold text-slate-ink">{{ displayTitleForGameType('rummy') }}</span>
          <span class="mt-1 block text-sm text-slate-inkMuted">2–6 players · highest score wins</span>
        </button>
      </li>
      <li class="md:min-w-0 md:flex-1">
        <button
          type="button"
          class="group h-full w-full min-h-[44px] rounded-2xl border border-gray-200/90 bg-white p-4 text-left shadow-soft transition-all duration-200 ease-out-expo hover:border-slate-accent hover:bg-slate-accent/10 hover:shadow-lift motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0"
          @click="goSetup('mexican-train')"
        >
          <span class="font-semibold text-slate-ink">{{ displayTitleForGameType('mexican-train') }}</span>
          <span class="mt-1 block text-sm text-slate-inkMuted">2–8 players · pip ladder 12→0</span>
        </button>
      </li>
      <li class="md:min-w-0 md:flex-1">
        <button
          type="button"
          class="group h-full w-full min-h-[44px] rounded-2xl border border-gray-200/90 bg-white p-4 text-left shadow-soft transition-all duration-200 ease-out-expo hover:border-slate-accent hover:bg-slate-accent/10 hover:shadow-lift motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0"
          @click="goSetup('whist')"
        >
          <span class="font-semibold text-slate-ink">{{ displayTitleForGameType('whist') }}</span>
          <span class="mt-1 block text-sm text-slate-inkMuted">4–6 players · cards-per-deal rows</span>
        </button>
      </li>
    </ul>
  </div>
</template>
