import { supabase } from '../lib/supabase'
import type { SetLog } from '../lib/types'

export async function saveSets(
  sessionId: number,
  sets: Array<{
    exercise_id: number
    set_number: number
    weight_lbs: number | null
    reps_completed: number | null
    rpe: number | null
  }>
): Promise<boolean> {
  const rows = sets.map((s) => ({ ...s, session_id: sessionId }))
  const { error } = await supabase.from('sets').insert(rows)
  if (error) {
    console.error('Error saving sets:', error)
    return false
  }
  return true
}

export async function deleteSetsForSession(sessionId: number): Promise<boolean> {
  const { error } = await supabase
    .from('sets')
    .delete()
    .eq('session_id', sessionId)

  if (error) {
    console.error('Error deleting sets:', error)
    return false
  }
  return true
}

export async function getSetsForSession(sessionId: number): Promise<SetLog[]> {
  const { data, error } = await supabase
    .from('sets')
    .select('*')
    .eq('session_id', sessionId)
    .order('exercise_id')
    .order('set_number')

  if (error) {
    console.error('Error fetching sets:', error)
    return []
  }
  return data as SetLog[]
}

export async function getSetsForExercise(exerciseId: number): Promise<
  Array<SetLog & { session_date: string }>
> {
  const { data, error } = await supabase
    .from('sets')
    .select('*, sessions!inner(date)')
    .eq('exercise_id', exerciseId)
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching exercise sets:', error)
    return []
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    ...(row as unknown as SetLog),
    session_date: (row.sessions as { date: string }).date,
  }))
}
