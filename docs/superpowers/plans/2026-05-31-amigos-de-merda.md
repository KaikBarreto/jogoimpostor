# "Amigos de Merda" + Hub de Jogos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the single-game "Impostor" app into a games collection with a home hub, and add a new voting/consensus party game, "Amigos de Merda".

**Architecture:** A thin `AppShell` owns a top-level `activeGame` state (`"home" | "impostor" | "amigos"`) exposed via `AppShellContext`. The home hub picks a game; each game mounts inside its own provider (so leaving and re-entering resets its state). The Impostor game stays untouched except for adopting a shared player-roster component. "Amigos de Merda" is fully self-contained under `src/amigos/` with its own store, screens, and scoped "caos noturno" CSS. Pure game logic (deck shuffle/cycle, scoring, ranking) lives in a React-free module covered by vitest tests.

**Tech Stack:** React 18 + Vite, function components + `useReducer`/Context (existing pattern), CSS custom properties scoped per game, vitest for the pure-logic unit tests.

---

## Testing approach

The project currently has **no test framework**. We add a minimal vitest setup and apply TDD **only to the pure game-logic module** (`amigosLogic.js`), where it adds real value and is cheap. React UI (screens, hub, CSS) is verified manually by running the dev server — each UI task ends with explicit manual-verification steps. This is a deliberate, scoped use of TDD, not a blanket UI test harness.

## File structure

**New files**
- `vitest.config.js` — vitest config isolated from the PWA plugin.
- `src/data/amigosQuestions.js` — the 100-question deck (array of strings).
- `src/amigos/amigosLogic.js` — pure helpers: `shuffle`, `buildDeck`, `currentCardId`, `ranking`.
- `src/amigos/amigosLogic.test.js` — vitest tests for the above.
- `src/amigos/AmigosStore.jsx` — provider + reducer + `useAmigos()` hook.
- `src/amigos/AmigosApp.jsx` — screen switcher for the Amigos game.
- `src/amigos/screens/AmigosSetup.jsx` — player cadastro + start.
- `src/amigos/screens/AmigosGameScreen.jsx` — card + player buttons + skip + finalizar.
- `src/amigos/screens/AmigosResult.jsx` — ranking with expandable cards.
- `src/amigos/amigos.css` — scoped "caos noturno / verde-ácido" styles (under `.amigos-root`).
- `src/shell/AppShell.jsx` — top-level game switcher + `AppShellContext` + `useShell()`.
- `src/screens/HomeScreen.jsx` — the hub (two game cards).
- `src/screens/home.css` — hub styles.
- `src/components/PlayerRoster.jsx` — shared, props-driven cadastro (input + list).

**Modified files**
- `src/main.jsx` — render `<AppShell/>` instead of `<GameProvider><App/></GameProvider>`.
- `src/components/Colophon.jsx` — add a "← Jogos" back link when not on the home hub.
- `src/screens/SetupScreen.jsx` — use the shared `<PlayerRoster/>` (Impostor look unchanged).
- `package.json` — add `vitest` devDependency + `test` script.

**Deleted files**
- `src/components/PlayersInput.jsx`, `src/components/PlayersList.jsx` — replaced by `PlayerRoster`.

---

## Task 1: Test tooling (vitest)

**Files:**
- Create: `vitest.config.js`
- Modify: `package.json`

- [ ] **Step 1: Install vitest**

Run: `npm install -D vitest`
Expected: `vitest` appears under `devDependencies` in `package.json`.

- [ ] **Step 2: Create an isolated vitest config**

The main `vite.config.js` loads `vite-plugin-pwa`; tests should not. Create `vitest.config.js`:

```js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.js"],
  },
});
```

- [ ] **Step 3: Add the test script**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest run -c vitest.config.js"
```

- [ ] **Step 4: Verify the runner works (no tests yet)**

Run: `npm test`
Expected: vitest runs and reports "No test files found" (exit is fine) — confirms config loads without the PWA plugin.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.js
git commit -m "chore: add vitest for pure-logic unit tests"
```

---

## Task 2: Amigos question deck (data)

**Files:**
- Create: `src/data/amigosQuestions.js`

- [ ] **Step 1: Create the deck file**

Same shape convention as `src/data/questions.js` (a plain exported array). 100 "Quem…" prompts, adult party tone. This is a starter deck — the user edits freely later.

