import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  unit?: string
  error?: string
}

export default function Input({ label, unit, error, className = '', ...rest }: InputProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">{label}</span>
      <div className="relative">
        <input
          {...rest}
          className={`w-full rounded-xl border bg-white/[0.03] px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-pulse-teal/60 ${
            error ? 'border-pulse-red/60' : 'border-white/10'
          } ${className}`}
        />
        {unit && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">
            {unit}
          </span>
        )}
      </div>
      {error && <span className="mt-1 block text-xs text-pulse-red">{error}</span>}
    </label>
  )
}
