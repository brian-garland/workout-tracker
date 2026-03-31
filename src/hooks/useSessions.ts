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

export async function getEarliestSessionDate(): Promise<string | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select('date')
    .order('date', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching earliest session:', error)
    return null
  }
  return data?.date ?? null
}

export async function getSessionByDate(date: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('date', date)
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching session:', error)
    return null
  }
  return data as Session | null
}

export async function createDraftSession(params: {
  date: string
  session_type: SessionType
  phase: number
  week_number: number
}): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      ...params,
      pain_level: null,
      notes: null,
      completed_at: null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating draft session:', error)
    return null
  }
  return data as Session
}

export async function completeSession(sessionId: number): Promise<boolean> {
  const { error } = await supabase
    .from('sessions')
    .update({ completed_at: new Date().toISOString() })
    .eq('id', sessionId)

  if (error) {
    console.error('Error completing session:', error)
    return false
  }
  return true
}

export async function updateSession(
  sessionId: number,
  params: {
    pain_level?: number | null
    notes?: string | null
  }
): Promise<boolean> {
  const { error } = await supabase
    .from('sessions')
    .update(params)
    .eq('id', sessionId)

  if (error) {
    console.error('Error updating session:', error)
    return false
  }
  return true
}
