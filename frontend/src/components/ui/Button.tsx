import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
}

const variants: Record<string, string> = {
  primary: 'bg-pulse-gradient text-base-950 font-semibold hover:brightness-110 shadow-glow',
  secondary: 'bg-white/[0.06] border border-white/10 text-slate-100 hover:bg-white/[0.1]',
  ghost: 'bg-transparent text-slate-400 hover:text-slate-100',
  danger: 'bg-pulse-red/15 border border-pulse-red/30 text-pulse-red hover:bg-pulse-red/25',
}

export default function Button({ children, variant = 'primary', className = '', ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
