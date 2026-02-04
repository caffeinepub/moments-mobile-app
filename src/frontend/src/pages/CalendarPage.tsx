import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { usePlannedMoments } from '../hooks/usePlannedMoments';
import PlannedMomentBottomSheet from '../components/PlannedMomentBottomSheet';
import InlineToast from '../components/InlineToast';
import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { useBackSlideNavigation } from '../hooks/useBackSlideNavigation';

interface PhotoMetadata {
  id: number;
  timestamp: number;
  dataUrl: string;
}

interface CalendarDate {
  date: number;
  month: number;
  year: number;
  isToday: boolean;
  isSelected: boolean;
  hasPhotoMoments: boolean;
  hasPlannedMoments: boolean;
  plannedMomentColor?: string;
}

function CalendarPage() {
  const navigate = useNavigate();
  const { isExiting, handleBackWithSlide } = useBackSlideNavigation(() => navigate({ to: '/home' }));
  const [currentDate] = useState(new Date());
  const [weekStartDate, setWeekStartDate] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - dayOfWeek);
    return start;
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [weekDates, setWeekDates] = useState<CalendarDate[]>([]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { moments: plannedMoments, datesWithMoments, dateColorMap, addMoment } = usePlannedMoments(selectedDate);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
    generateWeekDates();
  }, [weekStartDate, datesWithMoments, dateColorMap]);

  const generateWeekDates = () => {
    const dates: CalendarDate[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStartDate);
      date.setDate(weekStartDate.getDate() + i);
      
      const isToday = isSameDay(date, currentDate);
      const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
      const hasPhotoMoments = checkIfDateHasPhotoMoments(date);
      const hasPlannedMoments = checkIfDateHasPlannedMoments(date);
      const dateStr = formatDateToISO(date);
      const plannedMomentColor = dateColorMap.get(dateStr);

      dates.push({
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        isToday,
        isSelected,
        hasPhotoMoments,
        hasPlannedMoments,
        plannedMomentColor,
      });
    }

    setWeekDates(dates);
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const checkIfDateHasPhotoMoments = (date: Date): boolean => {
    try {
      const momentsData = localStorage.getItem('moments_photos');
      if (!momentsData) return false;

      const photos: PhotoMetadata[] = JSON.parse(momentsData);
      return photos.some((photo) => {
        const photoDate = new Date(photo.timestamp);
        return isSameDay(photoDate, date);
      });
    } catch (error) {
      console.error('Error checking photo moments:', error);
      return false;
    }
  };

  const checkIfDateHasPlannedMoments = (date: Date): boolean => {
    const dateStr = formatDateToISO(date);
    return datesWithMoments.has(dateStr);
  };

  const formatDateToISO = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateClick = (dateInfo: CalendarDate) => {
    const clickedDate = new Date(dateInfo.year, dateInfo.month, dateInfo.date);
    setSelectedDate(clickedDate);
    setIsBottomSheetOpen(true);
  };

  const handlePrevWeek = () => {
    const newStart = new Date(weekStartDate);
    newStart.setDate(weekStartDate.getDate() - 7);
    setWeekStartDate(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(weekStartDate);
    newStart.setDate(weekStartDate.getDate() + 7);
    setWeekStartDate(newStart);
  };

  const handlePrevMonth = () => {
    const newStart = new Date(weekStartDate);
    newStart.setMonth(weekStartDate.getMonth() - 1);
    setWeekStartDate(newStart);
  };

  const handleNextMonth = () => {
    const newStart = new Date(weekStartDate);
    newStart.setMonth(weekStartDate.getMonth() + 1);
    setWeekStartDate(newStart);
  };

  const handleChangeDate = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  const handleDuplicateDate = () => {
    setToastMessage('You can only have one moment per day');
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes}${ampm}`;
  };

  const getRelativeDay = (date: Date): string => {
    if (isSameDay(date, currentDate)) return 'Today';
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (isSameDay(date, tomorrow)) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCurrentMonthLabel = (): string => {
    const midWeek = new Date(weekStartDate);
    midWeek.setDate(weekStartDate.getDate() + 3);
    return monthNames[midWeek.getMonth()];
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
      <div
        className={`relative w-full h-full max-w-[390px] max-h-[844px] overflow-hidden flex flex-col ${isExiting ? 'slide-back-exit' : ''}`}
        style={{ background: '#ffffff' }}
      >
        {/* Header */}
        <header className="relative w-full px-4 pt-4 pb-2 flex items-center justify-between border-b border-gray-200">
          <button
            onClick={handleBackWithSlide}
            className="w-8 h-8 flex items-center justify-center text-black hover:opacity-70 transition-opacity no-pulse"
            aria-label="Back to home"
          >
            <i className="fa fa-arrow-left text-base"></i>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="calendar-nav-button no-pulse"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <h1
              className="text-lg font-bold text-black min-w-[100px] text-center"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              {getCurrentMonthLabel()}
            </h1>
            <button
              onClick={handleNextMonth}
              className="calendar-nav-button no-pulse"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            className="w-8 h-8 flex items-center justify-center text-black hover:opacity-70 transition-opacity no-pulse"
            aria-label="Menu"
          >
            <i className="fa fa-bars text-base"></i>
          </button>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto calendar-scrollbar px-4 py-3">
          {/* Weekly Calendar Strip */}
          <div className="glass-card rounded-2xl p-4 mb-4">
            {/* Week headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-gray-500 text-[10px] font-medium"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Week dates strip with horizontal scroll */}
            <div
              ref={scrollContainerRef}
              className="relative overflow-x-auto scrollbar-hide"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              <div className="grid grid-cols-7 gap-1">
                {weekDates.map((dateInfo, index) => (
                  <button
                    key={`${dateInfo.year}-${dateInfo.month}-${dateInfo.date}-${index}`}
                    onClick={() => handleDateClick(dateInfo)}
                    className="flex flex-col items-center justify-center py-2 rounded-lg hover:bg-gray-50 transition-all active:scale-95 cursor-pointer min-h-[50px] no-pulse"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <div
                      className={`text-sm font-medium transition-all relative ${
                        dateInfo.isSelected
                          ? 'bg-black text-white rounded-full w-8 h-8 flex items-center justify-center'
                          : dateInfo.isToday
                          ? 'bg-black text-white w-8 h-8 flex items-center justify-center'
                          : 'text-black'
                      }`}
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        borderRadius: dateInfo.isToday && !dateInfo.isSelected ? '12px' : dateInfo.isSelected ? '50%' : '0',
                      }}
                    >
                      {dateInfo.hasPlannedMoments && dateInfo.plannedMomentColor && !dateInfo.isSelected && !dateInfo.isToday && (
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            border: `2px solid ${dateInfo.plannedMomentColor}`,
                            width: '32px',
                            height: '32px',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                          }}
                        />
                      )}
                      {dateInfo.date}
                    </div>
                    {(dateInfo.hasPhotoMoments || dateInfo.hasPlannedMoments) && (
                      <div className="flex gap-0.5 mt-1">
                        {dateInfo.hasPlannedMoments && (
                          <div
                            className={`w-1 h-1 rounded-full transition-colors ${
                              dateInfo.isToday || dateInfo.isSelected ? 'bg-white' : 'bg-orange-500'
                            }`}
                          ></div>
                        )}
                        {dateInfo.hasPhotoMoments && (
                          <div
                            className={`w-1 h-1 rounded-full transition-colors ${
                              dateInfo.isToday || dateInfo.isSelected ? 'bg-white' : 'bg-gray-400'
                            }`}
                          ></div>
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Week navigation arrows - circular icon buttons */}
            <div className="flex justify-between items-center mt-2">
              <button
                onClick={handlePrevWeek}
                className="calendar-week-nav-button no-pulse"
                aria-label="Previous week"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNextWeek}
                className="calendar-week-nav-button no-pulse"
                aria-label="Next week"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Planned Moments List */}
          {selectedDate && plannedMoments.length > 0 && (
            <div className="space-y-2 mb-4">
              {plannedMoments.map((moment) => (
                <div
                  key={moment.id}
                  className="bg-gray-50 rounded-xl p-3 flex items-start gap-2 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    {moment.title && (
                      <h3
                        className="text-sm font-semibold text-black mb-0.5"
                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                      >
                        {moment.title}
                      </h3>
                    )}
                    <div className="flex items-center gap-1.5 mt-1">
                      <i className="fa fa-flag text-[10px] text-gray-400"></i>
                      <p
                        className="text-[10px] text-gray-500"
                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                      >
                        {getRelativeDay(selectedDate)}, {formatTime(moment.time)}
                      </p>
                    </div>
                  </div>
                  <button
                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-200 no-pulse"
                    aria-label="More options"
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sheet */}
      {selectedDate && (
        <PlannedMomentBottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          selectedDate={selectedDate}
          onSave={addMoment}
          onChangeDate={handleChangeDate}
          onDuplicateDate={handleDuplicateDate}
        />
      )}

      {/* Toast notification */}
      {toastMessage && (
        <InlineToast
          message={toastMessage}
          placement="side"
          variant="warning"
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}

export default CalendarPage;
