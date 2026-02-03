// Local-first profile storage utilities

export interface UserProfile {
  profilePicture?: string; // data URL
  displayName?: string;
  location?: string;
  inviteCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

const PROFILE_STORAGE_KEY = 'user_profile';

function generateInviteCode(): string {
  // Generate a simple 8-character invite code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function loadProfile(): UserProfile {
  try {
    const data = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!data) {
      // Initialize with a new invite code
      const newProfile: UserProfile = {
        inviteCode: generateInviteCode(),
      };
      saveProfile(newProfile);
      return newProfile;
    }
    const parsed = JSON.parse(data);
    // Ensure invite code exists
    if (!parsed.inviteCode) {
      parsed.inviteCode = generateInviteCode();
      saveProfile(parsed);
    }
    return parsed;
  } catch (error) {
    console.error('Error loading profile:', error);
    return {
      inviteCode: generateInviteCode(),
    };
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('profile_updated'));
  } catch (error) {
    console.error('Error saving profile:', error);
  }
}
