// Single source of truth for exercise names.
// These must match the seed data in supabase/schema.sql.
export const EXERCISES = {
  // Lower Body
  LEG_PRESS: 'Leg Press',
  TKE: 'Terminal Knee Extension with Band (TKE)',
  ISOMETRIC_WALL_SIT: 'Isometric Wall Sit',
  GLUTE_BRIDGE: 'Glute Bridge',
  STANDING_CALF_RAISES: 'Standing Calf Raises',
  STEP_UPS: 'Step-Ups',
  RDL: 'Romanian Deadlift (RDL)',
  SIDE_LYING_HIP_ABDUCTION: 'Side-Lying Hip Abduction with Band',
  REVERSE_LUNGE: 'Reverse Lunge',
  LEG_PRESS_PAUSE: 'Leg Press (with pause)',
  SINGLE_LEG_WALL_SIT: 'Single-Leg Wall Sit',
  SINGLE_LEG_GLUTE_BRIDGE: 'Single-Leg Glute Bridge',
  STANDING_CALF_RAISES_WEIGHTED: 'Standing Calf Raises (weighted)',
  STEP_UPS_TALL_BOX: 'Step-Ups (tall box, with dumbbells)',
  SINGLE_LEG_RDL: 'Single-Leg RDL',
  BULGARIAN_SPLIT_SQUAT: 'Bulgarian Split Squat',
  NORDIC_CURL_NEGATIVES: 'Nordic Curl Negatives',
  LEG_PRESS_HEAVY: 'Leg Press (heavy)',
  STEP_DOWN: 'Step-Down Exercise',
  SLED_PUSH: 'Sled Push',
  SINGLE_LEG_GLUTE_BRIDGE_ELEVATED: 'Single-Leg Glute Bridge (elevated)',
  STANDING_CALF_RAISES_HEAVY: 'Standing Calf Raises (heavy)',
  BULGARIAN_SPLIT_SQUAT_FULL: 'Bulgarian Split Squat (full depth)',
  SINGLE_LEG_RDL_HEAVIER: 'Single-Leg RDL (heavier)',
  TKE_HIP_ABDUCTION: 'TKE with Band + Hip Abduction',

  // Upper Pull
  BARBELL_ROW: 'Barbell or Dumbbell Row',
  LAT_PULLDOWN: 'Lat Pulldown or Weighted Pull-Up',
  SEATED_CABLE_ROW: 'Seated Cable Row (narrow grip)',
  FACE_PULLS: 'Face Pulls (cable)',
  INCLINE_CURL: 'Incline Dumbbell Curl',
  HAMMER_CURL: 'Hammer Curl',

  // Upper Push
  BENCH_PRESS: 'Barbell or Dumbbell Bench Press',
  INCLINE_PRESS: 'Incline Dumbbell Press',
  OVERHEAD_PRESS: 'Overhead Press',
  LATERAL_RAISES: 'Lateral Raises',
  CABLE_FLY: 'Cable Chest Fly or Pec Deck',
  TRICEP_PUSHDOWN: 'Tricep Pushdown (rope)',
  OVERHEAD_TRICEP_EXTENSION: 'Overhead Tricep Extension',
} as const
