import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'
import { clsx } from 'clsx'

export type ToastType = 'success' | 'error'

interface Props {
  message: string
  type?: ToastType
  onDismiss: () => void
}

export default function Toast({ message, type = 'success', onDismiss }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const t = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 200) }, 3000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div className={clsx(
      'flex items-center gap-3 px-4 py-3 font-mono text-xs transition-all duration-200',
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
      type === 'success'
        ? 'text-phosphor-400 border border-phosphor-400/30 bg-black/95'
        : 'text-red-400 border border-red-400/30 bg-black/95'
    )}
    style={{ borderRadius: '2px', boxShadow: type === 'success' ? '0 0 16px rgba(0,232,77,0.2)' : '0 0 16px rgba(255,68,68,0.2)' }}>
      {type === 'success'
        ? <CheckCircle size={13} className="shrink-0" />
        : <XCircle size={13} className="shrink-0" />}
      <span className="tracking-wide">{message}</span>
      <button onClick={onDismiss} className="btn-ghost p-0.5 ml-1">
        <X size={12} />
      </button>
    </div>
  )
}
