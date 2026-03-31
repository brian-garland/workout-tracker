import type { DaySchedule } from '../lib/types'
import { phaseWeekCounts } from './phases'

export const weekSchedule: DaySchedule[] = [
  { dayName: 'Mon', sessionType: 'lower_a', displayName: 'Lower Body A' },
  { dayName: 'Tue', sessionType: 'pull', displayName: 'Upper Pull', note: '6am Hot Yoga' },
  { dayName: 'Wed', sessionType: 'yoga', displayName: 'Yoga Sculpt / Rest' },
  { dayName: 'Thu', sessionType: 'lower_b', displayName: 'Lower Body B', note: '6am Hot Yoga' },
  { dayName: 'Fri', sessionType: 'push', displayName: 'Upper Push' },
  { dayName: 'Sat', sessionType: 'yoga', displayName: 'Yoga' },
  { dayName: 'Sun', sessionType: 'rest', displayName: 'Rest / Light Walk' },
]

export function getSessionForDate(date: Date): DaySchedule {
  const dayIndex = (date.getDay() + 6) % 7 // Monday = 0
  return weekSchedule[dayIndex]
}

export function getWeekDates(referenceDate: Date): Date[] {
  const date = new Date(referenceDate)
  const dayOfWeek = (date.getDay() + 6) % 7 // Monday = 0
  const monday = new Date(date)
  monday.setDate(date.getDate() - dayOfWeek)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return formatDate(date) === formatDate(today)
}

function getPhaseOffset(phase: number): number {
  let offset = 0
  for (let p = 1; p < phase; p++) {
    offset += phaseWeekCounts[p] ?? 0
  }
  return offset
}

export function getWeekDatesForProgram(
  programStartDate: string,
  phase: number,
  weekNumber: number
): Date[] {
  const totalWeeks = getPhaseOffset(phase) + (weekNumber - 1)
  const start = new Date(programStartDate + 'T12:00:00')
  start.setDate(start.getDate() + totalWeeks * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

/**
 * Calculate the current phase and week number based on the program start date
 * and today's date.
 */
export function getCurrentPhaseAndWeek(programStartDate: string, referenceDate?: Date): { phase: number; weekNumber: number } {
  const start = new Date(programStartDate + 'T12:00:00')
  const ref = referenceDate ? new Date(referenceDate) : new Date()
  ref.setHours(12, 0, 0, 0)

  const diffMs = ref.getTime() - start.getTime()
  const diffWeeks = Math.max(0, Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)))

  let remainingWeeks = diffWeeks
  for (let p = 1; p <= 3; p++) {
    const weeksInPhase = phaseWeekCounts[p] ?? 6
    if (remainingWeeks < weeksInPhase) {
      return { phase: p, weekNumber: remainingWeeks + 1 }
    }
    remainingWeeks -= weeksInPhase
  }

  // Past the end of all phases — return last week
  return { phase: 3, weekNumber: phaseWeekCounts[3] ?? 6 }
}
