# Specification

## Summary
**Goal:** Improve the splash screen and Moments experience by adding a 4th video slide, renaming “Vault” to “Moments”, enabling video moments, enforcing a 10-item cap with deletion, fixing the navbar notifications entry, and adding consistent back-slide transitions across the app.

**Planned changes:**
- Add a 4th splash slide in `frontend/src/pages/MobileSplashScreen.tsx` using `Gel Polish Manicure (1).mp4` rendered like an image (muted, looping, inline, no controls, no pointer interaction) and update slideshow logic to support 4 slides.
- Rename the user-facing label “Vault” to “Moments” everywhere in the UI, without changing existing route paths.
- Replace the Home bottom navbar Calendar item with a notifications bell item that navigates to the notifications inbox screen.
- Remove the music option from the Moments (Vault) moment viewer by removing the toggle and disabling any background music initialization in `frontend/src/pages/VaultMomentPage.tsx`.
- Extend Moments to support both image and video uploads, persistence in the existing local-first moments storage, and correct rendering in the grid (`frontend/src/pages/VaultPage.tsx`) and detail viewer (`frontend/src/pages/VaultMomentPage.tsx`).
- Enforce a maximum of 10 total moments (images + videos) and add in-app deletion so users can free space; show a clear English error when at capacity and guide users to delete moments.
- Add a consistent slide transition animation for back-arrow (and equivalent back) navigation across screens that have a back arrow.

**User-visible outcome:** Users see a 4-slide splash flow with the 4th slide playing seamlessly as a “static” video, the app feature is labeled “Moments” instead of “Vault”, the bottom navbar shows a working notifications bell (no calendar), Moments supports both photos and videos with a 10-item limit and deletion, no music plays in the moment viewer, and back navigation uses a smooth slide-back transition across the app.
