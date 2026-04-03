import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pkg from 'pg';

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.join(__dirname, 'migrations');

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function ensureMigrationTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function initDb() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await ensureMigrationTable(client);

    const appliedResult = await client.query('SELECT version FROM schema_migrations');
    const appliedVersions = new Set(appliedResult.rows.map((row) => row.version));
    const migrationFiles = (await readdir(migrationsDir))
      .filter((file) => file.endsWith('.sql'))
      .sort((left, right) => left.localeCompare(right));

    for (const file of migrationFiles) {
      if (appliedVersions.has(file)) {
        continue;
      }

      const sql = await readFile(path.join(migrationsDir, file), 'utf8');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file]);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
