import { Router } from 'express'
import { db, schema } from '../db'
import { eq, desc } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import { z } from 'zod'

export const dorksRouter = Router()

const DorkSchema = z.object({
  title: z.string().min(1).max(100),
  query: z.string().min(1),
  description: z.string().optional(),
  category: z.string().default('custom'),
  tags: z.array(z.string()).default([]),
})

dorksRouter.get('/', async (_req, res) => {
  try {
    const dorks = await db.select().from(schema.savedDorks).orderBy(desc(schema.savedDorks.createdAt))
    res.json({ data: dorks.map(d => ({ ...d, tags: JSON.parse(d.tags) })) })
  } catch (e) { res.status(500).json({ error: 'Failed to fetch dorks' }) }
})

dorksRouter.post('/', async (req, res) => {
  try {
    const body = DorkSchema.parse(req.body)
    const now = new Date()
    const dork = { id: randomUUID(), ...body, tags: JSON.stringify(body.tags), description: body.description || '', createdAt: now, updatedAt: now }
    await db.insert(schema.savedDorks).values(dork)
    res.status(201).json({ data: { ...dork, tags: body.tags } })
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: e.errors })
    res.status(500).json({ error: 'Failed to save dork' })
  }
})

dorksRouter.delete('/:id', async (req, res) => {
  try {
    await db.delete(schema.savedDorks).where(eq(schema.savedDorks.id, req.params.id))
    res.json({ success: true })
  } catch (e) { res.status(500).json({ error: 'Failed to delete dork' }) }
})
