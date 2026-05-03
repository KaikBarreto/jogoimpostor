import { useGame } from "../state/GameStore.jsx";
import { THEMES } from "../data/themes.js";
import PlayerRing from "../components/PlayerRing.jsx";

const META_BY_MODE = {
  palavra:
    "Cada um dá uma dica relacionada à palavra. Discutam, acusem — e quando tiverem certeza, encerrem.",
  perguntas:
    "Cada um responde a pergunta de forma vaga. O impostor está observando — quando tiverem certeza, encerrem.",
  historia:
    "Cada um adiciona uma frase à história. Quando o impostor se trair, encerrem.",
};

export default function GameScreen() {
  const { state, endRound, goToSetup } = useGame();
  const roundStr = String(state.roundNo).padStart(2, "0");

  let rightLabel = "— · —";
  if (state.mode === "palavra") {
    const theme = state.themeKey ? THEMES[state.themeKey] : null;
    rightLabel = `Tema · ${theme ? theme.label : "—"}`;
  } else if (state.mode === "perguntas") {
    rightLabel = "Modo · Perguntas";
  } else if (state.mode === "historia") {
    rightLabel = "Modo · História";
  }

  const handleBack = (e) => {
    e.stopPropagation();
    if (window.confirm("Encerrar a rodada e voltar ao elenco?")) {
      goToSetup();
    }
  };

  const handleEnd = (e) => {
    e.stopPropagation();
    endRound();
  };

  return (
    <main className="game-wrap screen">
      <div className="game-head">
        <button type="button" onClick={handleBack}>
          ← Encerrar rodada
        </button>
        <span>Discussão · Rodada {roundStr}</span>
        <span>{rightLabel}</span>
      </div>

      <div className="game-body">
        <div className="game-prompt compact scroll-reveal">
          <span className="small">Discussão aberta</span>
          <div className="meta ital">{META_BY_MODE[state.mode]}</div>
        </div>

        <PlayerRing />

        <div className="game-actions single scroll-reveal">
          <button
            type="button"
            className="gbtn primary"
            onClick={handleEnd}
          >
            <span className="l">Encerrar e revelar</span>
            <span className="a">REVELAR ↘</span>
          </button>
        </div>
      </div>
    </main>
  );
}
