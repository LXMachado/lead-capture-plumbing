import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import leadRouter from './routes/leads.js';
import { initDb } from './db.js';

dotenv.config();
export const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true, uptime: process.uptime() }));
app.use('/api/leads', leadRouter);

export async function startServer() {
  await initDb();

  const PORT = process.env.PORT || 4000;
  return app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}

if (process.env.NODE_ENV !== 'test') {
  startServer().catch((error) => {
    console.error('API startup failed', error);
    process.exit(1);
  });
}
