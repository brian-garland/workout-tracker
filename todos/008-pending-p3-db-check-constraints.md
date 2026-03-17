# No CHECK constraints on database columns

**Priority:** P3
**Status:** pending
**Tags:** code-review, security

## Problem

The `sets` and `sessions` tables have no range constraints. Invalid data (negative weights, NaN, absurd rep counts) can be inserted.

## Fix

Add constraints to `supabase/schema.sql`:
```sql
weight_lbs numeric CHECK (weight_lbs >= 0 AND weight_lbs <= 2000),
reps_completed integer CHECK (reps_completed >= 0 AND reps_completed <= 200),
pain_level integer CHECK (pain_level >= 0 AND pain_level <= 10),
notes text CHECK (char_length(notes) <= 1000),
```

Also add a unique constraint to prevent duplicate sessions:
```sql
UNIQUE (date, session_type)
```

## Files
- `supabase/schema.sql`
