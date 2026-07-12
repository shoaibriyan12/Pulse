import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import type { DailyEntry } from '@/types'
import { todayStr, formatLong } from '@/lib/date'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import GlassCard from '@/components/ui/GlassCard'
import { useEntries } from '@/hooks/useEntries'

type FormState = {
  date: string
  calories: string
  protein: string
  carbs: string
  fat: string
  weight: string
  water: string
  steps: string
  workoutMinutes: string
  notes: string
}

const emptyForm = (): FormState => ({
  date: todayStr(),
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
  weight: '',
  water: '',
  steps: '',
  workoutMinutes: '',
  notes: '',
})

const NUMERIC_FIELDS: (keyof FormState)[] = ['calories', 'protein', 'carbs', 'fat', 'weight', 'water', 'steps', 'workoutMinutes']

export default function DailyEntryPage() {
  const { entries, forceUpsert, getEntry } = useEntries()
  const [form, setForm] = useState<FormState>(() => hydrate(emptyForm(), getEntry(emptyForm().date)))
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [savedToast, setSavedToast] = useState(false)
  const [confirmOverwrite, setConfirmOverwrite] = useState(false)

  function hydrate(base: FormState, existing?: DailyEntry): FormState {
    if (!existing) return base
    return {
      date: existing.date,
      calories: String(existing.calories ?? ''),
      protein: String(existing.protein ?? ''),
      carbs: String(existing.carbs ?? ''),
      fat: String(existing.fat ?? ''),
      weight: existing.weight != null ? String(existing.weight) : '',
      water: String(existing.water ?? ''),
      steps: String(existing.steps ?? ''),
      workoutMinutes: String(existing.workoutMinutes ?? ''),
      notes: existing.notes ?? '',
    }
  }

  function onDateChange(date: string) {
    const existing = getEntry(date)
    setForm(existing ? hydrate(emptyForm(), existing) : { ...emptyForm(), date })
    setErrors({})
  }

  function updateField(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    for (const field of NUMERIC_FIELDS) {
      const raw = form[field]
      if (raw === '') continue
      const num = Number(raw)
      if (Number.isNaN(num)) {
        next[field] = 'Enter a valid number'
      } else if (num < 0) {
        next[field] = 'Negative values are not allowed'
      }
    }
    if (!form.date) next.date = 'Date is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function buildEntry(): Omit<DailyEntry, 'createdAt' | 'updatedAt'> {
    return {
      date: form.date,
      calories: Number(form.calories) || 0,
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
      weight: form.weight === '' ? undefined : Number(form.weight),
      water: Number(form.water) || 0,
      steps: Number(form.steps) || 0,
      workoutMinutes: Number(form.workoutMinutes) || 0,
      notes: form.notes.trim(),
    }
  }

  function handleSave() {
    if (!validate()) return
    const existing = entries[form.date]
    if (existing) {
      setConfirmOverwrite(true)
      return
    }
    commitSave()
  }

  function commitSave() {
    forceUpsert(buildEntry())
    setConfirmOverwrite(false)
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 2200)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <GlassCard glow="teal">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-100">Today's Log</h2>
            <p className="text-xs text-slate-500">{formatLong(form.date)}</p>
          </div>
          {entries[form.date] && (
            <span className="rounded-full border border-pulse-green/30 bg-pulse-green/10 px-2.5 py-1 text-[11px] font-medium text-pulse-green">
              Entry exists
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Date"
            type="date"
            value={form.date}
            max={todayStr()}
            onChange={(e) => onDateChange(e.target.value)}
            error={errors.date}
          />
          <Input
            label="Calories"
            type="number"
            unit="kcal"
            placeholder="0"
            min={0}
            value={form.calories}
            onChange={(e) => updateField('calories', e.target.value)}
            error={errors.calories}
          />
          <Input
            label="Protein"
            type="number"
            unit="g"
            placeholder="0"
            min={0}
            value={form.protein}
            onChange={(e) => updateField('protein', e.target.value)}
            error={errors.protein}
          />
          <Input
            label="Carbs"
            type="number"
            unit="g"
            placeholder="0"
            min={0}
            value={form.carbs}
            onChange={(e) => updateField('carbs', e.target.value)}
            error={errors.carbs}
          />
          <Input
            label="Fat"
            type="number"
            unit="g"
            placeholder="0"
            min={0}
            value={form.fat}
            onChange={(e) => updateField('fat', e.target.value)}
            error={errors.fat}
          />
          <Input
            label="Weight (optional)"
            type="number"
            unit="kg"
            placeholder="—"
            min={0}
            step="0.1"
            value={form.weight}
            onChange={(e) => updateField('weight', e.target.value)}
            error={errors.weight}
          />
          <Input
            label="Water Intake"
            type="number"
            unit="L"
            placeholder="0"
            min={0}
            step="0.1"
            value={form.water}
            onChange={(e) => updateField('water', e.target.value)}
            error={errors.water}
          />
          <Input
            label="Steps"
            type="number"
            unit="steps"
            placeholder="0"
            min={0}
            value={form.steps}
            onChange={(e) => updateField('steps', e.target.value)}
            error={errors.steps}
          />
          <Input
            label="Workout Duration"
            type="number"
            unit="min"
            placeholder="0"
            min={0}
            value={form.workoutMinutes}
            onChange={(e) => updateField('workoutMinutes', e.target.value)}
            error={errors.workoutMinutes}
          />
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">Notes</span>
          <textarea
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            rows={3}
            placeholder="How did today feel?"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-pulse-teal/60"
          />
        </label>

        <Button className="mt-6 w-full" onClick={handleSave}>
          Save Entry
        </Button>
      </GlassCard>

      <AnimatePresence>
        {confirmOverwrite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-panel w-full max-w-sm p-6"
            >
              <div className="mb-3 flex items-center gap-2 text-pulse-amber">
                <AlertTriangle size={20} />
                <h3 className="font-display text-base font-semibold">Overwrite entry?</h3>
              </div>
              <p className="mb-5 text-sm text-slate-400">
                An entry already exists for {formatLong(form.date)}. Saving will replace it.
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setConfirmOverwrite(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={commitSave}>
                  Overwrite
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {savedToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-pulse-green/30 bg-base-800/95 px-4 py-2.5 text-sm text-pulse-green shadow-glass lg:bottom-10"
          >
            <CheckCircle2 size={16} />
            Data Saved Successfully
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
