<script setup lang="ts">
import {
  rowLabelForScoreSheet,
  scoreCellDisplayString,
} from "~/utils/pdf/score-sheet-export";
import { whistRowStartsSection } from "~/utils/game/whist";

const game = useGameStore();

function rowLabelForIndex(i: number): string {
  if (!game.gameType) {
    return "";
  }
  return rowLabelForScoreSheet(game.gameType, game.rowLabels, i);
}

function cellValue(roundIdx: number, playerId: string): string {
  return scoreCellDisplayString(game.scores, roundIdx, playerId);
}

function currentCell(playerId: string): string {
  return cellValue(game.currentRoundIndex, playerId);
}

function totalBeforeRound(roundIdx: number, playerId: string): number {
  let t = 0;
  for (let r = 0; r < roundIdx; r += 1) {
    t += game.scores[r]?.[playerId] ?? 0;
  }
  return t;
}

/** Running total through roundIdx inclusive (for modal “total after”). */
function projectedTotalThroughRound(
  roundIdx: number,
  playerId: string,
): number {
  let t = 0;
  for (let r = 0; r <= roundIdx; r += 1) {
    t += game.scores[r]?.[playerId] ?? 0;
  }
  return t;
}

function updateScore(playerId: string, raw: string) {
  const ri = modalRoundIndex.value;
  if (ri === null) {
    return;
  }
  if (raw === "" || raw === "-") {
    game.setRoundScoreForRound(ri, playerId, 0);
    return;
  }
  const n = Number(raw);
  if (Number.isNaN(n)) {
    return;
  }
  game.setRoundScoreForRound(ri, playerId, n);
}

function modalCell(playerId: string): string {
  const ri = modalRoundIndex.value;
  if (ri === null) {
    return "";
  }
  return cellValue(ri, playerId);
}

/** One mode per row — avoids recomputing per cell in the template. */
const rowCellModes = computed(() =>
  game.rowLabels.map((_: string, ri: number) => {
    if (ri > game.currentRoundIndex) {
      return "future" as const;
    }
    if (ri < game.currentRoundIndex) {
      return "past" as const;
    }
    if (game.phase === "playing") {
      return "current-input" as const;
    }
    return "current-done" as const;
  }),
);

const modalRoundIndex = ref<number | null>(null);

function rowClickable(ri: number): boolean {
  if (game.phase === "playing") {
    return ri <= game.currentRoundIndex;
  }
  if (game.phase === "finished") {
    return true;
  }
  return false;
}

function rowAriaLabel(ri: number): string | undefined {
  if (!rowClickable(ri)) {
    return undefined;
  }
  return `Open scores for ${rowLabelForIndex(ri)}`;
}

function isLeaderColumn(pid: string): boolean {
  return game.scoreboardLeaderPlayerIds.includes(pid);
}

function isDealerColumn(pid: string): boolean {
  return game.dealerPlayerId === pid;
}

function whistSectionTopBorder(ri: number): string {
  if (game.gameType !== "whist") {
    return "";
  }
  return whistRowStartsSection(ri, game.playerIds.length)
    ? "border-t-2 border-t-gray-200"
    : "";
}

interface RoundSnapshot {
  [playerId: string]: number | undefined;
}

const modalRoundSnapshot = ref<RoundSnapshot | null>(null);

function captureRoundSnapshot(ri: number): RoundSnapshot {
  const row = game.scores[ri];
  const out: RoundSnapshot = {};
  for (const pid of game.playerIds) {
    out[pid] = row?.[pid];
  }
  return out;
}

function restoreRoundFromSnapshot(ri: number, snap: RoundSnapshot) {
  const row: Record<string, number> = {};
  for (const pid of game.playerIds) {
    const v = snap[pid];
    if (v !== undefined) {
      row[pid] = v;
    }
  }
  game.scores[ri] = row;
}

