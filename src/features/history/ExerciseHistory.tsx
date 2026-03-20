import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { ExerciseChart } from '../../components/ExerciseChart'
import { supabase } from '../../lib/supabase'
import { getSetsForExercise } from '../../hooks/useSets'
import type { Exercise, SetLog } from '../../lib/types'

interface SessionGroup {
  date: string
  sets: (SetLog & { session_date: string })[]
  maxWeight: number
}

export function ExerciseHistory() {
  const { exerciseId } = useParams<{ exerciseId: string }>()
  const navigate = useNavigate()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [groups, setGroups] = useState<SessionGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      if (!exerciseId) return

      const { data: ex } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', Number(exerciseId))
        .single()

      if (ex) setExercise(ex as Exercise)

      const sets = await getSetsForExercise(Number(exerciseId))

      // Group by session date
      const grouped = new Map<string, (SetLog & { session_date: string })[]>()
      for (const set of sets) {
        const date = set.session_date
        if (!grouped.has(date)) grouped.set(date, [])
        grouped.get(date)!.push(set)
      }

      const sessionGroups: SessionGroup[] = Array.from(grouped.entries())
        .map(([date, sets]) => ({
          date,
          sets: sets.sort((a, b) => a.set_number - b.set_number),
          maxWeight: Math.max(...sets.map((s) => s.weight_lbs || 0)),
        }))
        .sort((a, b) => b.date.localeCompare(a.date))

      setGroups(sessionGroups)
      setLoading(false)
    }
    fetch()
  }, [exerciseId])

  if (loading) {
    return <div className="text-center text-text-muted py-12">Loading...</div>
  }

  const chartData = [...groups]
    .reverse()
    .filter((g) => g.maxWeight > 0)
    .map((g) => ({
      date: g.date,
      weight: g.maxWeight,
    }))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          &larr; Back
        </Button>
        <h1 className="text-xl font-bold">{exercise?.name || 'Exercise'}</h1>
      </div>

      {exercise?.coaching_note && (
        <p className="text-sm text-text-muted italic">{exercise.coaching_note}</p>
      )}

      <Card>
        <h2 className="text-sm font-medium text-text-muted mb-2">Weight Progression</h2>
        <ExerciseChart data={chartData} />
      </Card>

      <h2 className="text-lg font-semibold">Session Log</h2>
      {groups.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-text-muted">No sessions logged yet.</p>
        </Card>
      ) : (
        groups.map((group) => {
          const dateLabel = new Date(group.date + 'T12:00:00').toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })
          return (
            <Card key={group.date}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-text-muted">{dateLabel}</span>
                <span className="text-sm font-medium">Max: {group.maxWeight} lbs</span>
              </div>
              <div className="space-y-1">
                {group.sets.map((set) => (
                  <div key={set.id} className="flex gap-4 text-sm">
                    <span className="text-text-muted w-10 shrink-0">Set {set.set_number}</span>
                    <span>{set.weight_lbs || '—'} lbs</span>
                    <span className="text-text-muted">&times;</span>
                    <span>{set.reps_completed || '—'} reps</span>
                  </div>
                ))}
              </div>
            </Card>
          )
        })
      )}
    </div>
  )
}
