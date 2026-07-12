import { CalendarDays, Gauge, History, LayoutGrid, LineChart, PlusCircle, Settings2 } from 'lucide-react'
import type { ComponentType } from 'react'

export interface NavItem {
  to: string
  label: string
  icon: ComponentType<{ size?: number; className?: string }>
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Log Entry', icon: PlusCircle },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/analytics', label: 'Analytics', icon: LineChart },
  { to: '/statistics', label: 'Statistics', icon: Gauge },
  { to: '/history', label: 'History', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings2 },
]
