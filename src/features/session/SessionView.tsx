import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useSettings } from '../../hooks/useSettings'
import { useExerciseByName } from '../../hooks/useExercises'
import { useLatestSets } from '../../hooks/useLatestSets'
import {
  createDraftSession,
  completeSession,
  updateSession,
  getSessionByDate,
} from '../../hooks/useSessions'
import { saveSets, deleteSetsForSession, getSetsForSession } from '../../hooks/useSets'
import { getSessionForDate, formatDate } from '../../data/schedule'
import { getPhaseExercises } from '../../data/phases'
import { ExerciseCard } from './ExerciseCard'
import { WarmUpChecklist } from './WarmUpChecklist'
import { SessionNotes } from './SessionNotes'
import type { PhaseExercise, Session } from '../../lib/types'

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
  const [existingSession, setExistingSession] = useState<Session | null>(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  const sessionRef = useRef<Session | null>(null)
  const setsStateRef = useRef<ExerciseSetsState>({})
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const statusTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const savingRef = useRef(false)
  const initializedRef = useRef(false)

  // Keep refs in sync
  useEffect(() => {
    setsStateRef.current = setsState
  }, [setsState])

  // Load existing session + sets on mount
  useEffect(() => {
    async function loadSession() {
      const session = await getSessionByDate(dateStr)
      if (session) {
        setExistingSession(session)
        sessionRef.current = session
        setPainLevel(session.pain_level ?? 0)
        setNotes(session.notes ?? '')

        // Load sets for this session
        const sets = await getSetsForSession(session.id)
        if (sets.length > 0) {
          const state: ExerciseSetsState = {}
          phaseExercises.forEach((pe: PhaseExercise) => {
            const exercise = getExercise(pe.exerciseName)
            if (!exercise) {
              state[pe.exerciseName] = Array.from({ length: pe.sets }, () => ({
                weight: '',
                reps: '',
              }))
              return
            }
            const exerciseSets = sets.filter((s) => s.exercise_id === exercise.id)
            state[pe.exerciseName] = Array.from({ length: pe.sets }, (_, i) => ({
              weight: exerciseSets[i]?.weight_lbs?.toString() ?? '',
              reps: exerciseSets[i]?.reps_completed?.toString() ?? '',
            }))
          })
          setSetsState(state)
          initializedRef.current = true
        }
      }
      setLoadingSession(false)
    }
    if (!exercisesLoading) {
      loadSession()
    }
  }, [dateStr, exercisesLoading, getExercise, phaseExercises])

  // Initialize sets state from phase exercises + pre-fill from previous session
  // Only when no existing session was loaded
  useEffect(() => {
    if (exercisesLoading || initializedRef.current) return
    if (loadingSession) return

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
    initializedRef.current = true
  }, [phaseExercises, previousSets, exercisesLoading, getExercise, loadingSession])

  const buildSetsArray = useCallback(
    (currentSetsState: ExerciseSetsState) => {
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
        const sets = currentSetsState[pe.exerciseName] || []
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
      return allSets
    },
    [phaseExercises, getExercise]
  )

  async function ensureSession(): Promise<Session | null> {
    if (sessionRef.current) return sessionRef.current
    const session = await createDraftSession({
      date: dateStr,
      session_type: schedule.sessionType,
      phase,
      week_number: weekNumber,
    })
    if (session) {
      sessionRef.current = session
      setExistingSession(session)
    }
    return session
  }

  const doAutoSave = useCallback(async () => {
    if (savingRef.current) return
    savingRef.current = true
    try {
      const currentState = setsStateRef.current
      const allSets = buildSetsArray(currentState)
      if (allSets.length === 0) return

      setAutoSaveStatus('saving')

      const session = await ensureSession()
      if (!session) {
        setAutoSaveStatus('idle')
        return
      }

      await deleteSetsForSession(session.id)
      await saveSets(session.id, allSets)
      setAutoSaveStatus('saved')
      clearTimeout(statusTimeoutRef.current)
      statusTimeoutRef.current = setTimeout(() => setAutoSaveStatus('idle'), 1500)
    } finally {
      savingRef.current = false
    }
  }, [buildSetsArray, dateStr, schedule.sessionType, phase, weekNumber])

  const triggerAutoSave = useCallback(() => {
    clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(doAutoSave, 800)
  }, [doAutoSave])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      clearTimeout(saveTimeoutRef.current)
      clearTimeout(statusTimeoutRef.current)
    }
  }, [])

  const handleSetChange = useCallback(
    (exerciseName: string, setIndex: number, field: 'weight' | 'reps', value: string) => {
      setSetsState((prev) => {
        const exerciseSets = [...(prev[exerciseName] || [])]
        exerciseSets[setIndex] = { ...exerciseSets[setIndex], [field]: value }
        return { ...prev, [exerciseName]: exerciseSets }
      })
      triggerAutoSave()
    },
    [triggerAutoSave]
  )

  async function handleSave(markComplete: boolean) {
    setSaving(true)
    try {
      clearTimeout(saveTimeoutRef.current)

      const session = await ensureSession()
      if (!session) {
        alert('Failed to save session')
        setSaving(false)
        return
      }

      await deleteSetsForSession(session.id)
      const allSets = buildSetsArray(setsState)
      if (allSets.length > 0) {
        await saveSets(session.id, allSets)
      }

      await updateSession(session.id, {
        pain_level: painLevel,
        notes: notes || null,
      })

      if (markComplete && !session.completed_at) {
        await completeSession(session.id)
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

  const isAlreadyCompleted = existingSession?.completed_at != null

  // Rest / Yoga days
  if (isRest) {
    const isYoga = schedule.sessionType === 'yoga'

    if (completed) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="text-center py-12 px-8 space-y-3">
            <svg className="w-16 h-16 text-success mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <h2 className="text-xl font-bold">{isYoga ? 'Yoga Complete!' : 'Rest Day Logged!'}</h2>
            <p className="text-text-muted">Redirecting...</p>
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
        <Card className="text-center py-12 space-y-3">
          <div className="text-4xl">{isYoga ? '\u{1F9D8}' : '\u{1F6CC}'}</div>
          <h2 className="text-xl font-semibold">{isYoga ? 'Yoga / Active Recovery' : 'Rest Day'}</h2>
          <p className="text-text-muted">
            {isYoga
              ? 'Yoga sculpt, mobility work, or light activity. Listen to your body.'
              : 'Recovery is part of the program. Stretch, hydrate, sleep well.'}
          </p>
        </Card>
        {isAlreadyCompleted ? (
          <Card className="text-center py-6 space-y-2">
            <svg className="w-10 h-10 text-success mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <p className="text-text-muted text-sm">Already logged for today</p>
          </Card>
        ) : (
          <Button
            size="lg"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            {saving ? 'Saving...' : isYoga ? 'Mark Yoga Complete' : 'Mark Rest Day Complete'}
          </Button>
        )}
      </div>
    )
  }

  // Just-completed success screen
  if (completed) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="text-center py-12 px-8 space-y-3">
          <svg className="w-16 h-16 text-success mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <h2 className="text-xl font-bold">
            {isAlreadyCompleted ? 'Session Updated!' : 'Session Complete!'}
          </h2>
          <p className="text-text-muted">Great work. Redirecting...</p>
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
          {isAlreadyCompleted && <Badge variant="success">Completed</Badge>}
          {existingSession && !existingSession.completed_at && (
            <Badge variant="warning">Draft</Badge>
          )}
          {autoSaveStatus === 'saving' && (
            <span className="text-xs text-text-muted self-center">Saving...</span>
          )}
          {autoSaveStatus === 'saved' && (
            <span className="text-xs text-success self-center">Saved</span>
          )}
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
        onClick={() => handleSave(!isAlreadyCompleted)}
        disabled={saving}
      >
        {saving ? 'Saving...' : isAlreadyCompleted ? 'Update Session' : 'Complete Session'}
      </Button>
    </div>
  )
}
