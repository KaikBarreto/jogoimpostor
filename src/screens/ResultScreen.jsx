import { Fragment } from "react";
import { useGame } from "../state/GameStore.jsx";
import { THEMES } from "../data/themes.js";

export default function ResultScreen() {
  const { state, playAgain, restart } = useGame();
  const roundStr = String(state.roundNo).padStart(2, "0");

  // Right header label in hero
  let heroRight = "Tema · —";
  if (state.mode === "palavra") {
    const theme = state.themeKey ? THEMES[state.themeKey] : null;
    heroRight = `Tema · ${theme ? theme.label : "—"}`;
  } else if (state.mode === "perguntas") {
    heroRight = "Modo · Perguntas";
  } else if (state.mode === "historia") {
    heroRight = `Modo · História — ${state.story ? state.story.t : "—"}`;
  }

  // Secret label + value
  let secretLabel = "A palavra secreta era";
  let secretValueNode = null;
  let secretLong = false;

  if (state.mode === "perguntas") {
    secretLabel = "A pergunta era";
    secretLong = true;
    secretValueNode = state.question ? state.question.q : "—";
  } else if (state.mode === "historia") {
    secretLabel = "A história começava com";
    secretLong = true;
    secretValueNode = state.story ? state.story.p : "—";
  } else {
    secretValueNode = (
      <>
        {state.word ?? "—"}
        <span className="pt">.</span>
      </>
    );
  }

  // Impostors
  const impostors = state.players.filter((p) =>
    state.impostorIds.includes(p.id)
  );
  const impostorLabel =
    impostors.length > 1 ? "Os impostores eram" : "O impostor era";

  const handlePlayAgain = (e) => {
    e.stopPropagation();
    playAgain();
  };
  const handleRestart = (e) => {
    e.stopPropagation();
    restart();
  };

  return (
    <main className="frame screen">
      <header className="mast">
        <div className="l">Fim da Rodada</div>
        <div className="c">
          <span className="dot" />
          Veredito
          <span className="dot" />
        </div>
        <div className="r">N°{roundStr}</div>
      </header>

      <section className="hero">
        <div className="meta">
          <span>Resultado · Reveal final</span>
          <span>{heroRight}</span>
        </div>
        <h1 style={{ fontSize: "clamp(48px,10vw,140px)" }}>
          Veredito<span className="pt">.</span>
        </h1>
        <p className="lede">
          A palavra é revelada. O impostor é apontado. Discutam o que entregou e
          joguem novamente.
        </p>
      </section>

      <section className="section">
        <div className="sec-no">
          Cap. <span className="num">∞</span> — Reveal
        </div>
        <div className="sec-body">
          <div className="result-card">
            <div className="result-row scroll-reveal">
              <span className="lbl">{secretLabel}</span>
              <span className={secretLong ? "val long" : "val"}>
                {secretValueNode}
              </span>
            </div>

            {state.mode === "historia" && state.story && (
              <div className="result-row scroll-reveal">
                <span className="lbl">Pista que o impostor recebeu</span>
                <span className="val long">
                  <em>{state.story.g}</em>
                  {" · "}
                  {state.story.k.map((kw, idx) => (
                    <Fragment key={idx}>
                      {idx > 0 && " · "}
                      <b
                        style={{
                          color: "var(--accent)",
                          fontWeight: 500,
                        }}
                      >
                        {kw}
                      </b>
                    </Fragment>
                  ))}
                </span>
                <span className="small">
                  Era só com isso que ele tinha pra improvisar.
                </span>
              </div>
            )}

            <div className="result-row scroll-reveal">
              <span className="lbl">{impostorLabel}</span>
              <span className="val accusation">
                {impostors.map((p, idx) => (
                  <Fragment key={p.id}>
                    {idx > 0 && <span className="sep"> & </span>}
                    {p.name}
                  </Fragment>
                ))}
                <span className="pt">.</span>
              </span>
              <span className="small">
                Aplaudam, ridicularizem, joguem novamente.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-row dual">
        <button
          type="button"
          className="cta"
          style={{
            background: "var(--paper)",
            color: "var(--ink)",
            outline: "1px solid var(--ink)",
            outlineOffset: "-1px",
          }}
          onClick={handlePlayAgain}
        >
          <span className="lbl">
            Nova rodada<span className="pt">.</span>
          </span>
          <span className="arr">REEMBARALHAR ↻</span>
        </button>
        <button type="button" className="cta" onClick={handleRestart}>
          <span className="lbl">
            Recomeçar<span className="pt">.</span>
          </span>
          <span className="arr">JOGAR DE NOVO →</span>
        </button>
      </section>
    </main>
  );
}
