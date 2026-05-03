import { useEffect, useRef } from "react";
import { useGame } from "../state/GameStore.jsx";
import Mast from "../components/Mast.jsx";
import Hero from "../components/Hero.jsx";
import ModeGrid from "../components/ModeGrid.jsx";
import PlayersInput from "../components/PlayersInput.jsx";
import PlayersList from "../components/PlayersList.jsx";
import ThemeGrid from "../components/ThemeGrid.jsx";
import Stepper from "../components/Stepper.jsx";
import HintToggle from "../components/HintToggle.jsx";
import SettingsRow from "../components/SettingsRow.jsx";
import Cta from "../components/Cta.jsx";
import { MODES } from "../data/modes.js";
import { THEMES } from "../data/themes.js";

export default function SetupScreen() {
  const { state, setImpostorCount } = useGame();
  const rootRef = useRef(null);

  // Scroll reveal — observe .scroll-reveal nodes inside this screen.
  useEffect(() => {
    if (!rootRef.current) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      // Fallback: reveal everything immediately.
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

    // Re-scan on DOM mutations so newly rendered cards (modes/themes/players)
    // get observed too.
    const mo = new MutationObserver(() => observeAll());
    mo.observe(rootRef.current, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, []);

  // Keep impostorCount within the safe range whenever player count changes.
  useEffect(() => {
    const max = Math.max(1, Math.floor((state.players.length - 1) / 2));
    if (state.impostorCount > max) setImpostorCount(max);
    if (state.impostorCount < 1) setImpostorCount(1);
  }, [state.players.length, state.impostorCount, setImpostorCount]);

  const impostorMax = Math.max(1, Math.floor((state.players.length - 1) / 2));
  const showThemes = state.mode === "palavra";
  const modeLabel = MODES[state.mode]?.label ?? "—";
  const themeLabel = state.themeKey
    ? THEMES[state.themeKey]?.label ?? "—"
    : "—";

  return (
    <main
      id="setupScreen"
      className="frame screen"
      ref={rootRef}
      style={{ paddingBottom: 80 }}
    >
      <Mast />
      <Hero />

      {/* Cap. 01 — Modo */}
      <section className="section scroll-reveal">
        <div className="sec-no">
          Cap. <span className="num">01</span> — Modo
        </div>
        <div className="sec-body">
          <div className="sec-head">
            <h2>
              Como jogar<span className="pt">.</span>
            </h2>
            <div className="tag">
              Selecionado · <b>{modeLabel}</b>
            </div>
          </div>
          <ModeGrid />
        </div>
      </section>

      {/* Cap. 02 — Elenco */}
      <section className="section scroll-reveal" id="playersSection">
        <div className="sec-no">
          Cap. <span className="num">02</span> — Elenco
        </div>
        <div className="sec-body">
          <div className="sec-head">
            <h2>
              Os jogadores<span className="pt">.</span>
            </h2>
            <div className="tag">
              Total <b>{state.players.length}</b> · Mín. 3 · Máx. 16
            </div>
          </div>

          <PlayersInput />
          <PlayersList />
        </div>
      </section>

      {/* Cap. 03 — Universo (only for palavra mode) */}
      {showThemes && (
        <section className="section scroll-reveal" id="themesSection">
          <div className="sec-no">
            Cap. <span className="num">03</span> — Universo
          </div>
          <div className="sec-body">
            <div className="sec-head">
              <h2>
                Tema da rodada<span className="pt">.</span>
              </h2>
              <div className="tag">
                Selecionado · <b>{themeLabel}</b>
              </div>
            </div>
            <ThemeGrid />
          </div>
        </section>
      )}

      {/* Cap. 04 — Regras */}
      <section className="section scroll-reveal">
        <div className="sec-no">
          Cap. <span className="num">04</span> — Regras
        </div>
        <div className="sec-body">
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
        </div>
      </section>

      <section className="cta-row scroll-reveal">
        <Cta />
      </section>
    </main>
  );
}
