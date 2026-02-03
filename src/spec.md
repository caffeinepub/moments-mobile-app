# Specification

## Summary
**Goal:** Revert UI regressions introduced during/after the Calendar feature by restoring the previous global button styling/behaviors and the original Splash/Onboarding slide card motion/animations, without changing the app’s visual design.

**Planned changes:**
- Restore pre-Calendar button styling and interaction behaviors (sizes, borders, shadows, typography, hover/active/disabled states) across all pages, ensuring Calendar-specific button styles are scoped and do not affect other screens.
- Restore Splash/Onboarding slide card transitions and per-card entrance animations to match the pre-Calendar timing/easing, direction, layering/z-index behavior, and clickability/pointer-events during transitions.

**User-visible outcome:** Buttons across the app look and behave as they did before the Calendar was implemented, and the Splash/Onboarding cards animate and transition smoothly with the original motion and content entrance effects.
