import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function Layout() {
  return (
    <div className="h-full flex flex-col bg-bg overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-24">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
