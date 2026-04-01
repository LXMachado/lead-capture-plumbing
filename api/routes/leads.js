import express from 'express';
import { pool, initDb } from '../db.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Ensure schema exists (idempotent)
initDb().catch((err) => {
  console.error('DB initialization error', err);
  process.exit(1);
});

const ensureAdmin = (req, res, next) => {
  const key = req.headers.authorization?.split(' ')[1];
  if (!key || key !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

router.post('/', async (req, res) => {
  const { name, phone, email = '', service_type, urgency = 'medium', suburb = '', contact_time = '', message = '' } = req.body;

  if (!name || !phone || !service_type) {
    return res.status(400).json({ message: 'name, phone and service_type are required' });
  }

  try {
    const insert = await pool.query(
      'INSERT INTO leads (name, phone, email, service_type, urgency, suburb, contact_time, message) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [name, phone, email, service_type, urgency, suburb, contact_time, message]
    );

    const lead = insert.rows[0];

    if (process.env.SMTP_HOST && process.env.EMAIL_TO && process.env.EMAIL_FROM) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: `New plumbing lead: ${service_type}`,
        text: `New lead received:\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${service_type}\nUrgency: ${urgency}\nSuburb: ${suburb}\nContact time: ${contact_time}\nMessage: ${message}`
      });
    }

    res.status(201).json(lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not save lead' });
  }
});

router.get('/', ensureAdmin, async (req, res) => {
  const { service_type, status, from, to } = req.query;
  const conditions = [];
  const values = [];

  if (service_type) { values.push(service_type); conditions.push(`service_type = $${values.length}`); }
  if (status) { values.push(status); conditions.push(`status = $${values.length}`); }
  if (from) { values.push(new Date(from)); conditions.push(`created_at >= $${values.length}`); }
  if (to) { values.push(new Date(`${to}T23:59:59`)); conditions.push(`created_at <= $${values.length}`); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const result = await pool.query(`SELECT * FROM leads ${where} ORDER BY created_at DESC LIMIT 500`, values);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not fetch leads' });
  }
});

router.patch('/:id/status', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ['new', 'contacted', 'booked'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const updated = await pool.query('UPDATE leads SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    if (!updated.rows.length) return res.status(404).json({ message: 'Lead not found' });
    res.json(updated.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not update lead' });
  }
});

export default router;
