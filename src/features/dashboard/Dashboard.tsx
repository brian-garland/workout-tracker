import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useSettings } from '../../hooks/useSettings'
import { useSessions } from '../../hooks/useSessions'
import { weekSchedule, getWeekDatesForProgram, formatDate, isToday } from '../../data/schedule'
import { phaseInfo } from '../../data/phases'
import { supplements, proteinTarget } from '../../data/supplements'

export function Dashboard() {
  const { phase, weekNumber, programStartDate, advanceWeek, rewindWeek } = useSettings()
  const weekDates = getWeekDatesForProgram(programStartDate, phase, weekNumber)
  const startDate = formatDate(weekDates[0])
  const endDate = formatDate(weekDates[6])
  const { sessions } = useSessions(startDate, endDate)
  const [showSupplements, setShowSupplements] = useState(false)

  const completedDates = new Set(
    sessions.filter((s) => s.completed_at).map((s) => s.date)
  )
  const draftDates = new Set(
    sessions.filter((s) => !s.completed_at).map((s) => s.date)
  )

  const info = phaseInfo[phase]

  return (
    <div className="space-y-4">
      {/* Phase Header */}
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="primary">Phase {phase}</Badge>
          <span className="ml-2 text-text-muted text-sm">Week {weekNumber}</span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={rewindWeek}>
            &larr; Prev
          </Button>
          <Button variant="ghost" size="sm" onClick={advanceWeek}>
            Next &rarr;
          </Button>
        </div>
      </div>

      {info && (
        <p className="text-sm text-text-muted">{info.name} (Weeks {info.weeks})</p>
      )}

      {/* Week Grid */}
      <div className="space-y-2">
        {weekDates.map((date, i) => {
          const schedule = weekSchedule[i]
          const dateStr = formatDate(date)
          const completed = completedDates.has(dateStr)
          const isDraft = !completed && draftDates.has(dateStr)
          const today = isToday(date)
          const isRest = schedule.sessionType === 'rest' || schedule.sessionType === 'yoga'

          return (
            <Link key={dateStr} to={`/session/${dateStr}`} className="block no-underline text-inherit">
              <Card
                highlight={today}
                className={`cursor-pointer active:bg-surface-bright transition-colors ${
                  completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-center w-12">
                      <div className="text-xs text-text-muted uppercase">{schedule.dayName}</div>
                      <div className="text-lg font-bold">
                        {date.getDate()}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{schedule.displayName}</div>
                      {schedule.note && (
                        <div className="text-sm text-text-muted">{schedule.note}</div>
                      )}
                      {isRest && (
                        <div className="text-sm text-text-muted">Recovery day</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {completed && (
                      <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    )}
                    {isDraft && (
                      <svg className="w-6 h-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    )}
                    <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Supplements */}
      <Card className="mt-4">
        <button
          className="w-full flex items-center justify-between"
          onClick={() => setShowSupplements(!showSupplements)}
        >
          <span className="font-medium">Supplement Timing</span>
          <svg
            className={`w-5 h-5 text-text-muted transition-transform ${showSupplements ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showSupplements && (
          <div className="mt-3 space-y-2">
            {supplements.map((s) => (
              <div key={s.name} className="flex justify-between text-sm gap-4">
                <div className="min-w-0">
                  <div className="text-text">{s.name}</div>
                  <div className="text-text-muted text-xs">{s.dose}</div>
                </div>
                <span className="text-text-muted text-xs text-right flex-shrink-0">{s.timing}</span>
              </div>
            ))}
            <div className="pt-2 mt-2 border-t border-surface-bright flex justify-between text-sm">
              <span className="text-text font-medium">Protein Target</span>
              <span className="text-primary font-medium">{proteinTarget}</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
