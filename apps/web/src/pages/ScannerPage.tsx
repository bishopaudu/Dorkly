import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ScanSearch, ExternalLink, Copy, BookmarkPlus, Terminal, ChevronDown, ChevronRight, Globe, Loader } from 'lucide-react'
import { api, type ScanResult, type ScanDork, type ScanCategory } from '@/lib/api'
import EmptyState from '@/components/ui/EmptyState'
import PivotLinks from '@/components/dork/PivotLinks'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'
import { useNavigate } from 'react-router-dom'

const PLATFORM_LINKS: Record<string, (d: string) => string> = {
  shodan:    d => `https://www.shodan.io/search?query=hostname%3A${d}`,
  github:    d => `https://github.com/search?q=${encodeURIComponent(`"${d}"`)}&type=code`,
  pastebin:  d => `https://www.google.com/search?q=site:pastebin.com+"${encodeURIComponent(d)}"`,
}

export default function ScannerPage() {
  const [domain, setDomain]     = useState('')
  const [result, setResult]     = useState<ScanResult | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const { toasts, toast, dismiss } = useToast()
  const navigate  = useNavigate()
  const qc        = useQueryClient()

  const { mutate: runScan, isPending } = useMutation({
    mutationFn: (d: string) => api.scanner.scan(d),
    onSuccess: (data) => {
      setResult(data)
      const init: Record<string, boolean> = {}
      data.categories.forEach(c => { init[c.id] = true })
      setExpanded(init)
    },
    onError: () => toast('Scan failed — check the domain and try again', 'error'),
  })

  const { mutate: saveDork } = useMutation({
    mutationFn: (d: ScanDork & { category: string }) =>
      api.dorks.save({ title: d.title, query: d.query, category: d.category }),
    onSuccess: () => {
      toast('Dork saved to library')
      qc.invalidateQueries({ queryKey: ['dorks'] })
    },
  })

  const handleSubmit = () => {
    const clean = domain.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    if (!clean) return
    setResult(null)
    runScan(clean)
  }

  const handleCopy = (query: string) => {
    navigator.clipboard.writeText(query)
    toast('Query copied')
  }

  const handleGoogle = (query: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank', 'noopener')
  }

  const handleLoad = (query: string) => {
    sessionStorage.setItem('dorkly_load_query', query)
    navigate('/')
  }

  const toggleCategory = (id: string) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-up">

      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#00e84d', letterSpacing: '0.05em' }}>
          DOMAIN SCANNER
        </h2>
        <p style={{ fontSize: '0.7rem', color: 'rgba(0,232,77,0.62)', marginTop: '3px' }}>
          enter a domain // auto-generate full recon dork suite across 8 categories
        </p>
      </div>

      {/* Input */}
      <div className="card" style={{ padding: '20px' }}>
        <p className="section-label" style={{ marginBottom: '12px' }}>// TARGET DOMAIN</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Globe size={14} style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-primary)',
              pointerEvents: 'none',
            }} />
            <input
              className="input"
              style={{ paddingLeft: '36px' }}
              placeholder="example.com"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <button
            className="btn btn-primary btn-md"
            style={{ minWidth: '120px', justifyContent: 'center' }}
            onClick={handleSubmit}
            disabled={!domain.trim() || isPending}
          >
            {isPending
              ? <><Loader size={13} className="animate-spin" /> scanning...</>
              : <><ScanSearch size={13} /> scan</>}
          </button>
        </div>
        <p style={{ fontSize: '0.65rem', color: 'rgba(0,232,77,0.48)', marginTop: '8px' }}>
          accepts bare domains, URLs, or subdomains — strips protocol automatically
        </p>
      </div>

      {/* Quick platform links */}
      {result && (
        <div className="card" style={{ padding: '16px' }}>
          <p className="section-label" style={{ marginBottom: '10px' }}>// QUICK PLATFORM LINKS</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {Object.entries(PLATFORM_LINKS).map(([name, urlFn]) => (
              
               <a key={name}
                href={urlFn(result.domain)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  borderRadius: '2px',
                  border: '1px solid rgba(0,229,255,0.25)',
                  background: 'rgba(0,229,255,0.05)',
                  color: '#00e5ff',
                  textDecoration: 'none',
                  transition: 'all 0.1s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(0,229,255,0.5)'
                  e.currentTarget.style.boxShadow = '0 0 8px rgba(0,229,255,0.2)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(0,229,255,0.25)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <ExternalLink size={11} /> {name}
              </a>
            ))}
          </div>
        </div>
      )}

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
            { label: 'TARGET',     value: result.domain },
            { label: 'CATEGORIES', value: result.categories.length },
            { label: 'DORKS',      value: result.total },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontSize: '0.55rem', color: 'var(--text-primary)', letterSpacing: '0.12em', marginBottom: '2px' }}>{label}</p>
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
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-primary)', marginLeft: '10px' }}>
                    // {cat.description}
                  </span>
                </div>
                <span style={{ fontSize: '0.6rem', color: 'rgba(0,232,77,0.48)', fontFamily: 'IBM Plex Mono, monospace' }}>
                  {cat.dorks.length} dorks
                </span>
              </button>

              {expanded[cat.id] && (
                <div style={{
                  borderTop: '1px solid rgba(0,232,77,0.08)',
                  animation: 'fadeIn 0.15s ease-out',
                }}>
                  {cat.dorks.map((dork, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 16px',
                        borderBottom: i < cat.dorks.length - 1 ? '1px solid rgba(0,232,77,0.05)' : 'none',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,232,77,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '3px' }}>
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', flexShrink: 0 }}>
                        <PivotLinks query={dork.query} compact />
                        <button className="btn btn-ghost btn-sm" title="Load into builder" onClick={() => handleLoad(dork.query)}>
                          <Terminal size={12} />
                        </button>
                        <button className="btn btn-ghost btn-sm" title="Copy query" onClick={() => handleCopy(dork.query)}>
                          <Copy size={12} />
                        </button>
                        <button className="btn btn-ghost btn-sm" title="Search Google" onClick={() => handleGoogle(dork.query)}>
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
          icon={ScanSearch}
          title="NO SCAN RESULTS"
          description="Enter a domain above and hit scan to generate a full recon dork suite."
        />
      )}

      <div style={{ position: 'fixed', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 50 }}>
        {toasts.map((t: { id: any; message: any; type: any }) => <Toast key={t.id} message={t.message} type={t.type} onDismiss={() => dismiss(t.id)} />)}
      </div>
    </div>
  )
}
