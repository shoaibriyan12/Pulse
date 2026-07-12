import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface RadarCardProps {
  data: { metric: string; actual: number; goal: number }[]
  height?: number
}

export default function RadarCard({ data, height = 280 }: RadarCardProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.08)" />
        <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} />
        <Radar name="Goal" dataKey="goal" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.08} strokeDasharray="4 4" />
        <Radar
          name="This Week"
          dataKey="actual"
          stroke="#2dd4bf"
          fill="#2dd4bf"
          fillOpacity={0.35}
          isAnimationActive
          animationDuration={700}
        />
        <Tooltip
          contentStyle={{
            background: 'rgba(18,24,38,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
