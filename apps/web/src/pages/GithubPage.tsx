import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Code2, ExternalLink, Copy, BookmarkPlus, Terminal, ChevronDown, ChevronRight, Loader, KeyRound } from 'lucide-react'
import { api, type GithubResult, type ScanDork, type ScanCategory } from '@/lib/api'
import EmptyState from '@/components/ui/EmptyState'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'

export default function GithubPage() {
  const [query, setQuery]       = useState('')
  const [result, setResult]     = useState<GithubResult | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const { toasts, toast, dismiss } = useToast()
  const navigate = useNavigate()
  const qc       = useQueryClient()

  const { mutate: runScan, isPending } = useMutation({
    mutationFn: (q: string) => api.github.scan(q),
    onSuccess: (data) => {
      setResult(data)
      const init: Record<string, boolean> = {}
      data.categories.forEach(c => { init[c.id] = true })
      setExpanded(init)
    },
    onError: () => toast('Scan failed — try a different query', 'error'),
  })

  const { mutate: saveDork } = useMutation({
    mutationFn: (d: ScanDork & { category: string }) =>
      api.dorks.save({ title: d.title, query: d.query, category: 'security' }),
    onSuccess: () => {
      toast('Dork saved to library')
      qc.invalidateQueries({ queryKey: ['dorks'] })
    },
  })

  const handleSubmit = () => {
    const clean = query.trim()
    if (!clean) return
    setResult(null)
    runScan(clean)
  }

  const handleCopy = (q: string) => {
    navigator.clipboard.writeText(q)
    toast('Query copied')
  }

  const handleGithub = (q: string) => {
    window.open(`https://github.com/search?q=${encodeURIComponent(q)}&type=code`, '_blank', 'noopener')
  }

  const handleLoad = (q: string) => {
    sessionStorage.setItem('dorkly_load_query', q)
    navigate('/')
  }

  const toggleCategory = (id: string) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-up">

      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#00e84d', letterSpacing: '0.05em' }}>
          GITHUB DORKING
        </h2>
        <p style={{ fontSize: '0.7rem', color: 'rgba(0,232,77,0.62)', marginTop: '3px' }}>
          find exposed secrets, configs, and code leaks across public repositories
        </p>
      </div>

      {/* Input */}
      <div className="card" style={{ padding: '20px' }}>
        <p className="section-label" style={{ marginBottom: '12px' }}>// SEARCH TARGET</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <KeyRound size={14} style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: 'rgba(0,232,77,0.72)',
              pointerEvents: 'none',
            }} />
            <input
              className="input"
              style={{ paddingLeft: '36px' }}
              placeholder="company name, domain, or org — e.g. acmecorp"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <button
            className="btn btn-primary btn-md"
            style={{ minWidth: '120px', justifyContent: 'center' }}
            onClick={handleSubmit}
            disabled={!query.trim() || isPending}
          >
            {isPending
              ? <><Loader size={13} className="animate-spin" /> scanning...</>
              : <><Code2 size={13} /> scan</>}
          </button>
        </div>
        <p style={{ fontSize: '0.65rem', color: 'rgba(0,232,77,0.48)', marginTop: '8px' }}>
          works best with a company name, domain, or GitHub org handle
        </p>
      </div>

      {/* Stats bar */}
      {result && (
        <div style={{
          display: 'flex',
          gap: '24px',
          padding: '12px 16px',
          border: '1px solid rgba(0,232,77,0.12)',
          borderRadius: '2px',
          background: 'rgba(0,232,77,0.03)',
          animation: 'fadeIn 0.2s ease-out',
        }}>
          {[
            { label: 'QUERY',      value: result.query },
            { label: 'CATEGORIES', value: result.categories.length },
            { label: 'DORKS',      value: result.total },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontSize: '0.55rem', color: 'rgba(0,232,77,0.72)', letterSpacing: '0.12em', marginBottom: '2px' }}>{label}</p>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#00e84d', fontFamily: 'IBM Plex Mono, monospace' }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {result ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {result.categories.map((cat: ScanCategory) => (
            <div key={cat.id} className="card" style={{ overflow: 'hidden' }}>
              <button
                onClick={() => toggleCategory(cat.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {expanded[cat.id]
                  ? <ChevronDown size={13} style={{ color: '#00e84d', flexShrink: 0 }} />
                  : <ChevronRight size={13} style={{ color: 'rgba(0,232,77,0.62)', flexShrink: 0 }} />}
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#00e84d', letterSpacing: '0.05em' }}>
                    {cat.label.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'rgba(0,232,77,0.72)', marginLeft: '10px' }}>
                    // {cat.description}
                  </span>
                </div>
                <span style={{ fontSize: '0.6rem', color: 'rgba(0,232,77,0.48)', fontFamily: 'IBM Plex Mono, monospace' }}>
                  {cat.dorks.length} dorks
                </span>
              </button>

              {expanded[cat.id] && (
                <div style={{ borderTop: '1px solid rgba(0,232,77,0.08)', animation: 'fadeIn 0.15s ease-out' }}>
                  {cat.dorks.map((dork, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 16px',
                        borderBottom: i < cat.dorks.length - 1 ? '1px solid rgba(0,232,77,0.05)' : 'none',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,232,77,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 500, color: 'rgba(0,232,77,0.85)', marginBottom: '3px' }}>
                          {dork.title}
                        </p>
                        <code style={{
                          fontSize: '0.65rem',
                          color: 'rgba(0,232,77,0.62)',
                          fontFamily: 'IBM Plex Mono, monospace',
                          display: 'block',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {dork.query}
                        </code>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                        <button className="btn btn-ghost btn-sm" title="Load into builder" onClick={() => handleLoad(dork.query)}>
                          <Terminal size={12} />
                        </button>
                        <button className="btn btn-ghost btn-sm" title="Copy query" onClick={() => handleCopy(dork.query)}>
                          <Copy size={12} />
                        </button>
                        <button className="btn btn-ghost btn-sm" title="Search on GitHub" onClick={() => handleGithub(dork.query)}>
                          <ExternalLink size={12} />
                        </button>
                        <button className="btn btn-ghost btn-sm" title="Save to library"
                          onClick={() => saveDork({ ...dork, category: cat.id })}>
                          <BookmarkPlus size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : !isPending && (
        <EmptyState
          icon={Code2}
          title="NO SCAN RESULTS"
          description="Enter a company name, domain, or org handle above to find exposed code and secrets on GitHub."
        />
      )}

      <div style={{ position: 'fixed', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 50 }}>
        {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onDismiss={() => dismiss(t.id)} />)}
      </div>
    </div>
  )
}