function openModalForRound(ri: number) {
  if (!rowClickable(ri)) {
    return;
  }
  modalRoundSnapshot.value = captureRoundSnapshot(ri);
  modalRoundIndex.value = ri;
}

function onRowClick(ri: number) {
  openModalForRound(ri);
}

const isEditingPastOrFinishedRound = computed(() => {
  const ri = modalRoundIndex.value;
  if (ri === null) {
    return false;
  }
  if (game.phase === "finished") {
    return true;
  }
  return ri < game.currentRoundIndex;
});

watch(
  () => game.phase,
  (phase: "idle" | "playing" | "finished") => {
    if (phase !== "playing" && phase !== "finished") {
      modalRoundIndex.value = null;
      modalRoundSnapshot.value = null;
    }
  },
);

watch(
  () => game.sessionId,
  () => {
    modalRoundIndex.value = null;
    modalRoundSnapshot.value = null;
  },
);

function cancelScoreModal() {
  const ri = modalRoundIndex.value;
  const snap = modalRoundSnapshot.value;
  modalRoundSnapshot.value = null;
  if (ri !== null && snap !== null) {
    restoreRoundFromSnapshot(ri, snap);
  }
  modalRoundIndex.value = null;
}

function closeScoreModal() {
  const ri = modalRoundIndex.value;
  modalRoundSnapshot.value = null;
  if (ri !== null) {
    game.flushRoundScores(ri);
    if (
      game.phase === "playing" &&
      ri === game.currentRoundIndex &&
      game.canAdvanceRound
    ) {
      game.advanceRound();
    }
  }
  modalRoundIndex.value = null;
}

const modalPanelRef = ref<HTMLElement | null>(null);

watch(modalRoundIndex, (ri: number | null) => {
  if (!import.meta.client) {
    return;
  }
  if (ri !== null) {
    nextTick(() => {
      modalPanelRef.value?.querySelector("input")?.focus();
    });
  }
});

function onGlobalEscape(e: KeyboardEvent) {
  if (e.key !== "Escape") {
    return;
  }
  if (modalRoundIndex.value === null) {
    return;
  }
  cancelScoreModal();
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener("keydown", onGlobalEscape);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener("keydown", onGlobalEscape);
  }
});
</script>

