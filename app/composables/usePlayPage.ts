import { displayTitleForGameType } from "~/utils/game/game-types";

/**
 * Play route: client-only session, landscape hint, header, PDF hooks, idle redirect.
 */
export function usePlayPage() {
  const { isPortrait, canLockOrientation, requestLandscapeLock } =
    useLandscapePresentation();

  const game = useGameStore();
  const { downloadPdf, printPdf } = useScoreSlatePdf();

  const title = computed(() => displayTitleForGameType(game.gameType));

  const winnerNames = computed(() =>
    game.leaderPlayerIds.map((id: string) => game.playerNames[id] ?? id),
  );

  const playReady = ref(false);

  onMounted(() => {
    if (game.phase === "idle") {
      void navigateTo("/");
      return;
    }
    playReady.value = true;
  });

  const showPortraitHint = computed(
    () =>
      !game.playPortraitHintDismissed &&
      isPortrait.value &&
      (game.phase === "playing" || game.phase === "finished"),
  );

  return {
    game,
    isPortrait,
    canLockOrientation,
    requestLandscapeLock,
    downloadPdf,
    printPdf,
    title,
    winnerNames,
    playReady,
    showPortraitHint,
  };
}
