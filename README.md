# Lead Capture Plumbing

Lead capture MVP for a plumbing business, with a React frontend and an Express/Postgres API.

## Structure

- `web/`: React + Vite frontend
- `api/`: Express API + PostgreSQL storage

## Backend features

- SQL-file migrations applied automatically on API startup
- Expanded `leads` schema with operational fields such as `source`, `page`, `next_action_at`, `assigned_to`, `quote_amount`, `created_at`, and `updated_at`
- `lead_notes` table for lead history
- Indexed filtering on `created_at`, `status`, and `service_type`
- Admin-protected lead listing and status updates
- Input validation and lightweight rate limiting on lead submission

## Local setup

### 1. Start PostgreSQL

Create a database and provide its connection string through `DATABASE_URL`.

Example:

```bash
createdb lead_capture_plumbing
```

### 2. Configure API env

Copy `api/.env.example` to `api/.env` and update values as needed.

Required for local API use:

- `DATABASE_URL`
- `ADMIN_TOKEN`

Optional:

- `PORT`
- SMTP settings for new-lead notification emails

### 3. Run the API

```bash
cd api
npm install
npm run dev
```

On startup, the API will apply any pending SQL migrations automatically.

### 4. Run the frontend

```bash
cd web
npm install
npm run dev
```

If the frontend is served separately from the API, set:

```bash
VITE_API_URL=http://localhost:4000/api
```

Optional frontend env:

```bash
VITE_DEMO_MODE=true
```

When `VITE_DEMO_MODE` is not set to `true`, the form and admin page use the live API.

## API

### `POST /api/leads`

Creates a lead.

Example payload:

```json
{
  "name": "Jane Smith",
  "phone": "0400 111 222",
  "email": "jane@example.com",
  "service_type": "Blocked drain",
  "urgency": "medium",
  "suburb": "Robina",
  "contact_time": "morning",
  "message": "Kitchen sink blocked",
  "source": "webform",
  "page": "/contact"
}
```

Allowed values:

- `urgency`: `low`, `medium`, `emergency`
- `contact_time`: `any`, `morning`, `afternoon`, `evening`
- `source`: `webform`, `call`

### `GET /api/leads`

Requires:

```http
Authorization: Bearer <ADMIN_TOKEN>
```

Supported query params:

- `service_type`
- `status`
- `from` (`YYYY-MM-DD`)
- `to` (`YYYY-MM-DD`)

### `PATCH /api/leads/:id/status`

Requires:

```http
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

Example payload:

```json
{
  "status": "contacted",
  "next_action_at": "2026-04-04T09:00:00.000Z"
}
```

Allowed status values:

- `new`
- `contacted`
- `booked`

## Testing

API tests are mock-based and do not require a running database:

```bash
cd api
npm test
```
