import { useState, useEffect, useCallback } from 'react'
import { phaseWeekCounts } from '../data/phases'

interface Settings {
  phase: number
  weekNumber: number
}

const STORAGE_KEY = 'workout-tracker-settings'

const defaultSettings: Settings = {
  phase: 1,
  weekNumber: 1,
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return { ...defaultSettings, ...JSON.parse(stored) }
      } catch {
        return defaultSettings
      }
    }
    return defaultSettings
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const advanceWeek = useCallback(() => {
    setSettings((prev) => {
      const nextWeek = prev.weekNumber + 1
      const maxWeeks = phaseWeekCounts[prev.phase] ?? 6
      if (nextWeek > maxWeeks && prev.phase < 3) {
        return { phase: prev.phase + 1, weekNumber: 1 }
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
        return { phase: prev.phase - 1, weekNumber: prevPhaseWeeks }
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
