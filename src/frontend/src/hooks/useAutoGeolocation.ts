import { useEffect, useRef } from 'react';

const SESSION_KEY = 'geolocation_requested';

export interface GeolocationResult {
  latitude: number;
  longitude: number;
}

export function useAutoGeolocation(
  onSuccess: (coords: GeolocationResult) => void,
  shouldRequest: boolean
) {
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    // Only request once per session and when explicitly enabled
    if (!shouldRequest || hasRequestedRef.current) return;

    // Check if we already requested in this session
    const sessionRequested = sessionStorage.getItem(SESSION_KEY);
    if (sessionRequested) return;

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser');
      sessionStorage.setItem(SESSION_KEY, 'unsupported');
      return;
    }

    hasRequestedRef.current = true;
    sessionStorage.setItem(SESSION_KEY, 'requested');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: GeolocationResult = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        onSuccess(coords);
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        // Don't throw - just log and continue
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [shouldRequest, onSuccess]);
}
