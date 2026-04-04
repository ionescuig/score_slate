<script setup lang="ts">
import GameScoreGrid from "~/components/game-scoreboard/GameScoreGrid.vue";
import GameScoreboardHints from "~/components/game-scoreboard/GameScoreboardHints.vue";
import GameScoreRoundModal from "~/components/game-scoreboard/GameScoreRoundModal.vue";
import { rowLabelForScoreSheet } from "~/utils/game/score-display";
import type { ScoreboardGridModel } from "~/utils/game/scoreboard-grid-model";
import { visibleRoundIndices } from "~/utils/game/round-visibility";

const game = useGameStore();

const tableRoundIndices = computed(() =>
  visibleRoundIndices({
    gameType: game.gameType,
    phase: game.phase,
    rummyHasRoundLimit: game.rummyHasRoundLimit,
    rowLabelsLength: game.rowLabels.length,
    scores: game.scores,
    playerIds: game.playerIds,
  }),
);

function rowLabelForIndex(i: number): string {
  if (!game.gameType) {
    return "";
  }
  return rowLabelForScoreSheet(game.gameType, game.rowLabels, i);
}

/** One mode per row — avoids recomputing per cell in the template. */
const rowCellModes = computed(() =>
  game.rowLabels.map((_: number, ri: number) => {
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

const gridModel = computed<ScoreboardGridModel>(() => ({
  gameType: game.gameType,
  phase: game.phase as "playing" | "finished",
  playerIds: game.playerIds,
  playerNames: game.playerNames,
  rowLabels: game.rowLabels,
  scores: game.scores,
  runningTotals: game.runningTotals,
  currentRoundIndex: game.currentRoundIndex,
  tableRoundIndices: tableRoundIndices.value,
  rowCellModes: rowCellModes.value,
  scoreboardLeaderPlayerIds: game.scoreboardLeaderPlayerIds,
  dealerPlayerId: game.dealerPlayerId,
}));

const modalRoundIndex = ref<number | null>(null);

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
  game.replaceRoundScoresRow(ri, row);
}

function openModalForRound(ri: number) {
  if (!rowClickable(ri)) {
    return;
  }
  modalRoundSnapshot.value = captureRoundSnapshot(ri);
  modalRoundIndex.value = ri;
}

function rowClickable(ri: number): boolean {
  if (game.phase === "playing") {
    return ri <= game.currentRoundIndex;
  }
  if (game.phase === "finished") {
    return true;
  }
  return false;
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
    game.onScoreModalCommitted(ri);
  }
  modalRoundIndex.value = null;
}
</script>

<template>
  <div
    class="w-full overflow-hidden rounded-2xl border-2 border-slate-accent/35 bg-white shadow-soft"
  >
    <GameScoreboardHints :phase="game.phase" />
    <GameScoreGrid :model="gridModel" @open-round="openModalForRound" />
    <GameScoreRoundModal
      v-if="modalRoundIndex !== null"
      :round-index="modalRoundIndex"
      :row-title="rowLabelForIndex(modalRoundIndex)"
      :player-ids="game.playerIds"
      :player-names="game.playerNames"
      :scores="game.scores"
      :is-editing-past-or-finished-round="isEditingPastOrFinishedRound"
      @cancel="cancelScoreModal"
      @done="closeScoreModal"
      @update-score="updateScore($event.playerId, $event.raw)"
    />
  </div>
</template>
