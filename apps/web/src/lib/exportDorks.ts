export type ExportFormat = 'json' | 'txt' | 'csv'
export type ExportItem = { title: string; query: string; description?: string; category?: string }

export async function exportDorks(format: ExportFormat, items?: ExportItem[]) {
  const res = await fetch('/api/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ format, items }),
  })
  if (!res.ok) throw new Error('Export failed')

  const blob = await res.blob()
  const disposition = res.headers.get('Content-Disposition') || ''
  const match = disposition.match(/filename="(.+)"/)
  const filename = match ? match[1] : `dorkly-export.${format}`

  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}
