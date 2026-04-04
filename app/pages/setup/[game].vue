<script setup lang="ts">
import { TrashIcon } from "@heroicons/vue/24/outline";
import {
  GAME_PLAYER_BOUNDS,
  displayTitleForGameType,
  parseGameTypeFromRouteParam,
} from "~/utils/game/game-types";
import type { GameType } from "~/utils/game/game-types";
import type { PlayerEntry } from "~/stores/player";

const route = useRoute();
const playerStore = usePlayerStore();
const gameStore = useGameStore();

const gameType = computed<GameType | null>(() =>
  parseGameTypeFromRouteParam(String(route.params.game ?? "")),
);

const selectedIds = ref<string[]>([]);
const newName = ref("");
const newPlayerNameInput = ref<HTMLInputElement | null>(null);
/** When checked, use the round count below; when unchecked, play until Finish (no round cap). */
const rummyLimitRoundCount = ref(false);
const rummyRounds = ref(15);
/** Bound to `type="number"` — value may be string or number from v-model. */
const rummyLimit = ref<string | number>("");

function trimRummyLimitInput(): string {
  const v = rummyLimit.value;
  if (v === null || v === undefined) {
    return "";
  }
  return String(v).trim();
}

const bounds = computed(() => {
  const g: GameType | null = gameType.value;
  return g ? GAME_PLAYER_BOUNDS[g] : null;
});

const canStart = computed(() => {
  if (!bounds.value || !gameType.value) {
    return false;
  }
  const n = selectedIds.value.length;
  return n >= bounds.value.min && n <= bounds.value.max;
});

/**
 * Empty until client mount so the first paint matches SSR. `persist.client.ts` restores
 * players before hydration, which would otherwise mismatch empty-state copy and Saved column.
 */
const setupMounted = ref(false);

const playersForSetupUi = computed(() =>
  setupMounted.value ? playerStore.players : [],
);

onMounted(() => {
  setupMounted.value = true;
  if (!gameType.value) {
    navigateTo("/");
  }
});

watch(rummyLimitRoundCount, (on: boolean) => {
  if (on && rummyRounds.value < 3) {
    rummyRounds.value = 3;
  }
});

/** Bottom copy for Rummy setup — updates from Limit rounds, round count, and score limit field. */
const rummyLimitsSummary = computed(() => {
  const limitedRounds = rummyLimitRoundCount.value;
  let rounds = Number(rummyRounds.value);
  if (!Number.isFinite(rounds) || rounds < 3) {
    rounds = 3;
  }
  rounds = Math.min(99, Math.max(3, Math.floor(rounds)));

  const limitRaw = trimRummyLimitInput();
  const limitNum = limitRaw === "" ? NaN : Number(limitRaw);
  const hasScoreLimit = Number.isFinite(limitNum) && limitNum > 0;

  if (!limitedRounds && !hasScoreLimit) {
    return "No round cap and no score limit — keep playing until you tap Finish on the score screen.";
  }
  if (!limitedRounds && hasScoreLimit) {
    return `No round cap — the game ends automatically when someone reaches ${limitNum} points (after you save that round). You can still tap Finish anytime.`;
  }
  if (limitedRounds && !hasScoreLimit) {
    return `${rounds} rounds — the game ends automatically when you save scores for the final round. You can tap Finish earlier if you want.`;
  }
  return `${rounds} rounds and a ${limitNum}-point cap — the game ends automatically when the last round is saved or when someone reaches ${limitNum} points after a round (whichever comes first).`;
});

/** Selection order matches game order. */
const activePlayers = computed(() => {
  const list: PlayerEntry[] = [];
  for (const id of selectedIds.value) {
    const p = playersForSetupUi.value.find((x: PlayerEntry) => x.id === id);
    if (p) {
      list.push(p);
    }
  }
  return list;
});

const poolPlayers = computed(() =>
  playersForSetupUi.value
    .filter((p: PlayerEntry) => !selectedIds.value.includes(p.id))
    .slice()
    .sort((a: PlayerEntry, b: PlayerEntry) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    ),
);

function togglePlayer(id: string) {
  const i = selectedIds.value.indexOf(id);
  if (i >= 0) {
    selectedIds.value.splice(i, 1);
    return;
  }
  if (!bounds.value) {
    return;
  }
  if (selectedIds.value.length >= bounds.value.max) {
    return;
  }
  selectedIds.value.push(id);
}

