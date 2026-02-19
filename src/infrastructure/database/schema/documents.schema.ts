import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { user } from './auth.schema.js';

export const categoryDocuments = pgTable(
  'category_documents',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    description: varchar('description', { length: 256 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    createdBy: varchar('created_by', { length: 255 })
      .references(() => user.id)
      .notNull(),
    modifiedBy: varchar('modified_by', { length: 255 }).references(
      () => user.id,
    ),
    isActive: integer('is_active').notNull().default(1).$type<0 | 1 | 2>(), // 0: Inactive, 1: Active, 2: Deleted
  },
  table => [
    index('id_category_documents_idx').on(table.id),
    index('name_idx').on(table.name),
  ],
);

export const typeDocuments = pgTable(
  'type_documents',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    description: varchar('description', { length: 256 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    modifiedAt: timestamp('modified_at', { withTimezone: true }),
    isActive: integer('is_active').notNull().default(1).$type<0 | 1 | 2>(), // 0: Inactive, 1: Active, 2: Deleted
    categoryId: integer('category_id')
      .notNull()
      .references(() => categoryDocuments.id),
    createdBy: varchar('created_by', { length: 255 })
      .references(() => user.id)
      .notNull(),
    modifiedBy: varchar('modified_by', { length: 255 }).references(
      () => user.id,
    ),
  },
  table => [
    index('id_type_document_idx').on(table.id),
    index('category_document_id_idx').on(table.categoryId),
  ],
);

export const documents = pgTable(
  'documents',
  {
    id: serial('id').primaryKey(),
    typeId: integer('type_id')
      .references(() => typeDocuments.id)
      .notNull(),
    keyName: varchar('key_name', { length: 256 }).notNull(),
    holderId: integer('holder_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    createdBy: varchar('created_by', { length: 255 })
      .references(() => user.id)
      .notNull(),
    modifiedBy: varchar('modified_by', { length: 255 }).references(
      () => user.id,
    ),
    isActive: integer('is_active').notNull().default(1).$type<0 | 1 | 2>(), // 0: Inactive, 1: Active, 2: Deleted
    categoryId: integer('category_id')
      .notNull()
      .references(() => categoryDocuments.id),
  },
  table => [
    index('id_idx').on(table.id),
    index('holder_id_idx').on(table.holderId),
  ],
);
