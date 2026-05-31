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
