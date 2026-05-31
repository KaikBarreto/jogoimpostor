// iOS-style toggle switch.
export default function Switch({ on, onChange, label }) {
  return (
    <button
      type="button"
      className="ios-switch"
      data-on={on ? "true" : "false"}
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
    >
      <span className="ios-switch-knob" />
    </button>
  );
}
