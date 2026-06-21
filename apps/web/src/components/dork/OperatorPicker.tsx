import { type DorkOperator } from '@dorkly/shared'
import { Plus } from 'lucide-react'

interface Props {
  operators: DorkOperator[]
  onAdd: (op: DorkOperator) => void
  activeIds: string[]
}

export default function OperatorPicker({ operators, onAdd, activeIds }: Props) {
  return (
    <div className="card p-4">
      <p className="section-label mb-3">Operators</p>
      <div className="flex flex-wrap gap-2">
        {operators.map(op => {
          const active = activeIds.includes(op.operator)
          return (
            <button
              key={op.operator}
              onClick={() => onAdd(op)}
              title={op.description}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                fontSize: '0.7rem',
                fontFamily: 'IBM Plex Mono, monospace',
                fontWeight: 500,
                borderRadius: '2px',
                border: active ? '1px solid rgba(0,232,77,0.5)' : '1px solid rgba(0,232,77,0.15)',
                background: active ? 'rgba(0,232,77,0.1)' : 'rgba(0,232,77,0.03)',
                color: active ? '#00e84d' : 'rgba(0,232,77,0.72)',
                cursor: 'pointer',
                transition: 'all 0.1s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.borderColor = 'rgba(0,232,77,0.5)'
                el.style.color = '#00e84d'
                el.style.background = 'rgba(0,232,77,0.08)'
                el.style.boxShadow = '0 0 8px rgba(0,232,77,0.15)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.borderColor = active ? 'rgba(0,232,77,0.5)' : 'rgba(0,232,77,0.15)'
                el.style.color = active ? '#00e84d' : 'rgba(0,232,77,0.72)'
                el.style.background = active ? 'rgba(0,232,77,0.1)' : 'rgba(0,232,77,0.03)'
                el.style.boxShadow = 'none'
              }}
            >
              <code style={{ fontFamily: 'inherit', color: '#00e84d' }}>{op.operator}</code>
              <span>{op.label}</span>
              <Plus size={10} style={{ color: 'rgba(0,232,77,0.62)' }} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
