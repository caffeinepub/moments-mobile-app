import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import HomeWeeklyCalendarStrip from '../components/HomeWeeklyCalendarStrip';
import PlannedMomentBottomSheet from '../components/PlannedMomentBottomSheet';
import PlannedMomentCard from '../components/PlannedMomentCard';
import InlineToast from '../components/InlineToast';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { usePlannedMoments } from '../hooks/usePlannedMoments';
import { useProfile } from '../hooks/useProfile';
import { PlannedMoment } from '../utils/plannedMomentsStorage';
import { generatePlannedMomentShareText } from '../utils/plannedMomentShareText';

function HomeScreen() {
    const navigate = useNavigate();
    const [hoveredNav, setHoveredNav] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastPlacement, setToastPlacement] = useState<'bottom' | 'side'>('bottom');
    const [momentToDelete, setMomentToDelete] = useState<PlannedMoment | null>(null);

    const { allMoments, datesWithMoments, dateColorMap, addMoment, deleteMoment } = usePlannedMoments(null);
    const { profile } = useProfile();

    const handleCameraClick = () => {
        navigate({ to: '/camera' });
    };

    const handleCalendarClick = () => {
        navigate({ to: '/calendar' });
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

    const handleDuplicateDate = () => {
        setToastPlacement('side');
        setToastMessage('You can only have one moment per day');
    };

    const handleShare = async (moment: PlannedMoment) => {
        const shareText = generatePlannedMomentShareText(moment, profile.displayName);

        // Always copy to clipboard (no native share)
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(shareText);
                setToastPlacement('bottom');
                setToastMessage('Copied to clipboard');
            } else {
                // Fallback for browsers without Clipboard API
                const textArea = document.createElement('textarea');
                textArea.value = shareText;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                    setToastPlacement('bottom');
                    setToastMessage('Copied to clipboard');
                } catch (err) {
                    console.error('Fallback copy failed:', err);
                    setToastPlacement('bottom');
                    setToastMessage('Failed to copy');
                }
                document.body.removeChild(textArea);
            }
        } catch (error) {
            console.error('Copy failed:', error);
            setToastPlacement('bottom');
            setToastMessage('Failed to copy');
        }
    };

    const handleDeleteRequest = (moment: PlannedMoment) => {
        setMomentToDelete(moment);
    };

    const handleConfirmDelete = () => {
        if (momentToDelete) {
            deleteMoment(momentToDelete.id);
            setMomentToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setMomentToDelete(null);
    };

    const hasMoments = allMoments.length > 0;

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
                    <header className="relative w-full px-8 pt-4 pb-2">
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
                    <div className="px-12 mt-2">
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

                    {/* Weekly Calendar Strip - Planning First */}
                    <div className="mt-5 px-6">
                        <HomeWeeklyCalendarStrip 
                            selectedDate={selectedDate}
                            onDateSelect={handleDateSelect}
                            datesWithMoments={datesWithMoments}
                            dateColorMap={dateColorMap}
                        />
                    </div>

                    {/* Planning Content Area */}
                    <div className="mt-6 px-10">
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
                            
                            {!hasMoments ? (
                                <button
                                    onClick={handleStartPlanning}
                                    className="yellow-button-small mx-auto block no-pulse"
                                >
                                    Start Planning
                                </button>
                            ) : (
                                <button
                                    onClick={handleStartPlanning}
                                    className="home-add-planning-button mx-auto block no-pulse"
                                    aria-label="Add new planned moment"
                                >
                                    <Plus size={20} strokeWidth={2.5} />
                                </button>
                            )}
                        </div>

                        {/* Saved Planning Cards */}
                        {hasMoments && (
                            <div className="mt-6 flex flex-col gap-3">
                                {allMoments.map((moment) => (
                                    <PlannedMomentCard 
                                        key={moment.id} 
                                        moment={moment}
                                        onShare={handleShare}
                                        onDelete={handleDeleteRequest}
                                    />
                                ))}
                            </div>
                        )}
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

                            {/* Calendar */}
                            <button 
                                onClick={handleCalendarClick}
                                className="flex flex-col items-center justify-center gap-0.5 min-w-[52px] transition-all duration-300 ease-in-out no-pulse"
                                aria-label="Calendar"
                                onMouseEnter={() => setHoveredNav('calendar')}
                                onMouseLeave={() => setHoveredNav(null)}
                            >
                                <i 
                                    className="fa-regular fa-calendar-days transition-colors duration-300 ease-in-out"
                                    style={{ 
                                        color: hoveredNav === 'calendar' ? '#ffa500' : '#000000',
                                        fontSize: '15px'
                                    }}
                                ></i>
                                <span 
                                    className="text-xs font-medium transition-colors duration-300 ease-in-out"
                                    style={{ 
                                        color: hoveredNav === 'calendar' ? '#ffa500' : '#000000',
                                        fontFamily: "'Bricolage Grotesque', sans-serif",
                                        fontSize: '9px'
                                    }}
                                >
                                    Calendar
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
                onDuplicateDate={handleDuplicateDate}
            />

            {/* Toast notification */}
            {toastMessage && (
                <InlineToast
                    message={toastMessage}
                    placement={toastPlacement}
                    onClose={() => setToastMessage(null)}
                />
            )}

            {/* Delete confirmation modal */}
            <ConfirmDeleteModal
                isOpen={!!momentToDelete}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                title="Delete Moment?"
                message="This planned moment will be permanently removed."
            />
        </div>
    );
}

export default HomeScreen;
