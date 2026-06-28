import { useState, useRef, useEffect } from 'react'
import { Download, FileJson, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react'
import { exportDorks, type ExportFormat, type ExportItem } from '@/lib/exportDorks'

interface Props {
  items?: ExportItem[]
  label?: string
  onExported?: () => void
  onError?: (msg: string) => void
}

const FORMATS: { format: ExportFormat; label: string; icon: typeof FileJson }[] = [
  { format: 'json', label: 'JSON', icon: FileJson },
  { format: 'csv',  label: 'CSV',  icon: FileSpreadsheet },
  { format: 'txt',  label: 'TXT',  icon: FileText },
]

export default function ExportMenu({ items, label = 'Export', onExported, onError }: Props) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState<ExportFormat | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleExport = async (format: ExportFormat) => {
    setBusy(format)
    try {
      await exportDorks(format, items)
      onExported?.()
    } catch {
      onError?.('Export failed — try again')
    } finally {
      setBusy(null)
      setOpen(false)
    }
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="btn btn-secondary btn-md" onClick={() => setOpen(o => !o)}>
        <Download size={13} /> {label} <ChevronDown size={11} style={{ opacity: 0.5 }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: 0,
          minWidth: '140px',
          background: '#000',
          border: '1px solid rgba(0,232,77,0.48)',
          borderRadius: '2px',
          boxShadow: '0 0 20px rgba(0,232,77,0.15)',
          zIndex: 60,
          animation: 'fadeIn 0.1s ease-out',
          overflow: 'hidden',
        }}>
          {FORMATS.map(({ format, label: fLabel, icon: Icon }) => (
            <button
              key={format}
              onClick={() => handleExport(format)}
              disabled={busy !== null}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 12px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.7rem',
                fontFamily: 'IBM Plex Mono, monospace',
                cursor: busy ? 'wait' : 'pointer',
                textAlign: 'left',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,232,77,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Icon size={13} />
              {busy === format ? 'exporting...' : `as ${fLabel}`}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
