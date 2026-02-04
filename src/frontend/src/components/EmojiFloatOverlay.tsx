import { useEffect, useState } from 'react';

interface EmojiFloatOverlayProps {
  emoji: string;
  count?: number;
}

interface FloatingEmoji {
  id: number;
  delay: number;
  duration: number;
  size: number;
}

function EmojiFloatOverlay({ emoji, count = 10 }: EmojiFloatOverlayProps) {
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Generate emojis with staggered delays for continuous flow from corner
    const generated: FloatingEmoji[] = [];
    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        delay: i * 0.8, // Stagger each emoji by 0.8s
        duration: 8 + Math.random() * 3, // 8-11s duration
        size: 28 + Math.random() * 16 // 28-44px size
      });
    }
    setEmojis(generated);
  }, [count]);

  // Don't render if reduced motion is preferred
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div className="emoji-float-overlay">
      {emojis.map((item) => (
        <div
          key={item.id}
          className="emoji-float-item"
          style={{
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
            fontSize: `${item.size}px`
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
}

export default EmojiFloatOverlay;
