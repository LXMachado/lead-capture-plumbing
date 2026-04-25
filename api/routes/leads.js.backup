import express from 'express';
import { pool } from '../db.js';
import nodemailer from 'nodemailer';
import {
  ADMIN_STATUSES,
  buildLeadPayload,
  buildLeadQueryFilters,
  coerceOptionalTimestamp,
  normalizeStatus
} from '../validation/leads.js';

const router = express.Router();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const requestBuckets = new Map();

const ensureAdmin = (req, res, next) => {
  const key = req.headers.authorization?.split(' ')[1];
  if (!key || key !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

const checkLeadRateLimit = (req, res, next) => {
  const now = Date.now();
  const key = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const recent = (requestBuckets.get(key) || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({ message: 'Too many submissions. Please try again shortly.' });
  }

  recent.push(now);
  requestBuckets.set(key, recent);
  next();
};

router.post('/', checkLeadRateLimit, async (req, res) => {
  const payload = buildLeadPayload(req.body);

  if (!payload.ok) {
    return res.status(400).json({ message: payload.message, fields: payload.fields });
  }

  try {
    const insert = await pool.query(
      `
        INSERT INTO leads (
          name,
          phone,
          email,
          service_type,
          urgency,
          suburb,
          contact_time,
          message,
          source,
          page,
          next_action_at,
          assigned_to,
          quote_amount
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        RETURNING *
      `,
      [
        payload.value.name,
        payload.value.phone,
        payload.value.email,
        payload.value.service_type,
        payload.value.urgency,
        payload.value.suburb,
        payload.value.contact_time,
        payload.value.message,
        payload.value.source,
        payload.value.page,
        payload.value.next_action_at,
        payload.value.assigned_to,
        payload.value.quote_amount
      ]
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
        subject: `New plumbing lead: ${lead.service_type}`,
        text: `New lead received:
Name: ${lead.name}
Phone: ${lead.phone}
Email: ${lead.email || 'Not provided'}
Service: ${lead.service_type}
Urgency: ${lead.urgency}
Suburb: ${lead.suburb || 'Not provided'}
Contact time: ${lead.contact_time}
Source: ${lead.source}
Page: ${lead.page || 'Not provided'}
Message: ${lead.message || 'Not provided'}`
      });
    }

    res.status(201).json(lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not save lead' });
  }
});

router.get('/', ensureAdmin, async (req, res) => {
  const filters = buildLeadQueryFilters(req.query);

  if (!filters.ok) {
    return res.status(400).json({ message: filters.message, fields: filters.fields });
  }

  try {
    const where = filters.value.conditions.length ? `WHERE ${filters.value.conditions.join(' AND ')}` : '';
    const result = await pool.query(
      `SELECT * FROM leads ${where} ORDER BY created_at DESC LIMIT 500`,
      filters.value.values
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not fetch leads' });
  }
});

router.patch('/:id/status', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  const status = normalizeStatus(req.body?.status);
  const nextActionAt = coerceOptionalTimestamp(req.body?.next_action_at);

  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({ message: 'Invalid lead id' });
  }

  if (!ADMIN_STATUSES.includes(status)) {
    return res.status(400).json({ message: `status must be one of: ${ADMIN_STATUSES.join(', ')}` });
  }

  if (req.body?.next_action_at && nextActionAt === null) {
    return res.status(400).json({ message: 'next_action_at must be a valid ISO date-time' });
  }

  try {
    const updated = await pool.query(
      'UPDATE leads SET status = $1, next_action_at = COALESCE($2, next_action_at) WHERE id = $3 RETURNING *',
      [status, nextActionAt, id]
    );
    if (!updated.rows.length) return res.status(404).json({ message: 'Lead not found' });
    res.json(updated.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not update lead' });
  }
});

export default router;
