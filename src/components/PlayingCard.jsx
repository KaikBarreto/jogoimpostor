import { useGame } from "../state/GameStore.jsx";
import { THEMES } from "../data/themes.js";
import { MODES } from "../data/modes.js";

function escapeHTML(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default function PlayingCard({ player, counter, onDismiss }) {
  const { state } = useGame();
  const { mode, themeKey, word, question, story, impostorIds, hintForImpostor } = state;

  const isImpostor = impostorIds.includes(player.id);
  const isStoryMode = mode === "historia";
  const isQuestionMode = mode === "perguntas";
  const themeName =
    mode === "palavra" ? THEMES[themeKey].label : MODES[mode].label;

  let cardClass;
  let suit;
  let idx;
  let eyebrow;
  let titleHTML;
  let subHTML;
  let titleClass = "card-title";
  let showCenterMark = false;

  if (isImpostor) {
    cardClass = "reveal-card playing back-impostor";
    suit = "✕";
    idx = "IM";
    eyebrow = "Você é";
    titleHTML = `Impostor<span class="pt">.</span>`;
    showCenterMark = true;

    if (isStoryMode) {
      const s = story;
      const keywords = s.k.map((k) => `<b>${escapeHTML(k)}</b>`).join(" · ");
      subHTML = `Pista: ${escapeHTML(s.g)} · ${keywords}. Use estas palavras pra se misturar.`;
    } else if (isQuestionMode) {
      subHTML = `Você não sabe a pergunta dos outros. Responda algo <b>vago</b> e tente se misturar.`;
    } else if (hintForImpostor) {
      subHTML = `Tema: <b>${escapeHTML(themeName)}</b>. Tente se misturar — sem saber a palavra exata.`;
    } else {
      subHTML = `Disfarce. Você não sabe a palavra. Tente descobrir.`;
    }
  } else {
    cardClass = "reveal-card playing back-word";
    if (isStoryMode) {
      eyebrow = `Capítulo · ${escapeHTML(story.t)}`;
      titleHTML = `${escapeHTML(story.p)}`;
      subHTML = `Quando for sua vez, continue a história com uma frase.`;
      suit = "§";
      idx = "HC";
      titleClass = "card-title long";
    } else if (isQuestionMode) {
      eyebrow = "Sua pergunta";
      titleHTML = `${escapeHTML(question.q)}`;
      subHTML = "";
      suit = "?";
      idx = "PG";
      titleClass = "card-title long";
    } else {
      eyebrow = "Palavra secreta";
      titleHTML = `${escapeHTML(word)}<span class="pt">.</span>`;
      subHTML = `Dê uma dica relacionada — sem entregar a palavra.`;
      suit = "◆";
      idx = "PS";
      titleClass = "card-title";
    }
  }

  return (
    <div className={cardClass}>
      <span className="ornament" />
      {showCenterMark && <span className="center-mark" />}
      <div className="card-meta-top">
        <span className="who">
          {player.name} · {counter}
        </span>
        <span className="tag">{themeName}</span>
      </div>
      <div className="corner-mark tl">
        <span className="suit">{suit}</span>
        <span className="idx">{idx}</span>
      </div>
      <div className="corner-mark br">
        <span className="suit">{suit}</span>
        <span className="idx">{idx}</span>
      </div>
      <div className="card-center">
        <span className="card-eyebrow">{eyebrow}</span>
        <span
          className={titleClass}
          dangerouslySetInnerHTML={{ __html: titleHTML }}
        />
        {subHTML && (
          <span
            className="card-sub"
            dangerouslySetInnerHTML={{ __html: subHTML }}
          />
        )}
      </div>
      <button type="button" className="dismiss" onClick={onDismiss}>
        Esconder e passar →
      </button>
    </div>
  );
}
