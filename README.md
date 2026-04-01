# Lead Capture Plumbing

Production-ready local plumbing lead capture system.

## Structure

- /web : React + Vite + Tailwind frontend
- /api : Node.js Express backend + PostgreSQL

## Tier 1: Frontend Only

1. `cd web`
2. `npm install`
3. `npm run dev`

Works as static site with form submission via Netlify/Vercel (or call your API if configured via `VITE_API_URL`).

## Tier 2: Full Stack

1. `cd api`
1. `cd api`
ull Stack
ith form submission via Netlify/Vercel (or call your API if configured via `VITE_API_URL`).
ig.
4. `npm run start`

`POST /api/leads` stores leads in Postgres.
`GET /api/leads` requires `Authorization: Bearer <ADMIN_TOKEN>`.

## Tier 3: Automation + Dashboard

- Lead fields: urgency, suburb, preferred contact time
- Email send on new lead (SMTP settings required)
- Admin route in frontend: `/admin` (token login)
- Filtering by date/status/service

## Deployment

- Frontend: deploy `web/dist` to Netlify/Vercel.
- Bac- Bac- Bac- Bac- Bac- Bac- Bac- Bac- Bac- Bac- Ba environment variables).
- DB: Supabase Postgres.

## Notes

- Lighthouse-focused: mobile-first, minimal dependency set, no heavy runtime features.
- `VITE_API_URL`, `VITE_ADMIN_TOKEN` should be env variables in production.
- Keep `ADMIN_TOKEN` secret.
