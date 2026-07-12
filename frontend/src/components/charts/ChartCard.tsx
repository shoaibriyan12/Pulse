import type { ReactNode } from 'react'
import GlassCard from '@/components/ui/GlassCard'

interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
  delay?: number
  className?: string
  action?: ReactNode
}

export default function ChartCard({ title, description, children, delay = 0, className = '', action }: ChartCardProps) {
  return (
    <GlassCard delay={delay} className={`col-span-1 ${className}`}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-sm font-semibold text-slate-100">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </GlassCard>
  )
}
