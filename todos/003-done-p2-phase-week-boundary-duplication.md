# Phase week boundaries are duplicated magic numbers

**Priority:** P2
**Status:** done
**Tags:** code-review, architecture

## Problem

Phase week counts are hardcoded in two places that must stay in sync:
- `src/hooks/useSettings.ts:35-41` (logic: `> 4`, `> 6`, `> 6`)
- `src/data/phases.ts:97-101` (display: `'1-4'`, `'5-10'`, `'11-16'`)

If either changes independently, the system falls out of sync. The previous code already had this bug.

## Fix

Extract a single source of truth in `phases.ts`:

```ts
export const phaseWeekCounts: Record<number, number> = { 1: 4, 2: 6, 3: 6 }
```

Then in `useSettings.ts`:
```ts
import { phaseWeekCounts } from '../data/phases'

const maxWeeks = phaseWeekCounts[prev.phase] ?? 6
if (nextWeek > maxWeeks && prev.phase < 3) {
  return { phase: prev.phase + 1, weekNumber: 1 }
}
```

## Files
- `src/data/phases.ts`
- `src/hooks/useSettings.ts`
