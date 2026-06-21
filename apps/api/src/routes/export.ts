import { Router } from 'express'
import { db, schema } from '../db'
import { z } from 'zod'

export const exportRouter = Router()

const ExportSchema = z.object({
  format: z.enum(['json', 'txt', 'csv']),
  source: z.enum(['saved', 'custom']).default('saved'),
  items: z.array(z.object({
    title: z.string(),
    query: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
  })).optional(),
})

function toCsv(rows: { title: string; query: string; description?: string; category?: string }[]) {
  const esc = (v: string) => `"${(v || '').replace(/"/g, '""')}"`
  const header = 'title,query,description,category'
  const lines = rows.map(r => [esc(r.title), esc(r.query), esc(r.description || ''), esc(r.category || '')].join(','))
  return [header, ...lines].join('\n')
}

function toTxt(rows: { title: string; query: string }[]) {
  return rows.map(r => `# ${r.title}\n${r.query}\n`).join('\n')
}

exportRouter.post('/', async (req, res) => {
  try {
    const body = ExportSchema.parse(req.body)
    let items = body.items

    // If no items passed directly, pull from saved dorks
    if (!items) {
      const dorks = await db.select().from(schema.savedDorks)
      items = dorks.map(d => ({
        title: d.title,
        query: d.query,
        description: d.description || '',
        category: d.category,
      }))
    }

    const filename = `dorkly-export-${Date.now()}`

    if (body.format === 'json') {
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`)
      res.setHeader('Content-Type', 'application/json')
      return res.send(JSON.stringify({ exportedAt: new Date().toISOString(), count: items.length, dorks: items }, null, 2))
    }

    if (body.format === 'csv') {
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`)
      res.setHeader('Content-Type', 'text/csv')
      return res.send(toCsv(items))
    }

    // txt
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.txt"`)
    res.setHeader('Content-Type', 'text/plain')
    return res.send(toTxt(items))
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: 'Invalid export request' })
    res.status(500).json({ error: 'Export failed' })
  }
})
