import type { PhaseExercise, SessionType } from '../lib/types'

type PhaseData = Record<string, PhaseExercise[]>

const upperPull: PhaseExercise[] = [
  { exerciseName: 'Barbell Row', sets: 4, reps: '8-10' },
  { exerciseName: 'Pull Up', sets: 3, reps: '6-10', note: 'Use band assistance if needed' },
  { exerciseName: 'Cable Row', sets: 3, reps: '10-12' },
  { exerciseName: 'Face Pull', sets: 3, reps: '15-20' },
  { exerciseName: 'Hammer Curl', sets: 3, reps: '10-12' },
  { exerciseName: 'Barbell Curl', sets: 2, reps: '10-12' },
]

const upperPush: PhaseExercise[] = [
  { exerciseName: 'Barbell Bench Press', sets: 4, reps: '8-10' },
  { exerciseName: 'Overhead Press', sets: 3, reps: '8-10' },
  { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: '10-12' },
  { exerciseName: 'Dumbbell Lateral Raise', sets: 3, reps: '12-15' },
  { exerciseName: 'Tricep Pushdown', sets: 3, reps: '10-12' },
  { exerciseName: 'Cable Fly', sets: 2, reps: '12-15' },
]

// Phase 1: Weeks 1-5 — Foundation / Hypertrophy Base
const phase1: PhaseData = {
  lower_a: [
    { exerciseName: 'Barbell Back Squat', sets: 4, reps: '8-10' },
    { exerciseName: 'Romanian Deadlift', sets: 3, reps: '10-12' },
    { exerciseName: 'Leg Press', sets: 3, reps: '10-12' },
    { exerciseName: 'Leg Curl', sets: 3, reps: '10-12' },
    { exerciseName: 'Calf Raise', sets: 4, reps: '12-15' },
  ],
  lower_b: [
    { exerciseName: 'Goblet Squat', sets: 3, reps: '12-15' },
    { exerciseName: 'Hip Thrust', sets: 4, reps: '10-12' },
    { exerciseName: 'Walking Lunges', sets: 3, reps: '10 each leg' },
    { exerciseName: 'Leg Extension', sets: 3, reps: '12-15', note: 'Light weight, focus on contraction' },
    { exerciseName: 'Leg Curl', sets: 3, reps: '10-12' },
    { exerciseName: 'Calf Raise', sets: 4, reps: '12-15' },
  ],
  pull: upperPull,
  push: upperPush,
}

// Phase 2: Weeks 6-10 — Strength Focus
const phase2: PhaseData = {
  lower_a: [
    { exerciseName: 'Barbell Back Squat', sets: 5, reps: '5-6', note: 'Heavier weight, lower reps' },
    { exerciseName: 'Sumo Deadlift', sets: 4, reps: '6-8' },
    { exerciseName: 'Bulgarian Split Squat', sets: 3, reps: '8-10 each leg' },
    { exerciseName: 'Leg Curl', sets: 3, reps: '8-10' },
    { exerciseName: 'Calf Raise', sets: 4, reps: '10-12' },
  ],
  lower_b: [
    { exerciseName: 'Front Squat', sets: 4, reps: '6-8' },
    { exerciseName: 'Romanian Deadlift', sets: 4, reps: '8-10' },
    { exerciseName: 'Step Ups', sets: 3, reps: '10 each leg' },
    { exerciseName: 'Hip Thrust', sets: 3, reps: '8-10' },
    { exerciseName: 'Leg Extension', sets: 3, reps: '12-15' },
    { exerciseName: 'Calf Raise', sets: 4, reps: '10-12' },
  ],
  pull: upperPull,
  push: upperPush,
}

// Phase 3: Weeks 11-16 — Peak / Progressive Overload
const phase3: PhaseData = {
  lower_a: [
    { exerciseName: 'Barbell Back Squat', sets: 5, reps: '3-5', note: 'Working toward peak strength' },
    { exerciseName: 'Sumo Deadlift', sets: 4, reps: '4-6' },
    { exerciseName: 'Leg Press', sets: 4, reps: '8-10' },
    { exerciseName: 'Bulgarian Split Squat', sets: 3, reps: '8 each leg' },
    { exerciseName: 'Calf Raise', sets: 4, reps: '10-12' },
  ],
  lower_b: [
    { exerciseName: 'Front Squat', sets: 4, reps: '5-6' },
    { exerciseName: 'Romanian Deadlift', sets: 4, reps: '6-8' },
    { exerciseName: 'Hip Thrust', sets: 4, reps: '8-10' },
    { exerciseName: 'Walking Lunges', sets: 3, reps: '8 each leg' },
    { exerciseName: 'Leg Curl', sets: 3, reps: '8-10' },
    { exerciseName: 'Calf Raise', sets: 4, reps: '10-12' },
  ],
  pull: upperPull,
  push: upperPush,
}

export const phases: Record<number, PhaseData> = {
  1: phase1,
  2: phase2,
  3: phase3,
}

export function getPhaseExercises(phase: number, sessionType: SessionType): PhaseExercise[] {
  if (sessionType === 'rest' || sessionType === 'yoga') return []
  const phaseData = phases[phase]
  if (!phaseData) return []
  return phaseData[sessionType] || []
}

export const phaseInfo: Record<number, { name: string; weeks: string }> = {
  1: { name: 'Foundation / Hypertrophy', weeks: '1-5' },
  2: { name: 'Strength Focus', weeks: '6-10' },
  3: { name: 'Peak / Progressive Overload', weeks: '11-16' },
}
