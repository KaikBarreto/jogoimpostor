import { useState } from "react";
import { useAmigos } from "../AmigosStore.jsx";
import { ranking } from "../amigosLogic.js";
import { AMIGOS_QUESTIONS } from "../../data/amigosQuestions.js";

export default function AmigosResult() {
  const { state, playAgain, goSetup } = useAmigos();
  const [openId, setOpenId] = useState(null);
  const ranked = ranking(state.players, state.scores);

  return (
    <main className="frame screen amigos-screen">
      <header className="mast">
        <div className="l">Fim de Jogo</div>
        <div className="c">
          <span className="dot" />
          Placar
          <span className="dot" />
        </div>
        <div className="r">+18</div>
      </header>

      <section className="hero">
        <div className="meta">
          <span>Resultado · sem volta</span>
          <span>Cartas acumuladas</span>
        </div>
        <h1 style={{ fontSize: "clamp(44px,10vw,130px)" }}>
          O placar<span className="pt amg-pt">.</span>
        </h1>
        <p className="lede">
          Quem juntou mais cartas é, oficialmente, o amigo de merda da rodada.
          Toque num nome pra ver as cartas.
        </p>
      </section>

      <section className="section">
        <div className="sec-body">
          <div className="amg-rank">
            {ranked.map((p, i) => {
              const open = openId === p.id;
              return (
                <div key={p.id} className="amg-rank-item">
                  <button
                    type="button"
                    className="amg-rank-row"
                    onClick={() => setOpenId(open ? null : p.id)}
                  >
                    <span className="amg-rank-pos">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="amg-rank-name">{p.name}</span>
                    <span className="amg-rank-count">{p.cards.length} 🃏</span>
                  </button>
                  {open && (
                    <ul className="amg-rank-cards">
                      {p.cards.length === 0 ? (
                        <li className="amg-rank-empty">Escapou ileso. Por enquanto.</li>
                      ) : (
                        p.cards.map((cid, idx) => (
                          <li key={idx}>{AMIGOS_QUESTIONS[cid]}</li>
                        ))
                      )}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cta-row dual">
        <button type="button" className="cta amg-cta" onClick={playAgain}>
          <span className="lbl">Jogar de novo<span className="pt">.</span></span>
          <span className="arr">NOVA PARTIDA ↻</span>
        </button>
        <button
          type="button"
          className="cta amg-cta-ghost"
          onClick={goSetup}
        >
          <span className="lbl">Mexer no elenco<span className="pt">.</span></span>
          <span className="arr">← ELENCO</span>
        </button>
      </section>
    </main>
  );
}
