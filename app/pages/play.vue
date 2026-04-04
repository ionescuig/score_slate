<script setup lang="ts">
import { ArrowDownTrayIcon, PrinterIcon } from '@heroicons/vue/24/outline'
import { displayTitleForGameType } from '~/utils/game/game-types'

const { isPortrait, canLockOrientation, requestLandscapeLock } =
  useLandscapePresentation()

const game = useGameStore()
const { downloadPdf, printPdf } = useScoreSlatePdf()

const title = computed(() => displayTitleForGameType(game.gameType))

const winnerNames = computed(() =>
  game.leaderPlayerIds.map((id: string) => game.playerNames[id] ?? id),
)

onMounted(() => {
  if (game.phase === 'idle') {
    navigateTo('/')
  }
})
</script>

<template>
  <div class="w-full py-6 md:py-8">
    <div
      v-if="
        isPortrait &&
        (game.phase === 'playing' || game.phase === 'finished')
      "
      role="status"
      class="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-accent/35 bg-slate-accent/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="text-sm font-medium text-slate-800">
        <template v-if="canLockOrientation">
          Score sheet is easier to use in landscape — rotate your device or tap
          below to lock.
        </template>
        <template v-else>
          Rotate your device to landscape for the full score sheet.
        </template>
      </p>
      <button
        v-if="canLockOrientation"
        type="button"
        class="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-xl border border-slate-accent/60 bg-white px-4 text-sm font-semibold text-slate-ink shadow-sm transition-colors hover:bg-slate-accent/15 touch-manipulation"
        @click="requestLandscapeLock()"
      >
        Use landscape
      </button>
    </div>
    <header
      class="mb-6 rounded-2xl border border-gray-200/90 bg-white p-5 shadow-soft md:p-6"
      aria-label="Game header"
    >
      <div
        class="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-stretch"
      >
        <div class="min-w-0">
          <nav aria-label="Site">
            <NuxtLink
              to="/"
              class="text-sm font-medium text-slate-inkMuted transition-colors duration-200 ease-out-expo hover:text-slate-accentDeep hover:underline"
            >
              ← Home
            </NuxtLink>
          </nav>
          <h1
            class="font-display mt-4 text-[1.625rem] font-semibold leading-[1.12] tracking-tight text-slate-ink md:text-[2rem]"
          >
            {{ title }}
          </h1>
          <div
            class="mt-5 h-px w-16 max-w-full rounded-full bg-gradient-to-r from-slate-accent via-slate-accentBright to-slate-accentDeep"
            aria-hidden="true"
          />
          <div
            v-if="game.roundCount > 0 && (game.phase === 'playing' || game.phase === 'finished')"
            class="mt-5 space-y-1.5"
          >
            <p class="text-sm font-medium leading-snug tabular-nums text-slate-600">
              <template v-if="game.gameType === 'rummy' && !game.rummyHasRoundLimit">
                Round {{ game.currentRoundIndex + 1 }} · until Finish
              </template>
              <template v-else>
                Round {{ game.currentRoundIndex + 1 }} of {{ game.roundCount }}
              </template>
            </p>
            <p
              v-if="game.rummyLimit != null"
              class="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500"
            >
              Limit {{ game.rummyLimit }} pts
            </p>
          </div>
        </div>
        <div
          v-if="game.phase === 'playing' || game.phase === 'finished'"
          class="flex w-full flex-col items-end gap-3 md:min-h-0 md:justify-between md:gap-0"
        >
          <div
            class="flex shrink-0 items-center gap-2"
            role="toolbar"
            aria-label="Score sheet export"
          >
            <button
              type="button"
              class="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 transition-colors duration-200 ease-out-expo hover:bg-slate-accent/10 hover:text-slate-ink motion-safe:active:scale-[0.98]"
              aria-label="Download PDF"
              @click="downloadPdf"
            >
              <ArrowDownTrayIcon class="h-5 w-5 shrink-0" aria-hidden="true" />
            </button>
            <button
              type="button"
              class="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 transition-colors duration-200 ease-out-expo hover:bg-slate-accent/10 hover:text-slate-ink motion-safe:active:scale-[0.98]"
              aria-label="Print score sheet"
              @click="printPdf"
            >
              <PrinterIcon class="h-5 w-5 shrink-0" aria-hidden="true" />
            </button>
          </div>
          <button
            v-if="game.phase === 'playing'"
            type="button"
            class="inline-flex min-h-[44px] min-w-[10rem] shrink-0 items-center justify-center rounded-xl border border-slate-300/90 bg-white/90 px-5 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur-sm transition-all duration-200 ease-out-expo hover:border-slate-accent hover:bg-slate-accent/10 hover:shadow-soft motion-safe:active:scale-[0.98]"
            @click="game.finishGame()"
          >
            Finish game
          </button>
        </div>
      </div>
      <div
        v-if="game.limitReached && game.phase === 'playing'"
        role="status"
        aria-live="polite"
        class="mt-6 rounded-xl border border-amber-200/70 bg-amber-50/95 px-4 py-3 text-sm leading-relaxed text-amber-950 shadow-soft"
      >
        A player reached the score limit — tap Finish when ready.
      </div>
    </header>

    <GameScoreboard v-if="game.phase === 'playing' || game.phase === 'finished'" />

    <section
      v-if="game.phase === 'finished'"
      class="mt-8 rounded-2xl border border-gray-200/90 bg-white p-5 shadow-soft"
    >
      <h2 class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-inkMuted">
        Result
      </h2>
      <p class="font-display mt-3 text-xl font-semibold text-slate-ink md:text-2xl">
        <template v-if="winnerNames.length">
          Winner<span v-if="winnerNames.length > 1">s</span>: {{ winnerNames.join(', ') }}
        </template>
        <template v-else>
          —
        </template>
      </p>
    </section>

  </div>
</template>
