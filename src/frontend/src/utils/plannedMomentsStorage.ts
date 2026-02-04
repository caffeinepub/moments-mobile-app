// Local-first storage for planned moments (separate from photo moments)

export interface PlannedMoment {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // HH:MM format
  title?: string;
  withWho: 'Family' | 'Friends' | 'Partner' | 'Solo' | 'Custom';
  color: string; // OKLCH color string
  createdAt: number;
}

const STORAGE_KEY = 'plannedMoments';
const STORAGE_EVENT_NAME = 'plannedMomentsChanged';

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

export function savePlannedMoment(moment: Omit<PlannedMoment, 'id' | 'createdAt'>): PlannedMoment {
  const moments = loadPlannedMoments();
  const newMoment: PlannedMoment = {
    ...moment,
    id: `moment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
  };
  moments.push(newMoment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(moments));
  
  // Emit change event for immediate UI updates
  emitStorageChange();
  
  return newMoment;
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
  
  // Group moments by date
  const momentsByDate = new Map<string, PlannedMoment[]>();
  moments.forEach(moment => {
    const existing = momentsByDate.get(moment.date) || [];
    existing.push(moment);
    momentsByDate.set(moment.date, existing);
  });
  
  // For each date, pick the color of the earliest moment by time (deterministic)
  momentsByDate.forEach((dateMoments, date) => {
    const sorted = dateMoments.sort((a, b) => a.time.localeCompare(b.time));
    if (sorted.length > 0) {
      colorMap.set(date, sorted[0].color);
    }
  });
  
  return colorMap;
}

function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Subscribe to storage changes
export function subscribeToStorageChanges(callback: () => void): () => void {
  const handleStorageChange = () => callback();
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
