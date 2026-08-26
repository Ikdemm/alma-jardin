export function ColibriMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 28c6-10 14-16 24-16 8 0 14 4 18 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 24c8-2 16-2 24 0"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <ellipse cx="34" cy="22" rx="5" ry="3.5" fill="currentColor" opacity="0.9" />
      <path
        d="M39 21l14-6-4 8 4 8-14-6"
        fill="currentColor"
        opacity="0.75"
      />
      <path
        d="M30 19l-4-8 2 6-6 2 8 0"
        fill="currentColor"
        opacity="0.55"
      />
      <circle cx="37" cy="21" r="1" fill="#f7f4ed" />
      <path
        d="M39 24c2 1 4 3 5 6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
