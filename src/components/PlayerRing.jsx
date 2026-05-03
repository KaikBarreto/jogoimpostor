import { useGame } from "../state/GameStore.jsx";

const PLAYER_SVG = (
  <svg
    viewBox="0 0 28 36"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    aria-hidden="true"
  >
    <circle cx="14" cy="8" r="6" />
    <path d="M2 36 Q2 18 14 18 Q26 18 26 36 Z" />
  </svg>
);

export default function PlayerRing() {
  const { state } = useGame();
  const order = state.shuffledOrder;
  const N = order.length;

  return (
    <div className="circle-stage scroll-reveal">
      {order.map((p, i) => {
        const angle = (360 / N) * i - 90;
        const rad = (angle * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const transform = `translate(-50%,-50%) translate(calc(${cos.toFixed(
          4
        )} * min(160px, 23dvh, 35vw)), calc(${sin.toFixed(
          4
        )} * min(160px, 23dvh, 35vw)))`;

        return (
          <div key={p.id} className="player-slot" style={{ transform }}>
            <div className="player-content" style={{ "--idx": i }}>
              <div className="player-figure">{PLAYER_SVG}</div>
              <span className="player-label">{p.name}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
