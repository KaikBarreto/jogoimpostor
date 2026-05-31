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
