import { EFFECTIVENESS_META, type Effectiveness } from '@dorkly/shared'

interface Props {
  value: Effectiveness
  showTip?: boolean
}

export default function EffectivenessBadge({ value, showTip = true }: Props) {
  const meta = EFFECTIVENESS_META[value] || EFFECTIVENESS_META['unverified']

  return (
    <span
      title={showTip ? meta.tip : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '0.58rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        padding: '2px 7px',
        borderRadius: '2px',
        border: `1px solid ${meta.border}`,
        background: meta.bg,
        color: meta.color,
        textTransform: 'uppercase',
        cursor: showTip ? 'help' : 'default',
        whiteSpace: 'nowrap',
      }}
    >
      {meta.label}
    </span>
  )
}
