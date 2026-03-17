import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useSettings } from '../../hooks/useSettings'
import { useExerciseByName } from '../../hooks/useExercises'
import { useLatestSets } from '../../hooks/useLatestSets'
import { createSession, getSessionByDate } from '../../hooks/useSessions'
import { saveSets } from '../../hooks/useSets'
import { getSessionForDate, formatDate } from '../../data/schedule'
import { getPhaseExercises } from '../../data/phases'
import { ExerciseCard } from './ExerciseCard'
import { WarmUpChecklist } from './WarmUpChecklist'
import { SessionNotes } from './SessionNotes'
import type { PhaseExercise } from '../../lib/types'

interface ExerciseSetsState {
  [exerciseName: string]: Array<{ weight: string; reps: string }>
}

export function SessionView() {
  const { date } = useParams<{ date: string }>()
  const navigate = useNavigate()
  const { phase, weekNumber } = useSettings()
  const { getExercise, loading: exercisesLoading } = useExerciseByName()

  const sessionDate = useMemo(() => {
    if (!date) return new Date()
    return new Date(date + 'T12:00:00')
  }, [date])

  const dateStr = formatDate(sessionDate)
  const schedule = getSessionForDate(sessionDate)
  const phaseExercises = getPhaseExercises(phase, schedule.sessionType)
  const isLower = schedule.sessionType === 'lower_a' || schedule.sessionType === 'lower_b'
  const isRest = schedule.sessionType === 'rest' || schedule.sessionType === 'yoga'

  const { previousSets } = useLatestSets(schedule.sessionType, dateStr)

  const [setsState, setSetsState] = useState<ExerciseSetsState>({})
  const [painLevel, setPainLevel] = useState(0)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [alreadyCompleted, setAlreadyCompleted] = useState(false)

  // Check if session already completed
  useEffect(() => {
    getSessionByDate(dateStr).then((session) => {
      if (session?.completed_at) setAlreadyCompleted(true)
    })
  }, [dateStr])

  // Initialize sets state from phase exercises and pre-fill from previous session
  useEffect(() => {
    if (exercisesLoading) return
    const state: ExerciseSetsState = {}
    phaseExercises.forEach((pe: PhaseExercise) => {
      const exercise = getExercise(pe.exerciseName)
      const prevSets = exercise ? previousSets[exercise.id] : undefined
      state[pe.exerciseName] = Array.from({ length: pe.sets }, (_, i) => ({
        weight: prevSets?.[i]?.weight_lbs?.toString() || '',
        reps: '',
      }))
    })
    setSetsState(state)
  }, [phaseExercises, previousSets, exercisesLoading, getExercise])

  const handleSetChange = useCallback(
    (exerciseName: string, setIndex: number, field: 'weight' | 'reps', value: string) => {
      setSetsState((prev) => {
        const exerciseSets = [...(prev[exerciseName] || [])]
        exerciseSets[setIndex] = { ...exerciseSets[setIndex], [field]: value }
        return { ...prev, [exerciseName]: exerciseSets }
      })
    },
    []
  )

  async function handleComplete() {
    setSaving(true)
    try {
      const session = await createSession({
        date: dateStr,
        session_type: schedule.sessionType,
        phase,
        week_number: weekNumber,
        pain_level: painLevel,
        notes: notes || null,
      })

      if (!session) {
        alert('Failed to save session')
        setSaving(false)
        return
      }

      const allSets: Array<{
        exercise_id: number
        set_number: number
        weight_lbs: number | null
        reps_completed: number | null
        rpe: number | null
      }> = []

      phaseExercises.forEach((pe) => {
        const exercise = getExercise(pe.exerciseName)
        if (!exercise) return
        const sets = setsState[pe.exerciseName] || []
        sets.forEach((set, i) => {
          if (set.weight || set.reps) {
            allSets.push({
              exercise_id: exercise.id,
              set_number: i + 1,
              weight_lbs: set.weight ? Number(set.weight) : null,
              reps_completed: set.reps ? Number(set.reps) : null,
              rpe: null,
            })
          }
        })
      })

      if (allSets.length > 0) {
        await saveSets(session.id, allSets)
      }

      setCompleted(true)
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      console.error(err)
      alert('Failed to save session')
    } finally {
      setSaving(false)
    }
  }

  const dayLabel = sessionDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  if (isRest) {
    const isYoga = schedule.sessionType === 'yoga'
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">{schedule.displayName}</h1>
          <p className="text-text-muted">{dayLabel}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="primary">Phase {phase}</Badge>
            <Badge>Week {weekNumber}</Badge>
          </div>
        </div>
        <Card className="text-center py-12 space-y-3">
          <div className="text-4xl">{isYoga ? '\u{1F9D8}' : '\u{1F6CC}'}</div>
          <h2 className="text-xl font-semibold">{isYoga ? 'Yoga / Active Recovery' : 'Rest Day'}</h2>
          <p className="text-text-muted">
            {isYoga
              ? 'Yoga sculpt, mobility work, or light activity. Listen to your body.'
              : 'Recovery is part of the program. Stretch, hydrate, sleep well.'}
          </p>
        </Card>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="text-center py-12 px-8 space-y-3">
          <svg className="w-16 h-16 text-success mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <h2 className="text-xl font-bold">Session Complete!</h2>
          <p className="text-text-muted">Great work. Redirecting...</p>
        </Card>
      </div>
    )
  }

  if (alreadyCompleted) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{dayLabel}</h1>
        <Badge variant="success">Completed</Badge>
        <Card className="text-center py-8 space-y-3">
          <svg className="w-12 h-12 text-success mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <h2 className="text-lg font-semibold">Session already completed</h2>
          <p className="text-text-muted text-sm">This day&apos;s workout has been logged.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{schedule.displayName}</h1>
        <p className="text-text-muted">{dayLabel}</p>
        <div className="flex gap-2 mt-2">
          <Badge variant="primary">Phase {phase}</Badge>
          <Badge>Week {weekNumber}</Badge>
        </div>
      </div>

      {isLower && <WarmUpChecklist />}

      {phaseExercises.map((pe) => (
        <ExerciseCard
          key={pe.exerciseName}
          phaseExercise={pe}
          exercise={getExercise(pe.exerciseName)}
          sets={setsState[pe.exerciseName] || []}
          onSetChange={(setIndex, field, value) =>
            handleSetChange(pe.exerciseName, setIndex, field, value)
          }
        />
      ))}

      <SessionNotes
        painLevel={painLevel}
        onPainChange={setPainLevel}
        notes={notes}
        onNotesChange={setNotes}
      />

      <Button
        size="lg"
        onClick={handleComplete}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Complete Session'}
      </Button>
    </div>
  )
}
