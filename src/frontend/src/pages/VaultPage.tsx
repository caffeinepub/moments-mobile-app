import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Trash2 } from 'lucide-react';
import { loadMomentsPhotos, MomentsPhoto, deleteMoment } from '../utils/momentsPhotosStorage';
import { useInView } from '../hooks/useInView';
import { getFeelingEmoji } from '../utils/momentFeelings';
import { useBackSlideNavigation } from '../hooks/useBackSlideNavigation';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { addNotification } from '../utils/localNotificationsStorage';

interface MonthGroup {
  monthYear: string;
  moments: MomentsPhoto[];
}

function MonthSection({ group, onMomentClick, onDeleteRequest }: { group: MonthGroup; onMomentClick: (id: number) => void; onDeleteRequest: (moment: MomentsPhoto) => void }) {
  const { ref, isInView } = useInView({ threshold: 0.1, rootMargin: '50px', triggerOnce: true });

  return (
    <div ref={ref} className={`vault-month-section ${isInView ? 'vault-month-visible' : ''}`}>
      {/* Month header with enhanced typography */}
      <div className="vault-month-header">
        <h2 className="vault-month-title">
          {group.monthYear}
        </h2>
        <p className="vault-month-count">
          {group.moments.length} moment{group.moments.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Photo grid - 2 columns with larger tiles */}
      <div className="vault-grid">
        {group.moments.map((moment, index) => (
          <div
            key={moment.id}
            className="vault-tile"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <button
              onClick={() => onMomentClick(moment.id)}
              className="vault-tile-wrapper w-full h-full"
            >
              {moment.type.startsWith('video/') ? (
                <video
                  src={moment.data}
                  className="vault-tile-image"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  src={moment.data}
                  alt="Moment"
                  className="vault-tile-image"
                />
              )}
              {/* Feeling indicator with enhanced styling */}
              {moment.feeling && (
                <div className="vault-tile-feeling">
                  {getFeelingEmoji(moment.feeling)}
                </div>
              )}
              {/* Subtle gradient overlay for depth */}
              <div className="vault-tile-overlay"></div>
            </button>
            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRequest(moment);
              }}
              className="absolute top-2 left-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-red-500/90 hover:bg-red-600/90 text-white transition-all"
              aria-label="Delete moment"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function VaultPage() {
  const navigate = useNavigate();
  const { isExiting, handleBackWithSlide } = useBackSlideNavigation(() => navigate({ to: '/home' }));
  const [monthGroups, setMonthGroups] = useState<MonthGroup[]>([]);
  const [momentToDelete, setMomentToDelete] = useState<MomentsPhoto | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    // Check if this is the first vault visit
    const triggersData = localStorage.getItem('notification_triggers');
    const triggers = triggersData ? JSON.parse(triggersData) : {};
    const firstVisit = !triggers['first-vault-visit'];
    setIsFirstVisit(firstVisit);
    
    // Trigger notification for first vault visit
    if (firstVisit) {
      addNotification('first-vault-visit');
    }
    
    loadAndGroupMoments();

    // Listen for storage updates
    const handleUpdate = () => {
      loadAndGroupMoments();
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('moments_photos_updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('moments_photos_updated', handleUpdate);
    };
  }, []);

  const loadAndGroupMoments = () => {
    const moments = loadMomentsPhotos();
    
    // Sort by timestamp descending (most recent first)
    const sorted = moments.sort((a, b) => b.timestamp - a.timestamp);

    // Group by month
    const groups: { [key: string]: MomentsPhoto[] } = {};
    sorted.forEach((moment) => {
      const date = new Date(moment.timestamp);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(moment);
    });

    // Convert to array and limit to 6 photos per month
    const groupArray: MonthGroup[] = Object.entries(groups).map(([monthYear, moments]) => ({
      monthYear,
      moments: moments.slice(0, 6)
    }));

    setMonthGroups(groupArray);
  };

  const handleMomentClick = (momentId: number) => {
    navigate({ to: `/vault/${momentId}` });
  };

  const handleDeleteRequest = (moment: MomentsPhoto) => {
    setMomentToDelete(moment);
  };

  const handleConfirmDelete = () => {
    if (momentToDelete) {
      deleteMoment(momentToDelete.id);
      setMomentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setMomentToDelete(null);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
      <div
        className={`relative w-full h-full max-w-[390px] max-h-[844px] overflow-hidden flex flex-col ${isExiting ? 'slide-back-exit' : ''}`}
        style={{ background: '#f5f0e8' }}
      >
        {/* Header */}
        <header className="vault-header">
          <button
            onClick={handleBackWithSlide}
            className="vault-back-button"
            aria-label="Back to home"
          >
            <i className="fa fa-arrow-left text-gray-700 text-xl"></i>
          </button>
          <h1 className="vault-page-title">
            Moments
          </h1>
          <div className="w-10"></div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto vault-scrollbar px-6 pb-24">
          {monthGroups.length === 0 ? (
            <div className="vault-empty-state">
              <i className="fa fa-camera text-gray-300 text-6xl mb-4"></i>
              <p className="vault-empty-title">
                No moments yet
              </p>
              <p className="vault-empty-subtitle">
                Capture your first moment to see it here
              </p>
            </div>
          ) : (
            <div className="vault-content">
              {monthGroups.map((group) => (
                <MonthSection
                  key={group.monthYear}
                  group={group}
                  onMomentClick={handleMomentClick}
                  onDeleteRequest={handleDeleteRequest}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmDeleteModal
        isOpen={!!momentToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Delete Moment?"
        message="This moment will be permanently removed."
      />
    </div>
  );
}

export default VaultPage;
