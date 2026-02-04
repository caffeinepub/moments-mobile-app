import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HomeWeeklyCalendarStripProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  datesWithMoments?: Set<string>;
  dateColorMap?: Map<string, string>;
}

export default function HomeWeeklyCalendarStrip({ 
  selectedDate: propSelectedDate,
  onDateSelect,
  datesWithMoments = new Set(),
  dateColorMap = new Map(),
}: HomeWeeklyCalendarStripProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(propSelectedDate || new Date());

  useEffect(() => {
    if (propSelectedDate) {
      setSelectedDate(propSelectedDate);
    }
  }, [propSelectedDate]);

  // Get the week containing the current date
  const getWeekDays = (date: Date): Date[] => {
    const week: Date[] = [];
    const current = new Date(date);
    
    // Find Sunday of the current week
    const day = current.getDay();
    const diff = current.getDate() - day;
    const sunday = new Date(current.setDate(diff));
    
    // Generate 7 days starting from Sunday
    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(sunday);
      weekDay.setDate(sunday.getDate() + i);
      week.push(weekDay);
    }
    
    return week;
  };

  const weekDays = getWeekDays(currentDate);
  const dayInitials = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const formatDateToISO = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div className="home-weekly-calendar-strip">
      {/* Header with month and navigation */}
      <div className="flex items-center justify-between mb-6 px-4">
        <button
          onClick={handlePrevWeek}
          className="home-calendar-arrow-button no-pulse"
          aria-label="Previous week"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>

        <div className="flex flex-col items-center gap-0.5">
          <span className="home-calendar-reschedule-label">Moment Month</span>
          <h2 className="home-calendar-month-title">{monthName}</h2>
        </div>

        <button
          onClick={handleNextWeek}
          className="home-calendar-arrow-button no-pulse"
          aria-label="Next week"
        >
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Week strip */}
      <div className="flex items-center justify-between px-2">
        {weekDays.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate);
          const dayNumber = date.getDate();
          const dayInitial = dayInitials[index];
          const dateStr = formatDateToISO(date);
          const hasMoment = datesWithMoments.has(dateStr);
          const momentColor = dateColorMap.get(dateStr);

          return (
            <button
              key={index}
              onClick={() => handleDayClick(date)}
              className={`home-calendar-day-button no-pulse ${
                isSelected ? 'home-calendar-day-selected' : 'home-calendar-day-inactive'
              }`}
              aria-label={`${dayInitial} ${dayNumber}`}
            >
              <span className="home-calendar-day-initial">{dayInitial}</span>
              <span className="home-calendar-day-number">{dayNumber}</span>
              {hasMoment && momentColor && !isSelected && (
                <div
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: momentColor }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
