interface PlannedDatePillProps {
  date: string; // ISO date string
  segmentColors: string[]; // 1-3 colors
  className?: string;
  onClick?: () => void;
}

export default function PlannedDatePill({ date, segmentColors, className = '', onClick }: PlannedDatePillProps) {
  // Format date for display (e.g., "Jan 15")
  const formatDateLabel = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const label = formatDateLabel(date);
  const numSegments = Math.min(segmentColors.length, 3);

  return (
    <button
      onClick={onClick}
      className={`planned-date-pill ${className}`}
      aria-label={`Planned date: ${label}`}
    >
      {/* Multi-segment background */}
      <div className="planned-date-pill-segments">
        {segmentColors.slice(0, 3).map((color, index) => (
          <div
            key={index}
            className="planned-date-pill-segment"
            style={{
              backgroundColor: color,
              width: `${100 / numSegments}%`,
            }}
          />
        ))}
      </div>
      
      {/* Label overlay */}
      <span className="planned-date-pill-label">{label}</span>
    </button>
  );
}
