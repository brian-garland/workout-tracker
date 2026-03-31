import { useState, useEffect, useCallback } from 'react'
import { phaseWeekCounts } from '../data/phases'
import { getWeekDates, formatDate, getCurrentPhaseAndWeek } from '../data/schedule'
import { getEarliestSessionDate } from './useSessions'

interface Settings {
  phase: number
  weekNumber: number
  programStartDate: string // ISO date string (YYYY-MM-DD), Monday of week 1
}

const STORAGE_KEY = 'workout-tracker-settings'

function getMondayOfCurrentWeek(): string {
  const dates = getWeekDates(new Date())
  return formatDate(dates[0])
}

const defaultSettings: Settings = {
  phase: 1,
  weekNumber: 1,
  programStartDate: getMondayOfCurrentWeek(),
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = { ...defaultSettings, ...JSON.parse(stored) }
        // Auto-calculate current phase/week from program start date
        const current = getCurrentPhaseAndWeek(parsed.programStartDate)
        return { ...parsed, phase: current.phase, weekNumber: current.weekNumber }
      } catch {
        return defaultSettings
      }
    }
    return defaultSettings
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  // Auto-correct programStartDate from earliest session in database
  useEffect(() => {
    getEarliestSessionDate().then((earliestDate) => {
      if (!earliestDate) return
      const earliest = new Date(earliestDate + 'T12:00:00')
      const dayOfWeek = (earliest.getDay() + 6) % 7 // Monday = 0
      const monday = new Date(earliest)
      monday.setDate(earliest.getDate() - dayOfWeek)
      const correctStart = formatDate(monday)
      if (correctStart < settings.programStartDate) {
        setSettings((prev) => {
          const current = getCurrentPhaseAndWeek(correctStart)
          return { ...prev, programStartDate: correctStart, phase: current.phase, weekNumber: current.weekNumber }
        })
      }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const advanceWeek = useCallback(() => {
    setSettings((prev) => {
      const nextWeek = prev.weekNumber + 1
      const maxWeeks = phaseWeekCounts[prev.phase] ?? 6
      if (nextWeek > maxWeeks && prev.phase < 3) {
        return { ...prev, phase: prev.phase + 1, weekNumber: 1 }
      }
      if (nextWeek > maxWeeks) {
        return prev // stay at max
      }
      return { ...prev, weekNumber: nextWeek }
    })
  }, [])

  const rewindWeek = useCallback(() => {
    setSettings((prev) => {
      if (prev.weekNumber > 1) {
        return { ...prev, weekNumber: prev.weekNumber - 1 }
      }
      if (prev.phase > 1) {
        const prevPhaseWeeks = phaseWeekCounts[prev.phase - 1] ?? 6
        return { ...prev, phase: prev.phase - 1, weekNumber: prevPhaseWeeks }
      }
      return prev // Already at Phase 1 Week 1
    })
  }, [])

  const setPhase = useCallback((phase: number) => {
    setSettings((prev) => ({ ...prev, phase }))
  }, [])

  const setWeek = useCallback((weekNumber: number) => {
    setSettings((prev) => ({ ...prev, weekNumber }))
  }, [])

  return { ...settings, advanceWeek, rewindWeek, setPhase, setWeek }
}
