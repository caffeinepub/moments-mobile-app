import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { loadDraft, clearDraft, saveConfirmation, saveSavedMomentId } from '../utils/pendingMomentDraftStorage';
import { saveMomentsPhoto } from '../utils/momentsPhotosStorage';

const RELATIONSHIP_OPTIONS = [
  'Family',
  'Close Friends',
  'Best Friend',
  'Partner',
  'Parents',
  'Other'
];

function SaveMomentConfirmPage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<{ photoDataUrl: string; photoType: string; timestamp: number } | null>(null);
  const [selectedWho, setSelectedWho] = useState<string>('');
  const [reflection, setReflection] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadedDraft = loadDraft();
    if (!loadedDraft) {
      // No draft found, redirect back to camera
      navigate({ to: '/camera' });
      return;
    }
    setDraft(loadedDraft);
  }, [navigate]);

  const handleRetake = () => {
    clearDraft();
    navigate({ to: '/camera' });
  };

  const handleSave = async () => {
    if (!draft) return;
    
    setIsSaving(true);
    try {
      // Save confirmation data
      saveConfirmation({
        who: selectedWho || undefined,
        reflection: reflection.trim() || undefined
      });

      // Create moment ID
      const momentId = Date.now();

      // Save moment to localStorage
      saveMomentsPhoto({
        id: momentId,
        data: draft.photoDataUrl,
        timestamp: draft.timestamp,
        type: draft.photoType,
        who: selectedWho || undefined,
        reflection: reflection.trim() || undefined
      });

      // Save moment ID for feeling check
      saveSavedMomentId(momentId);

      // Navigate to feeling check
      navigate({ to: '/feeling-check' });
    } catch (err) {
      console.error('Failed to save moment:', err);
      setIsSaving(false);
    }
  };

  if (!draft) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
      <div 
        className="relative w-full h-full max-w-[390px] max-h-[844px] overflow-hidden flex flex-col"
        style={{ background: '#f5f0e8' }}
      >
        {/* Full-screen photo preview */}
        <div className="relative flex-1 overflow-hidden">
          <img
            src={draft.photoDataUrl}
            alt="Moment preview"
            className="w-full h-full object-cover"
          />
          
          {/* Overlay gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

          {/* Header with title */}
          <div className="absolute top-0 left-0 right-0 p-6">
            <h1
              className="text-2xl font-bold text-white text-center"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Save this as a moment?
            </h1>
          </div>

          {/* Bottom inputs section */}
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
            {/* Who was this with? */}
            <div>
              <label
                className="block text-sm font-semibold text-white mb-2"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Who was this with?
              </label>
              <div className="flex flex-wrap gap-2">
                {RELATIONSHIP_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedWho(option)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedWho === option
                        ? 'bg-yellow-400 text-black'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional reflection */}
            <div>
              <label
                className="block text-sm font-semibold text-white mb-2"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Add a thought (optional)
              </label>
              <input
                type="text"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="One sentence about this moment..."
                maxLength={100}
                className="w-full px-4 py-3 rounded-2xl bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:border-white/60 transition-colors"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleRetake}
                disabled={isSaving}
                className="flex-1 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium hover:bg-white/30 transition-colors disabled:opacity-50"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Retake
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-6 py-3 rounded-full bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  'Save Moment'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SaveMomentConfirmPage;
