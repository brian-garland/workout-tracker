import { useState, useEffect, useCallback } from 'react'

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
      if (prev.phase === 1 && nextWeek > 5) {
        return { phase: 2, weekNumber: 1 }
      }
      if (prev.phase === 2 && nextWeek > 5) {
        return { phase: 3, weekNumber: 1 }
      }
      if (prev.phase === 3 && nextWeek > 6) {
        return { phase: 3, weekNumber: 6 } // stay at max
      }
      return { ...prev, weekNumber: nextWeek }
    })
  }, [])

  const setPhase = useCallback((phase: number) => {
    setSettings((prev) => ({ ...prev, phase }))
  }, [])

  const setWeek = useCallback((weekNumber: number) => {
    setSettings((prev) => ({ ...prev, weekNumber }))
  }, [])

  return { ...settings, advanceWeek, setPhase, setWeek }
}
