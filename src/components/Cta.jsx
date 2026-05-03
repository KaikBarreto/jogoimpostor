import { useGame } from "../state/GameStore.jsx";

export default function Cta() {
  const { state, startRound } = useGame();
  const needsTheme = state.mode === "palavra";
  const ok = state.players.length >= 3 && (!needsTheme || !!state.themeKey);

  return (
    <button
      id="startBtn"
      className="cta"
      type="button"
      disabled={!ok}
      onClick={() => {
        if (ok) startRound();
      }}
    >
      <span className="lbl">
        Iniciar a rodada
        <span style={{ color: "var(--ink-dim)" }}>.</span>
      </span>
      <span className="arr">PASSAR O CELULAR →</span>
    </button>
  );
}
