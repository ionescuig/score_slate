<script setup lang="ts">
import {
  GAME_PLAYER_BOUNDS,
  displayTitleForGameType,
  parseGameTypeFromRouteParam,
} from '~/utils/game/game-types'
import type { GameType } from '~/utils/game/game-types'
import type { PlayerEntry } from '~/stores/player'

const route = useRoute()
const playerStore = usePlayerStore()
const gameStore = useGameStore()

const gameType = computed<GameType | null>(() =>
  parseGameTypeFromRouteParam(String(route.params.game ?? '')),
)

const selectedIds = ref<string[]>([])
const newName = ref('')
/** When checked, use the round count below; when unchecked, play until Finish (no round cap). */
const rummyLimitRoundCount = ref(false)
const rummyRounds = ref(15)
const rummyLimit = ref<string>('')

const bounds = computed(() => {
  const g: GameType | null = gameType.value
  return g ? GAME_PLAYER_BOUNDS[g] : null
})

const canStart = computed(() => {
  if (!bounds.value || !gameType.value) {
    return false
  }
  const n = selectedIds.value.length
  return n >= bounds.value.min && n <= bounds.value.max
})

onMounted(() => {
  if (!gameType.value) {
    navigateTo('/')
  }
})

watch(rummyLimitRoundCount, (on: boolean) => {
  if (on && rummyRounds.value < 3) {
    rummyRounds.value = 3
  }
})

/** Selection order matches game order. */
const activePlayers = computed(() => {
  const list: PlayerEntry[] = []
  for (const id of selectedIds.value) {
    const p = playerStore.players.find((x: PlayerEntry) => x.id === id)
    if (p) {
      list.push(p)
    }
  }
  return list
})

const poolPlayers = computed(() =>
  playerStore.players
    .filter((p: PlayerEntry) => !selectedIds.value.includes(p.id))
    .slice()
    .sort((a: PlayerEntry, b: PlayerEntry) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
    ),
)

function togglePlayer(id: string) {
  const i = selectedIds.value.indexOf(id)
  if (i >= 0) {
    selectedIds.value.splice(i, 1)
    return
  }
  if (!bounds.value) {
    return
  }
  if (selectedIds.value.length >= bounds.value.max) {
    return
  }
  selectedIds.value.push(id)
}

function addNew() {
  playerStore.addPlayer(newName.value)
  newName.value = ''
}

function start() {
  if (!gameType.value || !canStart.value) {
    return
  }
  const names: Record<string, string> = {}
  for (const id of selectedIds.value) {
    const p = playerStore.players.find((x: PlayerEntry) => x.id === id)
    if (p) {
      names[id] = p.name
    }
  }
  const limitRaw = rummyLimit.value.trim()
  const limit =
    gameType.value === 'rummy' && limitRaw !== ''
      ? Number(limitRaw)
      : null
  const limitRounds = gameType.value === 'rummy' && rummyLimitRoundCount.value
  const effectiveRummyRounds =
    gameType.value === 'rummy' && limitRounds
      ? Math.max(
          3,
          Math.min(
            99,
            Number.isFinite(Number(rummyRounds.value))
              ? Number(rummyRounds.value)
              : 15,
          ),
        )
      : undefined
  gameStore.startGame({
    gameType: gameType.value,
    playerIds: [...selectedIds.value],
    playerNames: names,
    rummyHasRoundLimit: gameType.value === 'rummy' ? rummyLimitRoundCount.value : undefined,
    rummyRounds: effectiveRummyRounds,
    rummyLimit:
      gameType.value === 'rummy' && limitRaw !== '' && !Number.isNaN(limit!)
        ? limit
        : null,
  })
  navigateTo('/play')
}

const title = computed(() => `${displayTitleForGameType(gameType.value)} setup`)
</script>

