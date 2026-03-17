import { Link, useLocation } from 'react-router-dom'

function todayPath() {
  return `/session/${new Date().toISOString().split('T')[0]}`
}

export function BottomNav() {
  const { pathname } = useLocation()

  const tabs: Array<{ to: string; label: TabName; active: boolean }> = [
    { to: '/', label: 'Home', active: pathname === '/' },
    { to: todayPath(), label: 'Today', active: pathname.startsWith('/session') },
    { to: '/history', label: 'History', active: pathname.startsWith('/history') },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-surface-bright pb-[env(safe-area-inset-bottom)]">
      <div className="flex max-w-lg mx-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            to={tab.to}
            className={`flex-1 flex flex-col items-center py-3 text-center no-underline
              ${tab.active ? 'text-primary' : 'text-text-muted'}`}
          >
            <TabIcon name={tab.label} active={tab.active} />
            <span className="text-xs mt-1 font-medium">{tab.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

type TabName = 'Home' | 'Today' | 'History'

function TabIcon({ name, active }: { name: TabName; active: boolean }) {
  if (name === 'Home') {
    return (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        {!active && <path d="M9 22V12h6v10" />}
      </svg>
    )
  }
  if (name === 'Today') {
    return (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" fill={active ? 'currentColor' : 'none'} />
        <line x1="16" y1="2" x2="16" y2="6" stroke={active ? 'currentColor' : undefined} />
        <line x1="8" y1="2" x2="8" y2="6" stroke={active ? 'currentColor' : undefined} />
        <line x1="3" y1="10" x2="21" y2="10" stroke={active ? 'var(--color-bg)' : undefined} />
      </svg>
    )
  }
  // History
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="14" width="5" height="7" rx="1" opacity={active ? 1 : 0.4} />
      <rect x="10" y="9" width="5" height="12" rx="1" opacity={active ? 1 : 0.6} />
      <rect x="17" y="4" width="5" height="17" rx="1" opacity={active ? 1 : 0.8} />
    </svg>
  )
}
