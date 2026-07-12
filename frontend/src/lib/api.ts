import type { DailyEntry, Settings } from '@/types'

// Base URL of the backend API. In production this is baked in at build time
// via VITE_API_URL (see .env.example / docker-compose.yml). In dev it
// defaults to the local backend on port 4000.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const API_KEY = import.meta.env.VITE_API_KEY || ''

function headers(): HeadersInit {
  const h: HeadersInit = { 'Content-Type': 'application/json' }
  if (API_KEY) h['x-api-key'] = API_KEY
  return h
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`API error ${res.status}: ${body || res.statusText}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  async getEntries(): Promise<Record<string, DailyEntry>> {
    const res = await fetch(`${API_URL}/api/entries`, { headers: headers() })
    return handle(res)
  },

  async upsertEntry(entry: Omit<DailyEntry, 'createdAt' | 'updatedAt'>): Promise<DailyEntry> {
    const res = await fetch(`${API_URL}/api/entries/${entry.date}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(entry),
    })
    return handle(res)
  },

  async deleteEntry(date: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/entries/${date}`, {
      method: 'DELETE',
      headers: headers(),
    })
    return handle(res)
  },

  async getSettings(): Promise<Settings> {
    const res = await fetch(`${API_URL}/api/settings`, { headers: headers() })
    return handle(res)
  },

  async updateSettings(patch: Partial<Settings>): Promise<Settings> {
    const res = await fetch(`${API_URL}/api/settings`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify(patch),
    })
    return handle(res)
  },

  async health(): Promise<{ status: string; db: boolean }> {
    const res = await fetch(`${API_URL}/api/health`)
    return handle(res)
  },

  // Ready for future integrations (Strava, Google Fit, etc.) — see
  // backend/EXTENDING.md. Not wired to any UI yet beyond the placeholder
  // card in Settings.
  async getIntegrations(): Promise<Record<string, unknown>> {
    const res = await fetch(`${API_URL}/api/integrations`, { headers: headers() })
    return handle(res)
  },

  async updateIntegrations(patch: Record<string, unknown>): Promise<Record<string, unknown>> {
    const res = await fetch(`${API_URL}/api/integrations`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify(patch),
    })
    return handle(res)
  },
}
