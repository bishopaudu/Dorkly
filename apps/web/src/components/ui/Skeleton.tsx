import { clsx } from 'clsx'

interface Props { className?: string }

export default function Skeleton({ className }: Props) {
  return (
    <div className={clsx('rounded-xl bg-surface-800/60 shimmer', className)} />
  )
}
