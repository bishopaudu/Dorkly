interface LogoProps {
  className?: string
  size?: number
}

export default function Logo({ className, size = 16 }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      className={className}
    >
      <defs>
        <filter id="logo-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="logo-grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00ff66" />
          <stop offset="100%" stop-color="#00e84d" />
        </linearGradient>
      </defs>

      {/* Outer target ring */}
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="rgba(0, 232, 77, 0.18)"
        strokeWidth="3"
        strokeDasharray="6 8"
      />

      <g filter="url(#logo-neon-glow)">
        {/* Terminal Prompt symbol > */}
        <path
          d="M 30 35 L 50 50 L 30 65"
          stroke="url(#logo-grad-green)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Flashing terminal block / Cursor D-bracket */}
        <path
          d="M 60 32 H 70 C 78 32 78 68 70 68 H 60"
          stroke="url(#logo-grad-green)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Cyberpunk Crosshair ticks */}
        <line x1="50" y1="2" x2="50" y2="10" stroke="#00ff66" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="90" x2="50" y2="98" stroke="#00ff66" strokeWidth="3" strokeLinecap="round" />
        <line x1="2" y1="50" x2="10" y2="50" stroke="#00ff66" strokeWidth="3" strokeLinecap="round" />
        <line x1="90" y1="50" x2="98" y2="50" stroke="#00ff66" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  )
}
