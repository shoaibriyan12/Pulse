import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts'

interface ScatterCardProps {
  data: { x: number; y: number; label: string }[]
  xLabel: string
  yLabel: string
  color: string
  height?: number
}

export default function ScatterCard({ data, xLabel, yLabel, color, height = 240 }: ScatterCardProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-slate-500" style={{ height }}>
        No data yet to correlate.
      </div>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          type="number"
          dataKey="x"
          name={xLabel}
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="number"
          dataKey="y"
          name={yLabel}
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <ZAxis range={[60, 60]} />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          formatter={(v: number, n: string) => [v, n]}
          labelFormatter={(_, payload) => payload?.[0]?.payload?.label ?? ''}
          contentStyle={{
            background: 'rgba(18,24,38,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Scatter data={data} fill={color} isAnimationActive animationDuration={700} />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
