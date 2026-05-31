// iOS-style navigation bar: back chevron (left), title (center), action (right).
function ChevronLeft() {
  return (
    <svg viewBox="0 0 12 21" aria-hidden="true">
      <path
        d="M10.5 1.5 1.8 10.5l8.7 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NavBar({ title, back, trailing }) {
  return (
    <div className="ios-navbar">
      <div className="ios-navbar-inner">
        {back ? (
          <button type="button" className="ios-navbar-back" onClick={back.onClick}>
            <ChevronLeft />
            {back.label}
          </button>
        ) : (
          <span />
        )}
        <div className="ios-navbar-title">{title}</div>
        {trailing ? (
          <button
            type="button"
            className={"ios-navbar-trailing" + (trailing.strong ? " strong" : "")}
            onClick={trailing.onClick}
            disabled={trailing.disabled}
          >
            {trailing.label}
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
