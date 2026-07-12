import { useEffect } from 'react'
import type { AccentColor, ThemeMode } from '@/types'

export function useTheme(theme: ThemeMode, accentColor: AccentColor = 'teal') {
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.dataset.accent = accentColor
  }, [accentColor])
}
