/**
 * Build version utilities for Draft 146
 * Provides runtime verification and cache-bust helpers
 */

export const CURRENT_BUILD_VERSION = '146';
export const BUILD_TIMESTAMP = '2026-02-05T00:00:00Z';

/**
 * Read the build version from the DOM meta tag
 */
export function getBuildVersionFromDOM(): string | null {
  const metaTag = document.querySelector('meta[name="build-version"]');
  return metaTag?.getAttribute('content') || null;
}

/**
 * Verify that the current running build matches the expected version
 */
export function verifyBuildVersion(): boolean {
  const domVersion = getBuildVersionFromDOM();
  return domVersion === CURRENT_BUILD_VERSION;
}

/**
 * Get the last seen build version from storage
 */
export function getLastSeenBuildVersion(): string | null {
  try {
    return localStorage.getItem('last-build-version');
  } catch {
    return null;
  }
}

/**
 * Store the current build version in localStorage
 */
export function storeCurrentBuildVersion(): void {
  try {
    localStorage.setItem('last-build-version', CURRENT_BUILD_VERSION);
  } catch (error) {
    console.warn('Failed to store build version:', error);
  }
}

/**
 * Check if a cache refresh is needed (build version mismatch)
 */
export function needsCacheRefresh(): boolean {
  const lastSeen = getLastSeenBuildVersion();
  
  // First load or no stored version
  if (!lastSeen) {
    return false;
  }
  
  // Version mismatch detected
  if (lastSeen !== CURRENT_BUILD_VERSION) {
    console.log(`Build version changed: ${lastSeen} → ${CURRENT_BUILD_VERSION}`);
    return true;
  }
  
  return false;
}

/**
 * Perform a hard refresh to clear stale cached assets
 */
export function performCacheRefresh(): void {
  console.log('Performing cache refresh for build 146...');
  storeCurrentBuildVersion();
  
  // Use location.reload(true) equivalent for hard refresh
  window.location.href = window.location.href.split('#')[0] + '?v=' + CURRENT_BUILD_VERSION;
}

/**
 * Log build information to console for diagnostics
 */
export function logBuildInfo(): void {
  console.log('=== Build Information ===');
  console.log('Expected Version:', CURRENT_BUILD_VERSION);
  console.log('DOM Version:', getBuildVersionFromDOM());
  console.log('Last Seen Version:', getLastSeenBuildVersion());
  console.log('Build Timestamp:', BUILD_TIMESTAMP);
  console.log('Verified:', verifyBuildVersion() ? '✓' : '✗');
  console.log('========================');
}
