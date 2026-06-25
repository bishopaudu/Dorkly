import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSavedDorks } from '@/hooks/useSavedDorks'
import { useNavigate } from 'react-router-dom'
import { Search, Terminal, ExternalLink, BookmarkPlus, ChevronRight, Loader } from 'lucide-react'
import { api } from '@/lib/api'
import Badge from '@/components/ui/Badge'
import EffectivenessBadge from '@/components/ui/EffectivenessBadge'
import EmptyState from '@/components/ui/EmptyState'
import Skeleton from '@/components/ui/Skeleton'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'
import type { Template } from '@dorkly/shared'

const CATEGORY_LABELS: Record<string, string> = {
  all: 'ALL', security: 'SECURITY', osint: 'OSINT',
  research: 'RESEARCH', recon: 'RECON', custom: 'CUSTOM',
}

export default function TemplatesPage() {
  const [category, setCategory] = useState('all')
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState<Template | null>(null)
  const { toasts, toast, dismiss } = useToast()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { save: saveDorkLocal } = useSavedDorks()

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: api.templates.categories,
  })

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates', category, search],
    queryFn: () => api.templates.list({ category, search }),
  })

  const { mutate: trackUse } = useMutation({
    mutationFn: (id: string) => api.templates.trackUse(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['templates'] }),
  })

  const saveTemplate = (t: Template) => {
    saveDorkLocal({
      title: t.title,
      query: t.query,
      description: t.description || '',
      category: t.category,
      tags: t.tags,
    })
    toast('Template saved to library')
  }
  const saving = false

  const handleUseTemplate = (t: Template) => {
    trackUse(t.id)
    sessionStorage.setItem('dorkly_load_query', t.query)
    navigate('/')
  }

  const handleOpenGoogle = (t: Template) => {
    trackUse(t.id)
    window.open(`https://www.google.com/search?q=${encodeURIComponent(t.query)}`, '_blank', 'noopener')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-up">

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#00e84d', letterSpacing: '0.05em' }}>
            TEMPLATE LIBRARY
          </h2>
          <p style={{ fontSize: '0.7rem', color: 'rgba(0,232,77,0.62)', marginTop: '3px' }}>
            {templates.length} dork{templates.length !== 1 ? 's' : ''} available // select to preview or execute
          </p>
        </div>
      </div>

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
          placeholder="search templates..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.6rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              padding: '4px 10px',
              borderRadius: '2px',
              border: category === cat ? '1px solid rgba(0,232,77,0.5)' : '1px solid rgba(0,232,77,0.1)',
              background: category === cat ? 'rgba(0,232,77,0.12)' : 'transparent',
              color: category === cat ? '#00e84d' : 'rgba(0,232,77,0.72)',
              cursor: 'pointer',
              transition: 'all 0.1s',
            }}
            onMouseEnter={e => {
              if (category !== cat) {
                e.currentTarget.style.borderColor = 'rgba(0,232,77,0.48)'
                e.currentTarget.style.color = 'rgba(0,232,77,0.85)'
              }
            }}
            onMouseLeave={e => {
              if (category !== cat) {
                e.currentTarget.style.borderColor = 'rgba(0,232,77,0.1)'
                e.currentTarget.style.color = 'rgba(0,232,77,0.72)'
              }
            }}
          >
            {CATEGORY_LABELS[cat] || cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: '12px', alignItems: 'start' }}>

        {/* Template list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16" />)
            : templates.length === 0
            ? <EmptyState icon={Terminal} title="NO RESULTS" description="No templates match your current filters. Try a different category or search term." />
            : templates.map(t => (
              <div
                key={t.id}
                onClick={() => setSelected(selected?.id === t.id ? null : t)}
                className="card card-hover"
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderColor: selected?.id === t.id ? 'rgba(0,232,77,0.68)' : undefined,
                  background: selected?.id === t.id ? 'rgba(0,232,77,0.06)' : undefined,
                  boxShadow: selected?.id === t.id ? '0 0 16px rgba(0,232,77,0.15)' : undefined,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <ChevronRight
                  size={13}
                  style={{
                    color: 'rgba(0,232,77,0.48)',
                    flexShrink: 0,
                    transform: selected?.id === t.id ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.15s',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#00e84d' }}>
                      {t.title}
                    </span>
                    <Badge difficulty={t.difficulty} label={t.difficulty} />
                    <Badge category={t.category} label={t.category} />
                    {t.effectiveness && <EffectivenessBadge value={t.effectiveness as any} />}
                  </div>
                  <code style={{
                    fontSize: '0.65rem',
                    color: 'rgba(0,232,77,0.62)',
                    fontFamily: 'IBM Plex Mono, monospace',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    maxWidth: '100%',
                  }}>
                    {t.query}
                  </code>
                </div>
                <span style={{ fontSize: '0.6rem', color: 'rgba(0,232,77,0.48)', flexShrink: 0 }}>
                  {t.usageCount}x
                </span>
              </div>
            ))
          }
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="card" style={{ padding: '20px', position: 'sticky', top: 0, animation: 'fadeIn 0.15s ease-out' }}>
            <p className="section-label" style={{ marginBottom: '12px' }}>// DETAILS</p>

            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#00e84d', marginBottom: '6px' }}>
              {selected.title}
            </p>
            <p style={{ fontSize: '0.7rem', color: 'rgba(0,232,77,0.5)', lineHeight: 1.6, marginBottom: '16px' }}>
              {selected.description}
            </p>

            <p className="section-label" style={{ marginBottom: '8px' }}>// QUERY</p>
            <div style={{
              background: '#000',
              border: '1px solid rgba(0,232,77,0.2)',
              borderRadius: '2px',
              padding: '10px 12px',
              marginBottom: '16px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.7rem',
              color: '#00e84d',
              wordBreak: 'break-all',
              lineHeight: 1.6,
            }}>
              <span style={{ color: 'rgba(0,232,77,0.72)' }}>$ </span>{selected.query}
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <Badge difficulty={selected.difficulty} label={selected.difficulty} />
              <Badge category={selected.category} label={selected.category} />
              {selected.tags.map(tag => (
                <Badge key={tag} label={tag} variant="gray" />
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button className="btn btn-primary btn-md" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleUseTemplate(selected)}>
                <Terminal size={13} /> Load into builder
              </button>
              <button className="btn btn-secondary btn-md" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleOpenGoogle(selected)}>
                <ExternalLink size={13} /> Search Google
              </button>
              <button
                className="btn btn-secondary btn-md"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={saving}
                onClick={() => saveTemplate(selected)}
              >
                {saving ? <Loader size={13} className="animate-spin" /> : <BookmarkPlus size={13} />}
                Save to library
              </button>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(0,232,77,0.08)' }}>
              <p style={{ fontSize: '0.6rem', color: 'rgba(0,232,77,0.48)' }}>
                USED {selected.usageCount} TIME{selected.usageCount !== 1 ? 'S' : ''}
              </p>
            </div>
          </div>
        )}
      </div>

      <div style={{ position: 'fixed', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 50 }}>
        {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onDismiss={() => dismiss(t.id)} />)}
      </div>
    </div>
  )
}
