import { scoreboardRowIsClickable } from "~/utils/game/scoreboard-row-click";

interface RoundSnapshot {
  [playerId: string]: number | undefined;
}

/**
 * Score entry modal: snapshot on open, restore on cancel, commit via store on done.
 */
export function useScoreRoundModal() {
  const game = useGameStore();

  const modalRoundIndex = ref<number | null>(null);
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
    if (
      !scoreboardRowIsClickable(game.phase, ri, game.currentRoundIndex)
    ) {
      return;
    }
    modalRoundSnapshot.value = captureRoundSnapshot(ri);
    modalRoundIndex.value = ri;
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

  return {
    modalRoundIndex,
    isEditingPastOrFinishedRound,
    openModalForRound,
    cancelScoreModal,
    closeScoreModal,
    updateScore,
  };
}
