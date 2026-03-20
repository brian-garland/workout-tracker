import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { useExercises } from '../../hooks/useExercises'
import type { Exercise } from '../../lib/types'

const categoryLabels: Record<string, string> = {
  lower: 'Lower Body',
  upper_pull: 'Upper Pull',
  upper_push: 'Upper Push',
}

const categoryOrder = ['lower', 'upper_pull', 'upper_push']

const SCROLL_KEY = 'history-scroll'

export function HistoryList() {
  const { exercises, loading } = useExercises()

  useEffect(() => {
    if (loading) return
    const scrollContainer = document.querySelector('main')
    if (!scrollContainer) return

    const saved = sessionStorage.getItem(SCROLL_KEY)
    if (saved) {
      scrollContainer.scrollTop = Number(saved)
      sessionStorage.removeItem(SCROLL_KEY)
    }
  }, [loading])

  if (loading) {
    return <div className="text-center text-text-muted py-12">Loading...</div>
  }

  const saveScroll = () => {
    const scrollContainer = document.querySelector('main')
    if (scrollContainer) {
      sessionStorage.setItem(SCROLL_KEY, String(scrollContainer.scrollTop))
    }
  }

  const grouped = new Map<string, Exercise[]>()
  for (const cat of categoryOrder) {
    grouped.set(cat, [])
  }
  for (const ex of exercises) {
    const group = grouped.get(ex.category)
    if (group) group.push(ex)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Exercise History</h1>

      {categoryOrder.map((cat) => {
        const exs = grouped.get(cat) || []
        if (exs.length === 0) return null
        return (
          <div key={cat} className="space-y-2">
            <Badge variant="primary">{categoryLabels[cat]}</Badge>
            {exs.map((ex) => (
              <Link key={ex.id} to={`/history/${ex.id}`} className="block no-underline text-inherit" onClick={saveScroll}>
                <Card
                  className="cursor-pointer active:bg-surface-bright transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{ex.name}</div>
                      {ex.is_caution && (
                        <span className="text-xs text-warning">Caution</span>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )
      })}
    </div>
  )
}
