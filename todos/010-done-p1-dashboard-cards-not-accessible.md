# Dashboard day cards are not accessible as interactive elements

**Priority:** P1
**Status:** done
**Tags:** code-review, accessibility, ux

## Problem

The 7 day cards on the Dashboard use `<div onClick>` via the `Card` component. They do not appear in the accessibility tree as interactive elements — browser testing detected only 5 interactive elements on the dashboard (Next Week button, Supplement Timing button, 3 nav links). The day cards are invisible to screen readers, not keyboard-navigable, and violate WCAG.

The same pattern exists in `HistoryList.tsx` where exercise history cards also use `Card + onClick`.

## Fix

Replace `Card` + `onClick={() => navigate(...)}` with `<Link to={...}>` from react-router-dom. This makes the cards proper anchor elements that are keyboard-accessible, screen-reader-friendly, and get native browser link behaviors (right-click, cmd-click).

For Dashboard.tsx (~line 54-89):
```tsx
<Link to={`/session/${dateStr}`}>
  <Card highlight={today} className="...">
    ...
  </Card>
</Link>
```

For HistoryList.tsx (~line 43-59):
```tsx
<Link to={`/history/${ex.id}`}>
  <Card className="...">
    ...
  </Card>
</Link>
```

## Files
- `src/features/dashboard/Dashboard.tsx`
- `src/features/history/HistoryList.tsx`
- `src/components/ui/Card.tsx` (may need to support `as` prop or similar)
