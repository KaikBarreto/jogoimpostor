import { useAmigos } from "../AmigosStore.jsx";
import { currentCardId } from "../amigosLogic.js";
import { AMIGOS_QUESTIONS } from "../../data/amigosQuestions.js";
import NavBar from "../../components/ios/NavBar.jsx";

export default function AmigosGameScreen() {
  const { state, assign, skip, finish, goSetup } = useAmigos();
  const cardId = currentCardId(state.deck, state.deckIdx);
  const question = cardId == null ? "—" : AMIGOS_QUESTIONS[cardId];

  return (
    <>
      <NavBar
        title={`Carta ${state.deckIdx + 1}`}
        back={{ label: "Sair", onClick: goSetup }}
        trailing={{ label: "Pular", onClick: skip }}
      />
      <div className="ios-scroll">
        <div className="amg-card">
          <span className="amg-card-tag">Quem é mais provável…</span>
          <p className="amg-question">{question}</p>
        </div>

        <div className="amg-pick-header">Toque no culpado 👇</div>
        <div className="amg-pick-grid">
          {state.players.map((p) => (
            <button
              key={p.id}
              type="button"
              className="amg-pick"
              onClick={() => assign(p.id)}
            >
              <span className="amg-pick-name">{p.name}</span>
              <span className="amg-pick-count">
                {state.scores[p.id]?.length || 0} 🃏
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="ios-footer">
        <button
          type="button"
          className="ios-button ios-button--tinted"
          onClick={finish}
        >
          Finalizar · ver placar ↘
        </button>
      </div>
    </>
  );
}
