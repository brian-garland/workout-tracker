# Warmup data has redundant description/reps fields

**Priority:** P3
**Status:** pending
**Tags:** code-review, quality

## Problem

In `src/data/warmup.ts`, some items repeat the reps value in the description:
```ts
{
  name: 'Banded Clamshells',
  description: '2x15 each side. Glute med activation.',
  reps: '2x15 each side',  // duplicates description
}
```

## Fix

Keep reps in `reps` only, coaching cue in `description` only:
```ts
{
  name: 'Banded Clamshells',
  description: 'Glute med activation.',
  reps: '2x15 each side',
}
```

## Files
- `src/data/warmup.ts`
