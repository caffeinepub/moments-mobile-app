import { useNavigate } from '@tanstack/react-router';
import { useBackSlideNavigation } from '../hooks/useBackSlideNavigation';

function NotificationsPage() {
  const navigate = useNavigate();
  const { isExiting, handleBackWithSlide } = useBackSlideNavigation(() => navigate({ to: '/home' }));

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

          <div className="w-8"></div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto calendar-scrollbar px-4 py-3">
          {/* Empty state */}
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
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