```js
// Deck inicial do "Amigos de Merda". Tom adulto/zoeira (+18).
// Edite à vontade: é só uma lista de perguntas "Quem...".
export const AMIGOS_QUESTIONS = [
  "Quem secretamente daria um beijo em alguém dessa roda?",
  "Quem é mais provável de trair o parceiro?",
  "Quem já ficou com alguém e não contou pra ninguém aqui?",
  "Quem manda nudes com mais frequência?",
  "Quem tem o histórico de navegação mais sujo?",
  "Quem é mais provável de chorar bêbado?",
  "Quem já vomitou numa festa e culpou a comida?",
  "Quem é mais fácil de convencer a fazer besteira?",
  "Quem ficaria rico vendendo conteúdo no OnlyFans?",
  "Quem é o mais fofoqueiro do grupo?",
  "Quem é mais provável de acabar dormindo na delegacia?",
  "Quem mente mais nessa roda?",
  "Quem já beijou alguém comprometido?",
  "Quem tem o maior número de ex?",
  "Quem manda mensagem pro ex de madrugada?",
  "Quem fingiria estar bem só pra não dar o braço a torcer?",
  "Quem é o mais dramático?",
  "Quem seria capaz de roubar o crush do amigo?",
  "Quem é mais provável de virar influencer fracassado?",
  "Quem tem o pior gosto pra parceiros?",
  "Quem já deu uma de doente pra faltar trabalho ou aula?",
  "Quem é mais provável de gastar tudo numa só noite?",
  "Quem seria o primeiro a ser cancelado na internet?",
  "Quem é o mais safado disfarçado de santo?",
  "Quem stalkeou o ex ainda hoje?",
  "Quem é mais provável de pegar duas pessoas na mesma noite?",
  "Quem mente sobre a própria idade?",
  "Quem nunca admite que está errado?",
  "Quem é capaz de surtar no grupo da família no WhatsApp?",
  "Quem beberia até passar mal de novo mesmo sabendo do perigo?",
  "Quem é o mais carente da roda?",
  "Quem já chorou por causa de série ou filme?",
  "Quem some na hora que a conta chega?",
  "Quem dorme abraçado com o celular?",
  "Quem tem a aba de likes mais comprometedora?",
  "Quem já mandou mensagem pra pessoa errada e se ferrou?",
  "Quem é mais provável de virar a fofoca da firma?",
  "Quem topa qualquer parada depois de duas cervejas?",
  "Quem é o mais ciumento?",
  "Quem já fingiu sentir tesão só pra não constranger o outro?",
  "Quem é mais provável de terminar solteiro pra sempre?",
  "Quem se acha muito melhor do que realmente é?",
  "Quem é o pão-duro do grupo?",
  "Quem já ficou com mais de uma pessoa do mesmo grupo de amigos?",
  "Quem cairia num golpe do PIX?",
  "Quem some no meio do rolê sem avisar ninguém?",
  "Quem tem o crush mais inesperado?",
  "Quem é o mais fácil de manipular?",
  "Quem já mentiu sobre quantas pessoas pegou?",
  "Quem é mais provável de virar piada interna pra sempre?",
  "Quem aguenta menos álcool?",
  "Quem largaria tudo pra 'se encontrar' numa viagem?",
  "Quem já deu unfollow em alguém só de raiva?",
  "Quem é o mais invejoso?",
  "Quem posta indireta em vez de resolver a briga?",
  "Quem namoraria alguém só pelo dinheiro?",
  "Quem guarda o segredo mais pesado aqui?",
  "Quem já ficou com alguém dessa roda?",
  "Quem é o mais inconveniente quando bebe?",
  "Quem é mais provável de chorar durante esse jogo?",
  "Quem some justo quando o amigo mais precisa?",
  "Quem é o mais exibido?",
  "Quem já espalhou um segredo que jurou guardar?",
  "Quem transaria no primeiro encontro sem pensar duas vezes?",
  "Quem tem mais conversa aberta em app de pegação agora?",
  "Quem é o mais preguiçoso?",
  "Quem já deu o cano num date em cima da hora?",
  "Quem fala mal dos outros pelas costas?",
  "Quem vai virar o 'tio do pavê' da família?",
  "Quem é incapaz de guardar segredo?",
  "Quem já se apaixonou por alguém comprometido?",
  "Quem é mão-aberta só pra se exibir?",
  "Quem já mandou print de conversa privada pra terceiros?",
  "Quem briga feio em grupo de WhatsApp?",
  "Quem é o mais fingido da roda?",
  "Quem toparia um beijo técnico por um desafio?",
  "Quem mais vai se arrepender amanhã do que fizer hoje?",
  "Quem já chorou de propósito pra conseguir o que queria?",
  "Quem é o mais inseguro disfarçado de confiante?",
  "Quem é mais provável de estar vivendo um caso escondido?",
  "Quem já curtiu uma foto e tirou na hora rezando pra ninguém ver?",
  "Quem é o mais explosivo?",
  "Quem topa qualquer fofoca, mesmo a mais cruel?",
  "Quem vira problema numa viagem em grupo?",
  "Quem fica mais carente depois de beber?",
  "Quem já beijou alguém e fingiu não lembrar no dia seguinte?",
  "Quem seria capaz de processar um amigo?",
  "Quem guarda mágoa por anos?",
  "Quem é o mais falso simpático?",
  "Quem topa contar agora o segredo mais pesado que sabe de alguém aqui?",
  "Quem fura a dieta logo no primeiro dia?",
  "Quem já xeretou o celular do parceiro?",
  "Quem é o mais dependente de like e validação?",
  "Quem some da firma sempre que aparece trabalho chato?",
  "Quem fingiria gostar de alguém por puro interesse?",
  "Quem já inventou uma desculpa absurda e ainda coou?",
  "Quem é insuportável de mau humor logo que acorda?",
  "Quem topa revelar agora a última pessoa que stalkeou?",
  "Quem vai ser o último solteiro do grupo?",
  "Quem dessa roda você levaria pra cama se fosse obrigado a escolher?",
];
```

- [ ] **Step 2: Sanity-check the count**

Run: `node -e "import('./src/data/amigosQuestions.js').then(m=>console.log(m.AMIGOS_QUESTIONS.length))"`
Expected: `100`

