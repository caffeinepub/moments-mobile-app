import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useMomentsPhotos } from '../hooks/useMomentsPhotos';
import { useProfile } from '../hooks/useProfile';
import { formatRelativeTime } from '../utils/timeFormat';
import MomentsImageCard from '../components/MomentsImageCard';

function HomeScreen() {
    const navigate = useNavigate();
    const [hoveredNav, setHoveredNav] = useState<string | null>(null);
    const { mostRecent } = useMomentsPhotos();
    const { profile } = useProfile();

    const handleCameraClick = () => {
        navigate({ to: '/camera' });
    };

    const handleSettingsClick = () => {
        navigate({ to: '/settings' });
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

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
            {/* Mobile viewport container with beige background */}
            <div 
                className="relative w-full h-full max-w-[390px] max-h-[844px] overflow-hidden flex flex-col"
                style={{ 
                    background: '#f5f0e8'
                }}
            >
                {/* Scrollable content area */}
                <div className="flex-1 overflow-y-auto pb-24">
                    {/* Header Navigation */}
                    <header className="relative w-full px-8 pt-8 pb-4">
                        <div className="flex items-center justify-center">
                            {/* Center: Logo Image - increased size */}
                            <img 
                                src="/assets/Gel Polish Manicure (1).png" 
                                alt="Moments Logo"
                                className="h-24 w-auto object-contain"
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

                    {/* Moments Image Card Section */}
                    <div className="mt-8 mb-6">
                        {mostRecent ? (
                            <MomentsImageCard
                                imageUrl={mostRecent.data}
                                profilePicture={profile.profilePicture}
                                displayName={profile.displayName}
                                location={profile.location}
                                timestamp={formatRelativeTime(mostRecent.timestamp)}
                                who={mostRecent.who}
                                reflection={mostRecent.reflection}
                                feeling={mostRecent.feeling}
                            />
                        ) : (
                            <div className="px-10">
                                <div
                                    className="home-empty-glass-card w-full p-8 text-center"
                                    style={{
                                        borderRadius: '20px',
                                    }}
                                >
                                    <i className="fa fa-camera text-gray-300 text-5xl mb-4"></i>
                                    <p
                                        className="text-gray-500 mb-4"
                                        style={{
                                            fontFamily: "'Bricolage Grotesque', sans-serif",
                                            fontSize: '15px',
                                        }}
                                    >
                                        No moments captured yet
                                    </p>
                                    <button
                                        onClick={handleCameraClick}
                                        className="yellow-button-small"
                                    >
                                        Capture Your First Moment
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Curved Floating Footer Navigation Menu */}
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
                            className="flex flex-col items-center justify-center gap-0.5 min-w-[52px] transition-all duration-300 ease-in-out"
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
                            className="flex flex-col items-center justify-center gap-0.5 min-w-[52px] transition-all duration-300 ease-in-out"
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
                            className="flex flex-col items-center justify-center gap-0.5 min-w-[52px] transition-all duration-300 ease-in-out"
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
                            className="flex flex-col items-center justify-center gap-0.5 min-w-[52px] transition-all duration-300 ease-in-out"
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
            </div>
        </div>
    );
}

export default HomeScreen;
