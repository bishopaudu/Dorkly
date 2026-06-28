import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Crosshair, LayoutTemplate, Bookmark, ScanSearch, Code2, Database, Shield, HelpCircle, X } from 'lucide-react'

interface Command {
  id: string
  label: string
  description: string
  icon: React.ElementType
  action: () => void
  keys?: string
}

interface Props {
  open: boolean
  onClose: () => void
}

export default function CommandPalette({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const go = (path: string) => { navigate(path); onClose(); setQuery('') }

  const COMMANDS: Command[] = [
    { id: 'builder',   label: 'Go to Builder',   description: 'Build a dork query visually',           icon: Crosshair,      action: () => go('/'),          keys: '01' },
    { id: 'templates', label: 'Go to Templates',  description: 'Browse curated dork library',           icon: LayoutTemplate, action: () => go('/templates'), keys: '02' },
    { id: 'saved',     label: 'Go to Saved',      description: 'Your local dork library',               icon: Bookmark,       action: () => go('/saved'),     keys: '03' },
    { id: 'scanner',   label: 'Go to Scanner',    description: 'Domain recon dork suite',               icon: ScanSearch,     action: () => go('/scanner'),   keys: '04' },
    { id: 'github',    label: 'Go to GitHub',     description: 'GitHub code and secret recon',          icon: Code2,          action: () => go('/github'),    keys: '05' },
    { id: 'ghdb',      label: 'Go to GHDB',       description: 'Google Hacking Database browser',       icon: Database,       action: () => go('/ghdb'),      keys: '06' },
    { id: 'crtsh',     label: 'Go to crt.sh',     description: 'Certificate transparency recon',        icon: Shield,         action: () => go('/crtsh'),     keys: '07' },
    { id: 'help',      label: 'Go to Help',       description: 'Docs, operators, crash course',         icon: HelpCircle,     action: () => go('/help'),      keys: '08' },
  ]

  const filtered = query.trim()
    ? COMMANDS.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase())
      )
    : COMMANDS

  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => { setSelected(0) }, [query])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && filtered[selected]) { filtered[selected].action() }
  }

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'center', paddingTop: '18vh',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '540px', margin: '0 16px',
          background: '#0a140a',
          border: '1px solid rgba(0,232,77,0.5)',
          borderRadius: '4px',
          boxShadow: '0 0 60px rgba(0,232,77,0.2), 0 0 0 1px rgba(0,232,77,0.1)',
          animation: 'fadeUp 0.15s ease-out',
          overflow: 'hidden',
        }}
      >
        {/* Search input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '14px 16px',
          borderBottom: '1px solid rgba(0,232,77,0.15)',
        }}>
          <Search size={16} style={{ color: '#4db86a', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="type a command or page name..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.85rem',
              color: '#c8ffd8',
            }}
          />
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: '1px solid rgba(0,232,77,0.2)',
              borderRadius: '2px', cursor: 'pointer', padding: '3px 6px',
              color: '#4db86a', display: 'flex', alignItems: 'center',
              fontSize: '0.6rem', fontFamily: 'IBM Plex Mono, monospace',
              gap: '3px',
            }}
          >
            <X size={11} /> esc
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{
              padding: '32px', textAlign: 'center',
              fontSize: '0.75rem', color: '#4db86a',
              fontFamily: 'IBM Plex Mono, monospace',
            }}>
              no commands match "{query}"
            </div>
          ) : (
            filtered.map((cmd, i) => {
              const Icon = cmd.icon
              const isSelected = i === selected
              return (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelected(i)}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '11px 16px',
                    background: isSelected ? 'rgba(0,232,77,0.1)' : 'transparent',
                    border: 'none',
                    borderLeft: isSelected ? '2px solid #00e84d' : '2px solid transparent',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'background 0.08s',
                  }}
                >
                  <div style={{
                    width: '32px', height: '32px', flexShrink: 0,
                    border: `1px solid ${isSelected ? 'rgba(0,232,77,0.5)' : 'rgba(0,232,77,0.2)'}`,
                    background: isSelected ? 'rgba(0,232,77,0.12)' : 'rgba(0,232,77,0.04)',
                    borderRadius: '2px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={14} style={{ color: isSelected ? '#00e84d' : '#4db86a' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '0.8rem', fontWeight: 600, margin: 0,
                      color: isSelected ? '#c8ffd8' : '#7dde9a',
                      fontFamily: 'IBM Plex Mono, monospace',
                    }}>
                      {cmd.label}
                    </p>
                    <p style={{
                      fontSize: '0.68rem', margin: '2px 0 0',
                      color: isSelected ? '#4db86a' : '#2d7a45',
                      fontFamily: 'IBM Plex Mono, monospace',
                    }}>
                      {cmd.description}
                    </p>
                  </div>
                  {cmd.keys && (
                    <span style={{
                      fontSize: '0.6rem', color: '#2d7a45',
                      fontFamily: 'IBM Plex Mono, monospace',
                      letterSpacing: '0.06em',
                    }}>
                      {cmd.keys}
                    </span>
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', gap: '16px', padding: '9px 16px',
          borderTop: '1px solid rgba(0,232,77,0.12)',
          background: 'rgba(0,232,77,0.03)',
          flexWrap: 'wrap',
        }}>
          {[['↑↓', 'navigate'], ['↵', 'select'], ['esc', 'close'], ['/', 'focus search']].map(([key, label]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <kbd style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '0.62rem',
                color: '#7dde9a',
                border: '1px solid rgba(0,232,77,0.25)',
                borderRadius: '2px',
                padding: '1px 6px',
                background: 'rgba(0,232,77,0.06)',
              }}>
                {key}
              </kbd>
              <span style={{ fontSize: '0.62rem', color: '#4db86a', fontFamily: 'IBM Plex Mono, monospace' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
