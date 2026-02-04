import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { loadSavedMomentId, clearDraft } from '../utils/pendingMomentDraftStorage';
import { updateMomentsPhoto } from '../utils/momentsPhotosStorage';
import { FEELING_OPTIONS, MomentFeeling } from '../utils/momentFeelings';
import { useGentleAutoScroll } from '../hooks/useGentleAutoScroll';
import { addNotification } from '../utils/localNotificationsStorage';

function MomentFeelingCheckPage() {
  const navigate = useNavigate();
  const [momentId, setMomentId] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string>('');
  const [isFirstFeeling, setIsFirstFeeling] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Enable gentle auto-scroll
  useGentleAutoScroll(scrollContainerRef, {
    speed: 25,
    idleDelay: 2500,
    enabled: true,
  });

  useEffect(() => {
    const id = loadSavedMomentId();
    if (!id) {
      // No saved moment ID, redirect to home
      navigate({ to: '/home' });
      return;
    }
    setMomentId(id);
    
    // Check if this is the first feeling check
    const triggersData = localStorage.getItem('notification_triggers');
    const triggers = triggersData ? JSON.parse(triggersData) : {};
    setIsFirstFeeling(!triggers['first-feeling-check']);
  }, [navigate]);

  const handleSelectFeeling = async (feeling: MomentFeeling) => {
    if (!momentId) return;
    
    setIsUpdating(true);
    setError('');
    
    try {
      // Update the moment with the selected feeling
      const result = updateMomentsPhoto(momentId, { feeling });

      if (!result.success) {
        setError(result.error || 'Failed to save feeling. Please try again.');
        setIsUpdating(false);
        return;
      }

      // Trigger notification for first feeling check
      if (isFirstFeeling) {
        addNotification('first-feeling-check');
      }

      // Clear draft data
      clearDraft();

      // Navigate to vault to show the newly saved moment
      setTimeout(() => {
        navigate({ to: `/vault/${momentId}` });
      }, 300);
    } catch (err) {
      console.error('Failed to update moment feeling:', err);
      setError('An unexpected error occurred. Please try again.');
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
        <div className="px-8 text-center space-y-8 w-full max-w-md">
          {/* Question */}
          <h1
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            How did this feel?
          </h1>

          {/* Error message */}
          {error && (
            <div className="bg-red-500 text-white px-4 py-3 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Feeling options - scrollable list with custom scrollbar and auto-scroll */}
          <div 
            ref={scrollContainerRef}
            className="max-h-[60vh] overflow-y-auto space-y-3 px-2 feeling-list-scrollbar"
          >
            {FEELING_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelectFeeling(option.value)}
                disabled={isUpdating}
                className="feeling-option-pill"
              >
                <span className="feeling-option-emoji">{option.emoji}</span>
                <span className="feeling-option-label">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MomentFeelingCheckPage;
