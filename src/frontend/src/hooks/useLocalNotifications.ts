import { useState, useEffect } from 'react';
import {
  loadNotifications,
  getNotificationsSorted,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  subscribeToNotificationChanges,
  LocalNotification,
} from '../utils/localNotificationsStorage';

export function useLocalNotifications() {
  const [notifications, setNotifications] = useState<LocalNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = () => {
    setNotifications(getNotificationsSorted());
    setUnreadCount(getUnreadCount());
  };

  useEffect(() => {
    refresh();
    const unsubscribe = subscribeToNotificationChanges(refresh);
    return unsubscribe;
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
    refresh,
  };
}
