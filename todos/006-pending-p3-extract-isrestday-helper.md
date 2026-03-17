# Duplicated `isRest` check across components

**Priority:** P3
**Status:** pending
**Tags:** code-review, quality

## Problem

Both `Dashboard.tsx:51` and `SessionView.tsx:37` duplicate the same expression:
```ts
const isRest = schedule.sessionType === 'rest' || schedule.sessionType === 'yoga'
```

If a third non-workout type is added (e.g., `'deload'`), both files need updating.

## Fix

Add a helper to `src/data/schedule.ts`:
```ts
export function isRestDay(type: SessionType): boolean {
  return type === 'rest' || type === 'yoga'
}
```

## Files
- `src/data/schedule.ts`
- `src/features/dashboard/Dashboard.tsx`
- `src/features/session/SessionView.tsx`
