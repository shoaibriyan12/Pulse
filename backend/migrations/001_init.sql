-- Pulse Fitness Analytics — initial schema
-- Run this against the Postgres database hosted on your VM.

CREATE TABLE IF NOT EXISTS entries (
  date            DATE PRIMARY KEY,          -- 'YYYY-MM-DD'
  calories        INTEGER NOT NULL DEFAULT 0,
  protein         NUMERIC(7,2) NOT NULL DEFAULT 0,
  carbs           NUMERIC(7,2) NOT NULL DEFAULT 0,
  fat             NUMERIC(7,2) NOT NULL DEFAULT 0,
  weight          NUMERIC(6,2),               -- optional
  water           NUMERIC(7,2) NOT NULL DEFAULT 0,
  steps           INTEGER NOT NULL DEFAULT 0,
  workout_minutes INTEGER NOT NULL DEFAULT 0,
  notes           TEXT NOT NULL DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  id                SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- single-row settings table
  height_cm         NUMERIC(6,2) NOT NULL DEFAULT 175,
  goal_weight_kg     NUMERIC(6,2) NOT NULL DEFAULT 70,
  start_weight_kg    NUMERIC(6,2),
  protein_goal      NUMERIC(7,2) NOT NULL DEFAULT 150,
  calorie_goal      INTEGER NOT NULL DEFAULT 1500,
  carb_limit        NUMERIC(7,2) NOT NULL DEFAULT 50,
  fat_goal          NUMERIC(7,2) NOT NULL DEFAULT 70,
  theme             TEXT NOT NULL DEFAULT 'dark',
  units             TEXT NOT NULL DEFAULT 'metric'
);

INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_entries_date ON entries (date);
