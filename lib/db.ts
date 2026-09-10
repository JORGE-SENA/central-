import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/central_db';

declare global {
  var postgresPool: Pool | undefined;
}

export const db = global.postgresPool || new Pool({ connectionString });

if (process.env.NODE_ENV !== 'production') {
  global.postgresPool = db;
}
