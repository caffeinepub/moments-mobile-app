import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { 
  getMomentById, 
  MomentsPhoto, 
  getPreviousMomentId, 
  getNextMomentId
} from '../utils/momentsPhotosStorage';
import { formatRelativeTime } from '../utils/timeFormat';
import { getFeelingEmoji } from '../utils/momentFeelings';
import EmojiFloatOverlay from '../components/EmojiFloatOverlay';
import { useSwipeGesture } from '../hooks/useSwipeGesture';

function VaultMomentPage() {
  const navigate = useNavigate();
  const params = useParams({ from: '/vault/$momentId' });
  const [moment, setMoment] = useState<MomentsPhoto | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load moment
  useEffect(() => {
    const momentId = parseInt(params.momentId, 10);
    if (isNaN(momentId)) {
      navigate({ to: '/vault' });
      return;
    }

    const loadedMoment = getMomentById(momentId);
    if (!loadedMoment) {
      navigate({ to: '/vault' });
      return;
    }

    setMoment(loadedMoment);
  }, [params.momentId, navigate]);

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate({ to: '/vault' });
    }, 350);
  };

  const navigateToMoment = (momentId: number) => {
    // Use replace to keep back button working correctly
    navigate({ to: '/vault/$momentId', params: { momentId: momentId.toString() }, replace: true });
  };

  const handleSwipeLeft = () => {
    if (!moment) return;
    const nextId = getNextMomentId(moment.id);
    if (nextId !== null) {
      navigateToMoment(nextId);
    }
  };

  const handleSwipeRight = () => {
    if (!moment) return;
    const prevId = getPreviousMomentId(moment.id);
    if (prevId !== null) {
      navigateToMoment(prevId);
    }
  };

  const { attachListeners } = useSwipeGesture({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 50,
    preventScroll: true,
  });

  useEffect(() => {
    if (containerRef.current) {
      return attachListeners(containerRef.current);
    }
  }, [attachListeners]);

  if (!moment) {
    return null;
  }

  return (
    <div className={`vault-viewer-container ${isExiting ? 'vault-viewer-exiting' : ''}`}>
      <div
        ref={containerRef}
        className="relative w-full h-full max-w-[390px] max-h-[844px] overflow-hidden flex flex-col vault-viewer-swipe-area"
        style={{ background: '#000000' }}
      >
        {/* Close button */}
        <button
          onClick={handleBack}
          className="vault-viewer-close-button"
          aria-label="Back to moments"
        >
          <i className="fa fa-arrow-left text-xl"></i>
        </button>

        {/* Full-screen media container */}
        <div className="relative flex-1 flex items-center justify-center p-4">
          {moment.type.startsWith('video/') ? (
            <video
              src={moment.data}
              className={`vault-viewer-image ${isExiting ? 'vault-viewer-image-exit' : ''}`}
              controls
              playsInline
              preload="auto"
            />
          ) : (
            <img
              src={moment.data}
              alt="Moment"
              className={`vault-viewer-image ${isExiting ? 'vault-viewer-image-exit' : ''}`}
            />
          )}

          {/* Floating emoji overlay */}
          {moment.feeling && (
            <EmojiFloatOverlay emoji={getFeelingEmoji(moment.feeling)} count={12} />
          )}

          {/* Metadata overlay at bottom */}
          <div className={`vault-viewer-metadata ${isExiting ? 'vault-viewer-metadata-exit' : ''}`}>
            {/* Timestamp */}
            <p className="vault-viewer-timestamp">
              {formatRelativeTime(moment.timestamp)}
            </p>

            {/* Who */}
            {moment.who && (
              <p className="vault-viewer-who">
                With {moment.who}
              </p>
            )}

            {/* Reflection */}
            {moment.reflection && (
              <p className="vault-viewer-reflection">
                "{moment.reflection}"
              </p>
            )}

            {/* Feeling */}
            {moment.feeling && (
              <div className="vault-viewer-feeling">
                <span className="text-2xl">
                  {getFeelingEmoji(moment.feeling)}
                </span>
                <span className="vault-viewer-feeling-label">
                  {moment.feeling}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VaultMomentPage;
