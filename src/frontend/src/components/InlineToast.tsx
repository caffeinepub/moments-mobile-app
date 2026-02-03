import React, { useEffect, useState } from 'react';

interface InlineToastProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

function InlineToast({ message, duration = 2000, onClose }: InlineToastProps) {
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

  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        maxWidth: '320px',
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
