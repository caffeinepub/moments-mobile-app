// Local-first storage for personalized notifications

export type NotificationType = 
  | 'first-planned-moment'
  | 'first-photo-moment'
  | 'first-profile-save'
  | 'first-feeling-check'
  | 'first-vault-visit';

export interface LocalNotification {
  id: string;
  type: NotificationType;
  message: string;
  createdAt: number;
  read: boolean;
}

const STORAGE_KEY = 'local_notifications';
const TRIGGERS_KEY = 'notification_triggers';
const STORAGE_EVENT_NAME = 'localNotificationsChanged';

// Emotional notification messages
const NOTIFICATION_MESSAGES: Record<NotificationType, string> = {
  'first-planned-moment': '🎉 Amazing! You just planned your first moment. This is where memories begin!',
  'first-photo-moment': '📸 Yay! Your first moment is captured. You\'re building something beautiful!',
  'first-profile-save': '✨ Welcome aboard! Your profile is all set. Time to create some magic!',
  'first-feeling-check': '💭 Love it! You shared how you felt. Every emotion matters!',
  'first-vault-visit': '🗂️ Hey there! This is your vault—where all your precious moments live!',
};

// Track which triggers have already fired
interface TriggerState {
  [key: string]: boolean;
}

function loadTriggerState(): TriggerState {
  try {
    const data = localStorage.getItem(TRIGGERS_KEY);
    if (!data) return {};
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading trigger state:', error);
    return {};
  }
}

function saveTriggerState(state: TriggerState): void {
  try {
    localStorage.setItem(TRIGGERS_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving trigger state:', error);
  }
}

function hasTriggered(type: NotificationType): boolean {
  const state = loadTriggerState();
  return !!state[type];
}

function markTriggered(type: NotificationType): void {
  const state = loadTriggerState();
  state[type] = true;
  saveTriggerState(state);
}

// Emit a custom event when notifications change
function emitStorageChange() {
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT_NAME));
}

export function loadNotifications(): LocalNotification[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error loading notifications:', error);
    return [];
  }
}

export function addNotification(type: NotificationType): LocalNotification | null {
  // Check if this notification type has already been triggered
  if (hasTriggered(type)) {
    return null;
  }

  const notifications = loadNotifications();
  const newNotification: LocalNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    message: NOTIFICATION_MESSAGES[type],
    createdAt: Date.now(),
    read: false,
  };

  notifications.push(newNotification);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));

  // Mark this trigger as fired
  markTriggered(type);

  // Emit change event for immediate UI updates
  emitStorageChange();

  return newNotification;
}

export function markNotificationAsRead(notificationId: string): void {
  const notifications = loadNotifications();
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    emitStorageChange();
  }
}

export function markAllNotificationsAsRead(): void {
  const notifications = loadNotifications();
  notifications.forEach(n => n.read = true);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  emitStorageChange();
}

export function getUnreadCount(): number {
  const notifications = loadNotifications();
  return notifications.filter(n => !n.read).length;
}

export function getNotificationsSorted(): LocalNotification[] {
  const notifications = loadNotifications();
  return notifications.sort((a, b) => b.createdAt - a.createdAt);
}

// Subscribe to notification changes
export function subscribeToNotificationChanges(callback: () => void): () => void {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) {
      callback();
    }
  };
  const handleCustomEvent = () => callback();

  window.addEventListener('storage', handleStorageChange);
  window.addEventListener(STORAGE_EVENT_NAME, handleCustomEvent);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener(STORAGE_EVENT_NAME, handleCustomEvent);
  };
}
