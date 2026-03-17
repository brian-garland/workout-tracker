# No "Previous Week" navigation on dashboard

**Priority:** P2
**Status:** done
**Tags:** code-review, ux

## Problem

The dashboard has a "Next Week" button to advance the week counter, but no way to go back to a previous week. Users can only move forward. If they accidentally advance past their current week, they cannot correct it without manually editing localStorage.

## Fix

Add a "Prev Week" button alongside "Next Week" in `Dashboard.tsx`, and add a corresponding `rewindWeek` function to `useSettings.ts`:

```ts
// useSettings.ts
function rewindWeek() {
  setSettings((prev) => {
    if (prev.weekNumber > 1) {
      return { ...prev, weekNumber: prev.weekNumber - 1 }
    }
    if (prev.phase > 1) {
      // Go back to last week of previous phase
      return { ...prev, phase: prev.phase - 1, weekNumber: /* last week of prev phase */ }
    }
    return prev // Already at Phase 1 Week 1
  })
}
```

Dashboard header becomes:
```tsx
<Button variant="ghost" size="sm" onClick={rewindWeek}>&larr; Prev Week</Button>
<Button variant="ghost" size="sm" onClick={advanceWeek}>Next Week &rarr;</Button>
```

## Files
- `src/hooks/useSettings.ts`
- `src/features/dashboard/Dashboard.tsx`