- [ ] **Step 3: Commit**

```bash
git add src/data/amigosQuestions.js
git commit -m "content: add Amigos de Merda starter deck (100 questions)"
```

---

## Task 3: Pure game logic (TDD)

**Files:**
- Create: `src/amigos/amigosLogic.js`
- Test: `src/amigos/amigosLogic.test.js`

- [ ] **Step 1: Write the failing tests**

Create `src/amigos/amigosLogic.test.js`. A seeded RNG keeps `shuffle`/`buildDeck` deterministic.

```js
import { describe, it, expect } from "vitest";
import { shuffle, buildDeck, currentCardId, ranking } from "./amigosLogic.js";

// Deterministic RNG (mulberry32) for reproducible shuffles.
function seeded(seed) {
  let a = seed;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("shuffle", () => {
  it("preserves length and all elements", () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input, seeded(42));
    expect(out).toHaveLength(5);
    expect([...out].sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it("does not mutate the input array", () => {
    const input = [1, 2, 3];
    shuffle(input, seeded(1));
    expect(input).toEqual([1, 2, 3]);
  });
});

describe("buildDeck", () => {
  it("returns a permutation of 0..count-1", () => {
    const deck = buildDeck(5, seeded(7));
    expect([...deck].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4]);
  });
});

describe("currentCardId", () => {
  it("returns the card at deckIdx", () => {
    expect(currentCardId([10, 20, 30], 1)).toBe(20);
  });

  it("cycles when deckIdx passes the end", () => {
    expect(currentCardId([10, 20, 30], 3)).toBe(10);
    expect(currentCardId([10, 20, 30], 4)).toBe(20);
  });

  it("returns null for an empty deck", () => {
    expect(currentCardId([], 0)).toBe(null);
  });
});

describe("ranking", () => {
  it("sorts players by card count descending and attaches their cards", () => {
    const players = [
      { id: "a", name: "Ana" },
      { id: "b", name: "Bia" },
      { id: "c", name: "Cau" },
    ];
    const scores = { a: [1], b: [2, 3, 4], c: [] };
    const result = ranking(players, scores);
    expect(result.map((p) => p.id)).toEqual(["b", "a", "c"]);
    expect(result[0].cards).toEqual([2, 3, 4]);
    expect(result[2].cards).toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `amigosLogic.js` does not exist / functions undefined.

- [ ] **Step 3: Implement the logic module**

Create `src/amigos/amigosLogic.js`:

```js
// Pure, React-free game logic for "Amigos de Merda". Unit-tested.

export function shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// A deck is an array of indices into AMIGOS_QUESTIONS, in shuffled order.
export function buildDeck(count, rng = Math.random) {
  return shuffle([...Array(count).keys()], rng);
}

// Current card id, cycling infinitely as deckIdx grows.
export function currentCardId(deck, deckIdx) {
  if (deck.length === 0) return null;
  return deck[deckIdx % deck.length];
}

