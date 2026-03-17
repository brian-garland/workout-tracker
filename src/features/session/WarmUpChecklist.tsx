import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { Checkbox } from '../../components/ui/Checkbox'
import { lowerBodyWarmup } from '../../data/warmup'

export function WarmUpChecklist() {
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const [collapsed, setCollapsed] = useState(false)

  const allDone = checked.size === lowerBodyWarmup.length

  function toggle(index: number) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <Card className={allDone ? 'border border-success/30' : ''}>
      <button
        className="w-full flex items-center justify-between"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold">Warm-Up Protocol</span>
          {allDone && (
            <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-muted">
            {checked.size}/{lowerBodyWarmup.length}
          </span>
          <svg
            className={`w-5 h-5 text-text-muted transition-transform ${collapsed ? '' : 'rotate-180'}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {!collapsed && (
        <div className="mt-3 space-y-1">
          {lowerBodyWarmup.map((step, i) => (
            <Checkbox
              key={i}
              checked={checked.has(i)}
              onChange={() => toggle(i)}
              label={step.name}
              description={`${step.description}${step.duration ? ` — ${step.duration}` : ''}${step.reps ? ` — ${step.reps}` : ''}`}
            />
          ))}
        </div>
      )}
    </Card>
  )
}
