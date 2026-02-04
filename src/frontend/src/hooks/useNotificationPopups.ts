import { useState, useEffect, useCallback } from 'react';
import { LocalNotification, subscribeToNotificationChanges, loadNotifications } from '../utils/localNotificationsStorage';

interface PopupNotification extends LocalNotification {
  isVisible: boolean;
}

const POPUP_DURATION = 4000; // 4 seconds

export function useNotificationPopups() {
  const [popups, setPopups] = useState<PopupNotification[]>([]);
  const [lastNotificationCount, setLastNotificationCount] = useState(0);

  const dismissPopup = useCallback((id: string) => {
    setPopups(prev => prev.filter(p => p.id !== id));
  }, []);

  useEffect(() => {
    const checkForNewNotifications = () => {
      const allNotifications = loadNotifications();
      const currentCount = allNotifications.length;

      // If we have more notifications than before, show the newest one
      if (currentCount > lastNotificationCount) {
        const newestNotification = allNotifications[allNotifications.length - 1];
        
        // Add to popups with visible flag
        setPopups(prev => [...prev, { ...newestNotification, isVisible: true }]);

        // Auto-dismiss after duration
        setTimeout(() => {
          dismissPopup(newestNotification.id);
        }, POPUP_DURATION);
      }

      setLastNotificationCount(currentCount);
    };

    // Initial check
    checkForNewNotifications();

    // Subscribe to changes
    const unsubscribe = subscribeToNotificationChanges(checkForNewNotifications);
    return unsubscribe;
  }, [lastNotificationCount, dismissPopup]);

  return {
    popups,
    dismissPopup,
  };
}
