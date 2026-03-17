# `Settings.phase` typed as bare `number`

**Priority:** P3
**Status:** pending
**Tags:** code-review, typescript

## Problem

In `src/hooks/useSettings.ts:3-6`, `phase` is typed as `number` which allows invalid values like `99` or `-1`.

## Fix

```ts
interface Settings {
  phase: 1 | 2 | 3
  weekNumber: number
}
```

Also validate localStorage data on parse to ensure it matches valid values.

## Files
- `src/hooks/useSettings.ts`
