import { useTheme } from "../hooks/useTheme.js";

export default function Colophon() {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "CLARO" : "ESCURO";
  return (
    <footer className="colophon-fixed">
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
      <span className="colophon-sep" aria-hidden="true">
        ·
      </span>
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
