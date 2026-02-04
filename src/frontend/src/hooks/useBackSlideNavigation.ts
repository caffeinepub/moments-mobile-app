import { useState, useCallback } from 'react';

/**
 * Hook to coordinate a slide-back exit animation before navigation
 * @param onNavigate - Callback to perform navigation after animation
 * @returns Object with isExiting state and handleBackWithSlide function
 */
export function useBackSlideNavigation(onNavigate: () => void) {
  const [isExiting, setIsExiting] = useState(false);

  const handleBackWithSlide = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onNavigate();
    }, 350); // Match CSS animation duration
  }, [onNavigate]);

  return {
    isExiting,
    handleBackWithSlide,
  };
}
