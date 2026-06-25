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
    { id: 'github',    label: 'Go to GitHub',     description: 'GitHub code & secret recon',            icon: Code2,          action: () => go('/github'),    keys: '05' },
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
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '20vh' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '520px', margin: '0 16px', background: '#000', border: '1px solid var(--border-active)', borderRadius: '4px', boxShadow: '0 0 40px rgba(0,232,77,0.25)', animation: 'fadeUp 0.15s ease-out', overflow: 'hidden' }}
      >
        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderBottom: '1px solid var(--border-default)' }}>
          <Search size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="type a command or page name..."
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.82rem', color: 'var(--text-primary)' }}
          />
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '3px', flexShrink: 0 }}>
            <X size={13} />
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
              no commands match "{query}"
            </div>
          ) : (
            filtered.map((cmd, i) => {
              const Icon = cmd.icon
              return (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 14px', background: i === selected ? 'rgba(0,232,77,0.08)' : 'transparent',
                    border: 'none', borderLeft: i === selected ? '2px solid #00e84d' : '2px solid transparent',
                    cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s',
                  }}
                  onMouseEnter={() => setSelected(i)}
                >
                  <div style={{ width: '28px', height: '28px', border: `1px solid ${i === selected ? 'var(--border-active)' : 'var(--border-default)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: '2px' }}>
                    <Icon size={13} style={{ color: i === selected ? '#00e84d' : 'var(--text-tertiary)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: i === selected ? '#00e84d' : 'var(--text-secondary)', marginBottom: '1px' }}>{cmd.label}</p>
                    <p style={{ fontSize: '0.62rem', color: 'var(--text-tertiary)' }}>{cmd.description}</p>
                  </div>
                  {cmd.keys && (
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-disabled)', letterSpacing: '0.06em' }}>
                      {cmd.keys}
                    </span>
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: '16px', padding: '8px 14px', borderTop: '1px solid var(--border-default)', background: 'rgba(0,232,77,0.02)' }}>
          {[['↑↓', 'navigate'], ['↵', 'select'], ['esc', 'close'], ['/', 'focus search']].map(([key, label]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <kbd style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', color: 'var(--text-tertiary)', border: '1px solid var(--border-default)', borderRadius: '2px', padding: '1px 5px', background: 'rgba(0,232,77,0.04)' }}>{key}</kbd>
              <span style={{ fontSize: '0.58rem', color: 'var(--text-disabled)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
