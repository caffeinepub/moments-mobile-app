import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { loadMomentsPhotos, MomentsPhoto } from '../utils/momentsPhotosStorage';
import { useInView } from '../hooks/useInView';

interface MonthGroup {
  monthYear: string;
  moments: MomentsPhoto[];
}

function MonthSection({ group, onMomentClick }: { group: MonthGroup; onMomentClick: (id: number) => void }) {
  const { ref, isInView } = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <div ref={ref} className={`vault-month-section ${isInView ? 'vault-month-visible' : ''}`}>
      {/* Month header */}
      <h2
        className="text-lg font-bold text-gray-900 mb-4"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        {group.monthYear}
      </h2>

      {/* Photo grid - 3 columns with square tiles */}
      <div className="grid grid-cols-3 gap-2">
        {group.moments.map((moment, index) => (
          <button
            key={moment.id}
            onClick={() => onMomentClick(moment.id)}
            className="vault-thumbnail-tile"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="vault-thumbnail-wrapper">
              <img
                src={moment.data}
                alt="Moment"
                className="vault-thumbnail-image"
              />
              {/* Optional feeling indicator */}
              {moment.feeling && (
                <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-xs">
                  {moment.feeling === 'Meaningful' && '❤️'}
                  {moment.feeling === 'Good' && '🙂'}
                  {moment.feeling === 'Okay' && '😐'}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Month summary */}
      <p
        className="text-sm text-gray-500 mt-3"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        This month had {group.moments.length} moment{group.moments.length !== 1 ? 's' : ''}
      </p>
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
        <header className="relative w-full px-8 pt-8 pb-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Back"
          >
            <i className="fa fa-arrow-left text-gray-700 text-xl"></i>
          </button>
          <h1
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Vault
          </h1>
          <div className="w-10"></div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-8 pb-24">
          {monthGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <i className="fa fa-camera text-gray-300 text-6xl mb-4"></i>
              <p
                className="text-gray-500 text-lg"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                No moments yet
              </p>
              <p
                className="text-gray-400 text-sm mt-2"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Capture your first moment to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-8">
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