// Players sorted by number of cards (desc), each with its `cards` array.
export function ranking(players, scores) {
  return players
    .map((p) => ({ ...p, cards: scores[p.id] || [] }))
    .sort((a, b) => b.cards.length - a.cards.length);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS — all tests green.

- [ ] **Step 5: Commit**

```bash
git add src/amigos/amigosLogic.js src/amigos/amigosLogic.test.js
git commit -m "feat(amigos): pure game logic (shuffle, deck, ranking) with tests"
```

---

## Task 4: Amigos store (provider + reducer)

**Files:**
- Create: `src/amigos/AmigosStore.jsx`

- [ ] **Step 1: Create the store**

Mirrors the existing `GameStore.jsx` pattern (reducer + Context + `useMemo` actions). Uses the tested logic helpers.

```jsx
import { createContext, useContext, useReducer, useMemo } from "react";
import { AMIGOS_QUESTIONS } from "../data/amigosQuestions.js";
import { buildDeck, currentCardId } from "./amigosLogic.js";

function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());
}

const initialState = {
  screen: "setup", // "setup" | "game" | "result"
  players: [], // [{ id, name }]
  deck: [], // shuffled indices into AMIGOS_QUESTIONS
  deckIdx: 0,
  scores: {}, // { playerId: [cardId, ...] }
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_PLAYER": {
      const name = action.name.trim();
      if (!name) return state;
      if (state.players.length >= 16) return state;
      if (state.players.some((p) => p.name.toLowerCase() === name.toLowerCase()))
        return state;
      return { ...state, players: [...state.players, { id: newId(), name }] };
    }
    case "REMOVE_PLAYER":
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.id),
      };
    case "START": {
      if (state.players.length < 3) return state;
      return {
        ...state,
        deck: buildDeck(AMIGOS_QUESTIONS.length),
        deckIdx: 0,
        scores: {},
        screen: "game",
      };
    }
    case "ASSIGN": {
      const cardId = currentCardId(state.deck, state.deckIdx);
      if (cardId == null) return state;
      const prev = state.scores[action.playerId] || [];
      return {
        ...state,
        scores: { ...state.scores, [action.playerId]: [...prev, cardId] },
        deckIdx: state.deckIdx + 1,
      };
    }
    case "SKIP":
      return { ...state, deckIdx: state.deckIdx + 1 };
    case "FINISH":
      return { ...state, screen: "result" };
    case "PLAY_AGAIN":
      return {
        ...state,
        deck: buildDeck(AMIGOS_QUESTIONS.length),
        deckIdx: 0,
        scores: {},
        screen: "game",
      };
    case "GO_SETUP":
      return { ...state, screen: "setup" };
    default:
      return state;
  }
}

const AmigosContext = createContext(null);

export function AmigosProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(
    () => ({
      addPlayer: (name) => dispatch({ type: "ADD_PLAYER", name }),
      removePlayer: (id) => dispatch({ type: "REMOVE_PLAYER", id }),
      start: () => dispatch({ type: "START" }),
      assign: (playerId) => dispatch({ type: "ASSIGN", playerId }),
      skip: () => dispatch({ type: "SKIP" }),
      finish: () => dispatch({ type: "FINISH" }),
      playAgain: () => dispatch({ type: "PLAY_AGAIN" }),
      goSetup: () => dispatch({ type: "GO_SETUP" }),
    }),
    []
  );

  const value = useMemo(() => ({ state, ...actions }), [state, actions]);

  return <AmigosContext.Provider value={value}>{children}</AmigosContext.Provider>;
}

export function useAmigos() {
  const ctx = useContext(AmigosContext);
  if (!ctx) throw new Error("useAmigos must be used inside <AmigosProvider>");
  return ctx;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/amigos/AmigosStore.jsx
git commit -m "feat(amigos): store with reducer and provider"
```

---

## Task 5: Shared PlayerRoster + refactor Impostor

**Files:**
- Create: `src/components/PlayerRoster.jsx`
- Modify: `src/screens/SetupScreen.jsx`
- Delete: `src/components/PlayersInput.jsx`, `src/components/PlayersList.jsx`

The markup below is copied verbatim from the current `PlayersInput.jsx` + `PlayersList.jsx` so the Impostor screen stays pixel-identical; only the data source becomes props.

- [ ] **Step 1: Create the shared roster**

```jsx
import { useState } from "react";

// Presentational cadastro (input + list). Both games feed it via props.
export default function PlayerRoster({ players, onAdd, onRemove, max = 16 }) {
  const [name, setName] = useState("");

  const trimmed = name.trim();
  const atMax = players.length >= max;
  const disabled = trimmed.length === 0 || atMax;

  const onSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;
    onAdd(trimmed);
    setName("");
  };

  return (
    <>
      <form
        className="player-input"
        id="playerForm"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <input
          id="playerName"
          type="text"
          placeholder="Nome do próximo jogador…"
          maxLength={22}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button id="addBtn" type="submit" disabled={disabled}>
          Adicionar +
        </button>
      </form>

      {players.length === 0 ? (
        <p className="empty-note">
          Nenhum jogador adicionado ainda. Comece pelo seu nome.
        </p>
      ) : (
        <div className="players" id="playersList">
          {players.map((p, i) => (
            <div
              key={p.id}
              className="player scroll-reveal is-visible"
              data-delay={String(i % 4)}
            >
              <span className="pno">N°{String(i + 1).padStart(2, "0")}</span>
              <span className="pname">{p.name}</span>
              <button
                className="px"
                type="button"
                data-id={p.id}
                aria-label={`Remover ${p.name}`}
                onClick={() => onRemove(p.id)}
              >
                remover ×
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Switch Impostor's SetupScreen to PlayerRoster**

In `src/screens/SetupScreen.jsx`:

Replace the two imports:
```jsx
import PlayersInput from "../components/PlayersInput.jsx";
import PlayersList from "../components/PlayersList.jsx";
```
with:
```jsx
import PlayerRoster from "../components/PlayerRoster.jsx";
```

Add `addPlayer` and `removePlayer` to the `useGame()` destructure at the top of the component:
```jsx
const { state, setImpostorCount, addPlayer, removePlayer } = useGame();
```

Replace the two elements inside Cap. 02:
```jsx
          <PlayersInput />
          <PlayersList />
```
with:
```jsx
          <PlayerRoster
            players={state.players}
            onAdd={addPlayer}
            onRemove={removePlayer}
            max={16}
          />
```

- [ ] **Step 3: Delete the now-unused components**

```bash
git rm src/components/PlayersInput.jsx src/components/PlayersList.jsx
```

- [ ] **Step 4: Manually verify Impostor still works**

Run: `npm run dev` and open the shown URL.
Verify:
- The "Cap. 02 — Elenco" section looks identical to before.
- Adding a player via the form works; the list renders with `N°01` numbering.
- "remover ×" removes a player.
- Duplicate names and the 16-player cap are still rejected (store still enforces this).

- [ ] **Step 5: Commit**

```bash
git add src/components/PlayerRoster.jsx src/screens/SetupScreen.jsx
git commit -m "refactor: extract shared PlayerRoster, reuse in Impostor"
```

---

## Task 6: AppShell + context + main.jsx wiring

**Files:**
- Create: `src/shell/AppShell.jsx`
- Modify: `src/main.jsx`

- [ ] **Step 1: Create AppShell and the shell context**

```jsx
import { createContext, useContext, useState, useMemo } from "react";
import { GameProvider } from "../state/GameStore.jsx";
import App from "../App.jsx";
import { AmigosProvider } from "../amigos/AmigosStore.jsx";
import AmigosApp from "../amigos/AmigosApp.jsx";
import HomeScreen from "../screens/HomeScreen.jsx";

const AppShellContext = createContext(null);

export function useShell() {
  const ctx = useContext(AppShellContext);
  if (!ctx) throw new Error("useShell must be used inside <AppShell>");
  return ctx;
}

export default function AppShell() {
  const [activeGame, setActiveGame] = useState("home"); // "home" | "impostor" | "amigos"

  const value = useMemo(
    () => ({
      activeGame,
      goToGame: (g) => setActiveGame(g),
      goHome: () => setActiveGame("home"),
    }),
    [activeGame]
  );

  return (
    <AppShellContext.Provider value={value}>
      {activeGame === "home" && <HomeScreen />}
      {activeGame === "impostor" && (
        <GameProvider>
          <App />
        </GameProvider>
      )}
      {activeGame === "amigos" && (
        <AmigosProvider>
          <AmigosApp />
        </AmigosProvider>
      )}
    </AppShellContext.Provider>
  );
}
```

- [ ] **Step 2: Point main.jsx at AppShell**

Rewrite `src/main.jsx` so the root renders `<AppShell/>` (each game now mounts its own provider):

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import AppShell from "./shell/AppShell.jsx";
import "./index.css";

// Register the service worker for PWA / offline support.
if ("serviceWorker" in navigator) {
  import("virtual:pwa-register").then(({ registerSW }) => {
    registerSW({ immediate: true });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppShell />
  </React.StrictMode>
);
```

Note: this task references `AmigosApp` and `HomeScreen`, created in Tasks 7 and 9. The app will not run cleanly until those exist — that is expected; do not run the dev server at the end of this task. Commit and proceed.

- [ ] **Step 3: Commit**

```bash
git add src/shell/AppShell.jsx src/main.jsx
git commit -m "feat: AppShell game switcher + shell context"
```

---

## Task 7: Home hub screen

**Files:**
- Create: `src/screens/HomeScreen.jsx`
- Create: `src/screens/home.css`

- [ ] **Step 1: Create the hub screen**

Two game cards, each carrying its game's identity. Uses `useShell().goToGame`. Renders `Colophon` so the theme toggle is available on the hub.

```jsx
import { useShell } from "../shell/AppShell.jsx";
import Colophon from "../components/Colophon.jsx";
import "./home.css";

const GAMES = [
  {
    key: "impostor",
    no: "N°01",
    name: "O Impostor",
    desc: "Passe o celular, descubra sua palavra, encontre o impostor.",
    cls: "hub-card--impostor",
    cta: "JOGAR →",
  },
  {
    key: "amigos",
    no: "N°02",
    name: "Amigos de Merda",
    desc: "Puxe a carta, aponte o culpado. Quem junta mais cartas perde a moral.",
    cls: "hub-card--amigos",
    cta: "JOGAR →",
  },
];

export default function HomeScreen() {
  const { goToGame } = useShell();

  return (
    <>
      <main className="frame screen hub">
        <header className="mast">
          <div className="l">N°01 / Edição 2026</div>
          <div className="c">
            <span className="dot" />
            Coletânea
            <span className="dot" />
          </div>
          <div className="r">PT — BR</div>
        </header>

        <section className="hero">
          <div className="meta">
            <span>Jogos de mesa · ao vivo</span>
            <span>Escolha o jogo</span>
          </div>
          <h1 style={{ fontSize: "clamp(48px,10vw,140px)" }}>
            A Mesa<span className="pt">.</span>
          </h1>
          <p className="lede">
            Uma coletânea de jogos de festa. Junte a galera, escolha um e passe o
            celular.
          </p>
        </section>

        <section className="hub-grid">
          {GAMES.map((g) => (
            <button
              key={g.key}
              type="button"
              className={`hub-card ${g.cls}`}
              onClick={() => goToGame(g.key)}
            >
              <span className="hub-no">{g.no}</span>
              <span className="hub-name">{g.name}</span>
              <span className="hub-desc">{g.desc}</span>
              <span className="hub-cta">{g.cta}</span>
            </button>
          ))}
        </section>
      </main>
      <Colophon />
    </>
  );
}
```

- [ ] **Step 2: Create the hub styles**

Create `src/screens/home.css`. Reuses existing tokens (`--paper`, `--ink`, `--rule`, `--accent`); the Amigos card previews its green-acid identity.

```css
.hub-grid {
  width: min(var(--max), 92%);
  margin: 24px auto 80px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 720px) {
  .hub-grid { grid-template-columns: 1fr 1fr; }
}

.hub-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  text-align: left;
  padding: 28px 24px;
  border: 1px solid var(--rule);
  background: var(--paper-2);
  border-radius: 14px;
  transition: transform 0.18s ease, border-color 0.18s ease;
}
.hub-card:hover { transform: translateY(-3px); }
.hub-no {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.12em;
  color: var(--ink-dim);
}
.hub-name {
  font-family: var(--serif);
  font-size: clamp(28px, 6vw, 44px);
  line-height: 1.05;
}
.hub-desc { color: var(--ink-dim); font-size: 13px; max-width: 36ch; }
.hub-cta {
  margin-top: 10px;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.14em;
}

.hub-card--impostor { border-color: var(--accent); }
.hub-card--impostor .hub-cta { color: var(--accent); }

.hub-card--amigos { border-color: #b6ff3a; }
.hub-card--amigos .hub-name { color: #c7ff5a; }
.hub-card--amigos .hub-cta { color: #b6ff3a; }
```

- [ ] **Step 3: Commit**

```bash
git add src/screens/HomeScreen.jsx src/screens/home.css
git commit -m "feat: home hub screen with game cards"
```

---

## Task 8: Colophon back-to-home link

**Files:**
- Modify: `src/components/Colophon.jsx`

- [ ] **Step 1: Add a "← Jogos" link shown only inside a game**

Replace the contents of `src/components/Colophon.jsx`:

```jsx
import { useTheme } from "../hooks/useTheme.js";
import { useShell } from "../shell/AppShell.jsx";

export default function Colophon() {
  const { theme, toggle } = useTheme();
  const { activeGame, goHome } = useShell();
  const next = theme === "dark" ? "CLARO" : "ESCURO";

  return (
    <footer className="colophon-fixed">
      {activeGame !== "home" && (
        <>
          <button type="button" className="theme-toggle" onClick={goHome}>
            ← <b>Jogos</b>
          </button>
          <span className="colophon-sep" aria-hidden="true">·</span>
        </>
      )}
      <span>
        Criado por{" "}
        <a
          className="credit-link"
          href="https://instagram.com/okaikbarreto"
          target="_blank"
          rel="noopener noreferrer"
        >
          <b>Kaik Barreto</b>
        </a>
      </span>
      <span className="colophon-sep" aria-hidden="true">·</span>
      <button
        type="button"
        className="theme-toggle"
        onClick={toggle}
        aria-label={`Mudar para tema ${next}`}
      >
        Tema <b>{next}</b>
      </button>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Colophon.jsx
git commit -m "feat: back-to-hub link in colophon when inside a game"
```

---

## Task 9: Amigos screens + AmigosApp

**Files:**
- Create: `src/amigos/screens/AmigosSetup.jsx`
- Create: `src/amigos/screens/AmigosGameScreen.jsx`
- Create: `src/amigos/screens/AmigosResult.jsx`
- Create: `src/amigos/AmigosApp.jsx`

- [ ] **Step 1: Setup screen**

```jsx
import { useAmigos } from "../AmigosStore.jsx";
import PlayerRoster from "../../components/PlayerRoster.jsx";

export default function AmigosSetup() {
  const { state, addPlayer, removePlayer, start } = useAmigos();
  const canStart = state.players.length >= 3;

  return (
    <main className="frame screen amigos-screen">
      <header className="mast">
        <div className="l">Amigos de Merda</div>
        <div className="c">
          <span className="dot" />
          Elenco
          <span className="dot" />
        </div>
        <div className="r">+18</div>
      </header>

      <section className="hero">
        <div className="meta">
          <span>Votação · sem dó</span>
          <span>Mín. 3 jogadores</span>
        </div>
        <h1 style={{ fontSize: "clamp(40px,9vw,120px)" }}>
          Quem é o pior<span className="pt amg-pt">?</span>
        </h1>
        <p className="lede">
          Puxe a carta, o grupo decide quem é o culpado e toca no nome. No fim,
          quem juntou mais cartas perde a moral.
        </p>
      </section>

      <section className="section">
        <div className="sec-no">
          Cap. <span className="num">01</span> — Elenco
        </div>
        <div className="sec-body">
          <div className="sec-head">
            <h2>Os jogadores<span className="pt amg-pt">.</span></h2>
            <div className="tag">
              Total <b>{state.players.length}</b> · Mín. 3 · Máx. 16
            </div>
          </div>
          <PlayerRoster
            players={state.players}
            onAdd={addPlayer}
            onRemove={removePlayer}
            max={16}
          />
        </div>
      </section>

      <section className="cta-row">
        <button
          type="button"
          className="cta amg-cta"
          disabled={!canStart}
          onClick={start}
        >
          <span className="lbl">Começar<span className="pt">.</span></span>
          <span className="arr">PUXAR A PRIMEIRA CARTA →</span>
        </button>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Game screen**

```jsx
import { useAmigos } from "../AmigosStore.jsx";
import { currentCardId } from "../amigosLogic.js";
import { AMIGOS_QUESTIONS } from "../../data/amigosQuestions.js";

export default function AmigosGameScreen() {
  const { state, assign, skip, finish } = useAmigos();
  const cardId = currentCardId(state.deck, state.deckIdx);
  const question = cardId == null ? "—" : AMIGOS_QUESTIONS[cardId];

  return (
    <main className="frame screen amigos-screen">
      <div className="game-head">
        <span>Carta {state.deckIdx + 1}</span>
        <span>Toque no culpado</span>
        <button type="button" onClick={skip}>Pular ⏭</button>
      </div>

      <div className="amg-card">
        <span className="amg-card-tag">Quem é mais provável…</span>
        <p className="amg-question">{question}</p>
      </div>

      <div className="amg-players">
        {state.players.map((p) => (
          <button
            key={p.id}
            type="button"
            className="amg-pbtn"
            onClick={() => assign(p.id)}
          >
            <span className="amg-pname">{p.name}</span>
            <span className="amg-pcount">
              {(state.scores[p.id]?.length || 0)} 🃏
            </span>
          </button>
        ))}
      </div>

      <section className="cta-row">
        <button type="button" className="cta amg-cta-finish" onClick={finish}>
          <span className="lbl">Finalizar<span className="pt">.</span></span>
          <span className="arr">VER O PLACAR ↘</span>
        </button>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Result screen**

```jsx
import { useState } from "react";
import { useAmigos } from "../AmigosStore.jsx";
import { ranking } from "../amigosLogic.js";
import { AMIGOS_QUESTIONS } from "../../data/amigosQuestions.js";

export default function AmigosResult() {
  const { state, playAgain, goSetup } = useAmigos();
  const [openId, setOpenId] = useState(null);
  const ranked = ranking(state.players, state.scores);

  return (
    <main className="frame screen amigos-screen">
      <header className="mast">
        <div className="l">Fim de Jogo</div>
        <div className="c">
          <span className="dot" />
          Placar
          <span className="dot" />
        </div>
        <div className="r">+18</div>
      </header>

      <section className="hero">
        <div className="meta">
          <span>Resultado · sem volta</span>
          <span>Cartas acumuladas</span>
        </div>
        <h1 style={{ fontSize: "clamp(44px,10vw,130px)" }}>
          O placar<span className="pt amg-pt">.</span>
        </h1>
        <p className="lede">
          Quem juntou mais cartas é, oficialmente, o amigo de merda da rodada.
          Toque num nome pra ver as cartas.
        </p>
      </section>

      <section className="section">
        <div className="sec-body">
          <div className="amg-rank">
            {ranked.map((p, i) => {
              const open = openId === p.id;
              return (
                <div key={p.id} className="amg-rank-item">
                  <button
                    type="button"
                    className="amg-rank-row"
                    onClick={() => setOpenId(open ? null : p.id)}
                  >
                    <span className="amg-rank-pos">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="amg-rank-name">{p.name}</span>
                    <span className="amg-rank-count">{p.cards.length} 🃏</span>
                  </button>
                  {open && (
                    <ul className="amg-rank-cards">
                      {p.cards.length === 0 ? (
                        <li className="amg-rank-empty">Escapou ileso. Por enquanto.</li>
                      ) : (
                        p.cards.map((cid, idx) => (
                          <li key={idx}>{AMIGOS_QUESTIONS[cid]}</li>
                        ))
                      )}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cta-row dual">
        <button type="button" className="cta amg-cta" onClick={playAgain}>
          <span className="lbl">Jogar de novo<span className="pt">.</span></span>
          <span className="arr">NOVA PARTIDA ↻</span>
        </button>
        <button
          type="button"
          className="cta amg-cta-ghost"
          onClick={goSetup}
        >
          <span className="lbl">Mexer no elenco<span className="pt">.</span></span>
          <span className="arr">← ELENCO</span>
        </button>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: AmigosApp switcher**

```jsx
import { useAmigos } from "./AmigosStore.jsx";
import AmigosSetup from "./screens/AmigosSetup.jsx";
import AmigosGameScreen from "./screens/AmigosGameScreen.jsx";
import AmigosResult from "./screens/AmigosResult.jsx";
import Colophon from "../components/Colophon.jsx";
import "./amigos.css";

export default function AmigosApp() {
  const { state } = useAmigos();
  return (
    <div className="amigos-root">
      {state.screen === "setup" && <AmigosSetup />}
      {state.screen === "game" && <AmigosGameScreen />}
      {state.screen === "result" && <AmigosResult />}
      <Colophon />
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/amigos/AmigosApp.jsx src/amigos/screens
git commit -m "feat(amigos): setup, game, and result screens"
```

---

## Task 10: Amigos "caos noturno" styles

**Files:**
- Create: `src/amigos/amigos.css`

Scoped under `.amigos-root` so it never touches Impostor. Forces a dark "caos" palette with green-acid accent regardless of the global light/dark theme.

- [ ] **Step 1: Create the stylesheet**

```css
.amigos-root {
  --amg-bg: #07090a;
  --amg-bg-2: #0d1110;
  --amg-ink: #eafce0;
  --amg-dim: #7e8a78;
  --amg-rule: #1c241d;
  --amg-accent: #b6ff3a;
  --amg-accent-deep: #7bbf16;
  min-height: 100vh;
  background: var(--amg-bg);
  color: var(--amg-ink);
}

/* Override page tokens locally so reused .mast/.hero/.section look at home here */
.amigos-root .amigos-screen {
  --ink: var(--amg-ink);
  --ink-dim: var(--amg-dim);
  --rule: var(--amg-rule);
  --paper: var(--amg-bg);
  --paper-2: var(--amg-bg-2);
  --accent: var(--amg-accent);
}

.amg-pt { color: var(--amg-accent); }

/* The cursed card */
.amg-card {
  width: min(var(--max), 92%);
  margin: 18px auto;
  padding: 36px 26px;
  border: 1px solid var(--amg-accent-deep);
  border-radius: 16px;
  background:
    radial-gradient(80% 60% at 50% 0%, rgba(182, 255, 58, 0.08), transparent 70%),
    var(--amg-bg-2);
  box-shadow: 0 0 0 1px rgba(182, 255, 58, 0.08), 0 18px 50px rgba(0, 0, 0, 0.6);
  text-align: center;
}
.amg-card-tag {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--amg-accent);
}
.amg-question {
  margin-top: 14px;
  font-family: var(--serif);
  font-size: clamp(26px, 6vw, 46px);
  line-height: 1.1;
}

/* Player buttons */
.amg-players {
  width: min(var(--max), 92%);
  margin: 10px auto 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (min-width: 720px) {
  .amg-players { grid-template-columns: 1fr 1fr 1fr; }
}
.amg-pbtn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 18px 16px;
  border: 1px solid var(--amg-rule);
  border-radius: 12px;
  background: var(--amg-bg-2);
  color: var(--amg-ink);
  font-family: var(--mono);
  transition: transform 0.1s ease, border-color 0.1s ease, background 0.1s ease;
}
.amg-pbtn:hover { border-color: var(--amg-accent); }
.amg-pbtn:active {
  transform: scale(0.97);
  background: var(--amg-accent);
  color: #06170a;
}
.amg-pname { font-size: 16px; font-weight: 600; }
.amg-pcount { font-size: 12px; color: var(--amg-dim); }

/* CTAs */
.amg-cta { background: var(--amg-accent); color: #06170a; }
.amg-cta-finish {
  background: transparent;
  color: var(--amg-ink);
  outline: 1px solid var(--amg-rule);
  outline-offset: -1px;
}
.amg-cta-ghost {
  background: transparent;
  color: var(--amg-ink);
  outline: 1px solid var(--amg-accent);
  outline-offset: -1px;
}

/* Ranking */
.amg-rank {
  width: min(var(--max), 92%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.amg-rank-item {
  border: 1px solid var(--amg-rule);
  border-radius: 12px;
  overflow: hidden;
  background: var(--amg-bg-2);
}
.amg-rank-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  color: var(--amg-ink);
  font-family: var(--mono);
}
.amg-rank-pos { color: var(--amg-dim); font-size: 13px; }
.amg-rank-name { flex: 1; text-align: left; font-size: 17px; font-weight: 600; }
.amg-rank-count { color: var(--amg-accent); font-weight: 600; }
.amg-rank-cards {
  list-style: none;
  padding: 4px 18px 16px 48px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--amg-dim);
  font-size: 13px;
}
.amg-rank-cards li { border-left: 2px solid var(--amg-rule); padding-left: 10px; }
.amg-rank-empty { font-style: italic; }
```

- [ ] **Step 2: Manual verification (full app)**

Run: `npm run dev` and open the URL. Walk the whole flow:
- Home hub shows two cards. The Amigos card has the green accent.
- Click **O Impostor** → the Impostor setup loads and plays exactly as before. The footer now shows "← Jogos"; clicking it returns to the hub.
- Back at the hub, click **Amigos de Merda** → dark green "caos" theme; add 3+ players; "Começar" is disabled under 3 players.
- In-game: a card question shows; tapping a player flashes green and advances to the next card while their counter goes up; "Pular" advances without scoring; "Finalizar" goes to the placar.
- Result: players are ranked by card count (highest first); tapping a name expands the list of questions they collected; "Jogar de novo" reshuffles and restarts; "Mexer no elenco" returns to setup with players intact.
- Toggle theme (ESCURO/CLARO) in the footer: Impostor + hub respond; the Amigos screens stay in their dark "caos" palette by design.

- [ ] **Step 3: Commit**

```bash
git add src/amigos/amigos.css
git commit -m "style(amigos): caos noturno theme with green-acid accent"
```

---

## Task 11: Build verification

**Files:** none (verification only)

- [ ] **Step 1: Run the unit tests**

Run: `npm test`
Expected: all `amigosLogic` tests PASS.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: build succeeds with no errors (PWA assets emitted into `dist/`).

- [ ] **Step 3: Preview the build**

Run: `npm run preview` and open the port-4173 URL.
Expected: hub → both games work end-to-end from the built bundle.

- [ ] **Step 4: Final commit (if anything changed)**

```bash
git add -A
git commit -m "chore: verify build for games hub + Amigos de Merda" || echo "nothing to commit"
```

---

## Self-review notes

- **Spec coverage:** separate game + hub at "/" (Tasks 6–9), single +18 deck of 100 (Task 2), infinite play until Finalizar (Task 9 game screen + `currentCardId` cycling), single-tap consensus assignment (Task 9 `assign`), ranking + per-player card reveal (Task 9 result), shared cadastro (Task 5), distinct "caos noturno / verde-ácido" visual (Tasks 7, 10), each game isolated with its own provider (Task 6). All covered.
- **Out of scope (per spec):** react-router/real URLs, intensity levels, per-vote tallying, undo, score persistence, PWA manifest rename ("O Impostor"). Not implemented by design.
- **Type/name consistency:** `useAmigos` actions (`addPlayer`, `removePlayer`, `start`, `assign`, `skip`, `finish`, `playAgain`, `goSetup`) are defined in Task 4 and used unchanged in Task 9. `currentCardId`/`ranking`/`buildDeck` signatures match between Task 3 and their callers. `useShell` (`activeGame`, `goToGame`, `goHome`) defined in Task 6, consumed in Tasks 7–8. `PlayerRoster` props (`players`, `onAdd`, `onRemove`, `max`) consistent across Tasks 5 and 9.
