import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const templates = pgTable('templates', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  query: text('query').notNull(),
  category: text('category').notNull(),
  tags: text('tags').notNull().default('[]'),
  difficulty: text('difficulty').notNull().default('beginner'),
  usageCount: integer('usage_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const savedDorks = pgTable('saved_dorks', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  query: text('query').notNull(),
  description: text('description').default(''),
  category: text('category').notNull().default('custom'),
  tags: text('tags').notNull().default('[]'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
