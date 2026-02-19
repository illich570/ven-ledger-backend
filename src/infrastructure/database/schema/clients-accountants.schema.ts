import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { user } from './auth.schema.js';

export const clientsAccountants = pgTable(
  'clients_accountants',
  {
    id: serial('id').primaryKey(),
    clientId: varchar('client_id', { length: 255 })
      .references(() => user.id)
      .notNull(),
    accountantId: varchar('accountant_id', { length: 255 })
      .references(() => user.id)
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    modifiedAt: timestamp('modified_at', { withTimezone: true }),
    createdBy: varchar('created_by', { length: 255 })
      .references(() => user.id)
      .notNull(),
    modifiedBy: varchar('modified_by', { length: 255 }).references(
      () => user.id,
    ),
    isActive: integer('is_active').notNull().default(1).$type<0 | 1 | 2>(), // 0: Inactive, 1: Active, 2: Deleted
  },
  table => [
    index('id_clients_accountants_idx').on(table.id),
    index('client_id_idx').on(table.clientId),
    index('accountant_id_idx').on(table.accountantId),
  ],
);
