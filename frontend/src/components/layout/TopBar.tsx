import { Moon, Sun } from 'lucide-react'
import type { ThemeMode } from '@/types'

interface TopBarProps {
  title: string
  subtitle?: string
  theme: ThemeMode
  onToggleTheme: () => void
}

export default function TopBar({ title, subtitle, theme, onToggleTheme }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/8 bg-base-900/70 px-5 py-4 backdrop-blur-xl lg:px-8 print:hidden">
      <div>
        <h1 className="font-display text-xl font-semibold text-slate-100">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <button
        onClick={onToggleTheme}
        aria-label="Toggle theme"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:text-pulse-teal"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </header>
  )
}
