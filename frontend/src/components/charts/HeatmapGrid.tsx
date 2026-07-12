import { useState } from 'react'
import type { DailyEntry } from '@/types'
import { formatShort } from '@/lib/date'

interface HeatmapGridProps {
  entries: DailyEntry[]
  metric: 'calories' | 'protein' | 'carbs' | 'fat'
}

function intensity(value: number, max: number): number {
  if (max === 0) return 0
  return Math.min(1, value / max)
}

export default function HeatmapGrid({ entries, metric }: HeatmapGridProps) {
  const [hover, setHover] = useState<DailyEntry | null>(null)
  if (entries.length === 0) {
    return <div className="flex h-24 items-center justify-center text-sm text-slate-500">No data yet.</div>
  }
  const max = Math.max(...entries.map((e) => e[metric]), 1)

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-10 md:grid-cols-14">
        {entries.map((e) => {
          const t = intensity(e[metric], max)
          const bg = `rgba(45, 212, 191, ${0.08 + t * 0.85})`
          return (
            <div
              key={e.date}
              onMouseEnter={() => setHover(e)}
              onMouseLeave={() => setHover(null)}
              className="aspect-square rounded-md border border-white/5 transition-transform hover:scale-110"
              style={{ background: bg }}
              title={`${formatShort(e.date)}: ${e[metric]}`}
            />
          )
        })}
      </div>
      <div className="mt-3 flex h-8 items-center text-xs text-slate-400">
        {hover ? (
          <span className="font-mono">
            {formatShort(hover.date)} — {hover[metric]} {metric === 'calories' ? 'kcal' : 'g'}
          </span>
        ) : (
          <span className="text-slate-500">Hover a cell to see the value</span>
        )}
      </div>
    </div>
  )
}
