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
      class="relative rounded-2xl border border-slate-accent/30 bg-white p-6 shadow-soft sm:p-8"
    >
      <h1
        class="font-display text-display text-slate-ink md:text-[2.75rem] md:leading-[1.08]"
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
    </header>

    <div
      v-if="
        homeMounted &&
        (game.phase === 'playing' || game.phase === 'finished')
      "
      class="mt-10 flex flex-wrap gap-3"
    >
      <SlateButton variant="primary" @click="continueGame">
        Continue game
      </SlateButton>
      <SlateButton variant="danger" @click="newGame">
        Discard session
      </SlateButton>
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
          class="group h-full w-full min-h-[44px] rounded-2xl border border-slate-accent/25 bg-white p-4 text-left shadow-soft transition-all duration-200 ease-out-expo hover:border-slate-accent hover:bg-slate-mint/50 hover:shadow-lift motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0"
          @click="goSetup('rummy')"
        >
          <span class="font-semibold text-slate-ink">{{ displayTitleForGameType('rummy') }}</span>
          <span class="mt-1 block text-sm text-slate-inkMuted">2–6 players · highest score wins</span>
        </button>
      </li>
      <li class="md:min-w-0 md:flex-1">
        <button
          type="button"
          class="group h-full w-full min-h-[44px] rounded-2xl border border-slate-accent/25 bg-white p-4 text-left shadow-soft transition-all duration-200 ease-out-expo hover:border-slate-accent hover:bg-slate-mint/50 hover:shadow-lift motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0"
          @click="goSetup('mexican-train')"
        >
          <span class="font-semibold text-slate-ink">{{ displayTitleForGameType('mexican-train') }}</span>
          <span class="mt-1 block text-sm text-slate-inkMuted">2–8 players · pip ladder 12→0</span>
        </button>
      </li>
      <li class="md:min-w-0 md:flex-1">
        <button
          type="button"
          class="group h-full w-full min-h-[44px] rounded-2xl border border-slate-accent/25 bg-white p-4 text-left shadow-soft transition-all duration-200 ease-out-expo hover:border-slate-accent hover:bg-slate-mint/50 hover:shadow-lift motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0"
          @click="goSetup('whist')"
        >
          <span class="font-semibold text-slate-ink">{{ displayTitleForGameType('whist') }}</span>
          <span class="mt-1 block text-sm text-slate-inkMuted">4–6 players · cards-per-deal rows</span>
        </button>
      </li>
    </ul>
  </div>
</template>
