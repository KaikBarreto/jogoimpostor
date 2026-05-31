// iOS-style stepper: − | +
export default function Stepper({ value, min = 1, max = 99, onChange }) {
  const dec = () => {
    if (value > min) onChange(value - 1);
  };
  const inc = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="ios-stepper" role="group">
      <button type="button" aria-label="Menos" onClick={dec} disabled={value <= min}>
        −
      </button>
      <span className="ios-stepper-div" />
      <button type="button" aria-label="Mais" onClick={inc} disabled={value >= max}>
        +
      </button>
    </div>
  );
}
