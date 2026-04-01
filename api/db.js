import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function initDb() {
  const query = `
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(64) NOT NULL,
      email VARCHAR(255),
      service_type VARCHAR(100) NOT NULL,
      urgency VARCHAR(20) DEFAULT 'medium',
      suburb VARCHAR(100),
      contact_time VARCHAR(100),
      message TEXT,
      status VARCHAR(20) DEFAULT 'new',
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
}
