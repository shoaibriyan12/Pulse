import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

interface MacroPieChartProps {
  protein: number
  carbs: number
  fat: number
  height?: number
}

export default function MacroPieChart({ protein, carbs, fat, height = 240 }: MacroPieChartProps) {
  const data = [
    { name: 'Protein', value: protein, color: '#8b5cf6' },
    { name: 'Carbs', value: carbs, color: '#2dd4bf' },
    { name: 'Fat', value: fat, color: '#fbbf24' },
  ]
  const total = protein + carbs + fat
  if (total === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-slate-500" style={{ height }}>
        No macro data yet.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={3}
          isAnimationActive
          animationDuration={700}
        >
          {data.map((d) => (
            <Cell key={d.name} fill={d.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          formatter={(v: number, n: string) => [`${v}%`, n]}
          contentStyle={{
            background: 'rgba(18,24,38,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend
          formatter={(v) => <span className="text-xs text-slate-400">{v}</span>}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
