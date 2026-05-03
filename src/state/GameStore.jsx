import { createContext, useContext, useReducer, useCallback, useMemo } from "react";
import { THEMES } from "../data/themes.js";
import { QUESTIONS } from "../data/questions.js";
import { STORIES } from "../data/stories.js";

/* Helpers */
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pickN(ids, n) { return shuffle(ids).slice(0, n); }
function newId() {
  return (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now() + Math.random());
}

const initialState = {
  screen: "setup",          // "setup" | "reveal" | "game" | "result"
  mode: "palavra",          // "palavra" | "perguntas" | "historia"
  players: [],              // [{id, name}]
  themeKey: null,
  impostorCount: 1,
  hintForImpostor: false,
  // round
  roundNo: 1,
  word: null,
  question: null,
  story: null,
  impostorIds: [],
  shuffledOrder: [],
  revealIdx: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.mode };
    case "ADD_PLAYER": {
      const name = action.name.trim();
      if (!name) return state;
      if (state.players.length >= 16) return state;
      if (state.players.some(p => p.name.toLowerCase() === name.toLowerCase())) return state;
      return { ...state, players: [...state.players, { id: newId(), name }] };
    }
    case "REMOVE_PLAYER":
      return { ...state, players: state.players.filter(p => p.id !== action.id) };
    case "SELECT_THEME":
      return { ...state, themeKey: action.key };
    case "SET_IMPOSTOR_COUNT":
      return { ...state, impostorCount: action.count };
    case "SET_HINT":
      return { ...state, hintForImpostor: action.value };
    case "START_ROUND": {
      if (state.players.length < 3) return state;
      let word = null, question = null, story = null;
      if (state.mode === "palavra") {
        if (!state.themeKey) return state;
        word = pickRandom(THEMES[state.themeKey].words);
      } else if (state.mode === "perguntas") {
        question = pickRandom(QUESTIONS);
      } else if (state.mode === "historia") {
        story = pickRandom(STORIES);
      }
      const max = Math.max(1, Math.floor((state.players.length - 1) / 2));
      const count = Math.min(state.impostorCount, max);
      const impostorIds = pickN(state.players.map(p => p.id), count);
      const shuffledOrder = shuffle(state.players.slice());
      return {
        ...state,
        word, question, story,
        impostorIds,
        shuffledOrder,
        revealIdx: 0,
        screen: "reveal",
      };
    }
    case "ADVANCE_REVEAL": {
      const next = state.revealIdx + 1;
      if (next >= state.shuffledOrder.length) {
        return { ...state, screen: "game" };
      }
      return { ...state, revealIdx: next };
    }
    case "END_ROUND":
      return { ...state, screen: "result" };
    case "PLAY_AGAIN":
      return reducer({ ...state, roundNo: state.roundNo + 1 }, { type: "START_ROUND" });
    case "RESTART":
      return reducer({ ...state, roundNo: 1 }, { type: "START_ROUND" });
    case "GO_TO_SETUP":
      return { ...state, screen: "setup" };
    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(() => ({
    setMode: (mode) => dispatch({ type: "SET_MODE", mode }),
    addPlayer: (name) => dispatch({ type: "ADD_PLAYER", name }),
    removePlayer: (id) => dispatch({ type: "REMOVE_PLAYER", id }),
    selectTheme: (key) => dispatch({ type: "SELECT_THEME", key }),
    setImpostorCount: (count) => dispatch({ type: "SET_IMPOSTOR_COUNT", count }),
    setHint: (value) => dispatch({ type: "SET_HINT", value }),
    startRound: () => dispatch({ type: "START_ROUND" }),
    advanceReveal: () => dispatch({ type: "ADVANCE_REVEAL" }),
    endRound: () => dispatch({ type: "END_ROUND" }),
    playAgain: () => dispatch({ type: "PLAY_AGAIN" }),
    restart: () => dispatch({ type: "RESTART" }),
    goToSetup: () => dispatch({ type: "GO_TO_SETUP" }),
  }), []);

  const value = useMemo(() => ({ state, ...actions }), [state, actions]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside <GameProvider>");
  return ctx;
}
