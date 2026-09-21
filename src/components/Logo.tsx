export default function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="jb-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3d6b43" />
          <stop offset="1" stopColor="#22391d" />
        </linearGradient>
        <linearGradient id="jb-leaf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fc98a" />
          <stop offset="1" stopColor="#3d6b43" />
        </linearGradient>
      </defs>

      <rect width="64" height="64" rx="18" fill="url(#jb-bg)" />

      {/* Leaf silhouette — its point becomes a roofline */}
      <path
        d="M32 13
           C 43 23, 49 33, 49 42
           C 49 51, 41.5 57, 32 57
           C 22.5 57, 15 51, 15 42
           C 15 33, 21 23, 32 13
           Z"
        fill="url(#jb-leaf)"
      />

      {/* Roof pitch nested inside the leaf */}
      <path
        d="M24 33 L32 26 L40 33"
        stroke="#faf7f2"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Leaf vein / home threshold */}
      <path
        d="M32 33 C 30.5 40, 30.5 46, 32 51"
        stroke="#faf7f2"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
    </svg>
  );
}
