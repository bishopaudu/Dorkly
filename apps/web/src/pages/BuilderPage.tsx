import { useState, useEffect } from 'react'
import { Save, Lightbulb } from 'lucide-react'
import { useQueryBuilder } from '@/hooks/useQueryBuilder'
import { useToast } from '@/hooks/useToast'
import OperatorPicker from '@/components/dork/OperatorPicker'
import ChipInput from '@/components/dork/ChipInput'
import QueryPreview from '@/components/dork/QueryPreview'
import SaveDorkModal from '@/components/dork/SaveDorkModal'
import Toast from '@/components/ui/Toast'

export default function BuilderPage() {
  const builder = useQueryBuilder()
  const { toasts, toast, dismiss } = useToast()
  const [showSave, setShowSave] = useState(false)
  const query = builder.buildQuery()

  useEffect(() => {
    const loaded = sessionStorage.getItem('dorkly_load_query')
    if (loaded) {
      builder.loadFromTemplate(loaded)
      sessionStorage.removeItem('dorkly_load_query')
      toast('Template loaded into builder')
    }
  }, [])

  const handleCopy = () => {
    if (!query) return
    navigator.clipboard.writeText(query)
    toast('Query copied to clipboard')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-up">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#00e84d', letterSpacing: '0.05em' }}>
            QUERY BUILDER
          </h2>
          <p style={{ fontSize: '0.7rem', color: 'rgba(0,232,77,0.62)', marginTop: '3px' }}>
            construct dork queries visually // operators + free text
          </p>
        </div>
        <button onClick={() => setShowSave(true)} disabled={!query} className="btn btn-secondary btn-md">
          <Save size={14} /> Save dork
        </button>
      </div>

      <OperatorPicker
        operators={builder.operators}
        onAdd={builder.addChip}
        activeIds={builder.chips.map(c => c.operator.operator)}
      />

      <div className="card" style={{ padding: '16px' }}>
        <p className="section-label" style={{ marginBottom: '12px' }}>// BUILD</p>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '0.65rem', color: 'rgba(0,232,77,0.62)', display: 'block', marginBottom: '6px', letterSpacing: '0.08em' }}>
            FREE TEXT / KEYWORDS
          </label>
          <input
            className="input"
            placeholder='"confidential report" Nigeria filetype:pdf'
            value={builder.freeText}
            onChange={e => builder.setFreeText(e.target.value)}
          />
        </div>

        {builder.chips.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.65rem', color: 'rgba(0,232,77,0.62)', letterSpacing: '0.08em' }}>
              OPERATORS
            </label>
            {builder.chips.map(chip => (
              <ChipInput key={chip.id} chip={chip} onUpdate={builder.updateChip} onRemove={builder.removeChip} />
            ))}
          </div>
        )}

        {builder.chips.length === 0 && !builder.freeText && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', color: 'rgba(0,232,77,0.48)', paddingTop: '4px' }}>
            <Lightbulb size={13} style={{ color: 'rgba(255,179,0,0.5)' }} />
            click an operator above to start building
          </div>
        )}
      </div>

      <QueryPreview
        query={query}
        onCopy={handleCopy}
        onGoogle={builder.openInGoogle}
        onDuckDuckGo={builder.openInDuckDuckGo}
        onClear={builder.clearAll}
      />

      {showSave && (
        <SaveDorkModal
          query={query}
          onClose={() => setShowSave(false)}
          onSaved={() => toast('Dork saved to your library')}
        />
      )}

      <div style={{ position: 'fixed', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 50 }}>
        {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onDismiss={() => dismiss(t.id)} />)}
      </div>
    </div>
  )
}
