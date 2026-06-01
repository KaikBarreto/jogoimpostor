import { useEffect, useRef } from "react";
import { useGame } from "../state/GameStore.jsx";
import Mast from "../components/Mast.jsx";
import Hero from "../components/Hero.jsx";
import ModeGrid from "../components/ModeGrid.jsx";
import PlayerRoster from "../components/PlayerRoster.jsx";
import ThemeGrid from "../components/ThemeGrid.jsx";
import Stepper from "../components/Stepper.jsx";
import HintToggle from "../components/HintToggle.jsx";
import SettingsRow from "../components/SettingsRow.jsx";
import Cta from "../components/Cta.jsx";
import { MODES } from "../data/modes.js";
import { THEMES } from "../data/themes.js";

const LABELS = { modo: "Modo", elenco: "Elenco", tema: "Universo", regras: "Regras" };

export default function SetupScreen() {
  const {
    state,
    setImpostorCount,
    addPlayer,
    removePlayer,
    setSetupStep,
  } = useGame();
  const rootRef = useRef(null);

  // The ordered pages — "tema" only exists when playing in "palavra" mode.
  const steps = [
    "modo",
    "elenco",
    ...(state.mode === "palavra" ? ["tema"] : []),
    "regras",
  ];
  const current = steps.includes(state.setupStep) ? state.setupStep : "modo";
  const idx = steps.indexOf(current);
  const isFirst = idx === 0;
  const isLast = idx === steps.length - 1;
  const total = steps.length;

  const goNext = () => setSetupStep(steps[Math.min(idx + 1, steps.length - 1)]);
  const goPrev = () => setSetupStep(steps[Math.max(idx - 1, 0)]);

  // Scroll to the top of the page whenever the step changes.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [current]);

  // Scroll reveal — observe .scroll-reveal nodes inside this screen.
  useEffect(() => {
    if (!rootRef.current) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      rootRef.current
        .querySelectorAll(".scroll-reveal:not(.is-visible)")
        .forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    const observeAll = () => {
      if (!rootRef.current) return;
      rootRef.current
        .querySelectorAll(".scroll-reveal:not(.is-visible)")
        .forEach((el) => observer.observe(el));
    };
    observeAll();
    const mo = new MutationObserver(() => observeAll());
    mo.observe(rootRef.current, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, [current]);

  // Keep impostorCount within the safe range whenever player count changes.
  useEffect(() => {
    const max = Math.max(1, Math.floor((state.players.length - 1) / 2));
    if (state.impostorCount > max) setImpostorCount(max);
    if (state.impostorCount < 1) setImpostorCount(1);
  }, [state.players.length, state.impostorCount, setImpostorCount]);

  const impostorMax = Math.max(1, Math.floor((state.players.length - 1) / 2));
  const modeLabel = MODES[state.mode]?.label ?? "—";
  const themeLabel = state.themeKey ? THEMES[state.themeKey]?.label ?? "—" : "—";

  // Can the user advance from the current page?
  let canAdvance = true;
  if (current === "elenco") canAdvance = state.players.length >= 3;
  else if (current === "tema") canAdvance = !!state.themeKey;

  const stepNo = String(idx + 1).padStart(2, "0");
  const totalNo = String(total).padStart(2, "0");

  return (
    <main
      id="setupScreen"
      className="frame screen"
      ref={rootRef}
      style={{ paddingBottom: 80 }}
    >
      <Mast />
      {isFirst && <Hero />}

      <section className="section scroll-reveal" key={current}>
        <div className="sec-no">
          Etapa <span className="num">{stepNo}</span> / {totalNo} — {LABELS[current]}
        </div>
        <div className="sec-body">
          {current === "modo" && (
            <>
              <div className="sec-head">
                <h2>
                  Como jogar<span className="pt">.</span>
                </h2>
                <div className="tag">
                  Selecionado · <b>{modeLabel}</b>
                </div>
              </div>
              <ModeGrid />
            </>
          )}

          {current === "elenco" && (
            <>
              <div className="sec-head">
                <h2>
                  Os jogadores<span className="pt">.</span>
                </h2>
                <div className="tag">
                  Total <b>{state.players.length}</b> · Mín. 3 · Máx. 16
                </div>
              </div>
              <PlayerRoster
                players={state.players}
                onAdd={addPlayer}
                onRemove={removePlayer}
                max={16}
              />
            </>
          )}

          {current === "tema" && (
            <>
              <div className="sec-head">
                <h2>
                  Tema da rodada<span className="pt">.</span>
                </h2>
                <div className="tag">
                  Selecionado · <b>{themeLabel}</b>
                </div>
              </div>
              <ThemeGrid />
            </>
          )}

          {current === "regras" && (
            <>
              <div className="sec-head">
                <h2>
                  Configurações
                  <span className="pt" style={{ color: "var(--ink-dim)" }}>
                    .
                  </span>
                </h2>
                <div className="tag">Ajuste a partida</div>
              </div>
              <SettingsRow
                label="Quantos impostores?"
                hint="Recomendado · 1 para 3–6 · 2 para 7+"
              >
                <Stepper
                  value={state.impostorCount}
                  min={1}
                  max={impostorMax}
                  onChange={setImpostorCount}
                />
              </SettingsRow>
              <SettingsRow
                label="Mostrar dica para o impostor?"
                hint="Mostra apenas o tema, sem a palavra"
              >
                <HintToggle />
              </SettingsRow>
            </>
          )}
        </div>
      </section>

      {isLast ? (
        <section className="cta-row dual scroll-reveal">
          <button type="button" className="cta secondary" onClick={goPrev}>
            <span className="lbl">
              Voltar<span className="pt">.</span>
            </span>
            <span className="arr">← {LABELS[steps[idx - 1]].toUpperCase()}</span>
          </button>
          <Cta />
        </section>
      ) : isFirst ? (
        <section className="cta-row scroll-reveal">
          <button
            type="button"
            className="cta"
            disabled={!canAdvance}
            onClick={goNext}
          >
            <span className="lbl">
              Continuar<span className="pt">.</span>
            </span>
            <span className="arr">PRÓXIMA ETAPA →</span>
          </button>
        </section>
      ) : (
        <section className="cta-row dual scroll-reveal">
          <button type="button" className="cta secondary" onClick={goPrev}>
            <span className="lbl">
              Voltar<span className="pt">.</span>
            </span>
            <span className="arr">← {LABELS[steps[idx - 1]].toUpperCase()}</span>
          </button>
          <button
            type="button"
            className="cta"
            disabled={!canAdvance}
            onClick={goNext}
          >
            <span className="lbl">
              Continuar<span className="pt">.</span>
            </span>
            <span className="arr">PRÓXIMA ETAPA →</span>
          </button>
        </section>
      )}
    </main>
  );
}
