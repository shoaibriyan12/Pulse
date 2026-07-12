import { useCallback, useEffect, useState } from 'react'
import type { DailyEntry } from '@/types'
import { api } from '@/lib/api'

export interface SaveResult {
  ok: boolean
  overwritten: boolean
}

export function useEntries() {
  const [entries, setEntries] = useState<Record<string, DailyEntry>>({})
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .getEntries()
      .then((data) => {
        setEntries(data)
        setLoaded(true)
      })
      .catch((e) => {
        console.error('Failed to load entries from backend', e)
        setError('Could not reach the server. Changes will not be saved until it is back online.')
        setLoaded(true)
      })
  }, [])

  const upsertEntry = useCallback(
    (entry: Omit<DailyEntry, 'createdAt' | 'updatedAt'>, confirmOverwrite = true): SaveResult => {
      const existing = entries[entry.date]
      if (existing && confirmOverwrite) {
        return { ok: false, overwritten: false }
      }
      const now = new Date().toISOString()
      const next: DailyEntry = {
        ...entry,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      }
      setEntries((prev) => ({ ...prev, [entry.date]: next }))
      api.upsertEntry(entry).catch((e) => {
        console.error('Failed to save entry to backend', e)
        setError('Failed to save entry to the server. It is saved locally only for now.')
      })
      return { ok: true, overwritten: !!existing }
    },
    [entries]
  )

  const forceUpsert = useCallback(
    (entry: Omit<DailyEntry, 'createdAt' | 'updatedAt'>) => {
      const existing = entries[entry.date]
      const now = new Date().toISOString()
      const next: DailyEntry = {
        ...entry,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      }
      setEntries((prev) => ({ ...prev, [entry.date]: next }))
      api.upsertEntry(entry).catch((e) => {
        console.error('Failed to save entry to backend', e)
        setError('Failed to save entry to the server. It is saved locally only for now.')
      })
    },
    [entries]
  )

  const deleteEntry = useCallback((date: string) => {
    setEntries((prev) => {
      const next = { ...prev }
      delete next[date]
      return next
    })
    api.deleteEntry(date).catch((e) => {
      console.error('Failed to delete entry on backend', e)
      setError('Failed to delete entry on the server.')
    })
  }, [])

  const getEntry = useCallback((date: string) => entries[date], [entries])

  return { entries, loaded, error, upsertEntry, forceUpsert, deleteEntry, getEntry }
}
