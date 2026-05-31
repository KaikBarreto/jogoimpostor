// iOS disclosure chevron (right-pointing), for navigable rows.
export default function Chevron() {
  return (
    <span className="ios-row-chevron" aria-hidden="true">
      <svg viewBox="0 0 8 13">
        <path
          d="M1.5 1.5 6.5 6.5l-5 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
