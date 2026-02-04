import { X } from 'lucide-react';

interface NotificationPopupBubbleProps {
  message: string;
  onDismiss: () => void;
}

function NotificationPopupBubble({ message, onDismiss }: NotificationPopupBubbleProps) {
  return (
    <div className="notification-popup-bubble">
      <div className="notification-popup-avatar">
        <img 
          src="/assets/generated/notif-avatar-boy-small.dim_96x96.png" 
          alt="Notification"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="notification-popup-content">
        <p className="notification-popup-message">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="notification-popup-close"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default NotificationPopupBubble;
