import { useGame } from "../state/GameStore.jsx";
import FlipCard from "../components/FlipCard.jsx";

export default function RevealScreen() {
  const { state, goToSetup } = useGame();
  const total = state.revealOrder.length;
  const i = state.revealIdx;
  const counter = `${String(i + 1).padStart(2, "0")}/${String(total).padStart(2, "0")}`;

  return (
    <main className="reveal-wrap screen">
      <div className="reveal-top">
        <button type="button" onClick={goToSetup}>← Voltar ao elenco</button>
        <div className="progress">
          {Array.from({ length: total }).map((_, k) => (
            <span
              key={k}
              className={"seg" + (k < i ? " done" : k === i ? " curr" : "")}
            />
          ))}
        </div>
        <div><span>{counter}</span></div>
      </div>

      <div className="reveal-stage">
        <FlipCard />
      </div>

      <div className="reveal-bottom">
        Mantenha o celular próximo · Apenas você deve ver
      </div>
    </main>
  );
}