<template>
  <div
    class="w-full overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-soft"
  >
    <p
      v-if="game.phase === 'playing'"
      class="border-b border-gray-200/80 bg-slate-rail px-4 py-2 text-xs text-slate-600"
    >
      Tap the highlighted row to enter scores, or a row above to fix a past
      round.
    </p>
    <p
      v-else-if="game.phase === 'finished'"
      class="border-b border-gray-200/80 bg-slate-rail px-4 py-2 text-xs text-slate-600"
    >
      Tap any round row to edit scores.
    </p>

    <div class="w-full overflow-x-auto p-4 sm:p-5">
      <table class="w-full min-w-[480px] table-fixed border-collapse text-sm">
        <caption class="sr-only">
          Score grid: one row per round or deal step; columns are players.
          Totals are running sums.
        </caption>
        <colgroup>
          <col class="w-[5rem] sm:w-[5.5rem]">
          <col v-for="pid in game.playerIds" :key="`colgroup-${pid}`">
        </colgroup>
        <thead>
          <tr>
            <th
              scope="col"
              class="border border-gray-200 bg-gray-50 px-1.5 py-2 text-center text-xs font-semibold text-slate-inkMuted"
            >
              <span class="sr-only">Round</span>
            </th>
            <th
              v-for="pid in game.playerIds"
              :key="pid"
              scope="col"
              class="min-w-0 border px-2 py-2 text-center text-xs font-semibold"
              :class="
                isLeaderColumn(pid)
                  ? 'border-slate-accent/80 bg-slate-accent/8 text-slate-ink ring-1 ring-slate-accent/70'
                  : isDealerColumn(pid)
                    ? 'border-slate-200/90 bg-slate-50/80 text-slate-ink'
                    : 'border-gray-200 bg-gray-50 text-slate-ink'
              "
            >
              <span class="block font-semibold">{{
                game.playerNames[pid]
              }}</span>
              <span
                v-if="game.dealerPlayerId === pid"
                class="mt-1 block text-[10px] font-normal uppercase tracking-wide text-slate-500"
                >Dealer</span
              >
              <span
                v-if="game.scoreboardLeaderPlayerIds.includes(pid)"
                class="mt-0.5 block text-[10px] font-bold uppercase tracking-wide text-slate-accentDeep"
                >Leader</span
              >
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(_, ri) in game.rowLabels"
            :key="ri"
            :class="[
              ri === game.currentRoundIndex ? 'bg-slate-accent/10' : '',
              rowClickable(ri) ? 'cursor-pointer hover:bg-slate-accent/5' : '',
            ]"
            :tabindex="rowClickable(ri) ? 0 : -1"
            :aria-label="rowAriaLabel(ri)"
            @click="onRowClick(ri)"
            @keydown.enter.prevent="openModalForRound(ri)"
            @keydown.space.prevent="openModalForRound(ri)"
          >
            <th
              scope="row"
              class="border border-gray-200 bg-gray-50 px-1.5 py-1.5 text-center text-xs font-medium tabular-nums leading-tight text-slate-700"
              :class="whistSectionTopBorder(ri)"
            >
              {{ rowLabelForIndex(ri) }}
            </th>
            <td
              v-for="pid in game.playerIds"
              :key="`${ri}-${pid}`"
              class="min-w-0 border px-1 py-1 text-center text-sm"
              :class="[
                isLeaderColumn(pid)
                  ? 'border-slate-accent/35 bg-slate-accent/[0.06] text-slate-800'
                  : isDealerColumn(pid)
                    ? 'border-slate-200/80 bg-slate-50/55 text-slate-800'
                    : 'border-gray-200 text-slate-800',
                whistSectionTopBorder(ri),
              ]"
            >
              <template v-if="rowCellModes[ri] === 'future'">
                <span class="tabular-nums" />
              </template>
              <template v-else-if="rowCellModes[ri] === 'past'">
                <span class="tabular-nums">{{ cellValue(ri, pid) }}</span>
              </template>
              <template v-else-if="rowCellModes[ri] === 'current-input'">
                <span class="tabular-nums">{{ currentCell(pid) }}</span>
              </template>
              <template v-else>
                <span class="tabular-nums">{{ cellValue(ri, pid) }}</span>
              </template>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th
              scope="row"
              class="border border-gray-300 bg-gray-100 px-1.5 py-2 text-center text-xs font-semibold text-slate-ink"
            >
              Total
            </th>
            <td
              v-for="pid in game.playerIds"
              :key="`t-${pid}`"
              class="min-w-0 border border-gray-300 bg-gray-100 px-2 py-2 text-center text-sm font-semibold text-slate-ink"
            >
              {{ game.runningTotals[pid] ?? 0 }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <ClientOnly>
      <Teleport to="body">
        <div
          v-if="modalRoundIndex !== null"
          class="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center"
          role="presentation"
        >
          <div
            class="absolute inset-0 backdrop-blur-[2px]"
            style="background-color: var(--ss-scrim)"
            aria-hidden="true"
            @click="cancelScoreModal"
          />
          <div
            ref="modalPanelRef"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="'score-modal-title'"
            class="relative z-10 flex max-h-[min(90dvh,640px)] w-full max-w-[min(96vw,56rem)] flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-lift"
            @click.stop
          >
            <div class="border-b border-gray-200/90 bg-slate-ice/80 px-4 py-3">
              <h2
                id="score-modal-title"
                class="font-display text-lg font-semibold text-slate-ink"
              >
                {{ rowLabelForIndex(modalRoundIndex) }}
              </h2>
              <p class="mt-0.5 text-xs text-slate-500">
                <template v-if="isEditingPastOrFinishedRound">
                  Edit scores, then tap Done.
                </template>
                <template v-else>
                  Enter this round for everyone, then tap Done. The next round
                  starts when this one is complete.
                </template>
              </p>
            </div>
            <div
              class="min-h-0 flex-1 overflow-y-auto overflow-x-auto px-4 py-4"
            >
              <table class="w-full min-w-[480px] border-collapse text-sm">
                <caption class="sr-only">
                  Scores for this round: one column per player, rows before,
                  this round, after.
                </caption>
                <thead>
                  <tr>
                    <th
                      scope="col"
                      class="border border-gray-200 bg-gray-50 px-2 py-2 text-left text-xs font-semibold text-slate-inkMuted"
                    >
                      <span class="sr-only">Metric</span>
                    </th>
                    <th
                      v-for="pid in game.playerIds"
                      :key="`mh-${pid}`"
                      scope="col"
                      class="border border-gray-200 bg-gray-50 px-2 py-2 text-center text-xs font-semibold text-slate-ink"
                    >
                      {{ game.playerNames[pid] }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th
                      scope="row"
                      class="border border-gray-200 bg-gray-50 px-2 py-2 text-left text-xs font-medium text-slate-700"
                    >
                      Total before
                    </th>
                    <td
                      v-for="pid in game.playerIds"
                      :key="`tb-${pid}`"
                      class="border border-slate-200 px-2 py-2 text-center tabular-nums text-slate-700"
                    >
                      {{ totalBeforeRound(modalRoundIndex, pid) }}
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      class="border border-slate-200 bg-white px-2 py-2 text-left text-xs font-medium text-slate-600"
                    >
                      This round
                    </th>
                    <td
                      v-for="pid in game.playerIds"
                      :key="`tr-${pid}`"
                      class="border border-slate-200 px-1 py-1.5"
                    >
                      <label class="sr-only" :for="`round-score-${pid}`">
                        {{ game.playerNames[pid] }}, this round
                      </label>
                      <input
                        :id="`round-score-${pid}`"
                        type="number"
                        inputmode="numeric"
                        class="min-h-[44px] w-full min-w-[3.25rem] rounded border border-slate-300 bg-white px-2 py-1.5 text-center tabular-nums text-slate-900"
                        :value="modalCell(pid)"
                        :aria-label="`${game.playerNames[pid]}, ${rowLabelForIndex(modalRoundIndex)}`"
                        @input="
                          updateScore(
                            pid,
                            ($event.target as HTMLInputElement).value,
                          )
                        "
                      >
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      class="border border-gray-200 bg-gray-50 px-2 py-2 text-left text-xs font-medium text-slate-800"
                    >
                      Total after
                    </th>
                    <td
                      v-for="pid in game.playerIds"
                      :key="`ta-${pid}`"
                      class="border border-gray-200 bg-gray-50 px-2 py-2 text-center text-sm font-semibold tabular-nums text-slate-ink"
                    >
                      {{ projectedTotalThroughRound(modalRoundIndex, pid) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              class="flex flex-wrap justify-end gap-2 border-t border-gray-200/90 bg-slate-rail px-4 py-4"
            >
              <button
                type="button"
                class="inline-flex min-h-[44px] min-w-[7rem] items-center justify-center rounded-xl border border-slate-300/90 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm transition-all duration-200 ease-out-expo hover:border-slate-accent hover:bg-slate-accent/10 motion-safe:active:scale-[0.98]"
                @click="cancelScoreModal"
              >
                Cancel
              </button>
              <button
                type="button"
                class="inline-flex min-h-[44px] min-w-[7rem] items-center justify-center rounded-xl bg-slate-accent px-5 text-sm font-semibold text-slate-ink shadow-soft transition-colors hover:bg-slate-accentDeep"
                @click="closeScoreModal"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </ClientOnly>
  </div>
</template>
