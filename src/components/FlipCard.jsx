import { useState, useEffect, useRef } from "react";
import { useGame } from "../state/GameStore.jsx";
import FrontCard from "./FrontCard.jsx";
import PlayingCard from "./PlayingCard.jsx";

export default function FlipCard() {
  const { state, advanceReveal } = useGame();
  const { revealOrder, revealIdx } = state;
  const [flipped, setFlipped] = useState(false);
  const timeoutRef = useRef(null);

  const total = revealOrder.length;
  const player = revealOrder[revealIdx];
  const counter = `${String(revealIdx + 1).padStart(2, "0")}/${String(total).padStart(2, "0")}`;

  // Reset to front whenever the player at revealIdx changes
  useEffect(() => {
    setFlipped(false);
  }, [revealIdx]);

  // Cleanup any pending timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleReveal = (e) => {
    e.stopPropagation();
    setFlipped(true);
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    setFlipped(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      advanceReveal();
    }, 450);
  };

  if (!player) return null;

  return (
    <div className={"flip-wrap" + (flipped ? " flipped" : "")}>
      <div className="flip-face front">
        <FrontCard
          playerName={player.name}
          counter={counter}
          onReveal={handleReveal}
        />
      </div>
      <div className="flip-face back">
        <PlayingCard
          player={player}
          counter={counter}
          onDismiss={handleDismiss}
        />
      </div>
    </div>
  );
}
