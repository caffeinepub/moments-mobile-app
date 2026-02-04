import React, { useEffect, useState } from 'react';

interface InlineToastProps {
  message: string;
  duration?: number;
  onClose?: () => void;
  placement?: 'bottom' | 'side';
  variant?: 'success' | 'warning';
}

function InlineToast({ message, duration = 2000, onClose, placement = 'bottom', variant = 'success' }: InlineToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        setTimeout(onClose, 300); // Wait for fade-out animation
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const positionClasses = placement === 'side' 
    ? 'fixed top-1/2 right-4 -translate-y-1/2 z-[9999]'
    : 'fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999]';

  const animationClasses = placement === 'side'
    ? isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
    : isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';

  const backgroundColor = variant === 'warning' ? '#dc2626' : '#4e985d';

  return (
    <div
      className={`${positionClasses} transition-all duration-300 ${animationClasses}`}
      style={{
        maxWidth: placement === 'side' ? '240px' : '300px',
      }}
    >
      <div
        className="px-4 py-2 rounded-full shadow-lg"
        style={{
          backgroundColor,
          color: '#ffffff',
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: '12px',
          fontWeight: '500',
        }}
      >
        {message}
      </div>
    </div>
  );
}

export default InlineToast;
