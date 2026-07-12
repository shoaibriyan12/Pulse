import type { AccentColor } from '@/types'

export interface AccentPreset {
  id: AccentColor
  label: string
  swatch: string // representative hex for the swatch UI (matches --accent)
}

// Keep in sync with the html[data-accent="..."] blocks in index.css.
export const ACCENT_PRESETS: AccentPreset[] = [
  { id: 'teal', label: 'Teal', swatch: '#2dd4bf' },
  { id: 'violet', label: 'Violet', swatch: '#8b5cf6' },
  { id: 'coral', label: 'Coral', swatch: '#ff6b5b' },
  { id: 'blue', label: 'Sky', swatch: '#38bdf8' },
  { id: 'rose', label: 'Rose', swatch: '#f43f5e' },
  { id: 'emerald', label: 'Emerald', swatch: '#34d399' },
]
