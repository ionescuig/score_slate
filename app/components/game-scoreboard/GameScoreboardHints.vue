<script setup lang="ts">
defineProps<{
  phase: "idle" | "playing" | "finished";
}>();
</script>

<template>
  <p
    v-if="phase === 'playing'"
    class="border-b border-slate-gridline/80 bg-slate-rail px-4 py-2 text-xs font-medium text-slate-700"
  >
    Tap the highlighted row to enter scores, or a row above to fix a past
    round.
  </p>
  <p
    v-else-if="phase === 'finished'"
    class="border-b border-slate-gridline/80 bg-slate-rail px-4 py-2 text-xs font-medium text-slate-700"
  >
    Tap any round row to edit scores.
  </p>
</template>
