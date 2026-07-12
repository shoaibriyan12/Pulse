import { useMemo, useState } from 'react'
import { Download, FileJson, FileSpreadsheet, FileText, Printer, Search, Trash2 } from 'lucide-react'
import { useEntries } from '@/hooks/useEntries'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { addDays, formatShort, todayStr } from '@/lib/date'
import { sortedEntries } from '@/lib/calculations'
import { exportCSV, exportExcel, exportJSON, printPDFReport } from '@/lib/export'
import type { FilterPreset } from '@/types'

const PRESETS: { key: FilterPreset; label: string }[] = [
  { key: 'all', label: 'All Time' },
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'last7', label: 'Last 7 Days' },
  { key: 'last30', label: 'Last 30 Days' },
  { key: 'july', label: 'July' },
  { key: 'august', label: 'August' },
  { key: 'custom', label: 'Custom Range' },
]

export default function HistoryPage() {
  const { entries, deleteEntry } = useEntries()
  const [query, setQuery] = useState('')
  const [preset, setPreset] = useState<FilterPreset>('all')
  const [customStart, setCustomStart] = useState(todayStr())
  const [customEnd, setCustomEnd] = useState(todayStr())

  const list = useMemo(() => sortedEntries(entries), [entries])

  const filtered = useMemo(() => {
    let rangeStart = '0000-01-01'
    let rangeEnd = '9999-12-31'
    const today = todayStr()
    switch (preset) {
      case 'today':
        rangeStart = rangeEnd = today
        break
      case 'yesterday':
        rangeStart = rangeEnd = addDays(today, -1)
        break
      case 'last7':
        rangeStart = addDays(today, -6)
        rangeEnd = today
        break
      case 'last30':
        rangeStart = addDays(today, -29)
        rangeEnd = today
        break
      case 'july':
        rangeStart = '2026-07-01'
        rangeEnd = '2026-07-31'
        break
      case 'august':
        rangeStart = '2026-08-01'
        rangeEnd = '2026-08-31'
        break
      case 'custom':
        rangeStart = customStart
        rangeEnd = customEnd
        break
      default:
        break
    }
    return list.filter((e) => {
      if (e.date < rangeStart || e.date > rangeEnd) return false
      if (!query.trim()) return true
      const q = query.trim().toLowerCase()
      return (
        e.date.includes(q) ||
        String(e.calories).includes(q) ||
        String(e.protein).includes(q) ||
        String(e.carbs).includes(q) ||
        String(e.fat).includes(q) ||
        (e.weight != null && String(e.weight).includes(q))
      )
    })
  }, [list, preset, customStart, customEnd, query])

  return (
    <div className="space-y-5">
      <GlassCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by date, calories, protein, carbs, fat, or weight…"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-3.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-pulse-teal/60"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => exportCSV(filtered)}>
              <FileText size={14} /> CSV
            </Button>
            <Button variant="secondary" onClick={() => exportExcel(filtered)}>
              <FileSpreadsheet size={14} /> Excel
            </Button>
            <Button variant="secondary" onClick={() => exportJSON(filtered)}>
              <FileJson size={14} /> JSON
            </Button>
            <Button variant="secondary" onClick={printPDFReport}>
              <Printer size={14} /> Print PDF
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPreset(p.key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                preset === p.key
                  ? 'border-pulse-teal/40 bg-pulse-teal/10 text-pulse-teal'
                  : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {preset === 'custom' && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:max-w-sm">
            <Input label="Start" type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} />
            <Input label="End" type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
          </div>
        )}
      </GlassCard>

      <GlassCard className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/8 text-[11px] uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Calories</th>
              <th className="px-4 py-3">Protein</th>
              <th className="px-4 py-3">Carbs</th>
              <th className="px-4 py-3">Fat</th>
              <th className="px-4 py-3">Weight</th>
              <th className="px-4 py-3">Steps</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  No entries match your search or filter.
                </td>
              </tr>
            )}
            {filtered
              .slice()
              .reverse()
              .map((e) => (
                <tr key={e.date} className="border-b border-white/5 font-mono text-slate-300 last:border-0">
                  <td className="px-4 py-2.5 font-body text-slate-200">{formatShort(e.date)}</td>
                  <td className="px-4 py-2.5">{e.calories}</td>
                  <td className="px-4 py-2.5">{e.protein}</td>
                  <td className="px-4 py-2.5">{e.carbs}</td>
                  <td className="px-4 py-2.5">{e.fat}</td>
                  <td className="px-4 py-2.5">{e.weight ?? '—'}</td>
                  <td className="px-4 py-2.5">{e.steps}</td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => deleteEntry(e.date)}
                      aria-label="Delete entry"
                      className="text-slate-500 hover:text-pulse-red"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </GlassCard>

      <p className="flex items-center gap-1.5 text-xs text-slate-500">
        <Download size={12} /> Exports include the {filtered.length} entr{filtered.length === 1 ? 'y' : 'ies'} currently filtered.
      </p>
    </div>
  )
}
