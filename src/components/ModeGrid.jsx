import { useGame } from "../state/GameStore.jsx";
import { MODES } from "../data/modes.js";

export default function ModeGrid() {
  const { state, setMode } = useGame();
  const keys = Object.keys(MODES);

  return (
    <div className="themes modes" id="modesGrid">
      {keys.map((key, i) => {
        const m = MODES[key];
        const active = state.mode === key;
        return (
          <button
            key={key}
            type="button"
            className={`theme mode-card scroll-reveal${active ? " active" : ""}`}
            data-key={key}
            data-delay={String(i)}
            onClick={() => setMode(key)}
          >
            <span className="tno">M°{String(i + 1).padStart(2, "0")}</span>
            <span className="tname">{m.label}</span>
            <span className="tcount">{m.desc}</span>
          </button>
        );
      })}
    </div>
  );
}
