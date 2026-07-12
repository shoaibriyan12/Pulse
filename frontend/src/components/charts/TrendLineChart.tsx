import {
  Area,
  AreaChart,
  Brush,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export interface TrendPoint {
  label: string
  value: number
}

interface TrendLineChartProps {
  data: TrendPoint[]
  color: string
  unit?: string
  goal?: number
  goalLabel?: string
  type?: 'line' | 'area'
  height?: number
  zoomable?: boolean
}

function TrendTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-base-800/95 px-3 py-2 text-xs shadow-glass">
      <p className="mb-0.5 text-slate-400">{label}</p>
      <p className="font-mono font-semibold text-slate-100">
        {payload[0].value}
        {unit ? ` ${unit}` : ''}
      </p>
    </div>
  )
}

export default function TrendLineChart({
  data,
  color,
  unit,
  goal,
  goalLabel,
  type = 'area',
  height = 220,
  zoomable = false,
}: TrendLineChartProps) {
  const gradientId = `grad-${color.replace('#', '')}`

  if (data.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm text-slate-500" style={{ height }}>
        No data yet — log a few days to see this trend.
      </div>
    )
  }

  const Chart = type === 'area' ? AreaChart : LineChart

  return (
    <ResponsiveContainer width="100%" height={height}>
      <Chart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.35} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={20} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
        <Tooltip content={<TrendTooltip unit={unit} />} />
        {goal !== undefined && (
          <ReferenceLine
            y={goal}
            stroke="#fbbf24"
            strokeDasharray="4 4"
            label={{ value: goalLabel ?? 'Goal', position: 'insideTopRight', fill: '#fbbf24', fontSize: 10 }}
          />
        )}
        {type === 'area' ? (
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            isAnimationActive
            animationDuration={700}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ) : (
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            isAnimationActive
            animationDuration={700}
          />
        )}
        {zoomable && data.length > 10 && (
          <Brush dataKey="label" height={20} stroke={color} fill="rgba(255,255,255,0.03)" travellerWidth={8} />
        )}
      </Chart>
    </ResponsiveContainer>
  )
}
