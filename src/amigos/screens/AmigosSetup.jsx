import { useAmigos } from "../AmigosStore.jsx";
import PlayerRoster from "../../components/PlayerRoster.jsx";

export default function AmigosSetup() {
  const { state, addPlayer, removePlayer, start } = useAmigos();
  const canStart = state.players.length >= 3;

  return (
    <main className="frame screen amigos-screen">
      <header className="mast">
        <div className="l">Amigos de Merda</div>
        <div className="c">
          <span className="dot" />
          Elenco
          <span className="dot" />
        </div>
        <div className="r">+18</div>
      </header>

      <section className="hero">
        <div className="meta">
          <span>Votação · sem dó</span>
          <span>Mín. 3 jogadores</span>
        </div>
        <h1 style={{ fontSize: "clamp(36px,8vw,110px)" }}>
          Amigos de Merda<span className="pt amg-pt">.</span>
        </h1>
        <p className="lede">
          Puxe a carta, o grupo decide quem é o culpado e toca no nome. No fim,
          quem juntou mais cartas perde a moral.
        </p>
      </section>

      <section className="section">
        <div className="sec-no">
          Cap. <span className="num">01</span> — Elenco
        </div>
        <div className="sec-body">
          <div className="sec-head">
            <h2>Os jogadores<span className="pt amg-pt">.</span></h2>
            <div className="tag">
              Total <b>{state.players.length}</b> · Mín. 3 · Máx. 16
            </div>
          </div>
          <PlayerRoster
            players={state.players}
            onAdd={addPlayer}
            onRemove={removePlayer}
            max={16}
          />
        </div>
      </section>

      <section className="cta-row">
        <button
          type="button"
          className="cta amg-cta"
          disabled={!canStart}
          onClick={start}
        >
          <span className="lbl">Começar<span className="pt">.</span></span>
          <span className="arr">PUXAR A PRIMEIRA CARTA →</span>
        </button>
      </section>
    </main>
  );
}
