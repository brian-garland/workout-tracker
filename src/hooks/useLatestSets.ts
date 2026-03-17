import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { SetLog, SessionType } from '../lib/types'

interface PreviousSets {
  [exerciseId: number]: SetLog[]
}

export function useLatestSets(sessionType: SessionType, currentDate: string) {
  const [previousSets, setPreviousSets] = useState<PreviousSets>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      // Find the most recent completed session of the same type before this date
      const { data: prevSession } = await supabase
        .from('sessions')
        .select('id')
        .eq('session_type', sessionType)
        .lt('date', currentDate)
        .not('completed_at', 'is', null)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!prevSession) {
        setLoading(false)
        return
      }

      const { data: sets } = await supabase
        .from('sets')
        .select('*')
        .eq('session_id', prevSession.id)
        .order('set_number')

      if (sets) {
        const grouped: PreviousSets = {}
        for (const set of sets as SetLog[]) {
          if (!grouped[set.exercise_id]) grouped[set.exercise_id] = []
          grouped[set.exercise_id].push(set)
        }
        setPreviousSets(grouped)
      }
      setLoading(false)
    }
    fetch()
  }, [sessionType, currentDate])

  return { previousSets, loading }
}
