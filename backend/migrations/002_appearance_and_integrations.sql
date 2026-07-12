-- Adds appearance (accent color) and an open-ended integrations bucket for
-- future third-party connectors (Strava, Google Fit, etc.) without needing
-- another schema change per integration.

ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS accent_color TEXT NOT NULL DEFAULT 'teal',
  ADD COLUMN IF NOT EXISTS integrations JSONB NOT NULL DEFAULT '{}'::jsonb;
