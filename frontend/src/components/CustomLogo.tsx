/** Placeholder logo: swap the SVG for your own mark any time. */
export default function CustomLogo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="Ganesh Vaddepalli logo">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <path d="M20 2 36 11v18L20 38 4 29V11z" fill="none" stroke="url(#logo-g)" strokeWidth="2" />
      <path d="M26 14h-6a6 6 0 0 0 0 12h6v-5h-4" fill="none" stroke="url(#logo-g)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
