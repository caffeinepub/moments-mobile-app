// Local-first storage utilities for moments photos

export type MomentFeeling = 'Meaningful' | 'Good' | 'Okay';

export interface MomentsPhoto {
  id: number;
  data: string; // base64 data URL
  timestamp: number;
  type: string; // MIME type
  who?: string; // relationship/category
  reflection?: string; // optional one-sentence reflection
  feeling?: MomentFeeling; // post-save emotional check
}

const STORAGE_KEY = 'moments_photos';

export function loadMomentsPhotos(): MomentsPhoto[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading moments photos:', error);
    return [];
  }
}

export function getMostRecentPhoto(): MomentsPhoto | null {
  const photos = loadMomentsPhotos();
  if (photos.length === 0) return null;
  
  // Sort by timestamp descending and return the most recent
  const sorted = photos.sort((a, b) => b.timestamp - a.timestamp);
  return sorted[0];
}

export function saveMomentsPhoto(photo: MomentsPhoto): void {
  try {
    const photos = loadMomentsPhotos();
    photos.push(photo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('moments_photos_updated'));
  } catch (error) {
    console.error('Error saving moments photo:', error);
  }
}

export function updateMomentsPhoto(id: number, updates: Partial<MomentsPhoto>): void {
  try {
    const photos = loadMomentsPhotos();
    const index = photos.findIndex(p => p.id === id);
    if (index !== -1) {
      photos[index] = { ...photos[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
      
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new Event('moments_photos_updated'));
    }
  } catch (error) {
    console.error('Error updating moments photo:', error);
  }
}

export function getMomentById(id: number): MomentsPhoto | null {
  const photos = loadMomentsPhotos();
  return photos.find(p => p.id === id) || null;
}
