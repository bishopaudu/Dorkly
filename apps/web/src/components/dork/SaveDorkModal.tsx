import { useState } from 'react'
import { X, Save } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface Props {
  query: string
  onClose: () => void
  onSaved: () => void
}

export default function SaveDorkModal({ query, onClose, onSaved }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const qc = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.dorks.save({ title, query, description }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dorks'] })
      onSaved()
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-md p-6 space-y-4 animate-fade-up shadow-glow">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Save dork</h2>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-surface-400 mb-1.5 block">Title</label>
            <input
              className="input"
              placeholder="e.g. Exposed login pages"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-surface-400 mb-1.5 block">Description <span className="text-surface-600">(optional)</span></label>
            <input
              className="input"
              placeholder="What does this dork find?"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-surface-400 mb-1.5 block">Query</label>
            <div className="bg-surface-950/80 border border-surface-700/50 rounded-xl px-4 py-3 font-mono text-xs text-brand-300 break-all">
              {query}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="btn btn-secondary btn-md flex-1">Cancel</button>
          <button
            onClick={() => mutate()}
            disabled={!title.trim() || isPending}
            className="btn btn-primary btn-md flex-1"
          >
            <Save size={14} />
            {isPending ? 'Saving...' : 'Save dork'}
          </button>
        </div>
      </div>
    </div>
  )
}
