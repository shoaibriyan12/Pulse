import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from './nav'

const MOBILE_ITEMS = NAV_ITEMS.filter((i) => ['/', '/dashboard', '/calendar', '/analytics', '/settings'].includes(i.to))

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-white/8 bg-base-950/90 backdrop-blur-xl lg:hidden print:hidden">
      {MOBILE_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
              isActive ? 'text-pulse-teal' : 'text-slate-500'
            }`
          }
        >
          <item.icon size={19} />
          {item.label.split(' ')[0]}
        </NavLink>
      ))}
    </nav>
  )
}
