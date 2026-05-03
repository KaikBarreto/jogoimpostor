import { useGame } from "../state/GameStore.jsx";
import { THEMES } from "../data/themes.js";

export default function ThemeGrid() {
  const { state, selectTheme } = useGame();
  const keys = Object.keys(THEMES);

  return (
    <div className="themes" id="themesGrid">
      {keys.map((key, i) => {
        const t = THEMES[key];
        const active = state.themeKey === key;
        return (
          <button
            key={key}
            type="button"
            className={`theme scroll-reveal${active ? " active" : ""}`}
            data-key={key}
            data-delay={String(Math.min(i % 4, 4))}
            onClick={() => selectTheme(key)}
          >
            <span className="tno">N°{String(i + 1).padStart(2, "0")}</span>
            <span className="tname">{t.label}</span>
            <span className="tcount">
              {t.words.length} palavras · {t.desc}
            </span>
          </button>
        );
      })}
    </div>
  );
}
