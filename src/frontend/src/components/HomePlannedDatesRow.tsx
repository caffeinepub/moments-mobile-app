import { useRef, useEffect, useState } from 'react';
import PlannedDatePill from './PlannedDatePill';

interface HomePlannedDatesRowProps {
  sortedDates: string[];
  dateSegmentColors: Map<string, string[]>;
  onDateClick?: (date: string) => void;
}

export default function HomePlannedDatesRow({
  sortedDates,
  dateSegmentColors,
  onDateClick,
}: HomePlannedDatesRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-drift animation
  useEffect(() => {
    if (!scrollRef.current || sortedDates.length === 0) return;

    let animationFrameId: number;
    let lastTimestamp = 0;
    const driftSpeed = 0.3; // pixels per frame (slow drift)

    const drift = (timestamp: number) => {
      if (!scrollRef.current) return;

      if (!isInteracting) {
        const delta = timestamp - lastTimestamp;
        if (delta > 16) { // ~60fps
          const container = scrollRef.current;
          const maxScroll = container.scrollWidth - container.clientWidth;
          
          if (maxScroll > 0) {
            let newScroll = container.scrollLeft + driftSpeed;
            
            // Loop back to start when reaching end
            if (newScroll >= maxScroll) {
              newScroll = 0;
            }
            
            container.scrollLeft = newScroll;
          }
          
          lastTimestamp = timestamp;
        }
      }

      animationFrameId = requestAnimationFrame(drift);
    };

    animationFrameId = requestAnimationFrame(drift);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isInteracting, sortedDates.length]);

  // Handle user interaction
  const handleInteractionStart = () => {
    setIsInteracting(true);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
  };

  const handleInteractionEnd = () => {
    // Resume drift after 2 seconds of idle
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  if (sortedDates.length === 0) return null;

  return (
    <div className="planned-dates-row-container">
      <div
        ref={scrollRef}
        className="planned-dates-row"
        onPointerDown={handleInteractionStart}
        onPointerUp={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        onWheel={handleInteractionStart}
        onScroll={handleInteractionEnd}
      >
        {sortedDates.map((date) => {
          const colors = dateSegmentColors.get(date) || [];
          return (
            <PlannedDatePill
              key={date}
              date={date}
              segmentColors={colors}
              onClick={() => onDateClick?.(date)}
            />
          );
        })}
      </div>
    </div>
  );
}
