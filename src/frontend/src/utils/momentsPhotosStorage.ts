// Local-first storage utilities for moments photos

import { MomentFeeling } from './momentFeelings';

export type { MomentFeeling };

export interface MomentsPhoto {
  id: number;
  data: string; // base64 data URL
  timestamp: number;
  type: string; // MIME type
  who?: string; // relationship/category
  reflection?: string; // optional one-sentence reflection
  feeling?: MomentFeeling; // post-save emotional check
}

export interface SaveResult {
  success: boolean;
  error?: string;
}

const STORAGE_KEY = 'moments_photos';
const MAX_MOMENTS = 10;

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

/**
 * Save a moment photo with error handling and 10-item cap
 * Returns a SaveResult indicating success or failure
 */
export function saveMomentsPhoto(photo: MomentsPhoto): SaveResult {
  try {
    const photos = loadMomentsPhotos();
    
    // Enforce 10-item cap
    if (photos.length >= MAX_MOMENTS) {
      return {
        success: false,
        error: `Storage is full (${MAX_MOMENTS} moments max). Please delete some moments to free up space.`
      };
    }
    
    photos.push(photo);
    
    // Attempt to save to localStorage
    const serialized = JSON.stringify(photos);
    localStorage.setItem(STORAGE_KEY, serialized);
    
    // Verify the save was successful
    const verification = localStorage.getItem(STORAGE_KEY);
    if (!verification) {
      return {
        success: false,
        error: 'Failed to save moment. Please try again.'
      };
    }
    
    // Dispatch custom event for same-tab updates only on success
    window.dispatchEvent(new Event('moments_photos_updated'));
    
    return { success: true };
  } catch (error: any) {
    console.error('Error saving moments photo:', error);
    
    // Check for quota exceeded error
    if (error.name === 'QuotaExceededError' || error.code === 22) {
      return {
        success: false,
        error: 'Storage is full. Please delete some moments to free up space.'
      };
    }
    
    return {
      success: false,
      error: 'Failed to save moment. Please try again.'
    };
  }
}

export function updateMomentsPhoto(id: number, updates: Partial<MomentsPhoto>): SaveResult {
  try {
    const photos = loadMomentsPhotos();
    const index = photos.findIndex(p => p.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Moment not found.'
      };
    }
    
    photos[index] = { ...photos[index], ...updates };
    
    // Attempt to save to localStorage
    const serialized = JSON.stringify(photos);
    localStorage.setItem(STORAGE_KEY, serialized);
    
    // Verify the save was successful
    const verification = localStorage.getItem(STORAGE_KEY);
    if (!verification) {
      return {
        success: false,
        error: 'Failed to update moment. Please try again.'
      };
    }
    
    // Dispatch custom event for same-tab updates only on success
    window.dispatchEvent(new Event('moments_photos_updated'));
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating moments photo:', error);
    
    // Check for quota exceeded error
    if (error.name === 'QuotaExceededError' || error.code === 22) {
      return {
        success: false,
        error: 'Storage is full. Please delete some moments to free up space.'
      };
    }
    
    return {
      success: false,
      error: 'Failed to update moment. Please try again.'
    };
  }
}

/**
 * Delete a moment by ID
 * Returns true if successful, false if not found
 */
export function deleteMoment(id: number): boolean {
  try {
    const photos = loadMomentsPhotos();
    const filtered = photos.filter(p => p.id !== id);
    
    if (filtered.length === photos.length) {
      return false; // Moment not found
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('moments_photos_updated'));
    
    return true;
  } catch (error) {
    console.error('Error deleting moment:', error);
    return false;
  }
}

export function getMomentById(id: number): MomentsPhoto | null {
  const photos = loadMomentsPhotos();
  return photos.find(p => p.id === id) || null;
}

/**
 * Get all moments sorted by timestamp (most recent first)
 */
export function getAllMomentsSorted(): MomentsPhoto[] {
  const photos = loadMomentsPhotos();
  return photos.sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Get the index of a moment by ID in the sorted list
 */
export function getMomentIndexById(id: number): number {
  const sorted = getAllMomentsSorted();
  return sorted.findIndex(p => p.id === id);
}

/**
 * Get the previous moment ID (older) in the sorted list
 */
export function getPreviousMomentId(currentId: number): number | null {
  const sorted = getAllMomentsSorted();
  const currentIndex = sorted.findIndex(p => p.id === currentId);
  if (currentIndex === -1 || currentIndex === sorted.length - 1) return null;
  return sorted[currentIndex + 1].id;
}

/**
 * Get the next moment ID (newer) in the sorted list
 */
export function getNextMomentId(currentId: number): number | null {
  const sorted = getAllMomentsSorted();
  const currentIndex = sorted.findIndex(p => p.id === currentId);
  if (currentIndex === -1 || currentIndex === 0) return null;
  return sorted[currentIndex - 1].id;
}
