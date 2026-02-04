import { PlannedMoment } from '../utils/plannedMomentsStorage';

interface PlannedMomentCardProps {
  moment: PlannedMoment;
}

export default function PlannedMomentCard({ moment }: PlannedMomentCardProps) {
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

  return (
    <div
      className="planned-moment-card"
      style={{
        backgroundColor: moment.color,
      }}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="planned-moment-card-date">
            {formatDate(moment.date)}
          </span>
          <span className="planned-moment-card-time">
            {formatTime(moment.time)}
          </span>
        </div>
        {moment.title && (
          <p className="planned-moment-card-title">
            {moment.title}
          </p>
        )}
      </div>
    </div>
  );
}
