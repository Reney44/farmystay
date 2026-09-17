export default function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#2f5233" />
      <path d="M15 32 L32 16 L49 32 L49 34 L15 34 Z" fill="#c97b2e" />
      <rect x="19" y="34" width="26" height="16" rx="2" fill="#faf7f2" />
      <rect x="27.5" y="41" width="9" height="9" rx="1.5" fill="#2f5233" />
      <path
        d="M45 18c-3 .5-5 3-4.5 6.5 2.8 1 5.8-.6 6.8-3.4.8-2.2-.3-3.5-2.3-3.1z"
        fill="#8a5a3b"
      />
    </svg>
  );
}
