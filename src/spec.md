# Specification

## Summary
**Goal:** Improve the Home planning experience by immediately surfacing saved planned moments, updating the planning CTA after the first save, and correctly color-filling the weekly date pill for planned days.

**Planned changes:**
- After a planned moment is saved from the planner bottom sheet, render a new “saved planning” card directly below the planning area showing the plan’s date label, time, and optional title (omit title row when not provided).
- Style each saved planning card using the plan’s assigned color as a full background fill.
- Display multiple saved planning cards in a vertical list sorted most-recent-first (newest at the top).
- Update the Home planning CTA: show “Start Planning” when there are no planned moments; after the first save, replace it with a compact “+” icon button that opens the same planning bottom sheet flow.
- Fix Home weekly calendar strip color coding so the entire day pill becomes color-filled for dates that have planned moments (not just a dot), and updates immediately after saving.

**User-visible outcome:** After saving a plan, it instantly appears on Home as a color-filled card below the planning area; additional saved plans stack with the newest on top; the “Start Planning” button becomes a “+” add button after the first plan; and planned dates show a fully color-filled day pill in the weekly strip right away.
