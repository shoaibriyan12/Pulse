import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Moon, Sun, Check, Plug } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'
import GlassCard from '@/components/ui/GlassCard'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { ACCENT_PRESETS } from '@/lib/theme'
import type { ThemeMode, UnitSystem } from '@/types'

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings()
  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    updateSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <GlassCard glow="teal">
        <h2 className="mb-4 font-display text-sm font-semibold text-slate-100">Body & Goals</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Height"
            type="number"
            unit="cm"
            min={0}
            value={form.heightCm}
            onChange={(e) => set('heightCm', Number(e.target.value))}
          />
          <Input
            label="Goal Weight"
            type="number"
            unit="kg"
            min={0}
            value={form.goalWeightKg}
            onChange={(e) => set('goalWeightKg', Number(e.target.value))}
          />
          <Input
            label="Protein Goal"
            type="number"
            unit="g"
            min={0}
            value={form.proteinGoal}
            onChange={(e) => set('proteinGoal', Number(e.target.value))}
          />
          <Input
            label="Calorie Goal"
            type="number"
            unit="kcal"
            min={0}
            value={form.calorieGoal}
            onChange={(e) => set('calorieGoal', Number(e.target.value))}
          />
          <Input
            label="Carb Limit"
            type="number"
            unit="g"
            min={0}
            value={form.carbLimit}
            onChange={(e) => set('carbLimit', Number(e.target.value))}
          />
          <Input
            label="Fat Goal"
            type="number"
            unit="g"
            min={0}
            value={form.fatGoal}
            onChange={(e) => set('fatGoal', Number(e.target.value))}
          />
        </div>
      </GlassCard>

      <GlassCard glow="violet">
        <h2 className="mb-4 font-display text-sm font-semibold text-slate-100">Appearance & Units</h2>
        <div className="mb-4">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">Theme</span>
          <div className="flex gap-2">
            {(['dark', 'light'] as ThemeMode[]).map((t) => (
              <button
                key={t}
                onClick={() => set('theme', t)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                  form.theme === t
                    ? 'border-pulse-teal/40 bg-pulse-teal/10 text-pulse-teal'
                    : 'border-white/10 bg-white/[0.02] text-slate-400'
                }`}
              >
                {t === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
                {t === 'dark' ? 'Dark' : 'Light'}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">Accent Color</span>
          <div className="flex flex-wrap gap-2.5">
            {ACCENT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                title={preset.label}
                onClick={() => set('accentColor', preset.id)}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 transition-transform hover:scale-105"
                style={{
                  backgroundColor: preset.swatch,
                  borderColor: form.accentColor === preset.id ? preset.swatch : 'transparent',
                  boxShadow: form.accentColor === preset.id ? `0 0 0 2px rgba(255,255,255,0.15), 0 0 14px ${preset.swatch}99` : 'none',
                }}
              >
                {form.accentColor === preset.id && <Check size={16} className="text-base-950" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">Units</span>
          <div className="flex gap-2">
            {(['metric', 'imperial'] as UnitSystem[]).map((u) => (
              <button
                key={u}
                onClick={() => set('units', u)}
                className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium capitalize transition-colors ${
                  form.units === u
                    ? 'border-pulse-teal/40 bg-pulse-teal/10 text-pulse-teal'
                    : 'border-white/10 bg-white/[0.02] text-slate-400'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard glow="coral">
        <div className="mb-1 flex items-center gap-2">
          <Plug size={15} className="text-slate-400" />
          <h2 className="font-display text-sm font-semibold text-slate-100">Integrations</h2>
        </div>
        <p className="mb-4 text-xs text-slate-500">
          Connect other trackers to auto-fill your daily log. The backend already has an{' '}
          <code className="rounded bg-white/5 px-1 py-0.5">/api/integrations</code> endpoint ready for these — see{' '}
          <code className="rounded bg-white/5 px-1 py-0.5">backend/EXTENDING.md</code>.
        </p>
        <div className="space-y-2">
          {['Strava', 'Google Fit', 'Apple Health'].map((name) => (
            <div
              key={name}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2.5"
            >
              <span className="text-sm text-slate-300">{name}</span>
              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-slate-500">
                Coming soon
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      <Button className="w-full" onClick={handleSave}>
        Save Settings
      </Button>

      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-pulse-green/30 bg-base-800/95 px-4 py-2.5 text-sm text-pulse-green shadow-glass lg:bottom-10"
          >
            <CheckCircle2 size={16} />
            Settings Saved
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
