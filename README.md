# Pulse — Fitness Analytics

Full-stack version of Pulse: React frontend + Node/Express backend, backed by
PostgreSQL hosted on your own VM. Frontend and backend each ship as their own
Docker image; the database is **not** containerized here since it already
lives on your VM.

```
pulse-fitness/
├── frontend/          React 19 + TypeScript + Tailwind (Vite, served by nginx)
├── backend/           Express + TypeScript API (talks to Postgres over the network)
├── docker-compose.yml Builds & runs the frontend + backend images together
└── .env.example       Build-time vars for docker-compose (VITE_API_URL etc.)
```

## 1. Provision the database on your VM

SSH into the VM and install Postgres if it isn't already there:

```bash
sudo apt update && sudo apt install -y postgresql
sudo -u postgres psql -c "CREATE USER pulse_user WITH PASSWORD 'change_me';"
sudo -u postgres psql -c "CREATE DATABASE pulse_fitness OWNER pulse_user;"
```

Allow remote connections (only if the backend runs on a *different* host than
the DB — skip this if backend and DB share the VM):

- In `postgresql.conf`, set `listen_addresses = '*'`
- In `pg_hba.conf`, add a line allowing your backend's IP, e.g.
  `host pulse_fitness pulse_user <backend_ip>/32 md5`
- `sudo systemctl restart postgresql`
- Open port 5432 in the VM's firewall/security group to that IP only.

Then apply the schema. From the `backend/` folder on any machine that can
reach the VM (or on the VM itself):

```bash
cd backend
cp .env.example .env        # edit DATABASE_URL to point at the VM
npm install
npm run build
npm run migrate             # runs migrations/*.sql in order (idempotent — safe to re-run)
```

## 2. Configure environment variables

**backend/.env** (copy from `backend/.env.example`):

```
DATABASE_URL=postgres://pulse_user:change_me@VM_IP_OR_HOSTNAME:5432/pulse_fitness
DATABASE_SSL=false
CORS_ORIGIN=*
API_KEY=            # set this before exposing the API publicly
```

**Root .env** (copy from `.env.example`, used only at frontend build time):

```
VITE_API_URL=http://YOUR_SERVER_IP:4000
VITE_API_KEY=
```

`VITE_API_URL` must be reachable from the *browser*, not just from inside
Docker — so use the server's public/LAN IP or domain, not `backend` or
`localhost`, unless you're testing on the same machine.

## 3. Build and run with Docker

```bash
docker compose build
docker compose up -d
```

This produces two images, `pulse-backend:latest` and `pulse-frontend:latest`,
and runs them as containers:

- Backend on `http://<host>:4000` (health check at `/api/health`)
- Frontend on `http://<host>:8080`

Check logs / status:

```bash
docker compose logs -f
docker compose ps
```

## 4. Local development (without Docker)

```bash
# Terminal 1 — backend
cd backend
cp .env.example .env   # point DATABASE_URL at your VM's Postgres
npm install
npm run dev             # http://localhost:4000

# Terminal 2 — frontend
cd frontend
cp .env.example .env    # VITE_API_URL=http://localhost:4000
npm install
npm run dev              # http://localhost:5173
```

## API overview

| Method | Path                  | Description                          |
|--------|-----------------------|---------------------------------------|
| GET    | /api/health            | Liveness + DB connectivity check     |
| GET    | /api/entries            | All daily entries, keyed by date     |
| GET    | /api/entries/:date       | Single entry                         |
| PUT    | /api/entries/:date       | Create/update an entry (upsert)      |
| DELETE | /api/entries/:date       | Delete an entry                      |
| GET    | /api/settings            | Current settings                     |
| PATCH  | /api/settings            | Partial update to settings           |
| GET    | /api/integrations        | Third-party integration config (stub, for future use) |
| PATCH  | /api/integrations        | Merge-update integration config      |

If `API_KEY` is set on the backend, all `/api/*` routes (except `/api/health`)
require an `x-api-key` header matching it.

## What's new

- **Full-year calendar** — the Calendar page now covers all 12 months of the
  current year (auto-detected, so it carries into next year on its own),
  with a dropdown + prev/next navigation instead of a fixed month list.
- **Accent color themes** — pick from 6 accent presets (Teal, Violet, Coral,
  Sky, Rose, Emerald) in Settings → Appearance, on top of the existing
  Dark/Light mode. Stored per-user in `settings.accent_color`.
- **Downloadable reports** — "Download Month Report" on the Calendar page
  and "Download Full Report" on the Statistics page generate a clean,
  print-ready report (opens a new tab and triggers your browser's
  Save-as-PDF print dialog).
- **Room for integrations** — a `/api/integrations` endpoint and
  `settings.integrations` JSONB column are ready for connecting Strava,
  Google Fit, Apple Health, etc. later, plus a placeholder card in Settings.
  See `backend/EXTENDING.md` for the pattern to follow.

## Notes

- The frontend no longer uses Local Storage as its source of truth — it reads
  and writes through the backend API on every change, with an optimistic UI
  update so it still feels instant.
- The `settings` table is single-row (id=1) since this is a single-user app.
  If you want multi-user support later, that's the natural place to add a
  `user_id` and auth.
- Put the backend behind HTTPS (e.g. Caddy/nginx + Let's Encrypt, or a load
  balancer) before exposing it to the internet, and set `API_KEY`.
