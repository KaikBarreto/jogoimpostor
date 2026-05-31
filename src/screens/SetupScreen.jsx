import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../state/GameStore.jsx";
import NavBar from "../components/ios/NavBar.jsx";
import Chevron from "../components/ios/Chevron.jsx";
import Switch from "../components/ios/Switch.jsx";
import Stepper from "../components/Stepper.jsx";
import PlayerRoster from "../components/PlayerRoster.jsx";
import { MODES } from "../data/modes.js";
import { THEMES } from "../data/themes.js";

function Dots({ total, current }) {
  return (
    <div className="ios-dots">
      {Array.from({ length: total }).map((_, i) => (
        <i key={i} className={i === current - 1 ? "on" : ""} />
      ))}
    </div>
  );
}

function ThemePicker({ selected, onSelect, onBack }) {
  return (
    <div className="ios-app">
      <NavBar title="Tema" back={{ label: "Partida", onClick: onBack }} />
      <div className="ios-scroll">
        <h1 className="ios-large-title">Tema</h1>
        <div className="ios-section">
          <div className="ios-list">
            {Object.keys(THEMES).map((key) => {
              const t = THEMES[key];
              const active = selected === key;
              return (
                <button
                  key={key}
                  type="button"
                  className="ios-row"
                  onClick={() => {
                    onSelect(key);
                    onBack();
                  }}
                >
                  <span className="ios-row-label">
                    {t.label}
                    <span className="sub">
                      {t.words.length} palavras · {t.desc}
                    </span>
                  </span>
                  {active && <span className="ios-check">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SetupScreen() {
  const {
    state,
    addPlayer,
    removePlayer,
    setMode,
    selectTheme,
    setImpostorCount,
    setHint,
    setSetupStep,
    startRound,
  } = useGame();
  const navigate = useNavigate();
  const [showThemes, setShowThemes] = useState(false);

  // Keep impostorCount within the valid range as the roster changes.
  const impostorMax = Math.max(1, Math.floor((state.players.length - 1) / 2));
  useEffect(() => {
    if (state.impostorCount > impostorMax) setImpostorCount(impostorMax);
    if (state.impostorCount < 1) setImpostorCount(1);
  }, [impostorMax, state.impostorCount, setImpostorCount]);

  if (showThemes) {
    return (
      <ThemePicker
        selected={state.themeKey}
        onSelect={selectTheme}
        onBack={() => setShowThemes(false)}
      />
    );
  }

  // ---- Step 1: Elenco ----
  if (state.setupStep === 1) {
    return (
      <div className="ios-app">
        <NavBar
          title="O Impostor"
          back={{ label: "Jogos", onClick: () => navigate("/") }}
        />
        <div className="ios-stepbar">
          <Dots total={2} current={1} />
        </div>
        <div className="ios-scroll">
          <h1 className="ios-large-title">Elenco</h1>
          <p className="ios-lede">
            Quem está na mesa? Cadastre todo mundo que vai jogar.
          </p>
          <PlayerRoster
            players={state.players}
            onAdd={addPlayer}
            onRemove={removePlayer}
            max={16}
          />
        </div>
        <div className="ios-footer">
          <button
            type="button"
            className="ios-button"
            disabled={state.players.length < 3}
            onClick={() => setSetupStep(2)}
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  // ---- Step 2: Partida ----
  const needsTheme = state.mode === "palavra";
  const themeLabel = state.themeKey ? THEMES[state.themeKey].label : "Escolher";
  const ok = state.players.length >= 3 && (!needsTheme || !!state.themeKey);

  return (
    <div className="ios-app">
      <NavBar
        title="O Impostor"
        back={{ label: "Elenco", onClick: () => setSetupStep(1) }}
      />
      <div className="ios-stepbar">
        <Dots total={2} current={2} />
      </div>
      <div className="ios-scroll">
        <h1 className="ios-large-title">Partida</h1>

        <div className="ios-section">
          <div className="ios-section-header">Modo de jogo</div>
          <div className="ios-list">
            {Object.keys(MODES).map((key) => {
              const m = MODES[key];
              const active = state.mode === key;
              return (
                <button
                  key={key}
                  type="button"
                  className="ios-row"
                  onClick={() => setMode(key)}
                >
                  <span className="ios-row-label">
                    {m.label}
                    <span className="sub">{m.desc}</span>
                  </span>
                  {active && <span className="ios-check">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {needsTheme && (
          <div className="ios-section">
            <div className="ios-section-header">Tema</div>
            <div className="ios-list">
              <button
                type="button"
                className="ios-row"
                onClick={() => setShowThemes(true)}
              >
                <span className="ios-row-label">Tema da rodada</span>
                <span className="ios-row-value">{themeLabel}</span>
                <Chevron />
              </button>
            </div>
          </div>
        )}

        <div className="ios-section">
          <div className="ios-section-header">Ajustes</div>
          <div className="ios-list">
            <div className="ios-row">
              <span className="ios-row-label">Quantos impostores?</span>
              <span className="ios-row-value">{state.impostorCount}</span>
              <Stepper
                value={state.impostorCount}
                min={1}
                max={impostorMax}
                onChange={setImpostorCount}
              />
            </div>
            <div className="ios-row">
              <span className="ios-row-label">
                Dica para o impostor
                <span className="sub">Mostra só o tema, sem a palavra</span>
              </span>
              <Switch
                on={state.hintForImpostor}
                onChange={setHint}
                label="Dica para o impostor"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="ios-footer">
        <button
          type="button"
          className="ios-button"
          disabled={!ok}
          onClick={startRound}
        >
          Iniciar rodada
        </button>
      </div>
    </div>
  );
}
