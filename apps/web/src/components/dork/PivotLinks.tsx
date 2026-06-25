import { ExternalLink } from 'lucide-react'

interface Props {
  query: string
  compact?: boolean
}

const PIVOTS = [
  {
    label: 'Pastebin',
    color: '#02a8a8',
    url: (q: string) => `https://www.google.com/search?q=site:pastebin.com+${encodeURIComponent(`"${q}"`)}`,
  },
  {
    label: 'GitHub',
    color: '#00e84d',
    url: (q: string) => `https://github.com/search?q=${encodeURIComponent(q)}&type=code`,
  },
  {
    label: 'Wayback',
    color: '#ffb300',
    url: (q: string) => `https://web.archive.org/web/*/${encodeURIComponent(q)}`,
  },
  {
    label: 'Shodan',
    color: '#ff4444',
    url: (q: string) => `https://www.shodan.io/search?query=${encodeURIComponent(q)}`,
  },
]

export default function PivotLinks({ query, compact = false }: Props) {
  if (!query) return null

  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
      {!compact && (
        <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginRight: '2px' }}>
          PIVOT →
        </span>
      )}
      {PIVOTS.map(pivot => (
        
         <a key={pivot.label}
          href={pivot.url(query)}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: compact ? '2px 7px' : '4px 10px',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.6rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            borderRadius: '2px',
            border: `1px solid ${pivot.color}30`,
            background: `${pivot.color}08`,
            color: pivot.color,
            textDecoration: 'none',
            transition: 'all 0.1s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = `${pivot.color}60`
            e.currentTarget.style.background = `${pivot.color}15`
            e.currentTarget.style.boxShadow = `0 0 8px ${pivot.color}25`
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = `${pivot.color}30`
            e.currentTarget.style.background = `${pivot.color}08`
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <ExternalLink size={9} />
          {pivot.label}
        </a>
      ))}
    </div>
  )
}
