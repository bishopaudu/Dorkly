import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Database, RefreshCw, Search, Terminal, ExternalLink, Copy, BookmarkPlus, Loader, Clock } from 'lucide-react'
import ExportMenu from '@/components/ui/ExportMenu'
import { api, type GhdbEntry } from '@/lib/api'
import EmptyState from '@/components/ui/EmptyState'
import Skeleton from '@/components/ui/Skeleton'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'

export default function GhdbPage() {
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('all')
  const { toasts, toast, dismiss } = useToast()
  const navigate = useNavigate()
  const qc       = useQueryClient()

  const { data: status } = useQuery({
    queryKey: ['ghdb-status'],
    queryFn: api.ghdb.status,
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['ghdb-categories'],
    queryFn: api.ghdb.categories,
    enabled: !!status,
  })

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['ghdb-entries', search, category],
    queryFn: () => api.ghdb.entries({ search, category, limit: 100 }),
    enabled: !!status,
  })

  const { mutate: runSync, isPending: syncing } = useMutation({
    mutationFn: api.ghdb.sync,
    onSuccess: (data) => {
      toast(`Synced ${data.synced.toLocaleString()} dorks from GHDB`)
      qc.invalidateQueries({ queryKey: ['ghdb-status'] })
      qc.invalidateQueries({ queryKey: ['ghdb-entries'] })
      qc.invalidateQueries({ queryKey: ['ghdb-categories'] })
    },
    onError: (e: any) => toast(typeof e === 'string' ? e : 'Sync failed — try again', 'error'),
  })

  const { mutate: saveDork } = useMutation({
    mutationFn: (entry: GhdbEntry) =>
      api.dorks.save({
        title: entry.query.length > 60 ? entry.query.slice(0, 60) + '...' : entry.query,
        query: entry.query,
        category: 'custom',
        tags: [entry.category],
      }),
    onSuccess: () => {
      toast('Dork saved to library')
      qc.invalidateQueries({ queryKey: ['dorks'] })
    },
  })

  const handleCopy = (q: string) => {
    navigator.clipboard.writeText(q)
    toast('Query copied')
  }

  const handleGoogle = (q: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, '_blank', 'noopener')
  }

  const handleLoad = (q: string) => {
    sessionStorage.setItem('dorkly_load_query', q)
    navigate('/')
  }

  const fmtDate = (d: string) => {
    if (!d) return ''
    try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }
    catch { return d }
  }

  const fmtSyncTime = (d?: string) => {
    if (!d) return 'never'
    const diff = Date.now() - new Date(d).getTime()
    const hrs = Math.floor(diff / 3_600_000)
    if (hrs < 1) return 'just now'
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-up">

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#00e84d', letterSpacing: '0.05em' }}>
            GHDB SYNC
          </h2>
          <p style={{ fontSize: '0.7rem', color: 'rgba(0,232,77,0.62)', marginTop: '3px' }}>
            community-maintained Google Hacking Database // {status ? `${status.entryCount.toLocaleString()} dorks loaded` : 'not synced yet'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {entries.length > 0 && (
            <ExportMenu
              items={entries.map(e => ({ title: e.query.slice(0, 60), query: e.query, category: e.category }))}
              onExported={() => toast('Export downloaded')}
              onError={(msg) => toast(msg, 'error')}
            />
          )}
          <button
            className="btn btn-primary btn-md"
            onClick={() => runSync()}
            disabled={syncing}
          >
            {syncing
              ? <><Loader size={13} className="animate-spin" /> syncing...</>
              : <><RefreshCw size={13} /> sync now</>}
          </button>
        </div>
      </div>

      {/* Sync status bar */}
      {status && (
        <div style={{
          display: 'flex',
          gap: '24px',
          padding: '12px 16px',
          border: '1px solid rgba(0,232,77,0.12)',
          borderRadius: '2px',
          background: 'rgba(0,232,77,0.03)',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={13} style={{ color: '#00e84d' }} />
            <span style={{ fontSize: '0.7rem', color: 'rgba(0,232,77,0.78)' }}>
              {status.entryCount.toLocaleString()} entries
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={13} style={{ color: 'rgba(0,232,77,0.62)' }} />
            <span style={{ fontSize: '0.7rem', color: 'rgba(0,232,77,0.78)' }}>
              last synced {fmtSyncTime(status.lastSyncedAt)}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.65rem', color: 'rgba(0,232,77,0.48)' }}>
              source: github.com/readloud/Google-Hacking-Database
            </span>
          </div>
        </div>
      )}

      {!status ? (
        <EmptyState
          icon={Database}
          title="NO DATA SYNCED"
          description="Hit Sync Now to pull the latest community-maintained GHDB dorks into your library."
          action={
            <button className="btn btn-primary btn-md" onClick={() => runSync()} disabled={syncing}>
              {syncing ? <><Loader size={13} className="animate-spin" /> syncing...</> : <><RefreshCw size={13} /> sync now</>}
            </button>
          }
        />
      ) : (
        <>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: 'rgba(0,232,77,0.72)',
              pointerEvents: 'none',
            }} />
            <input
              className="input"
              style={{ paddingLeft: '36px' }}
              placeholder="search GHDB dorks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxHeight: '76px', overflowY: 'auto' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  padding: '4px 10px',
                  borderRadius: '2px',
                  border: category === cat ? '1px solid rgba(0,232,77,0.5)' : '1px solid rgba(0,232,77,0.1)',
                  background: category === cat ? 'rgba(0,232,77,0.12)' : 'transparent',
                  color: category === cat ? '#00e84d' : 'rgba(0,232,77,0.72)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat === 'all' ? 'ALL' : cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Results */}
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
            </div>
          ) : entries.length === 0 ? (
            <EmptyState icon={Search} title="NO RESULTS" description="No GHDB entries match your current filters." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <p style={{ fontSize: '0.6rem', color: 'rgba(0,232,77,0.48)', marginBottom: '4px' }}>
                showing {entries.length} result{entries.length !== 1 ? 's' : ''} — refine search for more precision
              </p>
              {entries.map(entry => (
                <div
                  key={entry.id}
                  className="card card-hover"
                  style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '0.6rem', fontWeight: 600, color: '#00e5ff',
                        border: '1px solid rgba(0,229,255,0.25)', background: 'rgba(0,229,255,0.06)',
                        padding: '1px 6px', borderRadius: '2px', letterSpacing: '0.05em',
                      }}>
                        {entry.category}
                      </span>
                      {entry.dateAdded && (
                        <span style={{ fontSize: '0.6rem', color: 'rgba(0,232,77,0.48)' }}>{fmtDate(entry.dateAdded)}</span>
                      )}
                      {entry.author && (
                        <span style={{ fontSize: '0.6rem', color: 'rgba(0,232,77,0.48)' }}>by {entry.author}</span>
                      )}
                    </div>
                    <code style={{
                      fontSize: '0.7rem',
                      color: 'rgba(0,232,77,0.85)',
                      fontFamily: 'IBM Plex Mono, monospace',
                      display: 'block',
                      wordBreak: 'break-all',
                    }}>
                      {entry.query}
                    </code>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    <button className="btn btn-ghost btn-sm" title="Load into builder" onClick={() => handleLoad(entry.query)}>
                      <Terminal size={12} />
                    </button>
                    <button className="btn btn-ghost btn-sm" title="Copy query" onClick={() => handleCopy(entry.query)}>
                      <Copy size={12} />
                    </button>
                    <button className="btn btn-ghost btn-sm" title="Search Google" onClick={() => handleGoogle(entry.query)}>
                      <ExternalLink size={12} />
                    </button>
                    <button className="btn btn-ghost btn-sm" title="Save to library" onClick={() => saveDork(entry)}>
                      <BookmarkPlus size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div style={{ position: 'fixed', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 50 }}>
        {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onDismiss={() => dismiss(t.id)} />)}
      </div>
    </div>
  )
}
