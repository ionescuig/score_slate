<script setup lang="ts">
import type { ScoreboardGridModel } from "~/utils/game/scoreboard-grid-model";
import {
  rowLabelForScoreSheet,
  scoreCellDisplayString,
} from "~/utils/game/score-display";
import { scoreboardPlayerColumnStyle } from "~/utils/game/scoreboard-player-style";
import { whistRowStartsSection } from "~/utils/game/whist";

const props = defineProps<{
  model: ScoreboardGridModel;
}>();

const emit = defineEmits<{
  "open-round": [roundIndex: number];
}>();

const playerStyles = computed(() => {
  const out: Record<
    string,
    ReturnType<typeof scoreboardPlayerColumnStyle>
  > = {};
  for (const pid of props.model.playerIds) {
    out[pid] = scoreboardPlayerColumnStyle(pid, {
      phase: props.model.phase,
      dealerPlayerId: props.model.dealerPlayerId,
      scoreboardLeaderPlayerIds: props.model.scoreboardLeaderPlayerIds,
    });
  }
  return out;
});

function rowLabelForIndex(i: number): string {
  if (!props.model.gameType) {
    return "";
  }
  return rowLabelForScoreSheet(
    props.model.gameType,
    props.model.rowLabels,
    i,
  );
}

function cellValue(roundIdx: number, playerId: string): string {
  return scoreCellDisplayString(
    props.model.scores,
    roundIdx,
    playerId,
  );
}

function currentCell(playerId: string): string {
  return cellValue(props.model.currentRoundIndex, playerId);
}

function playerColumnBorderClass(): string {
  return "border border-slate-gridline";
}

function rowClickable(ri: number): boolean {
  if (props.model.phase === "playing") {
    return ri <= props.model.currentRoundIndex;
  }
  if (props.model.phase === "finished") {
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

function isActiveScoringRow(ri: number): boolean {
  return (
    props.model.phase === "playing" &&
    ri === props.model.currentRoundIndex
  );
}

function whistSectionTopBorder(ri: number): string {
  if (props.model.gameType !== "whist") {
    return "";
  }
  return whistRowStartsSection(ri, props.model.playerIds.length)
    ? "border-t-2 border-t-slate-gridline"
    : "";
}

function onOpenRound(ri: number) {
  if (!rowClickable(ri)) {
    return;
  }
  emit("open-round", ri);
}
</script>

<template>
  <div class="w-full overflow-x-auto p-4 sm:p-5">
    <table class="w-full min-w-[480px] table-fixed border-collapse text-sm">
      <caption class="sr-only">
        Score grid: one row per round or deal step; columns are players; last
        row is running totals. In body cells only, leader columns use a light
        green tint and dealer columns a light gray tint; headers and totals do
        not.
      </caption>
      <colgroup>
        <col class="w-[5rem] sm:w-[5.5rem]" >
        <col v-for="pid in model.playerIds" :key="`colgroup-${pid}`" >
      </colgroup>
      <thead>
        <tr>
          <th
            scope="col"
            class="border border-slate-gridline bg-slate-headFill px-1.5 py-2 text-center text-xs font-semibold text-slate-inkMuted"
          >
            <span class="sr-only">Round</span>
          </th>
          <th
            v-for="pid in model.playerIds"
            :key="pid"
            scope="col"
            :class="[
              playerColumnBorderClass(),
              'min-w-0 bg-slate-headFill px-2 py-2 text-center text-xs font-semibold text-slate-ink',
            ]"
          >
            <span class="block font-semibold">{{
              model.playerNames[pid]
            }}</span>
            <span
              v-if="playerStyles[pid]?.showDealerBadge"
              class="mt-1 block text-[10px] font-normal uppercase tracking-wide text-slate-600"
              >Dealer</span
            >
            <span
              v-if="playerStyles[pid]?.showLeaderBadge"
              class="mt-0.5 block text-[10px] font-bold uppercase tracking-wide text-slate-accentDeep"
              >Leader</span
            >
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="ri in model.tableRoundIndices"
          :key="ri"
          :class="[rowClickable(ri) ? 'cursor-pointer' : '']"
          :tabindex="rowClickable(ri) ? 0 : -1"
          :aria-label="rowAriaLabel(ri)"
          @click="onOpenRound(ri)"
          @keydown.enter.prevent="onOpenRound(ri)"
          @keydown.space.prevent="onOpenRound(ri)"
        >
          <th
            scope="row"
            :class="[
              'border border-slate-gridline px-1.5 text-center text-xs font-semibold tabular-nums leading-tight text-slate-800',
              isActiveScoringRow(ri)
                ? 'border-l-[3px] border-l-slate-accent bg-slate-mint py-2 text-slate-ink shadow-[inset_0_0_0_1px_rgb(0_207_200_/_0.2)]'
                : 'bg-slate-headFill py-1.5',
              whistSectionTopBorder(ri),
            ]"
          >
            {{ rowLabelForIndex(ri) }}
          </th>
          <td
            v-for="pid in model.playerIds"
            :key="`${ri}-${pid}`"
            :class="[
              playerColumnBorderClass(),
              'min-w-0 px-1 text-center text-sm text-slate-800',
              isActiveScoringRow(ri)
                ? 'py-2 shadow-[inset_0_0_0_2px_rgb(0_207_200_/_0.35)]'
                : 'py-1',
              playerStyles[pid]?.bodyBackgroundClass ?? 'bg-white',
              whistSectionTopBorder(ri),
            ]"
          >
            <template v-if="model.rowCellModes[ri] === 'future'">
              <span class="tabular-nums" />
            </template>
            <template v-else-if="model.rowCellModes[ri] === 'past'">
              <span class="tabular-nums">{{ cellValue(ri, pid) }}</span>
            </template>
            <template v-else-if="model.rowCellModes[ri] === 'current-input'">
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
            class="border border-slate-gridline bg-slate-footFill px-1.5 py-2 text-center text-xs font-semibold text-slate-ink"
          >
            Total
          </th>
          <td
            v-for="pid in model.playerIds"
            :key="`t-${pid}`"
            :class="[
              playerColumnBorderClass(),
              'min-w-0 bg-slate-footFill px-2 py-2 text-center text-sm font-semibold text-slate-ink',
            ]"
          >
            {{ model.runningTotals[pid] ?? 0 }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
