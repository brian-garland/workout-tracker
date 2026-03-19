import type { DaySchedule } from '../lib/types'

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
