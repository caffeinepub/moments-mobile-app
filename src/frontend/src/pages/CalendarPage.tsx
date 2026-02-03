import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

interface PhotoMetadata {
    id: number;
    timestamp: number;
    dataUrl: string;
}

interface CalendarDate {
    date: number;
    month: number;
    year: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    hasMoments: boolean;
}

function CalendarPage() {
    const navigate = useNavigate();
    const [currentDate] = useState(new Date());
    const [viewDate, setViewDate] = useState(new Date(2026, 0, 1)); // Start at January 2026
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [calendarDates, setCalendarDates] = useState<CalendarDate[]>([]);
    const [selectedDateMoments, setSelectedDateMoments] = useState<PhotoMetadata[]>([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Generate calendar dates for the current view
    useEffect(() => {
        generateCalendarDates();
    }, [viewDate]);

    // Load moments for selected date
    useEffect(() => {
        if (selectedDate) {
            loadMomentsForDate(selectedDate);
        }
    }, [selectedDate]);

    const generateCalendarDates = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        
        // Get first day of month and last day of month
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Get the day of week for first day (0 = Sunday)
        const firstDayOfWeek = firstDay.getDay();
        
        // Get days in month
        const daysInMonth = lastDay.getDate();
        
        // Get previous month's last days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        
        const dates: CalendarDate[] = [];
        
        // Add previous month's trailing days
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const date = prevMonthLastDay - i;
            dates.push({
                date,
                month: month - 1,
                year: month === 0 ? year - 1 : year,
                isCurrentMonth: false,
                isToday: false,
                isSelected: false,
                hasMoments: false
            });
        }
        
        // Add current month's days
        for (let date = 1; date <= daysInMonth; date++) {
            const dateObj = new Date(year, month, date);
            const isToday = isSameDay(dateObj, currentDate);
            const isSelected = selectedDate ? isSameDay(dateObj, selectedDate) : false;
            const hasMoments = checkIfDateHasMoments(dateObj);
            
            dates.push({
                date,
                month,
                year,
                isCurrentMonth: true,
                isToday,
                isSelected,
                hasMoments
            });
        }
        
        // Add next month's leading days to complete the grid
        const remainingDays = 42 - dates.length; // 6 rows * 7 days
        for (let date = 1; date <= remainingDays; date++) {
            dates.push({
                date,
                month: month + 1,
                year: month === 11 ? year + 1 : year,
                isCurrentMonth: false,
                isToday: false,
                isSelected: false,
                hasMoments: false
            });
        }
        
        setCalendarDates(dates);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const isSameDay = (date1: Date, date2: Date): boolean => {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    };

    const checkIfDateHasMoments = (date: Date): boolean => {
        try {
            const momentsData = localStorage.getItem('momentsPhotos');
            if (!momentsData) return false;
            
            const photos: PhotoMetadata[] = JSON.parse(momentsData);
            return photos.some(photo => {
                const photoDate = new Date(photo.timestamp);
                return isSameDay(photoDate, date);
            });
        } catch (error) {
            console.error('Error checking moments:', error);
            return false;
        }
    };

    const loadMomentsForDate = (date: Date) => {
        try {
            const momentsData = localStorage.getItem('momentsPhotos');
            if (!momentsData) {
                setSelectedDateMoments([]);
                return;
            }
            
            const photos: PhotoMetadata[] = JSON.parse(momentsData);
            const filteredPhotos = photos.filter(photo => {
                const photoDate = new Date(photo.timestamp);
                return isSameDay(photoDate, date);
            });
            
            setSelectedDateMoments(filteredPhotos);
        } catch (error) {
            console.error('Error loading moments:', error);
            setSelectedDateMoments([]);
        }
    };

    const handleDateClick = (dateInfo: CalendarDate) => {
        const clickedDate = new Date(dateInfo.year, dateInfo.month, dateInfo.date);
        setSelectedDate(clickedDate);
        
        // Update calendar to reflect selection
        generateCalendarDates();
    };

    const handlePrevMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() - 1);
        
        // Keep within 2026
        if (newDate.getFullYear() >= 2026) {
            setViewDate(newDate);
        }
    };

    const handleNextMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + 1);
        
        // Keep within 2026
        if (newDate.getFullYear() <= 2026) {
            setViewDate(newDate);
        }
    };

    const handleBack = () => {
        navigate({ to: '/home' });
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const formatSelectedDate = (): string => {
        if (!selectedDate) return '';
        return selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
            {/* Mobile viewport container with white background */}
            <div 
                className="relative w-full h-full max-w-[390px] max-h-[844px] overflow-hidden flex flex-col"
                style={{ background: '#ffffff' }}
            >
                {/* Header */}
                <header className="relative w-full px-5 pt-5 pb-3 flex items-center justify-center border-b border-gray-200">
                    {/* Back arrow - left aligned */}
                    <button
                        onClick={handleBack}
                        className="absolute left-5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-black hover:opacity-70 transition-opacity"
                        aria-label="Back"
                    >
                        <i className="fa fa-arrow-left text-lg"></i>
                    </button>

                    {/* Month title - centered */}
                    <h1 
                        className="text-xl font-bold text-black"
                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                    >
                        {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                    </h1>

                    {/* Menu icon - right aligned */}
                    <button
                        onClick={toggleMenu}
                        className="absolute right-5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-black hover:opacity-70 transition-opacity"
                        aria-label="Menu"
                    >
                        <i className="fa fa-bars text-lg"></i>
                    </button>
                </header>

                {/* Month Navigation */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                    <button
                        onClick={handlePrevMonth}
                        disabled={viewDate.getFullYear() === 2026 && viewDate.getMonth() === 0}
                        className="w-8 h-8 flex items-center justify-center text-black hover:bg-gray-100 rounded-full transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Previous month"
                    >
                        <i className="fa fa-chevron-left text-sm"></i>
                    </button>

                    <span 
                        className="text-sm font-medium text-gray-600"
                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                    >
                        Swipe to navigate
                    </span>

                    <button
                        onClick={handleNextMonth}
                        disabled={viewDate.getFullYear() === 2026 && viewDate.getMonth() === 11}
                        className="w-8 h-8 flex items-center justify-center text-black hover:bg-gray-100 rounded-full transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Next month"
                    >
                        <i className="fa fa-chevron-right text-sm"></i>
                    </button>
                </div>

                {/* Scrollable content with thin mobile scrollbar */}
                <div className="flex-1 overflow-y-auto calendar-scrollbar px-5 py-4">
                    {/* Calendar Grid */}
                    <div className="mb-5">
                        {/* Week headers */}
                        <div className="grid grid-cols-7 gap-2 mb-3">
                            {weekDays.map((day) => (
                                <div 
                                    key={day}
                                    className="text-center text-gray-500 text-xs font-medium"
                                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Date grid */}
                        <div 
                            className={`grid grid-cols-7 gap-2 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
                        >
                            {calendarDates.map((dateInfo, index) => (
                                <button
                                    key={`${dateInfo.year}-${dateInfo.month}-${dateInfo.date}-${index}`}
                                    onClick={() => handleDateClick(dateInfo)}
                                    className="flex flex-col items-center justify-center py-2 rounded-lg hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
                                    style={{
                                        animationDelay: `${index * 10}ms`
                                    }}
                                >
                                    <div 
                                        className={`text-sm font-medium transition-all ${
                                            dateInfo.isToday 
                                                ? 'bg-orange-500 text-white rounded-full w-7 h-7 flex items-center justify-center' 
                                                : dateInfo.isSelected
                                                    ? 'bg-black text-white rounded-full w-7 h-7 flex items-center justify-center'
                                                    : dateInfo.isCurrentMonth 
                                                        ? 'text-black' 
                                                        : 'text-gray-400'
                                        }`}
                                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                    >
                                        {dateInfo.date}
                                    </div>
                                    {dateInfo.hasMoments && (
                                        <div className="flex gap-0.5 mt-1">
                                            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                                dateInfo.isToday || dateInfo.isSelected ? 'bg-white' : 'bg-orange-500'
                                            }`}></div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Selected Date Info */}
                    {selectedDate ? (
                        <div className="mb-5 animate-fade-in-up">
                            <h2 
                                className="text-base font-semibold text-black mb-3"
                                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                            >
                                {formatSelectedDate()}
                            </h2>

                            {/* Moments for selected date */}
                            {selectedDateMoments.length > 0 ? (
                                <div className="space-y-3">
                                    <h3 
                                        className="text-sm font-medium text-gray-600"
                                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                    >
                                        Moments ({selectedDateMoments.length})
                                    </h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        {selectedDateMoments.map((moment, idx) => (
                                            <div
                                                key={moment.id}
                                                className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-all hover:scale-105 cursor-pointer"
                                                style={{
                                                    animationDelay: `${idx * 50}ms`
                                                }}
                                            >
                                                <img 
                                                    src={moment.dataUrl} 
                                                    alt={`Moment ${moment.id}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-xl p-4 text-center">
                                    <i className="fa fa-calendar-o text-2xl text-gray-400 mb-2"></i>
                                    <p 
                                        className="text-sm text-gray-500"
                                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                    >
                                        No moments for this date
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl p-6 text-center">
                            <i className="fa fa-hand-pointer-o text-3xl text-gray-400 mb-3"></i>
                            <p 
                                className="text-sm text-gray-600 font-medium mb-1"
                                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                            >
                                Select a date
                            </p>
                            <p 
                                className="text-xs text-gray-500"
                                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                            >
                                Tap any date to view your moments
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CalendarPage;
