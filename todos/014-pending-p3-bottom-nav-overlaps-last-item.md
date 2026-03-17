# Bottom nav overlaps last content item on initial viewport

**Priority:** P3
**Status:** pending
**Tags:** code-review, ux, layout

## Problem

The fixed bottom nav (`BottomNav.tsx`) slightly overlaps the last visible content item before scrolling on several pages:

- **Dashboard**: Sunday "Rest / Light Walk" card is partially cut off
- **History**: Last exercise ("Reverse Lunge") is partially hidden

The `pb-24` padding in `Layout.tsx:8` handles the scroll case (content is reachable by scrolling), but the last item in the initial viewport gets clipped visually, giving a sense that content is missing.

## Fix

This is cosmetic — scrolling works correctly. Options:

1. Increase bottom padding from `pb-24` to `pb-28` or `pb-32` for more breathing room
2. Add a subtle fade/gradient at the bottom edge above the nav to hint at more content
3. Accept as-is — standard pattern for fixed bottom navs on mobile

## Files
- `src/components/Layout.tsx`
