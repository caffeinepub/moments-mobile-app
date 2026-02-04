import { useRef, useEffect, useCallback } from 'react';

export interface SwipeGestureConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number; // minimum distance in pixels to trigger swipe
  preventScroll?: boolean; // prevent default scroll during horizontal swipe
}

export function useSwipeGesture(config: SwipeGestureConfig) {
  const {
    onSwipeLeft,
    onSwipeRight,
    threshold = 50,
    preventScroll = true,
  } = config;

  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    startX.current = clientX;
    startY.current = clientY;
    isDragging.current = true;
  }, []);

  const handleMove = useCallback(
    (clientX: number, clientY: number, event: TouchEvent | MouseEvent) => {
      if (!isDragging.current) return;

      const deltaX = clientX - startX.current;
      const deltaY = clientY - startY.current;

      // If horizontal movement is greater than vertical, prevent scroll
      if (preventScroll && Math.abs(deltaX) > Math.abs(deltaY)) {
        event.preventDefault();
      }
    },
    [preventScroll]
  );

  const handleEnd = useCallback(
    (clientX: number) => {
      if (!isDragging.current) return;

      const deltaX = clientX - startX.current;

      // Check if swipe threshold is met
      if (Math.abs(deltaX) >= threshold) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }

      isDragging.current = false;
    },
    [threshold, onSwipeLeft, onSwipeRight]
  );

  const onTouchStart = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    },
    [handleStart]
  );

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY, e);
    },
    [handleMove]
  );

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      handleEnd(touch.clientX);
    },
    [handleEnd]
  );

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      handleStart(e.clientX, e.clientY);
    },
    [handleStart]
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY, e);
    },
    [handleMove]
  );

  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      handleEnd(e.clientX);
    },
    [handleEnd]
  );

  const attachListeners = useCallback(
    (element: HTMLElement | null) => {
      if (!element) return;

      // Touch events
      element.addEventListener('touchstart', onTouchStart, { passive: false });
      element.addEventListener('touchmove', onTouchMove, { passive: false });
      element.addEventListener('touchend', onTouchEnd);

      // Mouse events
      element.addEventListener('mousedown', onMouseDown);

      return () => {
        element.removeEventListener('touchstart', onTouchStart);
        element.removeEventListener('touchmove', onTouchMove);
        element.removeEventListener('touchend', onTouchEnd);
        element.removeEventListener('mousedown', onMouseDown);
      };
    },
    [onTouchStart, onTouchMove, onTouchEnd, onMouseDown]
  );

  useEffect(() => {
    if (!isDragging.current) return;

    const handleGlobalMouseMove = (e: MouseEvent) => onMouseMove(e);
    const handleGlobalMouseUp = (e: MouseEvent) => onMouseUp(e);

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return { attachListeners };
}
