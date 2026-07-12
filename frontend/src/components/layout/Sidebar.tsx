import { NavLink } from 'react-router-dom'
import { Activity } from 'lucide-react'
import { NAV_ITEMS } from './nav'

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-white/8 bg-base-950/80 backdrop-blur-xl lg:flex print:hidden">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pulse-gradient shadow-glow">
          <Activity size={18} className="text-base-950" strokeWidth={2.5} />
        </div>
        <span className="font-display text-lg font-semibold tracking-tight text-slate-100">Pulse</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/[0.08] text-pulse-teal'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'
              }`
            }
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-5 text-[11px] text-slate-600">Your data lives only on this device.</div>
    </aside>
  )
}
