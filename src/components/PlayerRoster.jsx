import { useState } from "react";

// iOS grouped-list roster (input + list). Both games feed it via props.
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
    <div className="ios-section">
      <div className="ios-section-header">
        Elenco · {players.length}/{max}
      </div>

      <div className="ios-list">
        {players.map((p, i) => (
          <div className="ios-row" key={p.id}>
            <span className="ios-badge">{i + 1}</span>
            <span className="ios-row-label">{p.name}</span>
            <button
              type="button"
              className="ios-delete"
              aria-label={`Remover ${p.name}`}
              onClick={() => onRemove(p.id)}
            >
              −
            </button>
          </div>
        ))}

        {!atMax && (
          <form className="ios-row" onSubmit={onSubmit} autoComplete="off">
            <input
              className="ios-row-input"
              type="text"
              placeholder="Adicionar jogador"
              maxLength={22}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              type="submit"
              className={"ios-add-icon" + (disabled ? " is-disabled" : "")}
              aria-label="Adicionar"
              disabled={disabled}
            >
              +
            </button>
          </form>
        )}
      </div>

      <div className="ios-section-footer">
        Mínimo 3 jogadores. Toque em + para adicionar.
      </div>
    </div>
  );
}
