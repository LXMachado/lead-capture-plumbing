# AGENTS.md

Guidance for AI agents working in this repository.

## Project Overview

This is a lead-capture MVP for a plumbing business. It has two independently installed Node projects:

- `web/`: React 18 + Vite + Tailwind frontend.
- `api/`: Express API backed by PostgreSQL.

Design reference exports live under `Design/`. Treat them as references unless the user explicitly asks to modify design artifacts.

## Working Principles

- Keep changes scoped to either `web/` or `api/` unless a feature genuinely crosses both.
- Prefer the existing plain React component style and CSS utility/component classes in `web/src/styles/index.css`.
- Keep backend validation centralized in `api/validation/leads.js`.
- Do not commit secrets. Local API configuration belongs in `api/.env`, based on `api/.env.example`.
- Preserve user changes in the working tree. Check `git status --short` before and after edits.

## Local Setup

Install dependencies separately:

```bash
cd api && npm install
cd ../web && npm install
```

The API expects PostgreSQL and these local environment values:

```bash
DATABASE_URL=postgres://localhost:5432/lead_capture_plumbing
PORT=4000
ADMIN_TOKEN=replace-me
```

Optional SMTP variables are documented in `api/.env.example`.

## Development Commands

API:

```bash
cd api
npm run dev
npm test
```

Frontend:

```bash
cd web
npm run dev
npm run build
npm run lint
```

When running the frontend against a separately hosted API, set:

```bash
VITE_API_URL=http://localhost:4000/api
```

For frontend-only demos, set:

```bash
VITE_DEMO_MODE=true
```

## Backend Notes

- `api/index.js` exports `app` for tests and starts the server outside `NODE_ENV=test`.
- `api/db.js` applies SQL migrations from `api/migrations/` automatically on API startup.
- `POST /api/leads` validates and normalizes payloads through `buildLeadPayload`.
- `GET /api/leads` and `PATCH /api/leads/:id/status` require `Authorization: Bearer <ADMIN_TOKEN>`.
- API tests in `api/tests/` mock the database and do not require a running PostgreSQL instance.
- If schema behavior changes, update SQL migrations, validation, route behavior, and tests together.

## Frontend Notes

- Routes are defined in `web/src/App.jsx`.
- Public content and option lists are in `web/src/data/siteContent.js`.
- Image paths are centralized in `web/src/data/siteImages.js`; expected public assets live under `web/public/images/`.
- Lead capture is implemented in `web/src/components/LeadForm.jsx`.
- Admin lead management is implemented in `web/src/pages/AdminPage.jsx`.
- The frontend defaults to live API calls unless `VITE_DEMO_MODE=true`.

## Verification

Before handing off backend changes, run:

```bash
cd api && npm test
```

Before handing off frontend changes, run:

```bash
cd web && npm run build
```

Run `cd web && npm run lint` for JavaScript/React changes when lint configuration is present and working.

## Known Gaps To Watch

- There is no root `package.json`; run commands from `api/` or `web/`.
- The frontend does not currently have an automated test suite.
- The API has mock-based route tests but no integration test against a real PostgreSQL database.
- The in-memory lead submission rate limiter resets on server restart and is not shared across instances.
