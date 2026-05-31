import { useGame } from "../state/GameStore.jsx";
import NavBar from "../components/ios/NavBar.jsx";

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

  return (
    <div className="ios-app">
      <NavBar
        title="Discussão"
        back={{ label: "Elenco", onClick: goToSetup }}
      />
      <div className="ios-scroll">
        <h1 className="ios-large-title">Discussão</h1>
        <p className="ios-lede">{META_BY_MODE[state.mode]}</p>

        <div className="ios-section">
          <div className="ios-section-header">Na mesa · {state.players.length}</div>
          <div className="ios-list">
            {state.players.map((p, i) => (
              <div className="ios-row" key={p.id}>
                <span className="ios-badge">{i + 1}</span>
                <span className="ios-row-label">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ios-footer">
        <button type="button" className="ios-button" onClick={endRound}>
          Encerrar e revelar ↘
        </button>
      </div>
    </div>
  );
}
