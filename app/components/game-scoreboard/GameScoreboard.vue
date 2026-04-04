<script setup lang="ts">
import GameScoreGrid from "~/components/game-scoreboard/GameScoreGrid.vue";
import GameScoreboardHints from "~/components/game-scoreboard/GameScoreboardHints.vue";
import GameScoreRoundModal from "~/components/game-scoreboard/GameScoreRoundModal.vue";
import { rowLabelForScoreSheet } from "~/utils/game/score-display";
import type { ScoreboardGridModel } from "~/utils/game/scoreboard-grid-model";
import { buildScoreboardGridModel } from "~/utils/game/scoreboard-grid-build";
import { visibleRoundIndices } from "~/utils/game/round-visibility";

const game = useGameStore();

const {
  modalRoundIndex,
  isEditingPastOrFinishedRound,
  openModalForRound,
  cancelScoreModal,
  closeScoreModal,
  updateScore,
} = useScoreRoundModal();

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

const gridModel = computed<ScoreboardGridModel>(() =>
  buildScoreboardGridModel({
    gameType: game.gameType,
    phase: game.phase as "playing" | "finished",
    playerIds: game.playerIds,
    playerNames: game.playerNames,
    rowLabels: game.rowLabels,
    scores: game.scores,
    runningTotals: game.runningTotals,
    currentRoundIndex: game.currentRoundIndex,
    tableRoundIndices: tableRoundIndices.value,
    scoreboardLeaderPlayerIds: game.scoreboardLeaderPlayerIds,
    dealerPlayerId: game.dealerPlayerId,
  }),
);
</script>

<template>
  <div
    class="w-full overflow-hidden rounded-2xl border-2 border-slate-accent/35 bg-white shadow-soft"
  >
    <GameScoreboardHints :phase="game.phase" />
    <GameScoreGrid
      :model="gridModel"
      aria-described-by="scoreboard-hint"
      @open-round="openModalForRound"
    />
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
