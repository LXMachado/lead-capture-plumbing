import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import leadRouter from './routes/leads.js';

dotenv.config();
export const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true, uptime: process.uptime() }));
app.use('/api/leads', leadRouter);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}

