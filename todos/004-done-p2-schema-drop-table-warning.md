# Schema DROP TABLE CASCADE has misleading comment

**Priority:** P2
**Status:** done
**Tags:** code-review, security

## Problem

`supabase/schema.sql:4-9` has `DROP TABLE IF EXISTS ... CASCADE` with a comment saying "safe to re-run". This is misleading — it will permanently destroy all workout data if run against a populated database.

## Fix

Either:
1. Change the comment to `-- WARNING: DESTROYS ALL DATA. Only run on fresh/dev databases.`
2. Move the DROP statements to a separate `supabase/reset-schema.sql` file
3. Replace with `CREATE TABLE IF NOT EXISTS` for true idempotency without data loss

## Files
- `supabase/schema.sql`
