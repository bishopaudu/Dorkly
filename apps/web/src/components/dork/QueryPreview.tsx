import { Copy, ExternalLink, Globe, Trash2 } from 'lucide-react'
import { clsx } from 'clsx'

interface Props {
  query: string
  onCopy: () => void
  onGoogle: () => void
  onDuckDuckGo: () => void
  onClear: () => void
}

export default function QueryPreview({ query, onCopy, onGoogle, onDuckDuckGo, onClear }: Props) {
  const empty = !query.trim()

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-2xs font-semibold text-surface-500 uppercase tracking-wider">
          Query preview
        </p>
        {!empty && (
          <button onClick={onClear} className="btn-ghost btn-sm text-2xs gap-1 text-red-400 hover:text-red-300">
            <Trash2 size={11} /> Clear
          </button>
        )}
      </div>

      <div className={clsx(
        'min-h-[52px] rounded-xl px-4 py-3 font-mono text-sm break-all transition-all duration-200',
        empty
          ? 'bg-surface-800/30 border border-dashed border-surface-700/40 text-surface-600'
          : 'bg-surface-950/80 border border-brand-500/20 text-brand-300 shadow-glow-sm'
      )}>
        {empty ? 'Your query will appear here...' : query}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={onCopy}
          disabled={empty}
          className="btn btn-secondary btn-sm flex-1"
        >
          <Copy size={14} /> Copy
        </button>
        <button
          onClick={onGoogle}
          disabled={empty}
          className="btn btn-primary btn-sm flex-1"
        >
          <ExternalLink size={14} /> Search Google
        </button>
        <button
          onClick={onDuckDuckGo}
          disabled={empty}
          className="btn btn-secondary btn-sm flex-1"
        >
          <Globe size={14} /> DuckDuckGo
        </button>
      </div>
    </div>
  )
}
