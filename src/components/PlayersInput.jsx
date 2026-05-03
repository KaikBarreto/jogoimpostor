import { useState } from "react";
import { useGame } from "../state/GameStore.jsx";

export default function PlayersInput() {
  const { state, addPlayer } = useGame();
  const [name, setName] = useState("");

  const trimmed = name.trim();
  const atMax = state.players.length >= 16;
  const disabled = trimmed.length === 0 || atMax;

  const onSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;
    addPlayer(trimmed);
    setName("");
  };

  return (
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
  );
}
