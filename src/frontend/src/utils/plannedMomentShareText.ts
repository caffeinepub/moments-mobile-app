import { PlannedMoment } from './plannedMomentsStorage';

export function generatePlannedMomentShareText(
  moment: PlannedMoment,
  displayName?: string
): string {
  // Format date for display
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const name = displayName || 'Someone';
  const eventTitle = moment.title || 'a moment';
  const formattedDate = formatDate(moment.date);
  const formattedTime = formatTime(moment.time);

  return `${name} planned ${eventTitle} with you on ${formattedDate} at ${formattedTime}. To create a moment with ${name}…`;
}
