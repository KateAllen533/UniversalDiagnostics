import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// For UI testing, use a dummy connection string if DATABASE_URL is not set
const databaseUrl = process.env.DATABASE_URL || 'postgresql://dummy:dummy@localhost:5432/dummy_db';

if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
  throw new Error(
    "DATABASE_URL must be set in production. Did you forget to provision a database?",
  );
}

// Lazy initialization: only create pool when first accessed
let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function getPool(): Pool {
  if (!_pool) {
    _pool = new Pool({ 
      connectionString: databaseUrl,
      // Disable automatic connection validation for UI testing
      max: 1,
    });
  }
  return _pool;
}

function getDb() {
  if (!_db) {
    _db = drizzle(getPool(), { schema });
  }
  return _db;
}

// Export lazy getters
export const pool = getPool();
export const db = getDb();