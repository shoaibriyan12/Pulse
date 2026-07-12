import type { DailyEntry, Settings } from '@/types'
import { daysInMonth, firstWeekdayOfMonth, todayStr, toDateStr } from '@/lib/date'
import DayCell from './DayCell'

interface MonthCalendarProps {
  year: number
  month: number // 0-indexed
  entries: Record<string, DailyEntry>
  settings: Settings
  onDayClick: (dateStr: string) => void
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function MonthCalendar({ year, month, entries, settings, onDayClick }: MonthCalendarProps) {
  const total = daysInMonth(year, month)
  const startOffset = firstWeekdayOfMonth(year, month)
  const today = todayStr()
  const cells: (number | null)[] = [...Array(startOffset).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)]

  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-[11px] font-medium uppercase tracking-wider text-slate-500">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`blank-${idx}`} />
          const dateStr = toDateStr(new Date(year, month, day))
          return (
            <DayCell
              key={dateStr}
              day={day}
              dateStr={dateStr}
              entry={entries[dateStr]}
              isToday={dateStr === today}
              settings={settings}
              onClick={() => onDayClick(dateStr)}
            />
          )
        })}
      </div>
    </div>
  )
}
