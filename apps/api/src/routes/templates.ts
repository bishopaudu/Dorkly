import { Router } from 'express'
import { db, schema } from '../db'
import { like, eq, sql } from 'drizzle-orm'

export const templatesRouter = Router()

templatesRouter.get('/', async (req, res) => {
  try {
    const { category, search, difficulty } = req.query as Record<string, string>
    let query = db.select().from(schema.templates)
    const conditions = []
    if (category && category !== 'all') conditions.push(eq(schema.templates.category, category))
    if (difficulty) conditions.push(eq(schema.templates.difficulty, difficulty))
    if (search) conditions.push(like(schema.templates.title, `%${search}%`))
    const results = await (conditions.length
      ? query.where(conditions.reduce((a, b) => sql`${a} AND ${b}`))
      : query)
    res.json({ data: results.map(r => ({ ...r, tags: JSON.parse(r.tags) })) })
  } catch (e) { res.status(500).json({ error: 'Failed to fetch templates' }) }
})

templatesRouter.get('/categories', async (_req, res) => {
  try {
    const rows = await db.selectDistinct({ category: schema.templates.category }).from(schema.templates)
    res.json({ data: ['all', ...rows.map(r => r.category)] })
  } catch (e) { res.status(500).json({ error: 'Failed to fetch categories' }) }
})

templatesRouter.post('/:id/use', async (req, res) => {
  try {
    await db.update(schema.templates)
      .set({ usageCount: sql`${schema.templates.usageCount} + 1` })
      .where(eq(schema.templates.id, req.params.id))
    res.json({ success: true })
  } catch (e) { res.status(500).json({ error: 'Failed to track usage' }) }
})
