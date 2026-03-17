export interface Exercise {
  id: number
  name: string
  category: 'lower' | 'upper_pull' | 'upper_push' | 'warmup' | 'accessory'
  coaching_note: string | null
  is_caution: boolean
  caution_note: string | null
}

export interface Session {
  id: number
  date: string
  session_type: SessionType
  phase: number
  week_number: number
  pain_level: number | null
  notes: string | null
  completed_at: string | null
}

export interface SetLog {
  id: number
  session_id: number
  exercise_id: number
  set_number: number
  weight_lbs: number | null
  reps_completed: number | null
  rpe: number | null
}

export type SessionType = 'lower_a' | 'lower_b' | 'pull' | 'push' | 'yoga' | 'rest'

export interface PhaseExercise {
  exerciseName: string
  sets: number
  reps: string
  note?: string
}

export interface DaySchedule {
  dayName: string
  sessionType: SessionType
  displayName: string
}

export interface WarmUpStep {
  name: string
  description: string
  duration?: string
  reps?: string
}

export interface SupplementTiming {
  name: string
  timing: string
  dose: string
}

export interface SetInput {
  setNumber: number
  weight: string
  reps: string
  rpe: string
}
