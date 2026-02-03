import { useState, useEffect, useCallback } from 'react';
import { loadProfile, saveProfile, UserProfile } from '../utils/profileStorage';
import { useAutoGeolocation, GeolocationResult } from './useAutoGeolocation';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(loadProfile());

  // Auto-request geolocation if location is not set
  const shouldRequestLocation = !profile.location && !profile.coordinates;

  const handleGeolocationSuccess = useCallback(
    (coords: GeolocationResult) => {
      const locationString = `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
      const updatedProfile = {
        ...profile,
        location: locationString,
        coordinates: coords,
      };
      saveProfile(updatedProfile);
      setProfile(updatedProfile);
    },
    [profile]
  );

  useAutoGeolocation(handleGeolocationSuccess, shouldRequestLocation);

  useEffect(() => {
    const handleProfileUpdate = () => {
      setProfile(loadProfile());
    };

    window.addEventListener('profile_updated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);

    return () => {
      window.removeEventListener('profile_updated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    const updatedProfile = { ...profile, ...updates };
    saveProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  return { profile, updateProfile };
}
