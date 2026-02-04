// Local-first storage for planned moments (separate from photo moments)

import { addNotification } from './localNotificationsStorage';

export interface PlannedMoment {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // HH:MM format
  title?: string;
  withWho?: 'Family' | 'Friends' | 'Partner' | 'Solo' | 'Custom'; // Optional for backward compatibility
  color: string; // OKLCH color string
  createdAt: number;
}

export interface SaveResult {
  success: boolean;
  moment?: PlannedMoment;
  error?: 'duplicate-date' | 'unknown';
}

const STORAGE_KEY = 'plannedMoments';
const STORAGE_EVENT_NAME = 'plannedMomentsChanged';

// New muted/pastel OKLCH color palette for planned moments
const COLOR_PALETTE = [
  'oklch(90% 0.04 25)',   // Very soft coral/peach
  'oklch(92% 0.03 60)',   // Very soft yellow/cream
  'oklch(91% 0.03 120)',  // Very soft mint green
  'oklch(89% 0.04 180)',  // Very soft sky blue
  'oklch(90% 0.05 250)',  // Very soft lavender
  'oklch(92% 0.04 320)',  // Very soft pink
  'oklch(91% 0.03 40)',   // Very soft apricot
];

// Deterministic color selection based on date string
export function getColorForDate(dateStr: string): string {
  // Simple hash function to convert date string to index
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
}

// Emit a custom event when planned moments change
function emitStorageChange() {
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT_NAME));
}

export function loadPlannedMoments(): PlannedMoment[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading planned moments:', error);
    return [];
  }
}

export function loadPlannedMomentsMostRecentFirst(): PlannedMoment[] {
  const moments = loadPlannedMoments();
  return moments.sort((a, b) => b.createdAt - a.createdAt);
}

// Check if a date already has a planned moment
function hasPlannedMomentOnDate(dateStr: string): boolean {
  const moments = loadPlannedMoments();
  return moments.some(m => m.date === dateStr);
}

// Save with one-per-day enforcement
export function savePlannedMoment(moment: Omit<PlannedMoment, 'id' | 'createdAt'>): SaveResult {
  // Check for existing moment on this date
  if (hasPlannedMomentOnDate(moment.date)) {
    return {
      success: false,
      error: 'duplicate-date',
    };
  }

  const moments = loadPlannedMoments();
  const isFirstMoment = moments.length === 0;
  
  const newMoment: PlannedMoment = {
    ...moment,
    id: `moment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
  };
  moments.push(newMoment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(moments));
  
  // Emit change event for immediate UI updates
  emitStorageChange();
  
  // Trigger notification for first planned moment
  if (isFirstMoment) {
    addNotification('first-planned-moment');
  }
  
  return {
    success: true,
    moment: newMoment,
  };
}

export function deletePlannedMoment(momentId: string): boolean {
  const moments = loadPlannedMoments();
  const filteredMoments = moments.filter(m => m.id !== momentId);
  
  if (filteredMoments.length === moments.length) {
    return false; // Moment not found
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredMoments));
  
  // Emit change event for immediate UI updates
  emitStorageChange();
  
  return true;
}

export function getPlannedMomentsForDate(date: Date): PlannedMoment[] {
  const moments = loadPlannedMoments();
  const dateStr = formatDateToISO(date);
  return moments
    .filter(m => m.date === dateStr)
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function getDatesWithMoments(): Set<string> {
  const moments = loadPlannedMoments();
  return new Set(moments.map(m => m.date));
}

export function getDateColorMap(): Map<string, string> {
  const moments = loadPlannedMoments();
  const colorMap = new Map<string, string>();
  
  // Use deterministic color per date
  const datesWithMoments = new Set(moments.map(m => m.date));
  datesWithMoments.forEach(date => {
    colorMap.set(date, getColorForDate(date));
  });
  
  return colorMap;
}

function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Subscribe to storage changes - filtered to only planned moments key
export function subscribeToStorageChanges(callback: () => void): () => void {
  const handleStorageChange = (e: StorageEvent) => {
    // Only trigger callback if the changed key matches our storage key
    if (e.key === STORAGE_KEY || e.key === null) {
      callback();
    }
  };
  const handleCustomEvent = () => callback();
  
  // Listen to both storage events (cross-tab) and custom events (same-tab)
  window.addEventListener('storage', handleStorageChange);
  window.addEventListener(STORAGE_EVENT_NAME, handleCustomEvent);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener(STORAGE_EVENT_NAME, handleCustomEvent);
  };
}
