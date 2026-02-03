// Temporary draft storage for moment confirmation flow
// Uses sessionStorage to persist only during the current session

export interface MomentDraft {
  photoDataUrl: string;
  photoType: string;
  timestamp: number;
}

export interface MomentConfirmation {
  who?: string;
  reflection?: string;
}

const DRAFT_KEY = 'moment_draft';
const CONFIRMATION_KEY = 'moment_confirmation';
const SAVED_MOMENT_ID_KEY = 'saved_moment_id';

export function saveDraft(draft: MomentDraft): void {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (error) {
    console.error('Error saving moment draft:', error);
  }
}

export function loadDraft(): MomentDraft | null {
  try {
    const data = sessionStorage.getItem(DRAFT_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading moment draft:', error);
    return null;
  }
}

export function clearDraft(): void {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
    sessionStorage.removeItem(CONFIRMATION_KEY);
    sessionStorage.removeItem(SAVED_MOMENT_ID_KEY);
  } catch (error) {
    console.error('Error clearing moment draft:', error);
  }
}

export function saveConfirmation(confirmation: MomentConfirmation): void {
  try {
    sessionStorage.setItem(CONFIRMATION_KEY, JSON.stringify(confirmation));
  } catch (error) {
    console.error('Error saving moment confirmation:', error);
  }
}

export function loadConfirmation(): MomentConfirmation | null {
  try {
    const data = sessionStorage.getItem(CONFIRMATION_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading moment confirmation:', error);
    return null;
  }
}

export function saveSavedMomentId(id: number): void {
  try {
    sessionStorage.setItem(SAVED_MOMENT_ID_KEY, id.toString());
  } catch (error) {
    console.error('Error saving moment ID:', error);
  }
}

export function loadSavedMomentId(): number | null {
  try {
    const data = sessionStorage.getItem(SAVED_MOMENT_ID_KEY);
    if (!data) return null;
    return parseInt(data, 10);
  } catch (error) {
    console.error('Error loading moment ID:', error);
    return null;
  }
}
