import { Plus } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function FAB() {
  const navigate = useNavigate()
  const location = useLocation()

  if (location.pathname === '/') return null

  return (
    <button
      onClick={() => navigate('/')}
      aria-label="Add today's entry"
      className="fixed bottom-20 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-pulse-gradient text-base-950 shadow-glow transition-transform hover:scale-105 active:scale-95 lg:bottom-8 lg:right-8 print:hidden"
    >
      <Plus size={26} strokeWidth={2.5} />
    </button>
  )
}
