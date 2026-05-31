import { useTheme } from "../hooks/useTheme.js";
import { useShell } from "../shell/AppShell.jsx";

export default function Colophon() {
  const { theme, toggle } = useTheme();
  const { activeGame, goHome } = useShell();
  const next = theme === "dark" ? "CLARO" : "ESCURO";

  return (
    <footer className="colophon-fixed">
      {activeGame !== "home" && (
        <>
          <button type="button" className="theme-toggle" onClick={goHome}>
            ← <b>Jogos</b>
          </button>
          <span className="colophon-sep" aria-hidden="true">·</span>
        </>
      )}
      <span>
        Criado por{" "}
        <a
          className="credit-link"
          href="https://instagram.com/okaikbarreto"
          target="_blank"
          rel="noopener noreferrer"
        >
          <b>Kaik Barreto</b>
        </a>
      </span>
      <span className="colophon-sep" aria-hidden="true">·</span>
      <button
        type="button"
        className="theme-toggle"
        onClick={toggle}
        aria-label={`Mudar para tema ${next}`}
      >
        Tema <b>{next}</b>
      </button>
    </footer>
  );
}
