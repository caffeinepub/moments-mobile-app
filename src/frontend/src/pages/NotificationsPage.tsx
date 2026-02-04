import { useNavigate } from '@tanstack/react-router';
import { useBackSlideNavigation } from '../hooks/useBackSlideNavigation';
import { useLocalNotifications } from '../hooks/useLocalNotifications';
import { formatRelativeTime } from '../utils/timeFormat';

function NotificationsPage() {
  const navigate = useNavigate();
  const { isExiting, handleBackWithSlide } = useBackSlideNavigation(() => navigate({ to: '/home' }));
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useLocalNotifications();

  const handleNotificationClick = (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(notificationId);
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
      <div
        className={`relative w-full h-full max-w-[390px] max-h-[844px] overflow-hidden flex flex-col ${isExiting ? 'slide-back-exit' : ''}`}
        style={{ background: '#ffffff' }}
      >
        {/* Header */}
        <header className="relative w-full px-4 pt-4 pb-2 flex items-center justify-between border-b border-gray-200">
          <button
            onClick={handleBackWithSlide}
            className="w-8 h-8 flex items-center justify-center text-black hover:opacity-70 transition-opacity no-pulse"
            aria-label="Back to home"
          >
            <i className="fa fa-arrow-left text-base"></i>
          </button>

          <h1
            className="text-lg font-bold text-black"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Notifications
          </h1>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Mark all read
            </button>
          )}
          {unreadCount === 0 && <div className="w-8"></div>}
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto calendar-scrollbar">
          {notifications.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <i className="fa fa-bell text-gray-300 text-6xl mb-4"></i>
              <p
                className="text-lg font-semibold text-gray-700 mb-2"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                No notifications yet
              </p>
              <p
                className="text-sm text-gray-500"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                You'll see updates and reminders here
              </p>
            </div>
          ) : (
            /* Notifications list */
            <div className="py-2">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id, notification.read)}
                  className={`w-full px-4 py-4 flex items-start gap-3 border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : 'bg-white'
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src="/assets/generated/notif-avatar-boy-small.dim_96x96.png"
                      alt="Notification"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left">
                    <p
                      className={`text-sm leading-relaxed ${
                        !notification.read ? 'font-semibold text-gray-900' : 'font-normal text-gray-700'
                      }`}
                      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                    >
                      {notification.message}
                    </p>
                    <p
                      className="text-xs text-gray-500 mt-1"
                      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                    >
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
