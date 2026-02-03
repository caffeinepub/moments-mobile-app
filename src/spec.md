# Specification

## Summary
**Goal:** Simplify the Home screen by removing the promo card, automatically set/persist user location via browser geolocation, and standardize a glassmorphic look for app cards (excluding buttons).

**Planned changes:**
- Remove the Home screen promotional card section (“Plan Meaningful Moments” / “Add Your Moment”) by deleting the corresponding promo-card block in `frontend/src/pages/HomeScreen.tsx`, ensuring no leftover layout gap.
- Add automatic, permission-based browser geolocation on fresh sessions (or when `profile.location` is unset) and persist the resulting location into the existing local-first profile storage so it appears wherever `profile.location` is displayed; handle denial/unavailability gracefully.
- Implement a reusable glassmorphic card style (CSS utility/class) and update existing solid white card containers (including `frontend/src/components/MomentsImageCard.tsx` outer card and the Home empty-state card in `frontend/src/pages/HomeScreen.tsx`) to use it while leaving all button styles unchanged.

**User-visible outcome:** The Home promo card is gone, cards across the app appear glassmorphic on the beige background, and the app can automatically populate and remember the user’s location (when permission is granted) without disrupting the UI if permission is denied.
