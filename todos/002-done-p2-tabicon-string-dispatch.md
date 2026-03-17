# TabIcon uses untyped string dispatch

**Priority:** P2
**Status:** done
**Tags:** code-review, typescript

## Problem

`TabIcon` in `src/components/BottomNav.tsx:35` takes `name: string` and dispatches on magic strings `'Home'`, `'Today'`, falling through to History as default. No compile-time safety if a label changes.

## Fix

```ts
type TabName = 'Home' | 'Today' | 'History'

function TabIcon({ name, active }: { name: TabName; active: boolean }) { ... }
```

Update the `tabs` array type accordingly:
```ts
const tabs: Array<{ to: string; label: TabName; active: boolean }> = [...]
```

## Files
- `src/components/BottomNav.tsx`
