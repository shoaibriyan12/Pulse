import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { X, Pencil, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { useEntries } from '@/hooks/useEntries'
import { useSettings } from '@/hooks/useSettings'
import MonthCalendar from '@/components/calendar/MonthCalendar'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'
import { formatLong, monthLabel } from '@/lib/date'
import { downloadMonthlyReport } from '@/lib/export'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function CalendarPage() {
  const { entries } = useEntries()
  const { settings } = useSettings()
  const navigate = useNavigate()

  // All 12 months of the current year — future years will pick this up
  // automatically since it's derived from the system clock, not hardcoded.
  const year = new Date().getFullYear()
  const months = useMemo(
    () => MONTH_NAMES.map((label, month) => ({ label, year, month })),
    [year]
  )

  const [activeMonth, setActiveMonth] = useState(new Date().getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const current = months[activeMonth]
  const entry = selectedDate ? entries[selectedDate] : undefined

  function goTo(delta: number) {
    setActiveMonth((m) => Math.min(11, Math.max(0, m + delta)))
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => goTo(-1)}
            disabled={activeMonth === 0}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-2 text-slate-400 transition-colors hover:text-slate-200 disabled:opacity-30"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>

          <select
            value={activeMonth}
            onChange={(e) => setActiveMonth(Number(e.target.value))}
            className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm font-medium text-slate-200 outline-none focus:border-pulse-teal/40"
          >
            {months.map((m, idx) => (
              <option key={m.label} value={idx} className="bg-base-800">
                {monthLabel(m.year, m.month)}
              </option>
            ))}
          </select>

          <button
            onClick={() => goTo(1)}
            disabled={activeMonth === 11}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-2 text-slate-400 transition-colors hover:text-slate-200 disabled:opacity-30"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <Button
          variant="secondary"
          onClick={() => downloadMonthlyReport(entries, settings, current.year, current.month)}
        >
          <Download size={14} /> Download Month Report
        </Button>
      </div>

      <GlassCard glow="teal">
        <MonthCalendar
          year={current.year}
          month={current.month}
          entries={entries}
          settings={settings}
          onDayClick={setSelectedDate}
        />
      </GlassCard>

      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-pulse-green/60 bg-pulse-green/20" /> Completed day
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full ring-2 ring-pulse-blue" /> Today
        </span>
      </div>

      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
            onClick={() => setSelectedDate(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel w-full max-w-sm p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-slate-100">{formatLong(selectedDate)}</h3>
                <button onClick={() => setSelectedDate(null)} className="text-slate-500 hover:text-slate-200">
                  <X size={18} />
                </button>
              </div>
              {entry ? (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Metric label="Calories" value={`${entry.calories} kcal`} />
                  <Metric label="Protein" value={`${entry.protein} g`} />
                  <Metric label="Carbs" value={`${entry.carbs} g`} />
                  <Metric label="Fat" value={`${entry.fat} g`} />
                  <Metric label="Weight" value={entry.weight != null ? `${entry.weight} kg` : '—'} />
                  <Metric label="Water" value={`${entry.water} L`} />
                  <Metric label="Steps" value={`${entry.steps}`} />
                  <Metric label="Workout" value={`${entry.workoutMinutes} min`} />
                  {entry.notes && (
                    <p className="col-span-2 mt-1 rounded-lg bg-white/[0.03] p-2.5 text-xs text-slate-400">{entry.notes}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No entry logged for this day.</p>
              )}
              <Button className="mt-5 w-full" onClick={() => navigate('/')}>
                <Pencil size={14} /> {entry ? 'Edit Entry' : 'Add Entry'}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="font-mono text-slate-200">{value}</p>
    </div>
  )
}
