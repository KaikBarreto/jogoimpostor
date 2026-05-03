import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const h1Ref = useRef(null);
  const typedRef = useRef(null);
  const caretRef = useRef(null);
  const [typed, setTyped] = useState("");
  const [showCaret, setShowCaret] = useState(true);
  const [ptOpacity, setPtOpacity] = useState(0);

  useEffect(() => {
    const text = "O Impostor";
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const timeouts = [];

    if (reduce) {
      setTyped(text);
      setShowCaret(false);
      setPtOpacity(1);
      if (h1Ref.current) h1Ref.current.classList.add("shimmer");
      return () => {};
    }

    let i = 0;
    const advance = () => {
      i += 1;
      setTyped(text.substring(0, i));
      if (i < text.length) {
        timeouts.push(setTimeout(advance, 90 + Math.random() * 70));
      } else {
        timeouts.push(
          setTimeout(() => {
            setPtOpacity(1);
          }, 220)
        );
        timeouts.push(
          setTimeout(() => {
            setShowCaret(false);
            if (h1Ref.current) h1Ref.current.classList.add("shimmer");
          }, 720)
        );
      }
    };
    timeouts.push(setTimeout(advance, 280));

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <section className="hero">
      <div className="meta anim-1">
        <span>Um Jogo Social — Local · Off-line</span>
        <span>Para 3 a 16 jogadores</span>
      </div>
      <h1 id="heroTitle" ref={h1Ref}>
        <span className="typed" ref={typedRef}>
          {typed}
        </span>
        {showCaret && (
          <span className="caret" ref={caretRef}>
            |
          </span>
        )}
        <span className="pt" style={{ opacity: ptOpacity }}>
          .
        </span>
      </h1>
      <p className="lede anim-3">
        Cadastre os jogadores, escolha o modo e <b>passe o celular</b>. Cada um
        descobre, em segredo, a palavra ou a pergunta da rodada. Um deles, porém,
        recebe apenas uma sentença
        <span className="pt">:</span> <em>você é o impostor</em>. Disfarce.
        Deduza. Acuse.
      </p>
    </section>
  );
}