function addNew() {
  const raw = (newPlayerNameInput.value?.value ?? newName.value).trim();
  playerStore.addPlayer(raw);
  newName.value = "";
  if (newPlayerNameInput.value) {
    newPlayerNameInput.value.value = "";
  }
}

/** Drop from this game if selected, then remove from saved names (local list). */
function removeFromSaved(id: string) {
  const i = selectedIds.value.indexOf(id);
  if (i >= 0) {
    selectedIds.value.splice(i, 1);
  }
  playerStore.removePlayer(id);
}

function start() {
  if (!gameType.value || !canStart.value) {
    return;
  }
  const names: Record<string, string> = {};
  for (const id of selectedIds.value) {
    const p = playerStore.players.find((x: PlayerEntry) => x.id === id);
    if (p) {
      names[id] = p.name;
    }
  }
  const limitRaw = trimRummyLimitInput();
  const limit =
    gameType.value === "rummy" && limitRaw !== "" ? Number(limitRaw) : null;
  const limitRounds = gameType.value === "rummy" && rummyLimitRoundCount.value;
  const effectiveRummyRounds =
    gameType.value === "rummy" && limitRounds
      ? Math.max(
          3,
          Math.min(
            99,
            Number.isFinite(Number(rummyRounds.value))
              ? Number(rummyRounds.value)
              : 15,
          ),
        )
      : undefined;
  gameStore.startGame({
    gameType: gameType.value,
    playerIds: [...selectedIds.value],
    playerNames: names,
    rummyHasRoundLimit:
      gameType.value === "rummy" ? rummyLimitRoundCount.value : undefined,
    rummyRounds: effectiveRummyRounds,
    rummyLimit:
      gameType.value === "rummy" && limitRaw !== "" && !Number.isNaN(limit!)
        ? limit
        : null,
  });
  navigateTo("/play");
}

const title = computed(
  () => `${displayTitleForGameType(gameType.value)} setup`,
);
</script>

