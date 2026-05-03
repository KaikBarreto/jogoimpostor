export default function Stepper({ value, min = 1, max = 99, onChange }) {
  const dec = () => {
    if (value > min) onChange(value - 1);
  };
  const inc = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="stepper">
      <button
        type="button"
        data-d="-1"
        aria-label="Menos"
        onClick={dec}
        disabled={value <= min}
      >
        −
      </button>
      <span className="val">{value}</span>
      <button
        type="button"
        data-d="1"
        aria-label="Mais"
        onClick={inc}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}
