import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function Layout() {
  return (
    <div className="min-h-full flex flex-col bg-bg">
      <main className="flex-1 pb-20 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-4">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
