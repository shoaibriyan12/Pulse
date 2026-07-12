import { useCallback, useEffect, useState } from 'react'
import type { Settings } from '@/types'
import { DEFAULT_SETTINGS } from '@/types'
import { api } from '@/lib/api'

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .getSettings()
      .then((data) => {
        setSettings({ ...DEFAULT_SETTINGS, ...data })
        setLoaded(true)
      })
      .catch((e) => {
        console.error('Failed to load settings from backend', e)
        setError('Could not reach the server. Using default settings.')
        setLoaded(true)
      })
  }, [])

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
    api.updateSettings(patch).catch((e) => {
      console.error('Failed to save settings to backend', e)
      setError('Failed to save settings to the server.')
    })
  }, [])

  return { settings, updateSettings, loaded, error }
}
