import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import { useSettings } from '@/hooks/useSettings'
import { useTheme } from '@/hooks/useTheme'

const DailyEntryPage = lazy(() => import('@/pages/DailyEntry'))
const DashboardPage = lazy(() => import('@/pages/Dashboard'))
const CalendarPage = lazy(() => import('@/pages/CalendarPage'))
const AnalyticsPage = lazy(() => import('@/pages/Analytics'))
const StatisticsPage = lazy(() => import('@/pages/Statistics'))
const HistoryPage = lazy(() => import('@/pages/History'))
const SettingsPage = lazy(() => import('@/pages/Settings'))

const TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Log Entry', subtitle: "Capture today's numbers" },
  '/dashboard': { title: 'Dashboard', subtitle: 'Your progress at a glance' },
  '/calendar': { title: 'Calendar', subtitle: 'Every logged day, mapped out' },
  '/analytics': { title: 'Analytics', subtitle: 'Trends, correlations, and moving averages' },
  '/statistics': { title: 'Statistics', subtitle: 'The numbers behind the numbers' },
  '/history': { title: 'History', subtitle: 'Search, filter, and export your log' },
  '/settings': { title: 'Settings', subtitle: 'Goals, targets, and preferences' },
}

function PageFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-pulse-teal/30 border-t-pulse-teal" />
    </div>
  )
}

export default function App() {
  const { settings, updateSettings } = useSettings()
  const location = useLocation()
  useTheme(settings.theme, settings.accentColor)

  const meta = TITLES[location.pathname] ?? { title: 'Pulse', subtitle: '' }

  return (
    <AppLayout
      title={meta.title}
      subtitle={meta.subtitle}
      theme={settings.theme}
      onToggleTheme={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
    >
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<DailyEntryPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Suspense>
    </AppLayout>
  )
}
