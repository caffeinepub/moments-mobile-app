# Specification

## Summary
**Goal:** Improve the Home planned-moment planning flow by using a slide-up bottom sheet (not navigation), refine the bottom sheet UI (especially date/time), and ensure planned-moment day indicators reliably update and color-code immediately across Home and Calendar.

**Planned changes:**
- Update Home interactions so tapping a day in the weekly strip or tapping “Start Planning” opens the planned-moment slide-up bottom sheet (matching the Calendar page pattern) and uses the selected/tapped date; closing returns to Home without route changes.
- Redesign the Planned Moment bottom sheet UI (per image-45.png reference) to simplify date/time setup by replacing +/- steppers with a cleaner time selection control, keep the “With who?” selector simple and icon-based, and remove any pulsating button behavior within the sheet.
- Ensure planned moments are stored/retrieved using the correct ISO date (YYYY-MM-DD) so they appear on the exact chosen day, and show a color-coded indicator in the Home weekly strip based on the saved moment’s category color.
- Make planned-moment storage changes observable so saving a planned moment automatically refreshes dependent UI (Home weekly indicators, Calendar indicators, and any planned-moment lists) without manual reload.
- Adjust global pulsing behavior so most buttons across the app do not pulse by default; pulsing becomes opt-in for explicitly designated buttons only.

**User-visible outcome:** On Home, users can open the planned-moment planner as a slide-up sheet from the weekly calendar or “Start Planning,” set a time with a cleaner UI, save without pulsing animations, and immediately see correctly color-coded indicators on the chosen day (consistent across Home and Calendar).
