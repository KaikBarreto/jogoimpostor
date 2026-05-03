export default function FrontCard({ playerName, counter, onReveal }) {
  return (
    <div className="reveal-card front">
      <span className="who">Passando para</span>
      <span className="num">{counter}</span>
      <span className="name">
        {playerName}
        <span className="pt">.</span>
      </span>
      <div className="warning-strip">
        <span className="icon">⚠</span>
        Não mostre a ninguém
        <span className="icon">⚠</span>
      </div>
      <button type="button" className="tap" onClick={onReveal}>
        Tocar para revelar
      </button>
    </div>
  );
}
