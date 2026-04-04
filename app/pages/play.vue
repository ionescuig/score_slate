<script setup lang="ts">
import { ArrowDownTrayIcon, PrinterIcon } from "@heroicons/vue/24/outline";

/** Session lives in Pinia + localStorage (client). SSR would render default store and mismatch after hydrate. */
definePageMeta({
  ssr: false,
});

const {
  game,
  canLockOrientation,
  requestLandscapeLock,
  downloadPdf,
  printPdf,
  title,
  winnerNames,
  playReady,
  showPortraitHint,
} = usePlayPage();
</script>

<template>
  <div
    class="w-full py-6 md:py-8"
    :class="!playReady ? 'min-h-[min(40vh,320px)]' : ''"
    :aria-busy="!playReady"
  >
    <p v-if="!playReady" class="sr-only">Loading Score Slate…</p>
    <template v-if="playReady">
      <div
        v-if="showPortraitHint"
        role="status"
        aria-live="polite"
        class="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-accent/35 bg-slate-accent/10 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
      >
        <p class="min-w-0 text-sm font-medium text-slate-800">
          <template v-if="canLockOrientation">
            Score Slate is easier to use in landscape — rotate your device or
            tap below to lock.
          </template>
          <template v-else>
            Rotate your device to landscape for the full Score Slate.
          </template>
        </p>
        <div
          class="flex flex-wrap items-center justify-end gap-2 sm:shrink-0"
        >
          <SlateButton
            v-if="canLockOrientation"
            variant="default"
            density="compact"
            label-tone="ink"
            @click="requestLandscapeLock()"
          >
            Use landscape
          </SlateButton>
          <SlateButton
            variant="default"
            density="compact"
            label-tone="muted"
            aria-label="Stay in portrait and hide this reminder until you start a new game or discard the session from Home"
            @click="game.dismissPlayPortraitHint()"
          >
            Ignore
          </SlateButton>
        </div>
      </div>
      <header
        class="mb-6 rounded-2xl border border-slate-accent/30 bg-white p-5 shadow-soft md:p-6"
        aria-labelledby="play-game-title"
      >
        <div
          class="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-stretch"
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
              id="play-game-title"
              class="font-display mt-4 text-[1.625rem] font-semibold leading-[1.12] tracking-tight text-slate-ink md:text-[2rem]"
            >
              {{ title }}
            </h1>
            <div
              class="mt-5 h-px w-16 max-w-full rounded-full bg-gradient-to-r from-slate-accent via-slate-accentBright to-slate-accentDeep"
              aria-hidden="true"
            />
            <div
              v-if="
                game.roundCount > 0 &&
                (game.phase === 'playing' || game.phase === 'finished')
              "
              class="mt-5 space-y-1.5"
            >
              <p
                class="text-sm font-medium leading-snug tabular-nums text-slate-600"
              >
                <template
                  v-if="game.gameType === 'rummy' && !game.rummyHasRoundLimit"
                >
                  Round {{ game.currentRoundIndex + 1 }} · until Finish
                </template>
                <template v-else>
                  Round {{ game.currentRoundIndex + 1 }} of
                  {{ game.roundCount }}
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
            class="flex w-full flex-col items-end gap-3 sm:min-h-0 sm:justify-between sm:gap-0"
          >
            <div
              class="flex shrink-0 items-center gap-2"
              role="toolbar"
              aria-label="Score Slate export"
            >
              <SlateButton
                type="button"
                variant="default"
                size="icon"
                aria-label="Download PDF"
                @click="downloadPdf"
              >
                <ArrowDownTrayIcon
                  class="h-5 w-5 shrink-0"
                  aria-hidden="true"
                />
              </SlateButton>
              <SlateButton
                type="button"
                variant="default"
                size="icon"
                aria-label="Print Score Slate"
                @click="printPdf"
              >
                <PrinterIcon class="h-5 w-5 shrink-0" aria-hidden="true" />
              </SlateButton>
            </div>
            <SlateButton
              v-if="game.phase === 'playing'"
              variant="default"
              min-width="md"
              @click="game.finishGame()"
            >
              Finish game
            </SlateButton>
          </div>
        </div>
      </header>

      <GameScoreboard
        v-if="game.phase === 'playing' || game.phase === 'finished'"
      />

      <section
        v-if="game.phase === 'finished'"
        role="status"
        aria-live="polite"
        class="mt-8 rounded-2xl border border-slate-accent/30 bg-white p-5 shadow-soft"
      >
        <h2
          class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-inkMuted"
        >
          Result
        </h2>
        <p
          class="font-display mt-3 text-xl font-semibold text-slate-ink md:text-2xl"
        >
          <template v-if="winnerNames.length">
            Winner<span v-if="winnerNames.length > 1">s</span>:
            {{ winnerNames.join(", ") }}
          </template>
          <template v-else> — </template>
        </p>
      </section>
    </template>
  </div>
</template>
