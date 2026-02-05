import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import HomeWeeklyCalendarStrip from '../components/HomeWeeklyCalendarStrip';
import HomePlannedDatesRow from '../components/HomePlannedDatesRow';
import PlannedMomentBottomSheet from '../components/PlannedMomentBottomSheet';
import { usePlannedMoments } from '../hooks/usePlannedMoments';

function HomeScreen() {
    const navigate = useNavigate();
    const [hoveredNav, setHoveredNav] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);

    const { datesWithMoments, dateSegmentColors, sortedDates, addMoment } = usePlannedMoments(null);

    const handleCameraClick = () => {
        navigate({ to: '/camera' });
    };

    const handleVaultClick = () => {
        navigate({ to: '/vault' });
    };

    const handleProfileClick = () => {
        navigate({ to: '/profile' });
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setIsBottomSheetOpen(true);
    };

    const handlePlannedDateClick = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        setSelectedDate(date);
        setIsBottomSheetOpen(true);
    };

    const handleStartPlanning = () => {
        setSelectedDate(new Date());
        setIsBottomSheetOpen(true);
    };

    const handleBottomSheetVisibilityChange = (isVisible: boolean) => {
        setIsNavbarVisible(!isVisible);
    };

    const handleChangeDate = (newDate: Date) => {
        setSelectedDate(newDate);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
            {/* Mobile viewport container with beige background */}
            <div 
                className="relative w-full h-full max-w-[390px] max-h-[844px] overflow-hidden flex flex-col"
                style={{ 
                    background: '#f5f0e8'
                }}
            >
                {/* Scrollable content area - hide scrollbar */}
                <div className="flex-1 overflow-y-auto pb-24 home-scrollbar">
                    {/* Header Navigation */}
                    <header className="relative w-full px-8 pt-6 pb-3">
                        <div className="flex items-center justify-center">
                            {/* Center: Logo Image */}
                            <img 
                                src="/assets/Gel Polish Manicure (1).png" 
                                alt="Moments Logo"
                                className="h-16 w-auto object-contain"
                            />
                        </div>
                    </header>

                    {/* Search Bar */}
                    <div className="px-12 mt-3">
                        <div 
                            className="relative w-full flex items-center gap-2.5 px-4 py-2.5"
                            style={{
                                backgroundColor: 'transparent',
                                borderRadius: '50px',
                                border: '1px solid #d0d0d0',
                                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)'
                            }}
                        >
                            <i className="fa fa-search text-gray-400 text-sm"></i>
                            <input
                                type="text"
                                placeholder="Search for family or friends.."
                                className="flex-1 bg-transparent border-none outline-none text-gray-600 placeholder-gray-400"
                                style={{ 
                                    fontFamily: "'Bricolage Grotesque', sans-serif",
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                    </div>

                    {/* Planned Dates Row - Swipeable Pills */}
                    {sortedDates.length > 0 && (
                        <div className="mt-6">
                            <HomePlannedDatesRow
                                sortedDates={sortedDates}
                                dateSegmentColors={dateSegmentColors}
                                onDateClick={handlePlannedDateClick}
                            />
                        </div>
                    )}

                    {/* Weekly Calendar Strip - Planning First */}
                    <div className="mt-8 px-6">
                        <HomeWeeklyCalendarStrip 
                            selectedDate={selectedDate}
                            onDateSelect={handleDateSelect}
                            datesWithMoments={datesWithMoments}
                            dateSegmentColors={dateSegmentColors}
                        />
                    </div>

                    {/* Planning Content Area */}
                    <div className="mt-8 px-10">
                        <div
                            className="home-planning-container"
                            style={{
                                borderRadius: '20px',
                                padding: '24px',
                            }}
                        >
                            <p
                                className="text-gray-600 text-center mb-4"
                                style={{
                                    fontFamily: "'Bricolage Grotesque', sans-serif",
                                    fontSize: '15px',
                                }}
                            >
                                Create space for the moments that matter most
                            </p>
                            <button
                                onClick={handleStartPlanning}
                                className="yellow-button-small mx-auto block no-pulse"
                            >
                                Start Planning
                            </button>
                        </div>
                    </div>
                </div>

                {/* Curved Floating Footer Navigation Menu */}
                {isNavbarVisible && (
                    <footer 
                        className="fixed left-0 right-0 w-full max-w-[340px] mx-auto"
                        style={{
                            bottom: '12px',
                            backgroundColor: 'transparent',
                            borderRadius: '50px',
                            zIndex: 1000,
                            padding: '10px 8px',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
                            border: '1px solid #d0d0d0'
                        }}
                    >
                        <nav className="flex items-center justify-around">
                            {/* Home */}
                            <button 
                                className="flex flex-col items-center justify-center gap-0.5 min-w-[52px] transition-all duration-300 ease-in-out no-pulse"
                                aria-label="Home"
                                onMouseEnter={() => setHoveredNav('home')}
                                onMouseLeave={() => setHoveredNav(null)}
                            >
                                <i 
                                    className="fa-solid fa-house transition-colors duration-300 ease-in-out"
                                    style={{ 
                                        color: hoveredNav === 'home' ? '#ffa500' : '#000000',
                                        fontSize: '15px'
                                    }}
                                ></i>
                                <span 
                                    className="text-xs font-medium transition-colors duration-300 ease-in-out"
                                    style={{ 
                                        color: hoveredNav === 'home' ? '#ffa500' : '#000000',
                                        fontFamily: "'Bricolage Grotesque', sans-serif",
                                        fontSize: '9px'
                                    }}
                                >
                                    Home
                                </span>
                            </button>

                            {/* Vault */}
                            <button 
                                onClick={handleVaultClick}
                                className="flex flex-col items-center justify-center gap-0.5 min-w-[52px] transition-all duration-300 ease-in-out no-pulse"
                                aria-label="Vault"
                                onMouseEnter={() => setHoveredNav('vault')}
                                onMouseLeave={() => setHoveredNav(null)}
                            >
                                <i 
                                    className="fa-solid fa-box-archive transition-colors duration-300 ease-in-out"
                                    style={{ 
                                        color: hoveredNav === 'vault' ? '#ffa500' : '#000000',
                                        fontSize: '15px'
                                    }}
                                ></i>
                                <span 
                                    className="text-xs font-medium transition-colors duration-300 ease-in-out"
                                    style={{ 
                                        color: hoveredNav === 'vault' ? '#ffa500' : '#000000',
                                        fontFamily: "'Bricolage Grotesque', sans-serif",
                                        fontSize: '9px'
                                    }}
                                >
                                    Vault
                                </span>
                            </button>

                            {/* Camera - yellow button with camera icon and pulsating animation */}
                            <button 
                                onClick={handleCameraClick}
                                className="yellow-button-footer camera-pulse"
                                aria-label="Camera"
                            >
                                <i className="fa-solid fa-camera text-black" style={{ fontSize: '20px' }}></i>
                            </button>

                            {/* Notifications - Bell Icon (no navigation) */}
                            <button 
                                className="flex flex-col items-center justify-center gap-0.5 min-w-[52px] transition-all duration-300 ease-in-out no-pulse"
                                aria-label="Notifications"
                                onMouseEnter={() => setHoveredNav('notifications')}
                                onMouseLeave={() => setHoveredNav(null)}
                            >
                                <img 
                                    src="/assets/generated/notification-bell.dim_24x24.png"
                                    alt="Notifications"
                                    className="transition-opacity duration-300 ease-in-out"
                                    style={{ 
                                        width: '15px',
                                        height: '15px',
                                        opacity: hoveredNav === 'notifications' ? 0.7 : 1,
                                        filter: hoveredNav === 'notifications' ? 'brightness(0) saturate(100%) invert(56%) sepia(89%) saturate(1574%) hue-rotate(360deg) brightness(102%) contrast(104%)' : 'none'
                                    }}
                                />
                                <span 
                                    className="text-xs font-medium transition-colors duration-300 ease-in-out"
                                    style={{ 
                                        color: hoveredNav === 'notifications' ? '#ffa500' : '#000000',
                                        fontFamily: "'Bricolage Grotesque', sans-serif",
                                        fontSize: '9px'
                                    }}
                                >
                                    Notifications
                                </span>
                            </button>

                            {/* Profile/Settings */}
                            <button 
                                onClick={handleProfileClick}
                                className="flex flex-col items-center justify-center gap-0.5 min-w-[52px] transition-all duration-300 ease-in-out no-pulse"
                                aria-label="Profile"
                                onMouseEnter={() => setHoveredNav('profile')}
                                onMouseLeave={() => setHoveredNav(null)}
                            >
                                <i 
                                    className="fa-solid fa-user transition-colors duration-300 ease-in-out"
                                    style={{ 
                                        color: hoveredNav === 'profile' ? '#ffa500' : '#000000',
                                        fontSize: '15px'
                                    }}
                                ></i>
                                <span 
                                    className="text-xs font-medium transition-colors duration-300 ease-in-out"
                                    style={{ 
                                        color: hoveredNav === 'profile' ? '#ffa500' : '#000000',
                                        fontFamily: "'Bricolage Grotesque', sans-serif",
                                        fontSize: '9px'
                                    }}
                                >
                                    Profile
                                </span>
                            </button>
                        </nav>
                    </footer>
                )}
            </div>

            {/* Bottom Sheet */}
            <PlannedMomentBottomSheet
                isOpen={isBottomSheetOpen}
                onClose={() => setIsBottomSheetOpen(false)}
                selectedDate={selectedDate}
                onSave={addMoment}
                onVisibilityChange={handleBottomSheetVisibilityChange}
                onChangeDate={handleChangeDate}
            />
        </div>
    );
}

export default HomeScreen;
