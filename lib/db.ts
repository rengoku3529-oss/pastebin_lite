/**
 * Database connection and schema management for Neon Postgres
 */

import { neonConfig, Pool } from '@neondatabase/serverless';

// Enable WebSocket for serverless edge runtime compatibility
neonConfig.fetchConnectionCache = true;

// Create a connection pool
let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

/**
 * Paste data structure
 */
export interface Paste {
  id: string;
  content: string;
  created_at: Date;
  expires_at: Date | null;
  max_views: number | null;
  remaining_views: number | null;
}

/**
 * Initialize database schema
 * This runs automatically on first connection
 */
export async function initDatabase(): Promise<void> {
  const client = getPool();
  
  try {
    // Create pastes table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS pastes (
        id VARCHAR(12) PRIMARY KEY,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMPTZ,
        max_views INTEGER,
        remaining_views INTEGER,
        CHECK (max_views IS NULL OR max_views >= 1),
        CHECK (remaining_views IS NULL OR remaining_views >= 0)
      )
    `);

    // Create index for faster expiry checks
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_expires_at ON pastes(expires_at)
      WHERE expires_at IS NOT NULL
    `);

    console.log('✅ Database schema initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

/**
 * Create a new paste
 */
export async function createPaste(
  id: string,
  content: string,
  expiresAt: Date | null,
  maxViews: number | null
): Promise<Paste> {
  const client = getPool();
  const remainingViews = maxViews;
  
  const result = await client.query<Paste>(
    `INSERT INTO pastes (id, content, expires_at, max_views, remaining_views)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [id, content, expiresAt, maxViews, remainingViews]
  );

  return result.rows[0];
}

/**
 * Get a paste by ID
 * Returns null if not found
 */
export async function getPaste(id: string): Promise<Paste | null> {
  const client = getPool();
  
  const result = await client.query<Paste>(
    'SELECT * FROM pastes WHERE id = $1',
    [id]
  );

  return result.rows.length > 0 ? result.rows[0] : null;
}

/**
 * Decrement remaining views atomically
 * Returns the updated paste or null if operation failed
 */
export async function decrementViews(id: string): Promise<Paste | null> {
  const client = getPool();
  
  const result = await client.query<Paste>(
    `UPDATE pastes
     SET remaining_views = remaining_views - 1
     WHERE id = $1
       AND remaining_views IS NOT NULL
       AND remaining_views > 0
     RETURNING *`,
    [id]
  );

  return result.rows.length > 0 ? result.rows[0] : null;
}

/**
 * Delete a paste (for cleanup)
 */
export async function deletePaste(id: string): Promise<void> {
  const client = getPool();
  await client.query('DELETE FROM pastes WHERE id = $1', [id]);
}

/**
 * Check database health
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const client = getPool();
    await client.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}
