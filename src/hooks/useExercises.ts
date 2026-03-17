import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Exercise } from '../lib/types'

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('id')
      if (error) console.error('Error fetching exercises:', error)
      else setExercises(data as Exercise[])
      setLoading(false)
    }
    fetch()
  }, [])

  return { exercises, loading }
}

export function useExerciseByName() {
  const { exercises, loading } = useExercises()
  const map = useMemo(() => new Map(exercises.map((e) => [e.name, e])), [exercises])
  const getExercise = useCallback((name: string) => map.get(name), [map])
  return { getExercise, exercises, loading }
}
