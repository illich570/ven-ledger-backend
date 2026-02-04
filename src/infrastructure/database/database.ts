import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { validDatabaseConfig } from '#config/database-config.js';

import { AppError } from '../app-error.js';
import * as schema from './schema.js';

let pool: Pool | undefined;
let database: ReturnType<typeof drizzle> | undefined;

export async function initializeDatabase() {
  if (pool) return database!;
  pool = new Pool({
    connectionString: validDatabaseConfig.dbUrl,
    max: 5,
    idleTimeoutMillis: 30_000,
  });

  await pool.query('SELECT 1');
  database = drizzle(pool, { schema });
  return database;
}

export function getDatabase() {
  if (!database) throw new AppError('Database not initialized!', 400);
  return database;
}
