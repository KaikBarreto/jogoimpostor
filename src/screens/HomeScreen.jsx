import { useShell } from "../shell/AppShell.jsx";
import Colophon from "../components/Colophon.jsx";
import "./home.css";

const GAMES = [
  {
    key: "impostor",
    no: "N°01",
    name: "O Impostor",
    desc: "Passe o celular, descubra sua palavra, encontre o impostor.",
    cls: "hub-card--impostor",
    cta: "JOGAR →",
  },
  {
    key: "amigos",
    no: "N°02",
    name: "Amigos de Merda",
    desc: "Puxe a carta, aponte o culpado. Quem junta mais cartas perde a moral.",
    cls: "hub-card--amigos",
    cta: "JOGAR →",
  },
];

export default function HomeScreen() {
  const { goToGame } = useShell();

  return (
    <>
      <main className="frame screen hub">
        <header className="mast">
          <div className="l">N°01 / Edição 2026</div>
          <div className="c">
            <span className="dot" />
            Coletânea
            <span className="dot" />
          </div>
          <div className="r">PT — BR</div>
        </header>

        <section className="hero">
          <div className="meta">
            <span>Jogos de mesa · ao vivo</span>
            <span>Escolha o jogo</span>
          </div>
          <h1 style={{ fontSize: "clamp(48px,10vw,140px)" }}>
            A Mesa<span className="pt">.</span>
          </h1>
          <p className="lede">
            Uma coletânea de jogos de festa. Junte a galera, escolha um e passe o
            celular.
          </p>
        </section>

        <section className="hub-grid">
          {GAMES.map((g) => (
            <button
              key={g.key}
              type="button"
              className={`hub-card ${g.cls}`}
              onClick={() => goToGame(g.key)}
            >
              <span className="hub-no">{g.no}</span>
              <span className="hub-name">{g.name}</span>
              <span className="hub-desc">{g.desc}</span>
              <span className="hub-cta">{g.cta}</span>
            </button>
          ))}
        </section>
      </main>
      <Colophon />
    </>
  );
}
