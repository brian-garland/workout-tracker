# Exercise names are stringly-coupled across 3 files

**Priority:** P2
**Status:** done
**Tags:** code-review, architecture

## Problem

Exercise names must match exactly between:
- `src/data/phases.ts` (which exercises appear per phase)
- `src/data/cautions.ts` (caution messages by name)
- `supabase/schema.sql` (seed data)

If any name drifts by even one character (e.g., `'Step-Ups'` vs `'Step Ups'`), `getExercise()` returns `undefined` and set data is silently lost.

## Fix

Create an exercise name constants file:

```ts
// src/data/exerciseNames.ts
export const EXERCISES = {
  BULGARIAN_SPLIT_SQUAT: 'Bulgarian Split Squat',
  STEP_UPS: 'Step-Ups',
  // ...
} as const
```

Reference these constants in `phases.ts` and `cautions.ts`. The `schema.sql` still needs manual alignment, but the TypeScript side becomes safe.

## Files
- New: `src/data/exerciseNames.ts`
- `src/data/phases.ts`
- `src/data/cautions.ts`
