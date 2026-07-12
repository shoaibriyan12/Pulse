import { useMemo, type ReactNode } from 'react'
import { useEntries } from '@/hooks/useEntries'
import { useSettings } from '@/hooks/useSettings'
import ChartCard from '@/components/charts/ChartCard'
import TrendLineChart, { type TrendPoint } from '@/components/charts/TrendLineChart'
import MacroPieChart from '@/components/charts/MacroPieChart'
import ScatterCard from '@/components/charts/ScatterCard'
import RadarCard from '@/components/charts/RadarCard'
import BarComparisonChart from '@/components/charts/BarComparisonChart'
import HeatmapGrid from '@/components/charts/HeatmapGrid'
import {
  average,
  estimateDeficit,
  macroCalorieSplit,
  monthlyAggregate,
  movingAverage,
  round,
  sortedEntries,
  weeklyAggregate,
} from '@/lib/calculations'
import { formatShort } from '@/lib/date'

function toTrend(list: { date: string }[], key: string): TrendPoint[] {
  return list.map((e: any) => ({ label: formatShort(e.date), value: e[key] ?? 0 }))
}

export default function AnalyticsPage() {
  const { entries } = useEntries()
  const { settings } = useSettings()
  const list = useMemo(() => sortedEntries(entries), [entries])
  const weekly = useMemo(() => weeklyAggregate(list), [list])
  const monthly = useMemo(() => monthlyAggregate(list), [list])
  const weightSeries = list.filter((e) => typeof e.weight === 'number')

  const macros = macroCalorieSplit(
    average(list.map((e) => e.protein)),
    average(list.map((e) => e.carbs)),
    average(list.map((e) => e.fat))
  )

  const deficitSeries: TrendPoint[] = list.map((e) => ({
    label: formatShort(e.date),
    value: estimateDeficit(e.calories, settings.calorieGoal, e.workoutMinutes),
  }))

  const goalHitSeries: TrendPoint[] = weekly.map((w) => ({
    label: w.label,
    value: round((w.calories <= settings.calorieGoal ? 1 : 0) * 100),
  }))

  const radarData = [
    { metric: 'Calories', actual: clampGoalPct(average(last7(list).map((e) => e.calories)), settings.calorieGoal, true), goal: 100 },
    { metric: 'Protein', actual: clampGoalPct(average(last7(list).map((e) => e.protein)), settings.proteinGoal, false), goal: 100 },
    { metric: 'Carbs', actual: clampGoalPct(average(last7(list).map((e) => e.carbs)), settings.carbLimit, true), goal: 100 },
    { metric: 'Fat', actual: clampGoalPct(average(last7(list).map((e) => e.fat)), settings.fatGoal, false), goal: 100 },
    { metric: 'Water', actual: clampGoalPct(average(last7(list).map((e) => e.water)), 3, false), goal: 100 },
    { metric: 'Steps', actual: clampGoalPct(average(last7(list).map((e) => e.steps)), 8000, false), goal: 100 },
  ]

  if (list.length === 0) {
    return (
      <div className="mx-auto max-w-lg pt-16 text-center">
        <p className="font-display text-lg text-slate-300">Nothing to chart yet</p>
        <p className="mt-2 text-sm text-slate-500">Log a few days on the entry page and your graphs will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Section title="Daily Trends">
        <ChartCard title="Weight Progress" description="Line chart · full history">
          <TrendLineChart data={toTrend(weightSeries, 'weight')} color="#38bdf8" unit="kg" zoomable />
        </ChartCard>
        <ChartCard title="Daily Calories" description="Line chart with goal reference">
          <TrendLineChart data={toTrend(list, 'calories')} color="#ff6b5b" unit="kcal" goal={settings.calorieGoal} zoomable />
        </ChartCard>
        <ChartCard title="Daily Protein" description="Line chart with goal reference">
          <TrendLineChart data={toTrend(list, 'protein')} color="#8b5cf6" unit="g" goal={settings.proteinGoal} zoomable />
        </ChartCard>
        <ChartCard title="Daily Carbs" description="Line chart with limit reference">
          <TrendLineChart data={toTrend(list, 'carbs')} color="#2dd4bf" unit="g" goal={settings.carbLimit} goalLabel="Limit" zoomable />
        </ChartCard>
        <ChartCard title="Daily Fat" description="Line chart">
          <TrendLineChart data={toTrend(list, 'fat')} color="#fbbf24" unit="g" zoomable />
        </ChartCard>
      </Section>

      <Section title="Weekly Averages">
        <ChartCard title="Weekly Avg Calories">
          <TrendLineChart data={weekly.map((w) => ({ label: w.label, value: w.calories }))} color="#ff6b5b" unit="kcal" type="line" />
        </ChartCard>
        <ChartCard title="Weekly Avg Protein">
          <TrendLineChart data={weekly.map((w) => ({ label: w.label, value: w.protein }))} color="#8b5cf6" unit="g" type="line" />
        </ChartCard>
        <ChartCard title="Weekly Avg Carbs">
          <TrendLineChart data={weekly.map((w) => ({ label: w.label, value: w.carbs }))} color="#2dd4bf" unit="g" type="line" />
        </ChartCard>
        <ChartCard title="Weekly Avg Fat">
          <TrendLineChart data={weekly.map((w) => ({ label: w.label, value: w.fat }))} color="#fbbf24" unit="g" type="line" />
        </ChartCard>
      </Section>

      <Section title="Monthly Comparisons">
        <ChartCard title="Monthly Calories Comparison">
          <BarComparisonChart data={monthly.map((m) => ({ label: m.label, value: m.calories }))} color="#ff6b5b" unit="kcal" />
        </ChartCard>
        <ChartCard title="Monthly Protein Comparison">
          <BarComparisonChart data={monthly.map((m) => ({ label: m.label, value: m.protein }))} color="#8b5cf6" unit="g" />
        </ChartCard>
        <ChartCard title="Monthly Carbs Comparison">
          <BarComparisonChart data={monthly.map((m) => ({ label: m.label, value: m.carbs }))} color="#2dd4bf" unit="g" />
        </ChartCard>
        <ChartCard title="Monthly Fat Comparison">
          <BarComparisonChart data={monthly.map((m) => ({ label: m.label, value: m.fat }))} color="#fbbf24" unit="g" />
        </ChartCard>
        <ChartCard title="Monthly Summary Comparison" description="All macros averaged per month" className="lg:col-span-2">
          <BarComparisonChart data={monthly.map((m) => ({ label: m.label, value: round(m.calories / 10) }))} color="#38bdf8" unit="kcal ÷10" />
        </ChartCard>
      </Section>

      <Section title="Weight & Deficit">
        <ChartCard title="Weight Loss Trend" description="Cumulative change from first logged weight">
          <TrendLineChart data={cumulativeWeightLoss(weightSeries)} color="#34d399" unit="kg" />
        </ChartCard>
        <ChartCard title="Daily Calorie Deficit Estimate" description="Goal + workout burn − intake">
          <TrendLineChart data={deficitSeries} color="#fbbf24" unit="kcal" goal={0} goalLabel="Break-even" />
        </ChartCard>
      </Section>

      <Section title="Distribution & Correlation">
        <ChartCard title="Macronutrient Distribution" description="Share of calories, all-time average">
          <MacroPieChart protein={macros.protein} carbs={macros.carbs} fat={macros.fat} />
        </ChartCard>
        <ChartCard title="Calories vs Protein" description="Scatter plot">
          <ScatterCard
            data={list.map((e) => ({ x: e.calories, y: e.protein, label: formatShort(e.date) }))}
            xLabel="Calories"
            yLabel="Protein"
            color="#8b5cf6"
          />
        </ChartCard>
        <ChartCard title="Weight vs Calories" description="Correlation scatter">
          <ScatterCard
            data={weightSeries.map((e) => ({ x: e.calories, y: e.weight!, label: formatShort(e.date) }))}
            xLabel="Calories"
            yLabel="Weight"
            color="#38bdf8"
          />
        </ChartCard>
      </Section>

      <Section title="7-Day Moving Averages">
        <ChartCard title="Weight (7d MA)">
          <TrendLineChart data={movingAverage(weightSeries, 'weight', 7).map((p) => ({ label: formatShort(p.date), value: p.value }))} color="#38bdf8" unit="kg" />
        </ChartCard>
        <ChartCard title="Calories (7d MA)">
          <TrendLineChart data={movingAverage(list, 'calories', 7).map((p) => ({ label: formatShort(p.date), value: p.value }))} color="#ff6b5b" unit="kcal" />
        </ChartCard>
        <ChartCard title="Protein (7d MA)">
          <TrendLineChart data={movingAverage(list, 'protein', 7).map((p) => ({ label: formatShort(p.date), value: p.value }))} color="#8b5cf6" unit="g" />
        </ChartCard>
        <ChartCard title="Carbs (7d MA)">
          <TrendLineChart data={movingAverage(list, 'carbs', 7).map((p) => ({ label: formatShort(p.date), value: p.value }))} color="#2dd4bf" unit="g" />
        </ChartCard>
        <ChartCard title="Fat (7d MA)">
          <TrendLineChart data={movingAverage(list, 'fat', 7).map((p) => ({ label: formatShort(p.date), value: p.value }))} color="#fbbf24" unit="g" />
        </ChartCard>
      </Section>

      <Section title="Activity & Hydration">
        <ChartCard title="Workout Minutes Trend">
          <TrendLineChart data={toTrend(list, 'workoutMinutes')} color="#f87171" unit="min" />
        </ChartCard>
        <ChartCard title="Water Intake Trend">
          <TrendLineChart data={toTrend(list, 'water')} color="#38bdf8" unit="L" />
        </ChartCard>
        <ChartCard title="Steps Trend">
          <TrendLineChart data={toTrend(list, 'steps')} color="#34d399" unit="steps" />
        </ChartCard>
        <ChartCard title="Goal Completion %" description="Weekly share of days at/under calorie goal">
          <TrendLineChart data={goalHitSeries} color="#fbbf24" unit="%" type="line" />
        </ChartCard>
      </Section>

      <Section title="Weekly Progress & Nutrition Map">
        <ChartCard title="Weekly Progress Radar" description="This week vs 100% of goal" className="lg:col-span-1">
          <RadarCard data={radarData} />
        </ChartCard>
        <ChartCard title="Nutrition Heatmap Calendar" description="Calorie intensity by day" className="lg:col-span-2">
          <HeatmapGrid entries={list} metric="calories" />
        </ChartCard>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-slate-500">{title}</h2>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">{children}</div>
    </section>
  )
}

function last7<T>(arr: T[]): T[] {
  return arr.slice(-7)
}

function clampGoalPct(value: number, goal: number, inverse: boolean): number {
  if (!goal) return 0
  const pct = inverse ? (goal / Math.max(value, 1)) * 100 : (value / goal) * 100
  return Math.max(0, Math.min(150, round(pct)))
}

function cumulativeWeightLoss(series: { date: string; weight?: number }[]): TrendPoint[] {
  if (series.length === 0) return []
  const start = series[0].weight ?? 0
  return series.map((e) => ({ label: formatShort(e.date), value: round(start - (e.weight ?? start), 1) }))
}
