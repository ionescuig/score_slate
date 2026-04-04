<script setup lang="ts">
defineOptions({ inheritAttrs: false })

export type SlateButtonLayoutWidth = 'hug' | 'fill' | 'fill-sm-hug'
export type SlateButtonJustify = 'center' | 'start'
export type SlateButtonMinWidth = 'none' | 'sm' | 'md'
export type SlateButtonDensity = 'default' | 'compact' | 'list'
export type SlateButtonWeight = 'semibold' | 'medium'
export type SlateButtonLabelTone = 'muted' | 'body' | 'ink'
/** Resting fill when `variant` is `primary`: `default` richer tint, `soft` lighter wash (e.g. name chips). */
export type SlateButtonPrimaryFill = 'default' | 'soft'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'default' | 'danger'
    size?: 'default' | 'icon'
    /** Horizontal sizing: default content-sized; full row; full on xs, content from `sm` (e.g. beside inputs). */
    layoutWidth?: SlateButtonLayoutWidth
    /** In a flex row, grow to available space (`flex-1 min-w-0`). */
    grow?: boolean
    justify?: SlateButtonJustify
    minWidth?: SlateButtonMinWidth
    density?: SlateButtonDensity
    weight?: SlateButtonWeight
    /** Only affects `variant="default"` label colour. */
    labelTone?: SlateButtonLabelTone
    /** Only affects `variant="primary"` resting background (and disabled state). */
    primaryFill?: SlateButtonPrimaryFill
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'default',
    size: 'default',
    layoutWidth: 'hug',
    grow: false,
    justify: 'center',
    minWidth: 'none',
    density: 'default',
    weight: 'semibold',
    labelTone: 'muted',
    primaryFill: 'default',
    type: 'button',
  },
)

const attrs = useAttrs()

const passthroughAttrs = computed(() => {
  const { class: _c, ...rest } = attrs as Record<string, unknown> & {
    class?: unknown
  }
  return rest
})

function layoutWidthClass(): string {
  switch (props.layoutWidth) {
    case 'fill':
      return 'w-full'
    case 'fill-sm-hug':
      return 'w-full sm:w-auto sm:min-w-[5.5rem]'
    default:
      return ''
  }
}

function minWidthClass(): string {
  switch (props.minWidth) {
    case 'sm':
      return 'min-w-[7rem] shrink-0'
    case 'md':
      return 'min-w-[10rem] shrink-0'
    default:
      return ''
  }
}

function densityClass(): string {
  switch (props.density) {
    case 'compact':
      return 'px-4'
    case 'list':
      return 'px-3 py-2.5'
    default:
      return 'px-5'
  }
}

function justifyClass(): string {
  return props.justify === 'start'
    ? 'justify-start text-left'
    : 'justify-center'
}

function weightClass(): string {
  return props.weight === 'medium' ? 'font-medium' : 'font-semibold'
}

function labelToneClass(): string {
  if (props.variant !== 'default' || props.labelTone === 'muted') {
    return ''
  }
  if (props.labelTone === 'ink') {
    return '!text-slate-ink'
  }
  return '!text-slate-700'
}

const rootClass = computed(() => {
  /** Avoid `transition-all`: interpolating bg-color → bg-image (gradient) causes edge slivers on rounded rects. */
  const base =
    'overflow-hidden transition-[color,box-shadow,transform] duration-200 ease-out-expo motion-safe:active:scale-[0.98] touch-manipulation disabled:cursor-not-allowed disabled:opacity-50'

  if (props.size === 'icon' && props.variant === 'danger') {
    return [
      base,
      'inline-flex size-[44px] shrink-0 items-center justify-center rounded-xl border-0 bg-transparent p-0 text-red-600 shadow-none hover:bg-ro-danger hover:text-red-950 motion-safe:hover:shadow-lift disabled:bg-transparent disabled:text-red-600 disabled:shadow-none disabled:hover:bg-transparent disabled:hover:text-red-600',
    ].join(' ')
  }

  if (props.size === 'icon') {
    return [
      base,
      'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-0 bg-transparent p-0 text-slate-700 shadow-none hover:bg-ro-primary hover:text-slate-ink motion-safe:hover:shadow-lift disabled:bg-transparent disabled:text-slate-700 disabled:shadow-none disabled:hover:bg-transparent disabled:hover:text-slate-700',
    ].join(' ')
  }

  const displayRow = props.grow
    ? 'flex min-h-[44px] min-w-0 flex-1'
    : 'inline-flex min-h-[44px]'

  const flexCore = [
    displayRow,
    'items-center rounded-xl text-sm',
    justifyClass(),
    weightClass(),
    densityClass(),
    layoutWidthClass(),
    minWidthClass(),
  ]
    .filter(Boolean)
    .join(' ')

  const primaryRestBg =
    props.primaryFill === 'soft' ? 'bg-slate-headFill' : 'bg-slate-footFill'
  const primaryDisabledRestBg =
    props.primaryFill === 'soft'
      ? 'disabled:hover:bg-slate-headFill'
      : 'disabled:hover:bg-slate-footFill'

  const body: Record<'primary' | 'default' | 'danger', string> = {
    default:
      'border border-slate-accent/80 bg-white text-slate-inkMuted shadow-sm hover:border-slate-accent hover:bg-ro-primary hover:text-slate-ink motion-safe:hover:shadow-lift disabled:hover:border-slate-accent/80 disabled:hover:bg-white disabled:hover:text-slate-inkMuted',
    primary: [
      'border border-slate-accent/90',
      primaryRestBg,
      'text-slate-ink shadow-sm hover:border-slate-accent hover:bg-ro-primary hover:text-white motion-safe:hover:shadow-lift disabled:hover:border-slate-accent/90',
      primaryDisabledRestBg,
      'disabled:hover:text-slate-ink',
    ].join(' '),
    danger:
      'border border-red-400/95 bg-red-100/95 text-red-900 shadow-sm hover:border-red-400 hover:bg-ro-danger hover:text-red-950 motion-safe:hover:shadow-lift disabled:hover:border-red-400/95 disabled:hover:bg-red-100/95 disabled:hover:text-red-900',
  }

  return [base, flexCore, body[props.variant], labelToneClass()]
    .filter(Boolean)
    .join(' ')
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="rootClass"
    v-bind="passthroughAttrs"
  >
    <slot />
  </button>
</template>
