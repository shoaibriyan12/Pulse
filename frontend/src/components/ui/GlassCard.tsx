import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface GlassCardProps {
  children: ReactNode
  className?: string
  glow?: 'teal' | 'violet' | 'coral' | 'none'
  delay?: number
}

const glowMap: Record<string, string> = {
  teal: 'hover:shadow-glow',
  violet: 'hover:shadow-glow-violet',
  coral: 'hover:shadow-glow-coral',
  none: '',
}

export default function GlassCard({ children, className = '', glow = 'none', delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className={`glass-card p-5 transition-shadow duration-300 ${glowMap[glow]} ${className}`}
    >
      {children}
    </motion.div>
  )
}
