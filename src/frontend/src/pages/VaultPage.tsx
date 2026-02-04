import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { loadMomentsPhotos, MomentsPhoto } from '../utils/momentsPhotosStorage';
import { useInView } from '../hooks/useInView';

interface MonthGroup {
  monthYear: string;
  moments: MomentsPhoto[];
}

function MonthSection({ group, onMomentClick }: { group: MonthGroup; onMomentClick: (id: number) => void }) {
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
          <button
            key={moment.id}
            onClick={() => onMomentClick(moment.id)}
            className="vault-tile"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="vault-tile-wrapper">
              <img
                src={moment.data}
                alt="Moment"
                className="vault-tile-image"
              />
              {/* Feeling indicator with enhanced styling */}
              {moment.feeling && (
                <div className="vault-tile-feeling">
                  {moment.feeling === 'Meaningful' && '❤️'}
                  {moment.feeling === 'Good' && '🙂'}
                  {moment.feeling === 'Okay' && '😐'}
                </div>
              )}
              {/* Subtle gradient overlay for depth */}
              <div className="vault-tile-overlay"></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function VaultPage() {
  const navigate = useNavigate();
  const [monthGroups, setMonthGroups] = useState<MonthGroup[]>([]);

  useEffect(() => {
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

  const handleBack = () => {
    navigate({ to: '/home' });
  };

  const handleMomentClick = (momentId: number) => {
    navigate({ to: `/vault/${momentId}` });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
      <div
        className="relative w-full h-full max-w-[390px] max-h-[844px] overflow-hidden flex flex-col"
        style={{ background: '#f5f0e8' }}
      >
        {/* Header */}
        <header className="vault-header">
          <button
            onClick={handleBack}
            className="vault-back-button"
            aria-label="Back"
          >
            <i className="fa fa-arrow-left text-gray-700 text-xl"></i>
          </button>
          <h1 className="vault-page-title">
            Vault
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
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VaultPage;
