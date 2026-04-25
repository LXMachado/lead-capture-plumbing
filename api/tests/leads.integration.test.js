// Set test environment variables BEFORE importing anything that uses them
process.env.NODE_ENV = 'test';
process.env.ADMIN_TOKEN = 'secret-token';
// Always use test database for integration tests to avoid conflicts
process.env.DATABASE_URL = 'postgres://localhost:5432/lead_capture_plumbing_test';

// Now import modules that depend on these environment variables
import { jest } from '@jest/globals';
import request from 'supertest';
import { pool } from '../db.js';

describe('lead routes (integration)', () => {
  let app;

  beforeAll(async () => {
    // Import the app after setting environment variables
    const { app: importedApp } = await import('../index.js');
    app = importedApp;
  });

  beforeEach(async () => {
    // Clean up test data before each test
    await pool.query('DELETE FROM lead_notes');
    await pool.query('DELETE FROM leads');
  });

  afterAll(async () => {
    // Close database connection after all tests
    await pool.end();
  });

  test('creates a lead with normalized defaults', async () => {
    const response = await request(app)
      .post('/api/leads')
      .send({
        name: '  Jane Smith ',
        phone: '0400 111 222',
        email: 'JANE@EXAMPLE.COM',
        service_type: 'Blocked drain',
        suburb: ' Robina ',
        contact_time: 'morning',
        message: 'Kitchen sink blocked',
        page: '/contact'
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      name: 'Jane Smith',
      phone: '0400 111 222',
      email: 'jane@example.com',
      service_type: 'Blocked drain',
      urgency: 'medium',
      suburb: 'Robina',
      contact_time: 'morning',
      message: 'Kitchen sink blocked',
      source: 'webform',
      page: '/contact',
      status: 'new'
    });
  });

  test('rejects invalid lead payloads with field errors', async () => {
    const response = await request(app)
      .post('/api/leads')
      .send({
        name: '',
        phone: 'bad-phone',
        service_type: '',
        urgency: 'now'
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Validation failed',
      fields: {
        name: 'Required',
        phone: 'Must be a valid phone number',
        service_type: 'Required',
        urgency: 'Must be one of: low, medium, emergency'
      }
    });
  });

  test('requires admin token for listing leads', async () => {
    const response = await request(app).get('/api/leads');
    expect(response.status).toBe(401);
  });

  test('lists leads with validated filters', async () => {
    // Insert a test lead directly
    const insertResult = await pool.query(
      `INSERT INTO leads (name, phone, email, service_type, urgency, suburb, contact_time, message, source, page, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      ['Test User', '0400 000 000', 'test@example.com', 'Emergency', 'medium', 'Test Suburb', 'morning', 'Test message', 'webform', '/test', 'new']
    );

    const response = await request(app)
      .get('/api/leads?status=new&service_type=Emergency')
      .set('Authorization', 'Bearer secret-token');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body[0]).toMatchObject({
      id: insertResult.rows[0].id,
      status: 'new',
      service_type: 'Emergency'
    });
  });

  test('rejects invalid status updates', async () => {
    // Insert a test lead
    const insertResult = await pool.query(
      `INSERT INTO leads (name, phone, email, service_type, urgency, suburb, contact_time, message, source, page, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      ['Test User', '0400 000 000', 'test@example.com', 'Emergency', 'medium', 'Test Suburb', 'morning', 'Test message', 'webform', '/test', 'new']
    );

    const response = await request(app)
      .patch(`/api/leads/${insertResult.rows[0].id}/status`)
      .set('Authorization', 'Bearer secret-token')
      .send({ status: 'closed' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'status must be one of: new, contacted, booked'
    });
  });

  test('valid status update works', async () => {
    // Insert a test lead
    const insertResult = await pool.query(
      `INSERT INTO leads (name, phone, email, service_type, urgency, suburb, contact_time, message, source, page, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      ['Test User', '0400 000 000', 'test@example.com', 'Emergency', 'medium', 'Test Suburb', 'morning', 'Test message', 'webform', '/test', 'new']
    );

    const response = await request(app)
      .patch(`/api/leads/${insertResult.rows[0].id}/status`)
      .set('Authorization', 'Bearer secret-token')
      .send({ status: 'contacted' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('contacted');
  });
});