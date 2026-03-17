import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function Layout() {
  return (
    <div className="h-full flex flex-col bg-bg">
      <main className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-4">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
