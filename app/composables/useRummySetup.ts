import {
  buildRummyStartPayload,
  rummyLimitsSummaryText,
  trimRummyLimitInputValue,
} from "~/utils/game/rummy-setup";

/**
 * Rummy-only setup fields: round cap, score limit, and summary copy for the setup page.
 */
export function useRummySetup() {
  /** When checked, use the round count below; when unchecked, play until Finish (no round cap). */
  const rummyLimitRoundCount = ref(false);
  const rummyRounds = ref(15);
  /** Bound to `type="number"` — value may be string or number from v-model. */
  const rummyLimit = ref<string | number>("");

  function trimRummyLimitInput(): string {
    return trimRummyLimitInputValue(rummyLimit.value);
  }

  const rummyLimitsSummary = computed(() =>
    rummyLimitsSummaryText({
      limitedRounds: rummyLimitRoundCount.value,
      rummyRounds: Number(rummyRounds.value),
      limitRawTrimmed: trimRummyLimitInput(),
    }),
  );

  watch(rummyLimitRoundCount, (on: boolean) => {
    if (on && rummyRounds.value < 3) {
      rummyRounds.value = 3;
    }
  });

  function rummyStartPayload() {
    return buildRummyStartPayload({
      limitRoundCount: rummyLimitRoundCount.value,
      rummyRoundsRaw: rummyRounds.value,
      limitRawTrimmed: trimRummyLimitInput(),
    });
  }

  return {
    rummyLimitRoundCount,
    rummyRounds,
    rummyLimit,
    trimRummyLimitInput,
    rummyLimitsSummary,
    rummyStartPayload,
  };
}
