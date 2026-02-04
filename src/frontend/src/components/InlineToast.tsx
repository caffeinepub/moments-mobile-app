import React, { useEffect, useState } from 'react';

interface InlineToastProps {
  message: string;
  duration?: number;
  onClose?: () => void;
  placement?: 'bottom' | 'side';
}

function InlineToast({ message, duration = 2000, onClose, placement = 'bottom' }: InlineToastProps) {
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
    ? 'fixed top-1/2 right-4 -translate-y-1/2 z-50'
    : 'fixed bottom-24 left-1/2 -translate-x-1/2 z-50';

  const animationClasses = placement === 'side'
    ? isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
    : isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';

  return (
    <div
      className={`${positionClasses} transition-all duration-300 ${animationClasses}`}
      style={{
        maxWidth: placement === 'side' ? '280px' : '320px',
      }}
    >
      <div
        className="px-6 py-3 rounded-full shadow-lg"
        style={{
          backgroundColor: '#4e985d',
          color: '#ffffff',
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: '14px',
          fontWeight: '500',
        }}
      >
        {message}
      </div>
    </div>
  );
}

export default InlineToast;
