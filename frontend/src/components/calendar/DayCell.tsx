import type { DailyEntry, Settings } from '@/types'
import { calorieColor, carbColor, colorClass, proteinColor } from '@/lib/calculations'

interface DayCellProps {
  day: number
  dateStr: string
  entry?: DailyEntry
  isToday: boolean
  settings: Settings
  onClick: () => void
}

export default function DayCell({ day, entry, isToday, settings, onClick }: DayCellProps) {
  const hasData = !!entry
  return (
    <button
      onClick={onClick}
      className={`group relative flex h-24 flex-col rounded-xl border p-2 text-left transition-all duration-200 sm:h-28 ${
        hasData ? 'border-pulse-green/40 bg-pulse-green/[0.04]' : 'border-white/8 bg-white/[0.02]'
      } ${isToday ? 'ring-2 ring-pulse-blue shadow-[0_0_16px_rgba(56,189,248,0.45)]' : ''} hover:border-pulse-teal/50 hover:bg-white/[0.06]`}
    >
      <span className={`text-xs font-medium ${isToday ? 'text-pulse-blue' : 'text-slate-400'}`}>{day}</span>
      {hasData && entry && (
        <div className="mt-1 flex flex-col gap-0.5 text-[10px] leading-tight">
          <span className={`font-mono ${colorClass[calorieColor(entry.calories, settings.calorieGoal)]}`}>
            {entry.calories} kcal
          </span>
          <span className={`font-mono ${colorClass[proteinColor(entry.protein, settings.proteinGoal)]}`}>
            {entry.protein}g P
          </span>
          <span className={`font-mono ${colorClass[carbColor(entry.carbs, settings.carbLimit)]}`}>
            {entry.carbs}g C
          </span>
          <span className="font-mono text-slate-500">{entry.fat}g F</span>
          {typeof entry.weight === 'number' && (
            <span className="font-mono text-slate-400">{entry.weight}kg</span>
          )}
        </div>
      )}
      {!hasData && <span className="mt-2 text-[10px] text-slate-600">No entry</span>}
    </button>
  )
}
