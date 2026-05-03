import { useGame } from "../state/GameStore.jsx";

export default function PlayersList() {
  const { state, removePlayer } = useGame();

  if (state.players.length === 0) {
    return (
      <p className="empty-note">
        Nenhum jogador adicionado ainda. Comece pelo seu nome.
      </p>
    );
  }

  return (
    <div className="players" id="playersList">
      {state.players.map((p, i) => (
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
            onClick={() => removePlayer(p.id)}
          >
            remover ×
          </button>
        </div>
      ))}
    </div>
  );
}
