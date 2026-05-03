import { useGame } from "../state/GameStore.jsx";

const baseStyle = {
  fontFamily: "var(--mono)",
  fontSize: "12px",
  letterSpacing: ".18em",
  textTransform: "uppercase",
  padding: "0 18px",
};

function btnStyle(active) {
  return {
    ...baseStyle,
    background: active ? "var(--ink)" : "transparent",
    color: active ? "var(--paper)" : "var(--ink)",
  };
}

export default function HintToggle() {
  const { state, setHint } = useGame();
  const on = state.hintForImpostor;

  return (
    <div className="stepper" id="hintToggle" role="group">
      <button
        type="button"
        data-v="off"
        id="hintOff"
        className="hint-btn"
        style={btnStyle(!on)}
        onClick={() => setHint(false)}
      >
        Não
      </button>
      <button
        type="button"
        data-v="on"
        id="hintOn"
        className="hint-btn"
        style={btnStyle(on)}
        onClick={() => setHint(true)}
      >
        Sim
      </button>
    </div>
  );
}
