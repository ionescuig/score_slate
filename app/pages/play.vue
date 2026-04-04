<script setup lang="ts">
import { ArrowDownTrayIcon, PrinterIcon } from "@heroicons/vue/24/outline";
import { displayTitleForGameType } from "~/utils/game/game-types";

/** Session lives in Pinia + localStorage (client). SSR would render default store and mismatch after hydrate. */
definePageMeta({
  ssr: false,
});

const { isPortrait, canLockOrientation, requestLandscapeLock } =
  useLandscapePresentation();

const game = useGameStore();
const { downloadPdf, printPdf } = useScoreSlatePdf();

const title = computed(() => displayTitleForGameType(game.gameType));

const winnerNames = computed(() =>
  game.leaderPlayerIds.map((id: string) => game.playerNames[id] ?? id),
);

/** Avoid hydration mismatch: Pinia + localStorage only exist on client after plugins run. */
const playReady = ref(false);

onMounted(() => {
  if (game.phase === "idle") {
    void navigateTo("/");
    return;
  }
  playReady.value = true;
});
</script>

<template>
  <div
    class="w-full py-6 md:py-8"
    :class="!playReady ? 'min-h-[min(40vh,320px)]' : ''"
    :aria-busy="!playReady"
  >
    <p v-if="!playReady" class="sr-only">Loading score sheet…</p>
    <template v-if="playReady">
      <div
        v-if="
          isPortrait && (game.phase === 'playing' || game.phase === 'finished')
        "
        role="status"
        class="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-accent/35 bg-slate-accent/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="text-sm font-medium text-slate-800">
          <template v-if="canLockOrientation">
            Score sheet is easier to use in landscape — rotate your device or
            tap below to lock.
          </template>
          <template v-else>
            Rotate your device to landscape for the full score sheet.
          </template>
        </p>
        <SlateButton
          v-if="canLockOrientation"
          variant="default"
          density="compact"
          label-tone="ink"
          @click="requestLandscapeLock()"
        >
          Use landscape
        </SlateButton>
      </div>
      <header
        class="mb-6 rounded-2xl border border-slate-accent/30 bg-white p-5 shadow-soft md:p-6"
        aria-labelledby="play-game-title"
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
            class="flex w-full flex-col items-end gap-3 md:min-h-0 md:justify-between md:gap-0"
          >
            <div
              class="flex shrink-0 items-center gap-2"
              role="toolbar"
              aria-label="Score sheet export"
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
                aria-label="Print score sheet"
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
