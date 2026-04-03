CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  email VARCHAR(255),
  service_type VARCHAR(100) NOT NULL,
  urgency VARCHAR(20) NOT NULL DEFAULT 'medium',
  suburb VARCHAR(100),
  contact_time VARCHAR(50) NOT NULL DEFAULT 'any',
  message TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'new',
  source VARCHAR(32) NOT NULL DEFAULT 'webform',
  page VARCHAR(255),
  assigned_to VARCHAR(255),
  next_action_at TIMESTAMPTZ,
  quote_amount NUMERIC(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS source VARCHAR(32) NOT NULL DEFAULT 'webform',
  ADD COLUMN IF NOT EXISTS page VARCHAR(255),
  ADD COLUMN IF NOT EXISTS assigned_to VARCHAR(255),
  ADD COLUMN IF NOT EXISTS next_action_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS quote_amount NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE leads
  ALTER COLUMN contact_time SET DEFAULT 'any';

UPDATE leads
SET
  source = COALESCE(source, 'webform'),
  contact_time = COALESCE(NULLIF(contact_time, ''), 'any'),
  updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS lead_notes (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_service_type ON leads (service_type);
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON lead_notes (lead_id, created_at DESC);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leads_set_updated_at ON leads;

CREATE TRIGGER leads_set_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
