import { useState } from 'react'
import { X, Save } from 'lucide-react'
import { useSavedDorks } from '@/hooks/useSavedDorks'

interface Props {
  query: string
  onClose: () => void
  onSaved: () => void
}

export default function SaveDorkModal({ query, onClose, onSaved }: Props) {
  const [title, setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const { save } = useSavedDorks()

  const handleSave = () => {
    if (!title.trim()) return
    save({
      title: title.trim(),
      query,
      description: description.trim(),
      category: 'custom',
      tags: [],
    })
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '24px', animation: 'fadeUp 0.2s ease-out', boxShadow: '0 0 40px rgba(0,232,77,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>SAVE DORK</p>
          <button onClick={onClose} className="btn btn-ghost btn-sm"><X size={15} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '6px', letterSpacing: '0.08em' }}>TITLE</label>
            <input className="input" placeholder="e.g. exposed login pages" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
          </div>
          <div>
            <label style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '6px', letterSpacing: '0.08em' }}>
              DESCRIPTION <span style={{ color: 'var(--text-disabled)' }}>(optional)</span>
            </label>
            <input className="input" placeholder="what does this dork find?" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '6px', letterSpacing: '0.08em' }}>QUERY</label>
            <div style={{
              background: '#000', border: '1px solid var(--border-default)',
              borderRadius: '2px', padding: '10px 12px',
              fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.68rem',
              color: 'var(--text-primary)', wordBreak: 'break-all', lineHeight: 1.6,
            }}>
              <span style={{ color: 'var(--text-tertiary)' }}>$ </span>{query}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
          <button onClick={onClose} className="btn btn-secondary btn-md" style={{ flex: 1, justifyContent: 'center' }}>cancel</button>
          <button onClick={handleSave} disabled={!title.trim()} className="btn btn-primary btn-md" style={{ flex: 1, justifyContent: 'center' }}>
            <Save size={13} /> save dork
          </button>
        </div>

        <p style={{ fontSize: '0.6rem', color: 'var(--text-disabled)', marginTop: '12px', textAlign: 'center', lineHeight: 1.5 }}>
          saved to your browser only — never sent to our servers
        </p>
      </div>
    </div>
  )
}
