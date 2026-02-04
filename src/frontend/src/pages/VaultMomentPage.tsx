import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { getMomentById, MomentsPhoto } from '../utils/momentsPhotosStorage';
import { formatRelativeTime } from '../utils/timeFormat';

function VaultMomentPage() {
  const navigate = useNavigate();
  const params = useParams({ from: '/vault/$momentId' });
  const [moment, setMoment] = useState<MomentsPhoto | null>(null);
  const [isExiting, setIsExiting] = useState(false);

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

  if (!moment) {
    return null;
  }

  return (
    <div className={`vault-viewer-container ${isExiting ? 'vault-viewer-exiting' : ''}`}>
      <div
        className="relative w-full h-full max-w-[390px] max-h-[844px] overflow-hidden flex flex-col"
        style={{ background: '#000000' }}
      >
        {/* Close button */}
        <button
          onClick={handleBack}
          className="vault-viewer-close-button"
          aria-label="Back to vault"
        >
          <i className="fa fa-arrow-left text-xl"></i>
        </button>

        {/* Full-screen photo container */}
        <div className="relative flex-1 flex items-center justify-center p-4">
          <img
            src={moment.data}
            alt="Moment"
            className={`vault-viewer-image ${isExiting ? 'vault-viewer-image-exit' : ''}`}
          />

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
                  {moment.feeling === 'Meaningful' && '❤️'}
                  {moment.feeling === 'Good' && '🙂'}
                  {moment.feeling === 'Okay' && '😐'}
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
