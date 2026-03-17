import type { PhaseExercise, SessionType } from '../lib/types'
import { EXERCISES as E } from './exerciseNames'

type PhaseData = Record<string, PhaseExercise[]>

// Upper body stays the same across all phases
const upperPull: PhaseExercise[] = [
  { exerciseName: E.BARBELL_ROW, sets: 4, reps: '8-10' },
  { exerciseName: E.LAT_PULLDOWN, sets: 3, reps: '10-12' },
  { exerciseName: E.SEATED_CABLE_ROW, sets: 3, reps: '12' },
  { exerciseName: E.FACE_PULLS, sets: 3, reps: '15-20' },
  { exerciseName: E.INCLINE_CURL, sets: 3, reps: '10-12' },
  { exerciseName: E.HAMMER_CURL, sets: 2, reps: '12' },
]

const upperPush: PhaseExercise[] = [
  { exerciseName: E.BENCH_PRESS, sets: 4, reps: '6-8' },
  { exerciseName: E.INCLINE_PRESS, sets: 3, reps: '10-12' },
  { exerciseName: E.OVERHEAD_PRESS, sets: 3, reps: '8-10' },
  { exerciseName: E.LATERAL_RAISES, sets: 3, reps: '15-20' },
  { exerciseName: E.CABLE_FLY, sets: 3, reps: '12-15' },
  { exerciseName: E.TRICEP_PUSHDOWN, sets: 3, reps: '12-15' },
  { exerciseName: E.OVERHEAD_TRICEP_EXTENSION, sets: 2, reps: '12' },
]

// Phase 1: Weeks 1-4 — Foundation
const phase1: PhaseData = {
  lower_a: [
    { exerciseName: E.LEG_PRESS, sets: 3, reps: '12-15', note: 'Start at 60-70% of max' },
    { exerciseName: E.TKE, sets: 3, reps: '15-20' },
    { exerciseName: E.ISOMETRIC_WALL_SIT, sets: 3, reps: '30-45 sec' },
    { exerciseName: E.GLUTE_BRIDGE, sets: 3, reps: '15' },
    { exerciseName: E.STANDING_CALF_RAISES, sets: 3, reps: '20' },
  ],
  lower_b: [
    { exerciseName: E.STEP_UPS, sets: 3, reps: '10 each leg', note: '8-12 inch box' },
    { exerciseName: E.RDL, sets: 3, reps: '10-12', note: 'Start with dumbbells' },
    { exerciseName: E.SIDE_LYING_HIP_ABDUCTION, sets: 3, reps: '15-20' },
    { exerciseName: E.REVERSE_LUNGE, sets: 3, reps: '8-10 each leg' },
    { exerciseName: E.TKE, sets: 3, reps: '15', note: 'Hits VMO twice per week intentionally' },
  ],
  pull: upperPull,
  push: upperPush,
}

// Phase 2: Weeks 5-10 — Load Progression
const phase2: PhaseData = {
  lower_a: [
    { exerciseName: E.LEG_PRESS_PAUSE, sets: 4, reps: '10-12', note: 'Increase weight 5-10% from Phase 1. 2-sec pause at bottom.' },
    { exerciseName: E.TKE, sets: 3, reps: '15', note: 'Use heavier band than Phase 1' },
    { exerciseName: E.SINGLE_LEG_WALL_SIT, sets: 3, reps: '20-30 sec each leg', note: 'Assisted if needed' },
    { exerciseName: E.SINGLE_LEG_GLUTE_BRIDGE, sets: 3, reps: '12 each leg' },
    { exerciseName: E.STANDING_CALF_RAISES_WEIGHTED, sets: 3, reps: '15' },
  ],
  lower_b: [
    { exerciseName: E.STEP_UPS_TALL_BOX, sets: 3, reps: '10 each leg', note: '16-18 inch box' },
    { exerciseName: E.SINGLE_LEG_RDL, sets: 3, reps: '10 each leg' },
    { exerciseName: E.BULGARIAN_SPLIT_SQUAT, sets: 3, reps: '8-10 each leg', note: 'Stop well above 90 degrees. Earn the depth.' },
    { exerciseName: E.NORDIC_CURL_NEGATIVES, sets: 3, reps: '5', note: '4-5 second eccentric lowering only' },
    { exerciseName: E.SIDE_LYING_HIP_ABDUCTION, sets: 3, reps: '20', note: 'Heavier band than Phase 1' },
  ],
  pull: upperPull,
  push: upperPush,
}

// Phase 3: Weeks 11-16 — Running Prep
const phase3: PhaseData = {
  lower_a: [
    { exerciseName: E.LEG_PRESS_HEAVY, sets: 4, reps: '8' },
    { exerciseName: E.STEP_DOWN, sets: 3, reps: '12 each leg', note: 'Clinical VMO and patellar tracking exercise' },
    { exerciseName: E.SLED_PUSH, sets: 4, reps: '20 meters', note: 'Zero patellar compression. Mimics running mechanics.' },
    { exerciseName: E.SINGLE_LEG_GLUTE_BRIDGE_ELEVATED, sets: 3, reps: '12 each leg', note: 'Foot on bench' },
    { exerciseName: E.STANDING_CALF_RAISES_HEAVY, sets: 4, reps: '12', note: '2 sec up, 2 sec hold, 3 sec down' },
  ],
  lower_b: [
    { exerciseName: E.BULGARIAN_SPLIT_SQUAT_FULL, sets: 4, reps: '8-10 each leg', note: 'Earned depth from Phase 2. Add dumbbells or barbell.' },
    { exerciseName: E.NORDIC_CURL_NEGATIVES, sets: 3, reps: '6-8', note: 'Increase reps from Phase 2. Same 4-5 sec eccentric.' },
    { exerciseName: E.SINGLE_LEG_RDL_HEAVIER, sets: 3, reps: '10 each leg', note: 'Increase load from Phase 2' },
    { exerciseName: E.TKE_HIP_ABDUCTION, sets: 2, reps: '15 each (superset)', note: 'Warm-up staple and session finisher' },
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

export const phaseWeekCounts: Record<number, number> = { 1: 4, 2: 6, 3: 6 }

export const phaseInfo: Record<number, { name: string; weeks: string }> = {
  1: { name: 'Foundation', weeks: '1-4' },
  2: { name: 'Load Progression', weeks: '5-10' },
  3: { name: 'Running Prep', weeks: '11-16' },
}
