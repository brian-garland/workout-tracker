# Remove `generalCautions` dead code

**Priority:** P2
**Status:** done
**Tags:** code-review, quality

## Problem

`generalCautions` array in `src/data/cautions.ts:8-13` is exported but never imported anywhere in the codebase. The comment says "shown on relevant screens" but no screen renders it.

## Fix

Either:
1. Wire it into a UI surface (e.g., a collapsible caution banner on lower body session days in `SessionView.tsx`)
2. Remove the export entirely until it's needed

## Files
- `src/data/cautions.ts`
