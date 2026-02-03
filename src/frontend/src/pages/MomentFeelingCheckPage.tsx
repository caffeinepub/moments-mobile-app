import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { loadSavedMomentId, clearDraft } from '../utils/pendingMomentDraftStorage';
import { updateMomentsPhoto, MomentFeeling } from '../utils/momentsPhotosStorage';

const FEELING_OPTIONS: { value: MomentFeeling; label: string; icon: string }[] = [
  { value: 'Meaningful', label: 'Meaningful', icon: '❤️' },
  { value: 'Good', label: 'Good', icon: '🙂' },
  { value: 'Okay', label: 'Okay', icon: '😐' }
];

function MomentFeelingCheckPage() {
  const navigate = useNavigate();
  const [momentId, setMomentId] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const id = loadSavedMomentId();
    if (!id) {
      // No saved moment ID, redirect to home
      navigate({ to: '/home' });
      return;
    }
    setMomentId(id);
  }, [navigate]);

  const handleSelectFeeling = async (feeling: MomentFeeling) => {
    if (!momentId) return;
    
    setIsUpdating(true);
    try {
      // Update the moment with the selected feeling
      updateMomentsPhoto(momentId, { feeling });

      // Clear draft data
      clearDraft();

      // Navigate to home
      setTimeout(() => {
        navigate({ to: '/home' });
      }, 300);
    } catch (err) {
      console.error('Failed to update moment feeling:', err);
      setIsUpdating(false);
    }
  };

  if (!momentId) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
      <div 
        className="relative w-full h-full max-w-[390px] max-h-[844px] overflow-hidden flex flex-col items-center justify-center"
        style={{ background: '#f5f0e8' }}
      >
        <div className="px-8 text-center space-y-8">
          {/* Question */}
          <h1
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            How did this feel?
          </h1>

          {/* Feeling options */}
          <div className="space-y-4">
            {FEELING_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelectFeeling(option.value)}
                disabled={isUpdating}
                className="w-full px-8 py-5 rounded-2xl bg-white border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                <span className="text-4xl">{option.icon}</span>
                <span className="text-xl font-semibold text-gray-900">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MomentFeelingCheckPage;
