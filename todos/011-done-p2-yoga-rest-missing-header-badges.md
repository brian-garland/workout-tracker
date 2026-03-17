# Yoga/Rest views missing session type header and phase badges

**Priority:** P2
**Status:** done
**Tags:** code-review, ux, consistency

## Problem

Workout views (Lower Body A, Upper Pull, etc.) show a consistent header: session type as H1 ("Lower Body A"), day as subtitle ("Monday, Mar 16"), and Phase/Week badges. Yoga and Rest views only show the day label ("Wednesday, Mar 18") with no session name in the header and no phase/week badges.

This happens because `SessionView.tsx:144-160` returns early for rest/yoga sessions before reaching the main return block that renders the header and badges.

## Fix

Add the same header structure to the rest/yoga early return in `SessionView.tsx`:

```tsx
if (isRest) {
  const isYoga = schedule.sessionType === 'yoga'
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{schedule.displayName}</h1>
        <p className="text-text-muted">{dayLabel}</p>
        <div className="flex gap-2 mt-2">
          <Badge variant="primary">Phase {phase}</Badge>
          <Badge>Week {weekNumber}</Badge>
        </div>
      </div>
      <Card className="text-center py-12 space-y-3">
        ...
      </Card>
    </div>
  )
}
```

## Files
- `src/features/session/SessionView.tsx`
