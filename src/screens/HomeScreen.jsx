import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import NavBar from "../components/ios/NavBar.jsx";
import "./home.css";

const GAMES = [
  {
    key: "impostor",
    to: "/impostor",
    name: "O Impostor",
    tagline: "Descubra quem está blefando",
    cover: "/cover-impostor.jpg",
    cls: "hub-card--impostor",
  },
  {
    key: "amigos",
    to: "/amigos",
    name: "Amigos de Merda",
    tagline: "Quem é o pior da roda?",
    cover: "/cover-amigos.jpg",
    cls: "hub-card--amigos",
  },
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const [failed, setFailed] = useState({});

  return (
    <div className="ios-app">
      <NavBar
        trailing={{ label: theme === "dark" ? "☀" : "☾", onClick: toggle }}
      />
      <div className="ios-scroll">
        <h1 className="ios-large-title">A Mesa</h1>
        <p className="ios-lede">
          Uma coletânea de jogos de festa. Junte a galera, escolha um e passe o
          celular.
        </p>

        <div className="hub-grid">
          {GAMES.map((g) => (
            <button
              key={g.key}
              type="button"
              className={`hub-card ${g.cls}`}
              aria-label={g.name}
              onClick={() => navigate(g.to)}
            >
              {failed[g.key] ? (
                <span className="hub-fallback">
                  <span className="hub-name">{g.name}</span>
                </span>
              ) : (
                <img
                  className="hub-cover"
                  src={g.cover}
                  alt={g.name}
                  onError={() => setFailed((f) => ({ ...f, [g.key]: true }))}
                />
              )}
            </button>
          ))}
        </div>

        <p className="hub-credit">
          Criado por{" "}
          <a
            href="https://instagram.com/okaikbarreto"
            target="_blank"
            rel="noopener noreferrer"
          >
            Kaik Barreto
          </a>
        </p>
      </div>
    </div>
  );
}
