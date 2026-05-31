import { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useAmigos } from "../AmigosStore.jsx";
import { ranking } from "../amigosLogic.js";
import { AMIGOS_QUESTIONS } from "../../data/amigosQuestions.js";
import NavBar from "../../components/ios/NavBar.jsx";

export default function AmigosResult() {
  const { state, playAgain } = useAmigos();
  const navigate = useNavigate();
  const [openId, setOpenId] = useState(null);
  const ranked = ranking(state.players, state.scores);

  return (
    <>
      <NavBar title="Placar" back={{ label: "Jogos", onClick: () => navigate("/") }} />
      <div className="ios-scroll">
        <h1 className="ios-large-title">O placar</h1>
        <p className="ios-lede">
          Quem juntou mais cartas é, oficialmente, o amigo de merda da rodada.
          Toque num nome pra ver as cartas.
        </p>

        <div className="ios-section">
          <div className="ios-list">
            {ranked.map((p, i) => {
              const open = openId === p.id;
              return (
                <Fragment key={p.id}>
                  <button
                    type="button"
                    className="ios-row"
                    onClick={() => setOpenId(open ? null : p.id)}
                  >
                    <span className="ios-badge">{i + 1}</span>
                    <span className="ios-row-label">{p.name}</span>
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
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div className="ios-footer dual">
        <button
          type="button"
          className="ios-button ios-button--tinted"
          onClick={() => navigate("/")}
        >
          Início
        </button>
        <button type="button" className="ios-button" onClick={playAgain}>
          Jogar de novo ↻
        </button>
      </div>
    </>
  );
}
