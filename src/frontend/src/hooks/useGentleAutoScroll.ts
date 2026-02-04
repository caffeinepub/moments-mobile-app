import { useEffect, useRef, RefObject } from 'react';

interface UseGentleAutoScrollOptions {
  /**
   * Speed in pixels per second
   * @default 30
   */
  speed?: number;
  /**
   * Idle delay in milliseconds before resuming auto-scroll after user interaction
   * @default 2000
   */
  idleDelay?: number;
  /**
   * Whether auto-scroll is enabled
   * @default true
   */
  enabled?: boolean;
}

/**
 * Hook that provides gentle auto-scroll functionality for a container.
 * Scrolls upward continuously, pauses on user interaction, and respects prefers-reduced-motion.
 */
export function useGentleAutoScroll(
  containerRef: RefObject<HTMLElement | null>,
  options: UseGentleAutoScrollOptions = {}
): void {
  const { speed = 30, idleDelay = 2000, enabled = true } = options;
  
  const isUserInteractingRef = useRef(false);
  const idleTimeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Auto-scroll animation loop
    const animate = (timestamp: number) => {
      if (!container) return;

      // Initialize timestamp on first frame
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      // Only scroll if user is not interacting
      if (!isUserInteractingRef.current) {
        const scrollAmount = (speed * deltaTime) / 1000;
        container.scrollTop += scrollAmount;

        // Loop back to top when reaching bottom
        if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
          container.scrollTop = 0;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // User interaction handlers
    const handleInteractionStart = () => {
      isUserInteractingRef.current = true;
      
      // Clear any existing idle timeout
      if (idleTimeoutRef.current !== null) {
        clearTimeout(idleTimeoutRef.current);
      }
    };

    const handleInteractionEnd = () => {
      // Set timeout to resume auto-scroll after idle delay
      idleTimeoutRef.current = window.setTimeout(() => {
        isUserInteractingRef.current = false;
      }, idleDelay);
    };

    // Attach event listeners
    container.addEventListener('wheel', handleInteractionStart);
    container.addEventListener('touchstart', handleInteractionStart);
    container.addEventListener('pointerdown', handleInteractionStart);
    container.addEventListener('scroll', handleInteractionStart);

    container.addEventListener('wheel', handleInteractionEnd);
    container.addEventListener('touchend', handleInteractionEnd);
    container.addEventListener('pointerup', handleInteractionEnd);
    container.addEventListener('scroll', handleInteractionEnd);

    // Cleanup
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (idleTimeoutRef.current !== null) {
        clearTimeout(idleTimeoutRef.current);
      }

      container.removeEventListener('wheel', handleInteractionStart);
      container.removeEventListener('touchstart', handleInteractionStart);
      container.removeEventListener('pointerdown', handleInteractionStart);
      container.removeEventListener('scroll', handleInteractionStart);

      container.removeEventListener('wheel', handleInteractionEnd);
      container.removeEventListener('touchend', handleInteractionEnd);
      container.removeEventListener('pointerup', handleInteractionEnd);
      container.removeEventListener('scroll', handleInteractionEnd);
    };
  }, [containerRef, speed, idleDelay, enabled]);
}