<template>
  <div
    v-if="gameType && bounds"
    class="w-full py-8 md:py-10"
  >
    <NuxtLink
      to="/"
      class="text-sm font-medium text-slate-inkMuted transition-colors hover:text-slate-accentDeep hover:underline"
    >
      ← Back
    </NuxtLink>
    <h1 class="font-display mt-5 text-3xl font-semibold tracking-tight text-slate-ink">
      {{ title }}
    </h1>
    <p class="mt-2 text-base text-slate-600">
      Choose {{ bounds.min }}–{{ bounds.max }} players.
    </p>

    <h2 class="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-slate-inkMuted">
      Players
    </h2>

    <div class="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
      <section aria-labelledby="setup-playing-heading">
        <h3
          id="setup-playing-heading"
          class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-inkMuted"
        >
          This game
          <span class="font-normal tabular-nums text-slate-500">({{ activePlayers.length }}/{{ bounds.max }})</span>
        </h3>
        <p
          v-if="activePlayers.length === 0"
          class="mt-3 rounded-lg border border-dashed border-gray-300 bg-slate-rail px-3 py-4 text-sm text-slate-600"
        >
          <template v-if="playerStore.players.length === 0">
            Add names with the form below on the right, then tap them from Saved to add them here.
          </template>
          <template v-else>
            Tap a name on the right to add them here.
          </template>
        </p>
        <ul
          v-else
          class="mt-3 space-y-2"
        >
          <li
            v-for="p in activePlayers"
            :key="p.id"
          >
            <button
              type="button"
              class="w-full min-h-[44px] rounded-xl border border-slate-accent/50 bg-slate-accent/10 px-3 py-2.5 text-left text-sm font-semibold text-slate-ink shadow-sm transition-colors hover:border-slate-accent hover:bg-slate-accent/20"
              :aria-label="`Remove ${p.name} from this game`"
              @click="togglePlayer(p.id)"
            >
              {{ p.name }}
            </button>
          </li>
        </ul>
      </section>

      <section
        class="flex flex-col"
        aria-labelledby="setup-pool-heading"
      >
        <h3
          id="setup-pool-heading"
          class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-inkMuted"
        >
          Saved
        </h3>
        <p
          v-if="playerStore.players.length === 0"
          class="mt-3 rounded-lg border border-dashed border-gray-300 bg-white px-3 py-4 text-sm text-slate-600"
        >
          No saved names yet — use Add new below.
        </p>
        <p
          v-else-if="poolPlayers.length === 0"
          class="mt-3 rounded-lg border border-dashed border-gray-200 bg-white px-3 py-4 text-sm text-slate-500"
        >
          Everyone is in this game.
        </p>
        <ul
          v-else-if="poolPlayers.length > 0"
          class="mt-3 space-y-2"
        >
          <li
            v-for="p in poolPlayers"
            :key="p.id"
          >
            <button
              type="button"
              class="w-full min-h-[44px] rounded-xl border border-gray-200/90 bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-ink shadow-sm transition-colors hover:border-slate-accent hover:bg-slate-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="selectedIds.length >= bounds.max"
              :aria-label="
                selectedIds.length >= bounds.max
                  ? `Cannot add ${p.name} — maximum ${bounds.max} players`
                  : `Add ${p.name} to this game`
              "
              @click="togglePlayer(p.id)"
            >
              {{ p.name }}
            </button>
          </li>
        </ul>
        <p
          v-if="selectedIds.length >= bounds.max && poolPlayers.length > 0"
          class="mt-2 text-xs text-slate-500"
        >
          Maximum players — remove someone on the left to add another.
        </p>

        <form
          class="mt-6 flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2"
          @submit.prevent="addNew"
        >
          <input
            v-model="newName"
            type="text"
            name="new-player"
            placeholder="Add new name"
            autocomplete="name"
            class="min-h-[44px] min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          >
          <button
            type="submit"
            class="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-xl border border-slate-300/90 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 ease-out-expo hover:border-slate-accent hover:bg-slate-accent/10 sm:w-auto sm:min-w-[5.5rem]"
          >
            Add
          </button>
        </form>
      </section>
    </div>

    <div
      v-if="gameType === 'rummy'"
      class="mt-10 space-y-4 rounded-2xl border border-gray-200/90 bg-white p-5 shadow-soft"
    >
      <h2 class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-inkMuted">
        Rounds &amp; limit
      </h2>
      <div
        class="flex flex-wrap items-center gap-x-4 gap-y-2"
      >
        <label
          class="flex min-h-[44px] min-w-0 flex-1 items-center gap-3 sm:max-w-xs"
          for="rummy-rounds"
        >
          <span class="shrink-0 text-sm font-medium text-slate-700">Rounds (min 3)</span>
          <input
            id="rummy-rounds"
            v-model.number="rummyRounds"
            type="number"
            min="3"
            max="99"
            autocomplete="off"
            :disabled="!rummyLimitRoundCount"
            class="min-h-[44px] min-w-[5rem] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-center tabular-nums text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 sm:flex-initial"
          >
        </label>
        <label
          class="inline-flex cursor-pointer select-none items-center gap-2 text-sm text-slate-700"
        >
          <input
            v-model="rummyLimitRoundCount"
            type="checkbox"
            class="size-4 shrink-0 accent-slate-accent"
          >
          <span>Limit rounds</span>
        </label>
      </div>
      <p
        v-if="!rummyLimitRoundCount"
        class="text-xs text-slate-500"
      >
        No round cap — keep playing until you tap Finish on the score screen.
      </p>
      <label class="block text-sm font-medium text-slate-700" for="rummy-limit">
        Optional score limit (stop when someone reaches it)
        <input
          id="rummy-limit"
          v-model="rummyLimit"
          type="number"
          min="1"
          placeholder="None"
          autocomplete="off"
          inputmode="numeric"
          class="mt-1 w-full min-h-[44px] rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        >
      </label>
    </div>

    <button
      type="button"
      class="mt-10 flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-slate-accent py-3.5 text-sm font-semibold text-slate-ink shadow-soft transition-all duration-200 ease-out-expo hover:bg-slate-accentDeep hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-50 motion-safe:active:scale-[0.99]"
      :disabled="!canStart"
      :aria-disabled="!canStart"
      @click="start"
    >
      Start game
    </button>
  </div>
</template>
