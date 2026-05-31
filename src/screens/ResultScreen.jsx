import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../state/GameStore.jsx";
import { THEMES } from "../data/themes.js";
import NavBar from "../components/ios/NavBar.jsx";

export default function ResultScreen() {
  const { state, playAgain } = useGame();
  const navigate = useNavigate();

  // Secret label + value
  let secretLabel = "A palavra era";
  let secretValue = state.word;
  if (state.mode === "perguntas") {
    secretLabel = "A pergunta era";
    secretValue = state.question ? state.question.q : "—";
  } else if (state.mode === "historia") {
    secretLabel = "A história começava com";
    secretValue = state.story ? state.story.p : "—";
  }

  const impostors = state.players.filter((p) =>
    state.impostorIds.includes(p.id)
  );
  const impostorLabel = impostors.length > 1 ? "Os impostores eram" : "O impostor era";

  return (
    <div className="ios-app">
      <NavBar
        title="Veredito"
        back={{ label: "Jogos", onClick: () => navigate("/") }}
      />
      <div className="ios-scroll">
        <h1 className="ios-large-title">Veredito</h1>
        <p className="ios-lede">
          A verdade é revelada. Aplaudam, ridicularizem e joguem de novo.
        </p>

        <div className="ios-section">
          <div className="ios-section-header">{secretLabel}</div>
          <div className="ios-list">
            <div className="ios-row">
              <span className="ios-row-label" style={{ fontWeight: 600 }}>
                {secretValue}
              </span>
            </div>
          </div>
        </div>

        {state.mode === "historia" && state.story && (
          <div className="ios-section">
            <div className="ios-section-header">Pista do impostor</div>
            <div className="ios-note">
              <em>{state.story.g}</em> ·{" "}
              {state.story.k.map((kw, idx) => (
                <Fragment key={idx}>
                  {idx > 0 && " · "}
                  <b style={{ color: "var(--accent)" }}>{kw}</b>
                </Fragment>
              ))}
            </div>
          </div>
        )}

        <div className="ios-section">
          <div className="ios-section-header">{impostorLabel}</div>
          <div className="ios-list">
            {impostors.map((p) => (
              <div className="ios-row" key={p.id}>
                <span className="ios-badge" style={{ background: "var(--accent)", color: "#fff" }}>
                  ✕
                </span>
                <span className="ios-row-label" style={{ fontWeight: 600 }}>
                  {p.name}
                </span>
              </div>
            ))}
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
          Nova rodada ↻
        </button>
      </div>
    </div>
  );
}
