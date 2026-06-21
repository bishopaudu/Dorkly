import { useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import type { QueryChip } from '@/hooks/useQueryBuilder'

interface Props {
  chip: QueryChip
  onUpdate: (id: string, value: string) => void
  onRemove: (id: string) => void
}

export default function ChipInput({ chip, onUpdate, onRemove }: Props) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { ref.current?.focus() }, [])

  return (
    <div
      className="group"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(0,232,77,0.04)',
        border: '1px solid rgba(0,232,77,0.2)',
        borderRadius: '2px',
        padding: '8px 12px',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(0,232,77,0.62)'
        e.currentTarget.style.boxShadow = '0 0 8px rgba(0,232,77,0.1)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(0,232,77,0.2)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <code style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '0.7rem',
        color: '#00e84d',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}>
        {chip.operator.operator}
      </code>
      <input
        ref={ref}
        type="text"
        value={chip.value}
        onChange={e => onUpdate(chip.id, e.target.value)}
        placeholder={chip.operator.placeholder}
        style={{
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '0.8rem',
          color: '#00e84d',
          width: '100%',
          minWidth: '80px',
        }}
        onFocus={e => e.currentTarget.closest('div')!.style.borderColor = 'rgba(0,232,77,0.5)'}
        onBlur={e => e.currentTarget.closest('div')!.style.borderColor = 'rgba(0,232,77,0.2)'}
      />
      <button
        onClick={() => onRemove(chip.id)}
        style={{
          flexShrink: 0,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'rgba(0,232,77,0.2)',
          padding: '2px',
          display: 'flex',
          transition: 'color 0.1s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#ff4444'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,232,77,0.2)'}
      >
        <X size={13} />
      </button>
    </div>
  )
}
