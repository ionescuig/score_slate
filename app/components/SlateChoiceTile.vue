<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    disabled?: boolean;
  }>(),
  {
    subtitle: undefined,
    disabled: false,
  },
);

const attrs = useAttrs();

const passthroughAttrs = computed(() => {
  const { class: _c, ...rest } = attrs as Record<string, unknown> & {
    class?: unknown;
  };
  return rest;
});

const tileClass = computed(() => {
  const pad = props.subtitle ? "p-4" : "px-4 py-3";
  const layout = props.subtitle ? "" : " flex items-center";
  const base = `group h-full w-full min-h-[44px] rounded-2xl border ${pad} text-left shadow-soft transition-all duration-200 ease-out-expo motion-safe:active:translate-y-0${layout}`;
  if (props.disabled) {
    return [
      base,
      "cursor-not-allowed border-slate-200/80 bg-slate-50 opacity-80 shadow-none",
    ].join(" ");
  }
  return [
    base,
    "border-slate-accent/25 bg-white",
    "hover:border-slate-accent hover:bg-slate-mint/50 hover:shadow-lift",
    "motion-safe:hover:-translate-y-0.5",
  ].join(" ");
});

const mergedClass = computed(() => [tileClass.value, attrs.class]);
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :class="mergedClass"
    v-bind="passthroughAttrs"
  >
    <span
      class="font-semibold"
      :class="disabled ? 'text-slate-500' : 'text-slate-ink'"
    >{{ title }}</span>
    <span
      v-if="subtitle"
      class="mt-1 block text-sm"
      :class="disabled ? 'text-slate-500' : 'text-slate-inkMuted'"
    >
      {{ subtitle }}
    </span>
  </button>
</template>
