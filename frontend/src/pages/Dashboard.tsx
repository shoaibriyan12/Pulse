import { Flame, Droplet, Beef, Wheat, TrendingDown, Award, Zap, Target } from 'lucide-react'
import { useEntries } from '@/hooks/useEntries'
import { useSettings } from '@/hooks/useSettings'
import StatCard from '@/components/ui/StatCard'
import GlassCard from '@/components/ui/GlassCard'
import ProgressRing from '@/components/ui/ProgressRing'
import MacroPieChart from '@/components/charts/MacroPieChart'
import {
  average,
  computeStreaks,
  extremeDay,
  macroCalorieSplit,
  round,
  sortedEntries,
  weightGoalProgress,
} from '@/lib/calculations'
import { formatShort, todayStr } from '@/lib/date'

export default function DashboardPage() {
  const { entries } = useEntries()
  const { settings } = useSettings()
  const list = sortedEntries(entries)
  const today = entries[todayStr()]
  const withWeight = list.filter((e) => typeof e.weight === 'number')
  const startWeight = settings.startWeightKg ?? withWeight[0]?.weight ?? null
  const currentWeight = withWeight.length ? withWeight[withWeight.length - 1].weight ?? null : null
  const weightLost = startWeight != null && currentWeight != null ? round(startWeight - currentWeight, 1) : null
  const { current, longest } = computeStreaks(list)
  const bestProtein = extremeDay(list, 'protein', 'max')
  const lowestCalorie = extremeDay(list, 'calories', 'min')
  const goalProgress = weightGoalProgress(startWeight, currentWeight, settings.goalWeightKg)
  const macros = macroCalorieSplit(
    average(list.map((e) => e.protein)),
    average(list.map((e) => e.carbs)),
    average(list.map((e) => e.fat))
  )

  if (list.length === 0) {
    return (
      <div className="mx-auto max-w-lg pt-16 text-center">
        <p className="font-display text-lg text-slate-300">No entries yet</p>
        <p className="mt-2 text-sm text-slate-500">
          Log your first day to see your dashboard come to life with stats, streaks, and trends.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <GlassCard glow="teal" className="flex flex-col items-center justify-center lg:col-span-1">
          <ProgressRing
            progress={goalProgress}
            label={`${goalProgress}%`}
            sublabel="Goal Progress"
            color="#2dd4bf"
            size={140}
          />
          <p className="mt-3 text-center text-xs text-slate-500">
            {currentWeight ?? '—'} kg → {settings.goalWeightKg} kg goal
          </p>
        </GlassCard>

        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          <StatCard label="Current Weight" value={currentWeight ?? '—'} unit="kg" accent="teal" />
          <StatCard label="Starting Weight" value={startWeight ?? '—'} unit="kg" accent="violet" />
          <StatCard
            label="Weight Lost"
            value={weightLost ?? '—'}
            unit="kg"
            accent={weightLost != null && weightLost > 0 ? 'green' : 'coral'}
            icon={<TrendingDown size={16} />}
          />
          <StatCard label="Current Streak" value={current} unit="days" accent="amber" icon={<Zap size={16} />} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Today's Calories" value={today?.calories ?? '—'} unit="kcal" accent="coral" icon={<Flame size={16} />} delay={0.02} />
        <StatCard label="Today's Protein" value={today?.protein ?? '—'} unit="g" accent="violet" icon={<Beef size={16} />} delay={0.04} />
        <StatCard label="Today's Carbs" value={today?.carbs ?? '—'} unit="g" accent="teal" icon={<Wheat size={16} />} delay={0.06} />
        <StatCard label="Today's Fat" value={today?.fat ?? '—'} unit="g" accent="amber" icon={<Droplet size={16} />} delay={0.08} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Average Calories" value={round(average(list.map((e) => e.calories)))} unit="kcal" accent="coral" delay={0.1} />
        <StatCard label="Average Protein" value={round(average(list.map((e) => e.protein)))} unit="g" accent="violet" delay={0.12} />
        <StatCard label="Average Carbs" value={round(average(list.map((e) => e.carbs)))} unit="g" accent="teal" delay={0.14} />
        <StatCard label="Average Fat" value={round(average(list.map((e) => e.fat)))} unit="g" accent="amber" delay={0.16} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <GlassCard glow="violet" delay={0.18}>
          <h3 className="mb-3 font-display text-sm font-semibold text-slate-100">Macronutrient Split</h3>
          <MacroPieChart protein={macros.protein} carbs={macros.carbs} fat={macros.fat} height={200} />
        </GlassCard>

        <StatCard
          label="Best Protein Day"
          value={bestProtein ? `${bestProtein.protein}g` : '—'}
          sub={bestProtein ? formatShort(bestProtein.date) : undefined}
          accent="violet"
          icon={<Award size={16} />}
          delay={0.2}
        />
        <StatCard
          label="Lowest Calorie Day"
          value={lowestCalorie ? `${lowestCalorie.calories} kcal` : '—'}
          sub={lowestCalorie ? formatShort(lowestCalorie.date) : undefined}
          accent="green"
          icon={<Target size={16} />}
          delay={0.22}
        />
      </div>

      <StatCard label="Longest Streak" value={longest} unit="days" accent="blue" icon={<Award size={16} />} delay={0.24} />
    </div>
  )
}
