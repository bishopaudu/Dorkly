import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bookmark, Trash2, ExternalLink, Terminal, Copy, Search, Trash } from 'lucide-react'
import { useSavedDorks } from '@/hooks/useSavedDorks'
import { useToast } from '@/hooks/useToast'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import Toast from '@/components/ui/Toast'
import ExportMenu from '@/components/ui/ExportMenu'
import PivotLinks from '@/components/dork/PivotLinks'
import type { LocalDork } from '@/hooks/useSavedDorks'

export default function SavedPage() {
  const { dorks, remove, clear } = useSavedDorks()
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState<LocalDork | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const { toasts, toast, dismiss } = useToast()
  const navigate = useNavigate()

  const filtered = dorks.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.query.toLowerCase().includes(search.toLowerCase())
  )

  const handleLoad = (d: LocalDork) => {
    sessionStorage.setItem('dorkly_load_query', d.query)
    navigate('/')
  }

  const handleCopy = (query: string) => {
    navigator.clipboard.writeText(query)
    toast('Query copied to clipboard')
  }

  const handleGoogle = (query: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank', 'noopener')
  }

  const handleDelete = (id: string) => {
    remove(id)
    if (selected?.id === id) setSelected(null)
    toast('Dork deleted')
  }

  const handleClear = () => {
    clear()
    setSelected(null)
    setConfirmClear(false)
    toast('Library cleared')
  }

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-up">

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#00e84d', letterSpacing: '0.05em' }}>
            SAVED DORKS
          </h2>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '3px' }}>
            {dorks.length} saved // stored locally in your browser — never sent to our servers
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {dorks.length > 0 && (
            <>
              <ExportMenu
                items={dorks.map(d => ({ title: d.title, query: d.query, description: d.description, category: d.category }))}
                onExported={() => toast('Export downloaded')}
                onError={msg => toast(msg, 'error')}
              />
              {confirmClear ? (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-danger btn-md" onClick={handleClear}>confirm clear</button>
                  <button className="btn btn-secondary btn-md" onClick={() => setConfirmClear(false)}>cancel</button>
                </div>
              ) : (
                <button className="btn btn-danger btn-md" onClick={() => setConfirmClear(true)}>
                  <Trash size={13} /> clear all
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Privacy notice */}
      <div style={{
        padding: '10px 14px',
        border: '1px solid rgba(0,232,77,0.12)',
        borderRadius: '2px',
        background: 'rgba(0,232,77,0.03)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
          <span style={{ color: '#00e84d', fontWeight: 600 }}>// PRIVACY</span>
          {' '}Your saved dorks live entirely in this browser's localStorage. Nothing is sent to our servers.
          Clearing your browser data will remove them — use Export to keep a backup.
        </span>
      </div>

      <div style={{ position: 'relative' }}>
        <Search size={14} style={{
          position: 'absolute', left: '12px', top: '50%',
          transform: 'translateY(-50%)', color: 'var(--text-tertiary)',
          pointerEvents: 'none',
        }} />
        <input
          className="input"
          style={{ paddingLeft: '36px' }}
          placeholder="search saved dorks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {dorks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="NO SAVED DORKS"
          description="Save dorks from the builder or templates page to build your personal library. Everything stays in your browser."
          action={
            <button className="btn btn-secondary btn-md" onClick={() => navigate('/templates')}>
              <Terminal size={13} /> browse templates
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="NO RESULTS" description={`No saved dorks match "${search}"`} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: '12px', alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {filtered.map(d => (
              <div
                key={d.id}
                onClick={() => setSelected(selected?.id === d.id ? null : d)}
                className="card card-hover"
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderColor: selected?.id === d.id ? 'var(--border-active)' : undefined,
                  background: selected?.id === d.id ? 'rgba(0,232,77,0.06)' : undefined,
                  boxShadow: selected?.id === d.id ? '0 0 16px rgba(0,232,77,0.15)' : undefined,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Bookmark size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {d.title}
                    </span>
                    <Badge category={d.category} label={d.category} />
                  </div>
                  <code style={{
                    fontSize: '0.65rem', color: 'var(--text-tertiary)',
                    fontFamily: 'IBM Plex Mono, monospace',
                    whiteSpace: 'nowrap', overflow: 'hidden',
                    textOverflow: 'ellipsis', display: 'block',
                  }}>
                    {d.query}
                  </code>
                </div>
                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}
                  onClick={e => e.stopPropagation()}>
                  <button className="btn btn-ghost btn-sm" title="Copy" onClick={() => handleCopy(d.query)}><Copy size={12} /></button>
                  <button className="btn btn-ghost btn-sm" title="Search Google" onClick={() => handleGoogle(d.query)}><ExternalLink size={12} /></button>
                  <button className="btn btn-danger btn-sm" title="Delete" onClick={() => handleDelete(d.id)}><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>

          {selected && (
            <div className="card" style={{ padding: '20px', position: 'sticky', top: 0, animation: 'fadeIn 0.15s ease-out' }}>
              <p className="section-label" style={{ marginBottom: '12px' }}>// DETAILS</p>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>{selected.title}</p>
              {selected.description && (
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>{selected.description}</p>
              )}
              <p className="section-label" style={{ marginBottom: '8px' }}>// QUERY</p>
              <div style={{
                background: '#000', border: '1px solid var(--border-default)',
                borderRadius: '2px', padding: '10px 12px', marginBottom: '16px',
                fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem',
                color: 'var(--text-primary)', wordBreak: 'break-all', lineHeight: 1.6,
              }}>
                <span style={{ color: 'var(--text-tertiary)' }}>$ </span>{selected.query}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <Badge category={selected.category} label={selected.category} />
                {selected.tags.map(tag => <Badge key={tag} label={tag} variant="gray" />)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button className="btn btn-primary btn-md" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleLoad(selected)}>
                  <Terminal size={13} /> load into builder
                </button>
                <button className="btn btn-secondary btn-md" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleGoogle(selected.query)}>
                  <ExternalLink size={13} /> search google
                </button>
                <button className="btn btn-secondary btn-md" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleCopy(selected.query)}>
                  <Copy size={13} /> copy query
                </button>
                <button className="btn btn-danger btn-md" style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }} onClick={() => handleDelete(selected.id)}>
                  <Trash2 size={13} /> delete
                </button>
              </div>
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-default)', marginBottom: '8px' }}>
                <p className="section-label" style={{ marginBottom: '8px' }}>// PIVOT TO</p>
                <PivotLinks query={selected.query} compact />
              </div>
              <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-default)' }}>
                <p style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)' }}>SAVED {fmt(selected.createdAt)}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ position: 'fixed', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 50 }}>
        {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onDismiss={() => dismiss(t.id)} />)}
      </div>
    </div>
  )
}
