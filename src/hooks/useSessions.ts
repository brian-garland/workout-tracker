import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Session, SessionType } from '../lib/types'

export function useSessions(startDate?: string, endDate?: string) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSessions = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('sessions').select('*').order('date', { ascending: false })
    if (startDate) query = query.gte('date', startDate)
    if (endDate) query = query.lte('date', endDate)
    const { data, error } = await query
    if (error) console.error('Error fetching sessions:', error)
    else setSessions(data as Session[])
    setLoading(false)
  }, [startDate, endDate])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  return { sessions, loading, refetch: fetchSessions }
}

export async function createSession(params: {
  date: string
  session_type: SessionType
  phase: number
  week_number: number
  pain_level: number | null
  notes: string | null
}): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      ...params,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating session:', error)
    return null
  }
  return data as Session
}

export async function getSessionByDate(date: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('date', date)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching session:', error)
    return null
  }
  return data as Session | null
}
