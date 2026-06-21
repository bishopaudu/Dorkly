import { Router } from 'express'
import { db, schema } from '../db'
import { eq, desc, like, sql } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export const ghdbRouter = Router()

const GHDB_SOURCE_URL = 'https://raw.githubusercontent.com/readloud/Google-Hacking-Database/main/exploit-database.md'

function parseGhdbMarkdown(markdown: string) {
  const lines = markdown.split('\n')
  const entries: { query: string; category: string; author: string; dateAdded: string }[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed.startsWith('|')) continue
    if (trimmed.includes('---')) continue
    if (trimmed.includes('**Date Added**') || trimmed.includes('**Date**')) continue

    const cells = trimmed.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1)
    if (cells.length < 3) continue

    const [dateAdded, query, category, author] = cells

    // Skip rows that look like the second table format (exploit listings, not dorks)
    if (!query || query.startsWith('http') || query.startsWith('<https')) continue
    if (!dateAdded.match(/^\d{4}-\d{2}-\d{2}$/)) continue
    if (query.length < 4) continue

    entries.push({
      query: query.replace(/\\/g, ''),
      category: category || 'Uncategorized',
      author: author || '',
      dateAdded,
    })
  }

  return entries
}

ghdbRouter.post('/sync', async (_req, res) => {
  try {
    const response = await fetch(GHDB_SOURCE_URL)
    if (!response.ok) throw new Error(`Source fetch failed: ${response.status}`)
    const markdown = await response.text()

    const entries = parseGhdbMarkdown(markdown)
    if (entries.length === 0) throw new Error('No entries parsed from source')

    // Clear old entries and insert fresh batch
    await db.delete(schema.ghdbEntries)

    const BATCH_SIZE = 500
    for (let i = 0; i < entries.length; i += BATCH_SIZE) {
      const batch = entries.slice(i, i + BATCH_SIZE).map(e => ({
        id: randomUUID(),
        query: e.query,
        category: e.category,
        author: e.author,
        dateAdded: e.dateAdded,
      }))
      await db.insert(schema.ghdbEntries).values(batch)
    }

    await db.delete(schema.syncMeta)
    await db.insert(schema.syncMeta).values({
      id: randomUUID(),
      entryCount: entries.length,
      sourceUrl: GHDB_SOURCE_URL,
    })

    res.json({ data: { synced: entries.length, sourceUrl: GHDB_SOURCE_URL } })
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Sync failed' })
  }
})

ghdbRouter.get('/status', async (_req, res) => {
  try {
    const meta = await db.select().from(schema.syncMeta).orderBy(desc(schema.syncMeta.lastSyncedAt)).limit(1)
    res.json({ data: meta[0] || null })
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch sync status' })
  }
})

ghdbRouter.get('/entries', async (req, res) => {
  try {
    const { search, category, limit = '50', offset = '0' } = req.query as Record<string, string>
    let query = db.select().from(schema.ghdbEntries)
    const conditions = []
    if (search) conditions.push(like(schema.ghdbEntries.query, `%${search}%`))
    if (category && category !== 'all') conditions.push(eq(schema.ghdbEntries.category, category))

    const results = await (conditions.length
      ? query.where(conditions.reduce((a, b) => sql`${a} AND ${b}`))
      : query)
      .orderBy(desc(schema.ghdbEntries.dateAdded))
      .limit(Number(limit))
      .offset(Number(offset))

    res.json({ data: results })
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch entries' })
  }
})

ghdbRouter.get('/categories', async (_req, res) => {
  try {
    const rows = await db.selectDistinct({ category: schema.ghdbEntries.category }).from(schema.ghdbEntries)
    res.json({ data: ['all', ...rows.map(r => r.category).sort()] })
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})
