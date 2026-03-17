# History page only shows Lower Body category

**Priority:** P3
**Status:** pending
**Tags:** code-review, ux, data

## Problem

During browser testing, the History page only displayed the "Lower Body" category badge with ~10 exercises. No "Upper Pull" or "Upper Push" sections were visible. This could be:

1. A data issue — exercises for other categories may not be seeded in Supabase
2. A rendering issue — the grouping logic in `HistoryList.tsx` skips empty categories (line 38: `if (exs.length === 0) return null`)

## Fix

1. Verify Supabase `exercises` table has entries for all three categories (`lower`, `upper_pull`, `upper_push`)
2. If seed data is missing, update `supabase/schema.sql` to include exercises for all categories
3. If the exercises exist but aren't being fetched, check the `useExercises` hook query

## Files
- `supabase/schema.sql` (seed data)
- `src/features/history/HistoryList.tsx`
- `src/hooks/useExercises.ts`
