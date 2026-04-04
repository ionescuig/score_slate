<script setup lang="ts">
import { scoreCellDisplayString } from "~/utils/game/score-display";
import {
  totalBeforeRound as runningTotalBeforeRound,
  totalThroughRoundInclusive,
} from "~/utils/game/running-totals";

const props = defineProps<{
  roundIndex: number;
  rowTitle: string;
  playerIds: string[];
  playerNames: Record<string, string>;
  scores: Record<number, Record<string, number>>;
  isEditingPastOrFinishedRound: boolean;
}>();

const emit = defineEmits<{
  cancel: [];
  done: [];
  "update-score": [payload: { playerId: string; raw: string }];
}>();

const modalPanelRef = ref<HTMLElement | null>(null);

function playerColumnBorderClass(): string {
  return "border border-slate-gridline";
}

function cellValue(roundIdx: number, playerId: string): string {
  return scoreCellDisplayString(props.scores, roundIdx, playerId);
}

function modalCell(playerId: string): string {
  return cellValue(props.roundIndex, playerId);
}

function totalBeforeRound(pid: string): number {
  return runningTotalBeforeRound(props.scores, props.roundIndex, pid);
}

function projectedTotalThroughRound(pid: string): number {
  return totalThroughRoundInclusive(props.scores, props.roundIndex, pid);
}

function onInput(playerId: string, raw: string) {
  emit("update-score", { playerId, raw });
}

watch(
  () => props.roundIndex,
  () => {
    if (!import.meta.client) {
      return;
    }
    nextTick(() => {
      modalPanelRef.value?.querySelector("input")?.focus();
    });
  },
  { immediate: true },
);
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center"
      role="presentation"
    >
      <div
        class="absolute inset-0 backdrop-blur-[2px]"
        style="background-color: var(--ss-scrim)"
        aria-hidden="true"
      />
      <div
        ref="modalPanelRef"
        role="dialog"
        aria-modal="true"
        aria-labelledby="score-modal-title"
        aria-describedby="score-modal-desc"
        class="relative z-10 flex max-h-[min(90dvh,640px)] w-full max-w-[min(96vw,56rem)] flex-col overflow-hidden rounded-2xl border border-slate-gridline/90 bg-white shadow-lift"
      >
        <div
          class="border-b border-slate-gridline/85 bg-slate-ice/90 px-4 py-3"
        >
          <h2
            id="score-modal-title"
            class="font-display text-lg font-semibold text-slate-ink"
          >
            {{ rowTitle }}
          </h2>
          <p id="score-modal-desc" class="mt-0.5 text-xs text-slate-600">
            <template v-if="isEditingPastOrFinishedRound">
              Edit scores, then choose Done.
            </template>
            <template v-else>
              Enter this round for everyone, then choose Done. The next round
              starts when this one is complete.
            </template>
          </p>
        </div>
        <div class="min-h-0 flex-1 overflow-y-auto overflow-x-auto px-4 py-4">
          <table class="w-full min-w-[480px] border-collapse text-sm">
            <caption class="sr-only">
              Scores for this round: one column per player; rows are total
              before, this round (number fields), and projected total after.
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  class="border border-slate-gridline bg-slate-headFill px-2 py-2 text-left text-xs font-semibold text-slate-inkMuted"
                >
                  <span class="sr-only">Metric</span>
                </th>
                <th
                  v-for="pid in playerIds"
                  :key="`mh-${pid}`"
                  scope="col"
                  :class="[
                    playerColumnBorderClass(),
                    'bg-slate-headFill px-2 py-2 text-center text-xs font-semibold text-slate-ink',
                  ]"
                >
                  {{ playerNames[pid] }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th
                  scope="row"
                  class="border border-slate-gridline bg-slate-headFill px-2 py-2 text-left text-xs font-medium text-slate-800"
                >
                  Total before
                </th>
                <td
                  v-for="pid in playerIds"
                  :key="`tb-${pid}`"
                  :class="[
                    playerColumnBorderClass(),
                    'bg-white px-2 py-2 text-center tabular-nums text-slate-800',
                  ]"
                >
                  {{ totalBeforeRound(pid) }}
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  class="border border-slate-gridline bg-slate-mint/50 px-2 py-2 text-left text-xs font-semibold text-slate-800"
                >
                  This round
                </th>
                <td
                  v-for="pid in playerIds"
                  :key="`tr-${pid}`"
                  class="border border-slate-gridline bg-slate-mint/35 px-1 py-1.5"
                >
                  <label class="sr-only" :for="`round-score-${pid}`">
                    {{ playerNames[pid] }}, this round
                  </label>
                  <input
                    :id="`round-score-${pid}`"
                    type="number"
                    inputmode="numeric"
                    class="min-h-[44px] w-full min-w-[3.25rem] rounded border border-slate-gridline bg-white px-2 py-1.5 text-center tabular-nums text-slate-900 shadow-sm"
                    :value="modalCell(pid)"
                    :aria-label="`${playerNames[pid]}, ${rowTitle}`"
                    @input="
                      onInput(
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
                  class="border border-slate-gridline bg-slate-footFill px-2 py-2 text-left text-xs font-semibold text-slate-ink"
                >
                  Total after
                </th>
                <td
                  v-for="pid in playerIds"
                  :key="`ta-${pid}`"
                  :class="[
                    playerColumnBorderClass(),
                    'bg-slate-footFill px-2 py-2 text-center text-sm font-semibold tabular-nums text-slate-ink',
                  ]"
                >
                  {{ projectedTotalThroughRound(pid) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          class="flex flex-wrap justify-end gap-2 border-t border-slate-gridline/85 bg-slate-rail px-4 py-4"
        >
          <SlateButton variant="danger" min-width="sm" @click="emit('cancel')">
            Cancel
          </SlateButton>
          <SlateButton variant="primary" min-width="sm" @click="emit('done')">
            Done
          </SlateButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
