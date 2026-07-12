import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import TopBar from './TopBar'
import FAB from './FAB'
import type { ThemeMode } from '@/types'

interface AppLayoutProps {
  title: string
  subtitle?: string
  theme: ThemeMode
  onToggleTheme: () => void
  children: ReactNode
}

export default function AppLayout({ title, subtitle, theme, onToggleTheme, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-radial-glow">
      <Sidebar />
      <div className="lg:pl-60 print:pl-0">
        <TopBar title={title} subtitle={subtitle} theme={theme} onToggleTheme={onToggleTheme} />
        <main className="px-5 pb-24 pt-5 lg:px-8 lg:pb-10">{children}</main>
      </div>
      <FAB />
      <BottomNav />
    </div>
  )
}
