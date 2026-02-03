import { useState, useEffect } from 'react';
import { loadMomentsPhotos, getMostRecentPhoto, MomentsPhoto } from '../utils/momentsPhotosStorage';

export function useMomentsPhotos() {
  const [photos, setPhotos] = useState<MomentsPhoto[]>([]);
  const [mostRecent, setMostRecent] = useState<MomentsPhoto | null>(null);

  useEffect(() => {
    const loadPhotos = () => {
      const loadedPhotos = loadMomentsPhotos();
      setPhotos(loadedPhotos);
      setMostRecent(getMostRecentPhoto());
    };

    loadPhotos();

    // Listen for storage changes (e.g., from other tabs or after camera capture)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'moments_photos') {
        loadPhotos();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event for same-tab updates
    const handleCustomUpdate = () => {
      loadPhotos();
    };
    window.addEventListener('moments_photos_updated', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('moments_photos_updated', handleCustomUpdate);
    };
  }, []);

  return { photos, mostRecent };
}
