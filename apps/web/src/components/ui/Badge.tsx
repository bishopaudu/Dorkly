import { clsx } from 'clsx'

const variants = {
  purple: 'badge-purple',
  green:  'badge-green',
  amber:  'badge-amber',
  red:    'badge-red',
  cyan:   'badge-cyan',
  gray:   'badge-gray',
} as const

const difficultyMap: Record<string, keyof typeof variants> = {
  beginner:     'green',
  intermediate: 'amber',
  advanced:     'red',
}

const categoryMap: Record<string, keyof typeof variants> = {
  security: 'red',
  osint:    'cyan',
  research: 'green',
  recon:    'amber',
  custom:   'gray',
}

interface Props {
  label: string
  variant?: keyof typeof variants
  difficulty?: string
  category?: string
  className?: string
}

export default function Badge({ label, variant, difficulty, category, className }: Props) {
  const v = variant
    || (difficulty ? difficultyMap[difficulty] : undefined)
    || (category   ? categoryMap[category]     : undefined)
    || 'gray'
  return (
    <span className={clsx(variants[v], 'badge', className)}>
      {label}
    </span>
  )
}
