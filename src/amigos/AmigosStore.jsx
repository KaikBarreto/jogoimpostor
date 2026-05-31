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
