export default function SettingsRow({ label, hint, children }) {
  return (
    <div className="setting-row">
      <div className="lblwrap">
        <span className="lbl">{label}</span>
        {hint && <span className="hint">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
