import { useState } from 'react'
import PivotLinks from './PivotLinks'
import { Copy, ExternalLink, Globe, Trash2, ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'

interface Props {
  query: string
  onCopy: () => void
  onGoogle: () => void
  onDuckDuckGo: () => void
  onClear: () => void
}

const ENGINES = [
  { label: 'Google',     url: (q: string) => `https://www.google.com/search?q=${encodeURIComponent(q)}` },
  { label: 'Bing',       url: (q: string) => `https://www.bing.com/search?q=${encodeURIComponent(q)}` },
  { label: 'DuckDuckGo', url: (q: string) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}` },
  { label: 'Yandex',     url: (q: string) => `https://yandex.com/search/?text=${encodeURIComponent(q)}` },
  { label: 'Brave',      url: (q: string) => `https://search.brave.com/search?q=${encodeURIComponent(q)}` },
]

export default function QueryPreview({ query, onCopy, onClear }: Props) {
  const [showEngines, setShowEngines] = useState(false)
  const empty = !query.trim()

  const openInEngine = (engineUrl: (q: string) => string) => {
    if (!query) return
    window.open(engineUrl(query), '_blank', 'noopener')
  }

  const openAll = () => {
    if (!query) return
    ENGINES.forEach(e => window.open(e.url(query), '_blank', 'noopener'))
  }

  return (
    <div className="card" style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <p className="section-label">// query preview</p>
        {!empty && (
          <button onClick={onClear} className="btn btn-danger btn-sm" style={{ fontSize: '0.6rem', gap: '4px' }}>
            <Trash2 size={11} /> clear
          </button>
        )}
      </div>

      <div style={{
        minHeight: '52px',
        borderRadius: '2px',
        padding: '12px 14px',
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '0.78rem',
        wordBreak: 'break-all',
        lineHeight: 1.6,
        marginBottom: '12px',
        transition: 'all 0.2s',
        border: empty ? '1px dashed var(--border-default)' : '1px solid var(--border-active)',
        background: empty ? 'transparent' : 'rgba(0,232,77,0.04)',
        color: empty ? 'var(--text-disabled)' : 'var(--text-primary)',
        boxShadow: empty ? 'none' : '0 0 12px rgba(0,232,77,0.1)',
      }}>
        {empty ? 'your query will appear here...' : <><span style={{ color: 'var(--text-tertiary)' }}>$ </span>{query}</>}
      </div>

      {/* Actions row */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
        <button onClick={onCopy} disabled={empty} className="btn btn-secondary btn-md" style={{ flex: 1, justifyContent: 'center' }}>
          <Copy size={13} /> copy
        </button>
        <button
          onClick={() => openInEngine(ENGINES[0].url)}
          disabled={empty}
          className="btn btn-primary btn-md"
          style={{ flex: 2, justifyContent: 'center' }}
        >
          <ExternalLink size={13} /> search google
        </button>
      </div>

      {/* Pivot links */}
      {!empty && (
        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-default)' }}>
          <PivotLinks query={query} />
        </div>
      )}

      {/* Engine picker */}
      <div>
        <button
          disabled={empty}
          onClick={() => setShowEngines(o => !o)}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', justifyContent: 'center', gap: '6px', fontSize: '0.65rem' }}
        >
          <Globe size={12} /> more search engines
          <ChevronDown size={11} style={{ transform: showEngines ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
        </button>

        {showEngines && (
          <div style={{
            marginTop: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            animation: 'fadeIn 0.15s ease-out',
          }}>
            {ENGINES.slice(1).map(engine => (
              <button
                key={engine.label}
                onClick={() => openInEngine(engine.url)}
                disabled={empty}
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: 'flex-start', width: '100%', fontSize: '0.68rem' }}
              >
                <Globe size={11} style={{ color: 'var(--text-tertiary)' }} />
                {engine.label}
              </button>
            ))}
            <button
              onClick={openAll}
              disabled={empty}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'center', width: '100%', fontSize: '0.65rem', marginTop: '2px', borderColor: 'rgba(0,232,77,0.35)' }}
            >
              <ExternalLink size={11} /> launch in all engines simultaneously
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
