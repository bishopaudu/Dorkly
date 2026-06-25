import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const templates = pgTable('templates', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  query: text('query').notNull(),
  category: text('category').notNull(),
  tags: text('tags').notNull().default('[]'),
  difficulty: text('difficulty').notNull().default('beginner'),
  effectiveness: text('effectiveness').notNull().default('reliable'),
  effectivenessNote: text('effectiveness_note').default(''),
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

export const ghdbEntries = pgTable('ghdb_entries', {
  id: text('id').primaryKey(),
  query: text('query').notNull(),
  category: text('category').notNull(),
  author: text('author').default(''),
  dateAdded: text('date_added').default(''),
  effectiveness: text('effectiveness').notNull().default('unverified'),
  syncedAt: timestamp('synced_at').notNull().defaultNow(),
})

export const syncMeta = pgTable('sync_meta', {
  id: text('id').primaryKey(),
  lastSyncedAt: timestamp('last_synced_at').notNull().defaultNow(),
  entryCount: integer('entry_count').notNull().default(0),
  sourceUrl: text('source_url').notNull(),
})
