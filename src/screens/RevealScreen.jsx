import { useState, useEffect, useRef } from "react";
import { useGame } from "../state/GameStore.jsx";
import { THEMES } from "../data/themes.js";
import { MODES } from "../data/modes.js";
import NavBar from "../components/ios/NavBar.jsx";

// Builds the back-of-card content for a given player.
function backContent(state, player) {
  const { mode, themeKey, word, question, story, impostorIds, hintForImpostor } =
    state;
  const isImpostor = impostorIds.includes(player.id);

  if (isImpostor) {
    let sub;
    if (mode === "historia") {
      sub = (
        <>
          Pista: {story.g} · <b>{story.k.join(" · ")}</b>. Use estas palavras pra
          se misturar.
        </>
      );
    } else if (mode === "perguntas") {
      sub = "Você não sabe a pergunta. Responda algo vago e tente se misturar.";
    } else if (hintForImpostor) {
      sub = (
        <>
          Tema: <b>{THEMES[themeKey].label}</b>. Tente se misturar — sem saber a
          palavra.
        </>
      );
    } else {
      sub = "Disfarce. Você não sabe a palavra. Tente descobrir.";
    }
    return { impostor: true, eyebrow: "Você é", title: "Impostor", sub };
  }

  if (mode === "historia") {
    return {
      eyebrow: `Capítulo · ${story.t}`,
      title: story.p,
      long: true,
      sub: "Quando for sua vez, continue a história com uma frase.",
    };
  }
  if (mode === "perguntas") {
    return {
      eyebrow: "Sua pergunta",
      title: question.q,
      long: true,
      sub: "Responda de forma vaga quando for sua vez.",
    };
  }
  return {
    eyebrow: "Palavra secreta",
    title: word,
    sub: "Dê uma dica relacionada — sem entregar a palavra.",
  };
}

export default function RevealScreen() {
  const { state, advanceReveal, goToSetup } = useGame();
  const { revealOrder, revealIdx, mode, themeKey } = state;
  const [flipped, setFlipped] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setFlipped(false);
  }, [revealIdx]);
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const player = revealOrder[revealIdx];
  if (!player) return null;

  const total = revealOrder.length;
  const counter = `${String(revealIdx + 1).padStart(2, "0")} / ${String(
    total
  ).padStart(2, "0")}`;
  const themeName = mode === "palavra" ? THEMES[themeKey].label : MODES[mode].label;
  const back = backContent(state, player);

  const handleDismiss = () => {
    setFlipped(false);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(advanceReveal, 480);
  };

  return (
    <div className="ios-app">
      <NavBar
        title={themeName}
        back={{ label: "Sair", onClick: goToSetup }}
      />
      <div className="reveal-counter">{counter}</div>

      <div className="reveal-stage">
        <button
          type="button"
          className={"reveal-card3d" + (flipped ? " flipped" : "")}
          onClick={() => !flipped && setFlipped(true)}
          aria-label={flipped ? "Carta revelada" : `Revelar carta de ${player.name}`}
        >
          <div className="reveal-face reveal-front">
            <span className="reveal-avatar">
              {player.name.slice(0, 1).toUpperCase()}
            </span>
            <span className="pass">Passe o celular para</span>
            <span className="name">{player.name}</span>
            <span className="hint">Toque para revelar 👆</span>
          </div>
          <div className={"reveal-face reveal-back" + (back.impostor ? " is-impostor" : "")}>
            <span className="reveal-eyebrow">{back.eyebrow}</span>
            <span className={"reveal-title" + (back.long ? " long" : "")}>
              {back.title}
            </span>
            {back.sub && <span className="reveal-sub">{back.sub}</span>}
          </div>
        </button>
      </div>

      <div className="ios-footer">
        <button
          type="button"
          className="ios-button"
          disabled={!flipped}
          onClick={handleDismiss}
        >
          Esconder e passar →
        </button>
      </div>
    </div>
  );
}
