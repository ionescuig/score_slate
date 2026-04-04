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

useSeoMeta({
  title: 'Local tabletop scorekeeping',
  description:
    'Pick Rummy, Mexican Train, or Whist — track scores in the browser with no account. Data stays on your device and works offline after the first load.',
  ogTitle: 'Score Slate — local tabletop scorekeeping',
  ogDescription:
    'Pick Rummy, Mexican Train, or Whist — track scores in the browser with no account. Data stays on your device.',
})
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
        Score Slate — local scorekeeping for tabletop games. No accounts.
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
        <SlateChoiceTile
          :title="displayTitleForGameType('rummy')"
          subtitle="2–6 players · highest score wins"
          class="h-full"
          @click="goSetup('rummy')"
        />
      </li>
      <li class="md:min-w-0 md:flex-1">
        <SlateChoiceTile
          :title="displayTitleForGameType('mexican-train')"
          subtitle="2–8 players · pip ladder 12→0"
          class="h-full"
          @click="goSetup('mexican-train')"
        />
      </li>
      <li class="md:min-w-0 md:flex-1">
        <SlateChoiceTile
          :title="displayTitleForGameType('whist')"
          subtitle="4–6 players · cards-per-deal rows"
          class="h-full"
          @click="goSetup('whist')"
        />
      </li>
    </ul>
  </div>
</template>
