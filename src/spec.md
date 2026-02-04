# Specification

## Summary
**Goal:** Make planned-moment pill cards noticeably slimmer (reduced height/thickness) and more horizontally elongated while keeping the existing border-only pill style and layout.

**Planned changes:**
- Update CSS in `frontend/src/index.css` for planned-moment card classes used by `frontend/src/components/PlannedMomentCard.tsx` (e.g., `.planned-moment-card-clear`, `.planned-moment-card-color-dot`) to reduce vertical padding/height and increase the capsule-like width-to-height ratio.
- Adjust action icon sizing/spacing as needed so the right-side icon stack remains aligned and functional within the slimmer pill.
- Ensure text stays readable and truncates appropriately without overflowing outside the pill, while preserving the left color dot and `moment.color`-driven border color via `--card-border-color`.

**User-visible outcome:** Planned-moment cards appear thinner and more elongated capsules, with the same border-only look, left color dot, and working share/delete icons without layout breakage.
