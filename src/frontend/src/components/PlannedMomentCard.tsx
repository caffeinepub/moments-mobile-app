import { PlannedMoment } from '../utils/plannedMomentsStorage';

interface PlannedMomentCardProps {
  moment: PlannedMoment;
  onShare?: (moment: PlannedMoment) => void;
  onDelete?: (moment: PlannedMoment) => void;
}

export default function PlannedMomentCard({ moment, onShare, onDelete }: PlannedMomentCardProps) {
  // Format date for display
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Format time for display (remove leading zero if present)
  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(moment);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(moment);
  };

  return (
    <div
      className="planned-moment-card-clear"
      style={{
        '--card-border-color': moment.color,
      } as React.CSSProperties}
    >
      {/* Left color dot with black ring */}
      <div 
        className="planned-moment-card-color-dot"
        style={{
          backgroundColor: moment.color,
        }}
      />

      {/* Main content area */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        {/* Date as primary line */}
        <span className="planned-moment-card-date">
          {formatDate(moment.date)}
        </span>
        
        {/* Two stacked secondary lines */}
        {moment.title && (
          <p className="planned-moment-card-secondary-line">
            {moment.title}
          </p>
        )}
        <span className="planned-moment-card-secondary-line">
          {formatTime(moment.time)}
        </span>
      </div>

      {/* Right-aligned in-card action icons (share above, trash below) */}
      <div className="planned-moment-card-actions-column">
        <button
          onClick={handleShare}
          className="planned-moment-card-action-icon no-pulse"
          aria-label="Share moment"
        >
          <i className="fa-solid fa-share-nodes"></i>
        </button>
        <button
          onClick={handleDelete}
          className="planned-moment-card-action-icon no-pulse"
          aria-label="Delete moment"
        >
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  );
}
