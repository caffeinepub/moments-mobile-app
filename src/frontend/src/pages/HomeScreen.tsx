import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

function HomeScreen() {
    const navigate = useNavigate();
    const [hoveredNav, setHoveredNav] = useState<string | null>(null);

    const handleCameraClick = () => {
        navigate({ to: '/camera' });
    };

    const handleSettingsClick = () => {
        navigate({ to: '/settings' });
    };

    const handleCalendarClick = () => {
        navigate({ to: '/calendar' });
    };

    const handleMomentsClick = () => {
        navigate({ to: '/moments' });
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
                        <div className="flex items-center justify-between">
                            {/* Left: Profile Placeholder */}
                            <button 
                                className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 bg-gray-100 hover:opacity-70 transition-opacity"
                                aria-label="Profile"
                            >
                                <i className="fa fa-user text-gray-400 text-xl"></i>
                            </button>
                            
                            {/* Center: Logo Image - significantly enlarged */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                <img 
                                    src="/assets/Gel Polish Manicure (1).png" 
                                    alt="Moments Logo"
                                    className="h-16 w-auto object-contain"
                                />
                            </div>
                            
                            {/* Right: Notification Icon */}
                            <button 
                                className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300 bg-gray-100 hover:opacity-70 transition-opacity"
                                aria-label="Notifications"
                            >
                                <i className="fa fa-bell text-gray-400 text-xl"></i>
                            </button>
                        </div>
                    </header>

                    {/* Search Bar - narrower with reduced padding, pushed up closer to header */}
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
                            {/* Search Icon */}
                            <i className="fa fa-search text-gray-400 text-sm"></i>
                            
                            {/* Search Input */}
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

                    {/* Promotional Card Section - smaller and less tall */}
                    <div className="px-10 mt-6">
                        <div 
                            className="relative w-full overflow-hidden flex flex-col"
                            style={{
                                backgroundColor: '#E87A3E',
                                borderRadius: '20px',
                                height: '140px',
                                padding: '16px'
                            }}
                        >
                            {/* Text Content with Enhanced Arrow */}
                            <div className="relative z-10">
                                <h3 
                                    className="text-white font-bold leading-tight"
                                    style={{
                                        fontFamily: "'Bricolage Grotesque', sans-serif",
                                        fontSize: '18px',
                                        letterSpacing: '-0.02em'
                                    }}
                                >
                                    Plan Meaningful Moments{' '}
                                    <span 
                                        className="inline-block"
                                        style={{
                                            fontSize: '26px',
                                            fontWeight: '900',
                                            transform: 'scaleX(1.3)',
                                            display: 'inline-block',
                                            marginLeft: '4px'
                                        }}
                                    >
                                        →
                                    </span>
                                </h3>
                            </div>

                            {/* Add Your Moment Button - yellow with new styling */}
                            <div className="relative z-10 mt-3">
                                <button className="yellow-button-small">
                                    Add Your Moment
                                </button>
                            </div>

                            {/* Character Image - sad girl perfectly framed within card */}
                            <div className="absolute right-0 bottom-0 h-full flex items-end overflow-hidden">
                                <img 
                                    src="/assets/Untitled design (2)-1.png"
                                    alt="Character"
                                    className="h-full w-auto object-contain object-bottom"
                                    style={{
                                        maxHeight: '140px',
                                        maxWidth: '130px'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Curved Floating Footer Navigation Menu - slimmer with reduced width and padding */}
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

                        {/* Camera - yellow button with camera icon */}
                        <button 
                            onClick={handleCameraClick}
                            className="yellow-button-footer"
                            aria-label="Camera"
                        >
                            <i className="fa-solid fa-camera text-black" style={{ fontSize: '20px' }}></i>
                        </button>

                        {/* Moments */}
                        <button 
                            onClick={handleMomentsClick}
                            className="flex flex-col items-center justify-center gap-0.5 min-w-[52px] transition-all duration-300 ease-in-out"
                            aria-label="Moments"
                            onMouseEnter={() => setHoveredNav('moments')}
                            onMouseLeave={() => setHoveredNav(null)}
                        >
                            <i 
                                className="fa-regular fa-clipboard-list transition-colors duration-300 ease-in-out"
                                style={{ 
                                    color: hoveredNav === 'moments' ? '#ffa500' : '#000000',
                                    fontSize: '15px'
                                }}
                            ></i>
                            <span 
                                className="text-xs font-medium transition-colors duration-300 ease-in-out"
                                style={{ 
                                    color: hoveredNav === 'moments' ? '#ffa500' : '#000000',
                                    fontFamily: "'Bricolage Grotesque', sans-serif",
                                    fontSize: '9px'
                                }}
                            >
                                Moments
                            </span>
                        </button>

                        {/* Settings */}
                        <button 
                            onClick={handleSettingsClick}
                            className="flex flex-col items-center justify-center gap-0.5 min-w-[52px] transition-all duration-300 ease-in-out"
                            aria-label="Settings"
                            onMouseEnter={() => setHoveredNav('settings')}
                            onMouseLeave={() => setHoveredNav(null)}
                        >
                            <i 
                                className="fa-solid fa-user-gear transition-colors duration-300 ease-in-out"
                                style={{ 
                                    color: hoveredNav === 'settings' ? '#ffa500' : '#000000',
                                    fontSize: '15px'
                                }}
                            ></i>
                            <span 
                                className="text-xs font-medium transition-colors duration-300 ease-in-out"
                                style={{ 
                                    color: hoveredNav === 'settings' ? '#ffa500' : '#000000',
                                    fontFamily: "'Bricolage Grotesque', sans-serif",
                                    fontSize: '9px'
                                }}
                            >
                                Settings
                            </span>
                        </button>
                    </nav>
                </footer>
            </div>
        </div>
    );
}

export default HomeScreen;
