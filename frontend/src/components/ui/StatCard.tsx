import type { ReactNode } from 'react'
import GlassCard from './GlassCard'

interface StatCardProps {
  label: string
  value: ReactNode
  unit?: string
  accent?: 'teal' | 'violet' | 'coral' | 'amber' | 'green' | 'red' | 'blue'
  icon?: ReactNode
  sub?: ReactNode
  delay?: number
}

const accentText: Record<string, string> = {
  teal: 'text-pulse-teal',
  violet: 'text-pulse-violet',
  coral: 'text-pulse-coral',
  amber: 'text-pulse-amber',
  green: 'text-pulse-green',
  red: 'text-pulse-red',
  blue: 'text-pulse-blue',
}

export default function StatCard({ label, value, unit, accent = 'teal', icon, sub, delay = 0 }: StatCardProps) {
  return (
    <GlassCard delay={delay} glow={accent === 'violet' ? 'violet' : accent === 'coral' ? 'coral' : 'teal'}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
        {icon && <div className={`${accentText[accent]} opacity-80`}>{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className={`stat-figure text-2xl font-semibold ${accentText[accent]}`}>{value}</span>
        {unit && <span className="text-xs text-slate-500">{unit}</span>}
      </div>
      {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
    </GlassCard>
  )
}
