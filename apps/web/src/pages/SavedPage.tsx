import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Bookmark, Trash2, ExternalLink, Terminal, Copy, Search } from 'lucide-react'
import { api } from '@/lib/api'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import Skeleton from '@/components/ui/Skeleton'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'
import type { SavedDork } from '@dorkly/shared'

export default function SavedPage() {
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState<SavedDork | null>(null)
  const { toasts, toast, dismiss } = useToast()
  const navigate  = useNavigate()
  const qc        = useQueryClient()

  const { data: dorks = [], isLoading } = useQuery({
    queryKey: ['dorks'],
    queryFn:  api.dorks.list,
  })

  const { mutate: deleteDork } = useMutation({
    mutationFn: (id: string) => api.dorks.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dorks'] })
      setSelected(null)
      toast('Dork deleted')
    },
    onError: () => toast('Failed to delete', 'error'),
  })

  const filtered = dorks.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.query.toLowerCase().includes(search.toLowerCase())
  )

  const handleLoad = (d: SavedDork) => {
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

  const fmt = (d: string | Date) =>
    new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-up">

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#00e84d', letterSpacing: '0.05em' }}>
            SAVED DORKS
          </h2>
          <p style={{ fontSize: '0.7rem', color: 'rgba(0,232,77,0.4)', marginTop: '3px' }}>
            {dorks.length} saved // personal dork library
          </p>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <Search size={14} style={{
          position: 'absolute', left: '12px', top: '50%',
          transform: 'translateY(-50%)', color: 'rgba(0,232,77,0.35)',
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

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : dorks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="NO SAVED DORKS"
          description="Save dorks from the builder or templates page to build your personal library."
          action={
            <button className="btn btn-secondary btn-md" onClick={() => navigate('/templates')}>
              <Terminal size={13} /> Browse templates
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="NO RESULTS"
          description={`No saved dorks match "${search}"`}
        />
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
                  borderColor: selected?.id === d.id ? 'rgba(0,232,77,0.45)' : undefined,
                  background: selected?.id === d.id ? 'rgba(0,232,77,0.06)' : undefined,
                  boxShadow: selected?.id === d.id ? '0 0 16px rgba(0,232,77,0.15)' : undefined,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Bookmark size={13} style={{ color: 'rgba(0,232,77,0.3)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#00e84d' }}>
                      {d.title}
                    </span>
                    <Badge category={d.category} label={d.category} />
                  </div>
                  <code style={{
                    fontSize: '0.65rem',
                    color: 'rgba(0,232,77,0.4)',
                    fontFamily: 'JetBrains Mono, monospace',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block',
                  }}>
                    {d.query}
                  </code>
                </div>
                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}
                     onClick={e => e.stopPropagation()}>
                  <button
                    className="btn btn-ghost btn-sm"
                    title="Copy query"
                    onClick={() => handleCopy(d.query)}
                  >
                    <Copy size={12} />
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    title="Search Google"
                    onClick={() => handleGoogle(d.query)}
                  >
                    <ExternalLink size={12} />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    title="Delete"
                    onClick={() => deleteDork(d.id)}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selected && (
            <div className="card" style={{ padding: '20px', position: 'sticky', top: 0, animation: 'fadeIn 0.15s ease-out' }}>
              <p className="section-label" style={{ marginBottom: '12px' }}>// DETAILS</p>

              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#00e84d', marginBottom: '6px' }}>
                {selected.title}
              </p>

              {selected.description && (
                <p style={{ fontSize: '0.7rem', color: 'rgba(0,232,77,0.5)', lineHeight: 1.6, marginBottom: '12px' }}>
                  {selected.description}
                </p>
              )}

              <p className="section-label" style={{ marginBottom: '8px' }}>// QUERY</p>
              <div style={{
                background: '#000',
                border: '1px solid rgba(0,232,77,0.2)',
                borderRadius: '2px',
                padding: '10px 12px',
                marginBottom: '16px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.7rem',
                color: '#00e84d',
                wordBreak: 'break-all',
                lineHeight: 1.6,
              }}>
                <span style={{ color: 'rgba(0,232,77,0.35)' }}>$ </span>{selected.query}
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <Badge category={selected.category} label={selected.category} />
                {(selected.tags as string[]).map((tag: string) => (
                  <Badge key={tag} label={tag} variant="gray" />
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button className="btn btn-primary btn-md" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => handleLoad(selected)}>
                  <Terminal size={13} /> Load into builder
                </button>
                <button className="btn btn-secondary btn-md" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => handleGoogle(selected.query)}>
                  <ExternalLink size={13} /> Search Google
                </button>
                <button className="btn btn-secondary btn-md" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => handleCopy(selected.query)}>
                  <Copy size={13} /> Copy query
                </button>
                <button className="btn btn-danger btn-md" style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
                  onClick={() => deleteDork(selected.id)}>
                  <Trash2 size={13} /> Delete dork
                </button>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(0,232,77,0.08)' }}>
                <p style={{ fontSize: '0.6rem', color: 'rgba(0,232,77,0.25)' }}>
                  SAVED {fmt(selected.createdAt)}
                </p>
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
