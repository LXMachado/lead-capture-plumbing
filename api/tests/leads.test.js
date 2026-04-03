import { jest } from '@jest/globals';
import request from 'supertest';

const mockQuery = jest.fn();
const mockCreateTransport = jest.fn(() => ({
  sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message' })
}));

process.env.NODE_ENV = 'test';
process.env.ADMIN_TOKEN = 'secret-token';

await jest.unstable_mockModule('../db.js', () => ({
  initDb: jest.fn(),
  pool: {
    query: mockQuery
  }
}));

await jest.unstable_mockModule('nodemailer', () => ({
  default: {
    createTransport: mockCreateTransport
  }
}));

const { app } = await import('../index.js');

describe('lead routes', () => {
  beforeEach(() => {
    mockQuery.mockReset();
    mockCreateTransport.mockClear();
    delete process.env.SMTP_HOST;
    delete process.env.EMAIL_TO;
    delete process.env.EMAIL_FROM;
  });

  test('creates a lead with normalized defaults', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
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
          status: 'new',
          created_at: '2026-04-03T00:00:00.000Z'
        }
      ]
    });

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
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO leads'), [
      'Jane Smith',
      '0400 111 222',
      'jane@example.com',
      'Blocked drain',
      'medium',
      'Robina',
      'morning',
      'Kitchen sink blocked',
      'webform',
      '/contact',
      null,
      null,
      null
    ]);
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
    expect(mockQuery).not.toHaveBeenCalled();
  });

  test('lists leads with validated filters', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 7, status: 'new', service_type: 'Emergency' }]
    });

    const response = await request(app)
      .get('/api/leads?status=new&service_type=Emergency&from=2026-04-01&to=2026-04-03')
      .set('Authorization', 'Bearer secret-token');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 7, status: 'new', service_type: 'Emergency' }]);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('ORDER BY created_at DESC LIMIT 500'),
      ['Emergency', 'new', expect.any(String), expect.any(String)]
    );
  });

  test('rejects invalid status updates', async () => {
    const response = await request(app)
      .patch('/api/leads/12/status')
      .set('Authorization', 'Bearer secret-token')
      .send({ status: 'closed' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'status must be one of: new, contacted, booked'
    });
  });
});