<template>
  <div v-if="gameType && bounds" class="w-full py-8 md:py-10">
    <header
      class="mb-6 rounded-2xl border border-slate-accent/30 bg-white p-5 shadow-soft md:p-6"
      aria-label="Setup header"
    >
      <nav aria-label="Site">
        <NuxtLink
          to="/"
          class="text-sm font-medium text-slate-inkMuted transition-colors hover:text-slate-accentDeep hover:underline"
        >
          ← Back
        </NuxtLink>
      </nav>
      <h1
        class="font-display mt-4 text-[1.625rem] font-semibold leading-[1.12] tracking-tight text-slate-ink md:text-[2rem]"
      >
        {{ title }}
      </h1>
      <div
        class="mt-5 h-px w-16 max-w-full rounded-full bg-gradient-to-r from-slate-accent via-slate-accentBright to-slate-accentDeep"
        aria-hidden="true"
      />
      <p class="mt-5 text-base leading-relaxed text-slate-600">
        Choose {{ bounds.min }}–{{ bounds.max }} players.
      </p>
    </header>

    <h2
      class="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-slate-inkMuted"
    >
      Players
    </h2>

    <div class="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
      <section aria-labelledby="setup-playing-heading">
        <h3
          id="setup-playing-heading"
          class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-inkMuted"
        >
          This game
          <span class="font-normal tabular-nums text-slate-500"
            >({{ activePlayers.length }}/{{ bounds.max }})</span
          >
        </h3>
        <p
          v-if="activePlayers.length === 0"
          class="mt-3 rounded-lg border border-dashed border-slate-accent/35 bg-slate-rail px-3 py-4 text-sm text-slate-600"
        >
          <template v-if="playersForSetupUi.length === 0">
            Add names with the form below on the right, then tap them from Saved
            to add them here.
          </template>
          <template v-else>
            Tap a name on the right to add them here.
          </template>
        </p>
        <ul v-else class="mt-3 space-y-2">
          <li
            v-for="p in activePlayers"
            :key="p.id"
            class="flex min-h-[44px] gap-2"
          >
            <SlateButton
              variant="primary"
              primary-fill="soft"
              grow
              justify="start"
              density="list"
              :aria-label="`Remove ${p.name} from this game`"
              @click="togglePlayer(p.id)"
            >
              {{ p.name }}
            </SlateButton>
            <SlateButton
              variant="danger"
              size="icon"
              :aria-label="`Remove ${p.name} from saved names`"
              :title="`Remove ${p.name} from saved names`"
              @click="removeFromSaved(p.id)"
            >
              <TrashIcon class="size-5" aria-hidden="true" />
            </SlateButton>
          </li>
        </ul>
      </section>

      <section class="flex flex-col" aria-labelledby="setup-pool-heading">
        <h3
          id="setup-pool-heading"
          class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-inkMuted"
        >
          Saved
        </h3>
        <p
          v-if="playersForSetupUi.length === 0"
          class="mt-3 rounded-lg border border-dashed border-slate-accent/35 bg-white px-3 py-4 text-sm text-slate-600"
        >
          No saved names yet — use Add new below.
        </p>
        <p
          v-else-if="poolPlayers.length === 0"
          class="mt-3 rounded-lg border border-dashed border-slate-accent/25 bg-white px-3 py-4 text-sm text-slate-500"
        >
          Everyone is in this game.
        </p>
        <ul v-else-if="poolPlayers.length > 0" class="mt-3 space-y-2">
          <li
            v-for="p in poolPlayers"
            :key="p.id"
            class="flex min-h-[44px] gap-2"
          >
            <SlateButton
              variant="default"
              grow
              justify="start"
              density="list"
              weight="medium"
              label-tone="body"
              :disabled="selectedIds.length >= bounds.max"
              :aria-label="
                selectedIds.length >= bounds.max
                  ? `Cannot add ${p.name} — maximum ${bounds.max} players`
                  : `Add ${p.name} to this game`
              "
              @click="togglePlayer(p.id)"
            >
              {{ p.name }}
            </SlateButton>
            <SlateButton
              variant="danger"
              size="icon"
              :aria-label="`Remove ${p.name} from saved names`"
              :title="`Remove ${p.name} from saved names`"
              @click="removeFromSaved(p.id)"
            >
              <TrashIcon class="size-5" aria-hidden="true" />
            </SlateButton>
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
            ref="newPlayerNameInput"
            v-model="newName"
            type="text"
            name="new-player"
            placeholder="Add new name"
            autocomplete="name"
            enterkeyhint="done"
            class="min-h-[44px] min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
            @keydown.enter.prevent="addNew"
          />
          <SlateButton
            variant="default"
            layout-width="fill-sm-hug"
            density="compact"
            weight="medium"
            @click.prevent="addNew"
          >
            Add
          </SlateButton>
        </form>
      </section>
    </div>

    <div
      v-if="gameType === 'rummy'"
      class="mt-10 space-y-4 rounded-2xl border border-slate-accent/30 bg-white p-5 shadow-soft"
    >
      <h2
        class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-inkMuted"
      >
        Rounds &amp; limit
      </h2>
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
        <label
          class="flex min-h-[44px] min-w-0 flex-1 items-center gap-3 sm:max-w-xs"
          for="rummy-rounds"
        >
          <span class="shrink-0 text-sm font-medium text-slate-700"
            >Rounds (min 3)</span
          >
          <input
            id="rummy-rounds"
            v-model.number="rummyRounds"
            type="number"
            min="3"
            max="99"
            autocomplete="off"
            :disabled="!rummyLimitRoundCount"
            class="min-h-[44px] min-w-[5rem] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-center tabular-nums text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 sm:flex-initial"
          />
        </label>
        <label
          class="inline-flex cursor-pointer select-none items-center gap-2 text-sm text-slate-700"
        >
          <input
            v-model="rummyLimitRoundCount"
            type="checkbox"
            class="size-4 shrink-0 accent-slate-accent"
          />
          <span>Limit rounds</span>
        </label>
      </div>
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
        />
      </label>
      <p
        class="text-xs text-slate-500"
        role="status"
        aria-live="polite"
      >
        {{ rummyLimitsSummary }}
      </p>
    </div>

    <div class="mt-10 w-full">
      <SlateButton
        variant="primary"
        layout-width="fill"
        :disabled="!canStart"
        :aria-disabled="!canStart"
        @click="start"
      >
        Start game
      </SlateButton>
    </div>
  </div>
</template>
