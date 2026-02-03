# Specification

## Summary
**Goal:** Polish the Vault UX so it feels more dynamic, consistent, and provides a clear full-screen moment viewing experience.

**Planned changes:**
- Add subtle entrance/viewport animations for Vault month sections and photo cards, plus a pressed/tap micro-interaction on thumbnail click.
- Redesign Vault month thumbnails to use consistent, intentional glassmorphic-style tiles with refined spacing/radius/shadows while keeping a clean 3-column mobile grid.
- Enforce true square (1:1) thumbnails across browsers using explicit CSS/inline aspect-ratio fallback (not relying on Tailwind `aspect-square`) with `object-fit: cover`.
- Improve the enlarged moment view from a Vault thumbnail to reliably show a crisp, near full-screen image with a clear close/back control, using the original stored image data.
- Apply the existing camera-style pulsating animation to all buttons (including icon-only buttons), excluding disabled states, with a safe opt-out (e.g., `no-pulse`).

**User-visible outcome:** The Vault screen feels lively and consistent, thumbnails are always square, tapping a moment gives immediate feedback and opens a clear full-screen image view, and buttons across the app gently pulse (unless disabled or opted out).
