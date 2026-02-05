import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { getMomentById, MomentsPhoto } from '../utils/momentsPhotosStorage';
import { formatRelativeTime } from '../utils/timeFormat';

function VaultMomentPage() {
  const navigate = useNavigate();
  const params = useParams({ from: '/vault/$momentId' });
  const [moment, setMoment] = useState<MomentsPhoto | null>(null);

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
    navigate({ to: '/vault' });
  };

  if (!moment) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden vault-viewer-backdrop">
      <div
        className="relative w-full h-full max-w-[390px] max-h-[844px] overflow-hidden flex flex-col"
        style={{ background: '#000000' }}
      >
        {/* Close button */}
        <button
          onClick={handleBack}
          className="absolute top-6 left-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all vault-close-button"
          aria-label="Back to vault"
        >
          <i className="fa fa-arrow-left text-xl"></i>
        </button>

        {/* Full-screen photo container */}
        <div className="relative flex-1 flex items-center justify-center p-4">
          <img
            src={moment.data}
            alt="Moment"
            className="vault-enlarged-image"
          />

          {/* Metadata overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8 space-y-3">
            {/* Timestamp */}
            <p
              className="text-white text-sm opacity-90"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              {formatRelativeTime(moment.timestamp)}
            </p>

            {/* Who */}
            {moment.who && (
              <p
                className="text-white text-base font-semibold"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                With {moment.who}
              </p>
            )}

            {/* Reflection */}
            {moment.reflection && (
              <p
                className="text-white text-base italic"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                "{moment.reflection}"
              </p>
            )}

            {/* Feeling */}
            {moment.feeling && (
              <div className="flex items-center gap-2 pt-2">
                <span className="text-2xl">
                  {moment.feeling === 'Meaningful' && '❤️'}
                  {moment.feeling === 'Good' && '🙂'}
                  {moment.feeling === 'Okay' && '😐'}
                </span>
                <span
                  className="text-white text-sm font-medium"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
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
