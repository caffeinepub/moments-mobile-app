# Specification

## Summary
**Goal:** Promote Draft Version 146 to be the active live deployment and prevent the platform from reverting the live version back to 125.

**Planned changes:**
- Promote/mark deployment version 146 as the live/active version on the deployment platform.
- Ensure version 125 is no longer treated as the live/active deployment after 146 is promoted.
- Verify deployment behavior so refresh/reload and no-op redeploys do not cause the live version to switch back to 125.

**User-visible outcome:** Users consistently receive the Version 146 build after deployment, and the live/active version remains 146 (not 125) across refreshes and subsequent no-op redeploys unless explicitly changed.
