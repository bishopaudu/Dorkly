import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Shield, Globe, ExternalLink, Copy, Terminal, BookmarkPlus, ChevronDown, ChevronRight, Loader } from 'lucide-react'
import { api, type CrtResult, type CrtSubdomain } from '@/lib/api'
import { useSavedDorks } from '@/hooks/useSavedDorks'
import EmptyState from '@/components/ui/EmptyState'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'
import PivotLinks from '@/components/dork/PivotLinks'

export default function CrtshPage() {
  const [domain, setDomain]     = useState('')
  const [result, setResult]     = useState<CrtResult | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [view, setView]         = useState<'dorks' | 'list'>('dorks')
  const { toasts, toast, dismiss } = useToast()
  const { save: saveDork } = useSavedDorks()
  const navigate = useNavigate()

  const { mutate: runLookup, isPending } = useMutation({
    mutationFn: (d: string) => api.crtsh.lookup(d),
    onSuccess: (data) => {
      setResult(data)
      const init: Record<string, boolean> = {}
      data.dorks.slice(0, 5).forEach(d => { init[d.subdomain] = true })
      setExpanded(init)
    },
    onError: (e: any) => toast(typeof e === 'string' ? e : 'Lookup failed — check domain and try again', 'error'),
  })

  const handleSubmit = () => {
    const clean = domain.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    if (!clean) return
    setResult(null)
    runLookup(clean)
  }

  const handleCopy = (q: string) => { navigator.clipboard.writeText(q); toast('Copied') }
  const handleGoogle = (q: string) => window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, '_blank', 'noopener')
  const handleLoad = (q: string) => { sessionStorage.setItem('dorkly_load_query', q); navigate('/') }
  const handleSave = (title: string, q: string) => {
    saveDork({ title, query: q, description: '', category: 'recon', tags: ['crtsh', 'subdomain'] })
    toast('Dork saved to library')
  }

  const toggle = (key: string) => setExpanded(p => ({ ...p, [key]: !p[key] }))

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-up">

      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#00e84d', letterSpacing: '0.05em' }}>
          CRT.SH — CERTIFICATE TRANSPARENCY
        </h2>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '3px' }}>
          find every subdomain that has ever had an ssl certificate issued // powered by crt.sh
        </p>
      </div>

      <div className="card" style={{ padding: '16px' }}>
        <p className="section-label" style={{ marginBottom: '10px' }}>// TARGET DOMAIN</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Globe size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
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
            {isPending ? <><Loader size={13} className="animate-spin" /> looking up...</> : <><Shield size={13} /> lookup</>}
          </button>
        </div>
        <p style={{ fontSize: '0.62rem', color: 'var(--text-disabled)', marginTop: '8px' }}>
          queries certificate transparency logs — surfaces subdomains even if they're not linked or indexed by Google
        </p>
      </div>

      {result && (
        <>
          {/* Stats */}
          <div style={{ display: 'flex', gap: '24px', padding: '12px 16px', border: '1px solid var(--border-default)', borderRadius: '2px', background: 'rgba(0,232,77,0.03)', flexWrap: 'wrap' }}>
            {[
              { label: 'DOMAIN',     value: result.domain },
              { label: 'SUBDOMAINS', value: `${result.subdomainCount}${result.truncated ? '+' : ''}` },
              { label: 'SHOWING',    value: `${result.dorks.length} with dorks` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)', letterSpacing: '0.12em', marginBottom: '2px' }}>{label}</p>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#00e84d', fontFamily: 'IBM Plex Mono, monospace' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* View toggle */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['dorks', 'list'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', fontWeight: 600,
                letterSpacing: '0.08em', padding: '5px 12px', borderRadius: '2px', cursor: 'pointer',
                border: view === v ? '1px solid var(--border-active)' : '1px solid var(--border-default)',
                background: view === v ? 'rgba(0,232,77,0.1)' : 'transparent',
                color: view === v ? '#00e84d' : 'var(--text-tertiary)',
                transition: 'all 0.1s',
              }}>
                {v === 'dorks' ? 'DORK VIEW' : 'SUBDOMAIN LIST'}
              </button>
            ))}
          </div>

          {view === 'list' ? (
            <div className="card" style={{ padding: '16px' }}>
              <p className="section-label" style={{ marginBottom: '12px' }}>// ALL SUBDOMAINS {result.truncated && '(TOP 50)'}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '6px' }}>
                {result.subdomains.map(sub => (
                  <div key={sub} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ChevronRight size={10} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                    <code style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontFamily: 'IBM Plex Mono, monospace', wordBreak: 'break-all' }}>
                      {sub}
                    </code>
                    <button className="btn btn-ghost btn-sm" style={{ padding: '2px', flexShrink: 0 }} onClick={() => handleCopy(sub)}>
                      <Copy size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {result.dorks.map((item: CrtSubdomain) => (
                <div key={item.subdomain} className="card" style={{ overflow: 'hidden' }}>
                  <button
                    onClick={() => toggle(item.subdomain)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    {expanded[item.subdomain]
                      ? <ChevronDown size={12} style={{ color: '#00e84d', flexShrink: 0 }} />
                      : <ChevronRight size={12} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />}
                    <code style={{ fontSize: '0.72rem', color: '#00e84d', fontFamily: 'IBM Plex Mono, monospace', flex: 1 }}>
                      {item.subdomain}
                    </code>
                    <PivotLinks query={item.subdomain} compact />
                  </button>

                  {expanded[item.subdomain] && (
                    <div style={{ borderTop: '1px solid var(--border-default)', animation: 'fadeIn 0.15s ease-out' }}>
                      {item.dorks.map((dork, i) => (
                        <div
                          key={i}
                          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 14px', borderBottom: i < item.dorks.length - 1 ? '1px solid rgba(0,232,77,0.04)' : 'none' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,232,77,0.03)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '2px' }}>{dork.title}</p>
                            <code style={{ fontSize: '0.62rem', color: 'var(--text-tertiary)', fontFamily: 'IBM Plex Mono, monospace', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {dork.query}
                            </code>
                          </div>
                          <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                            <button className="btn btn-ghost btn-sm" title="Load into builder" onClick={() => handleLoad(dork.query)}><Terminal size={11} /></button>
                            <button className="btn btn-ghost btn-sm" title="Copy" onClick={() => handleCopy(dork.query)}><Copy size={11} /></button>
                            <button className="btn btn-ghost btn-sm" title="Search Google" onClick={() => handleGoogle(dork.query)}><ExternalLink size={11} /></button>
                            <button className="btn btn-ghost btn-sm" title="Save" onClick={() => handleSave(dork.title + ' — ' + item.subdomain, dork.query)}><BookmarkPlus size={11} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!result && !isPending && (
        <EmptyState icon={Shield} title="NO RESULTS YET" description="Enter a domain to pull certificate transparency logs and generate targeted dorks for each subdomain." />
      )}

      <div style={{ position: 'fixed', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 50 }}>
        {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onDismiss={() => dismiss(t.id)} />)}
      </div>
    </div>
  )
}
