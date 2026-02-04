import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useBackSlideNavigation } from '../hooks/useBackSlideNavigation';

function SettingsPage() {
    const navigate = useNavigate();
    const { clear } = useInternetIdentity();
    const { isExiting, handleBackWithSlide } = useBackSlideNavigation(() => navigate({ to: '/home' }));

    const handleLogout = () => {
        clear();
        navigate({ to: '/' });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
            {/* Mobile viewport container with white background */}
            <div 
                className={`relative w-full h-full max-w-[390px] max-h-[844px] overflow-hidden flex flex-col ${isExiting ? 'slide-back-exit' : ''}`}
                style={{ background: '#ffffff' }}
            >
                {/* Header - reduced size */}
                <header className="relative w-full px-5 pt-5 pb-3 flex items-center justify-center border-b border-gray-200">
                    {/* Back arrow - left aligned */}
                    <button
                        onClick={handleBackWithSlide}
                        className="absolute left-5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-black hover:opacity-70 transition-opacity"
                        aria-label="Back to home"
                    >
                        <i className="fa fa-arrow-left text-lg"></i>
                    </button>

                    {/* Title - centered with smaller font */}
                    <h1 
                        className="text-xl font-bold text-black"
                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                    >
                        Settings
                    </h1>
                </header>

                {/* Scrollable content with thin mobile scrollbar */}
                <div className="flex-1 overflow-y-auto settings-scrollbar px-5 py-4">
                    {/* Account & Subscription Group - more compact */}
                    <div className="mb-3">
                        <div className="bg-gray-50 rounded-xl overflow-hidden">
                            {/* Account */}
                            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <i className="fa-solid fa-user text-black text-base w-5 text-center"></i>
                                    <span 
                                        className="text-sm font-medium text-black"
                                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                    >
                                        Account
                                    </span>
                                </div>
                                <i className="fa fa-chevron-right text-gray-400 text-xs"></i>
                            </button>

                            {/* My subscription */}
                            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <i className="fa-solid fa-heart text-black text-base w-5 text-center"></i>
                                    <span 
                                        className="text-sm font-medium text-black"
                                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                    >
                                        My subscription
                                    </span>
                                </div>
                                <i className="fa fa-chevron-right text-gray-400 text-xs"></i>
                            </button>
                        </div>
                    </div>

                    {/* Main Settings Group - more compact */}
                    <div className="mb-3">
                        <div className="bg-gray-50 rounded-xl overflow-hidden">
                            {/* General */}
                            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <i className="fa-solid fa-gear text-black text-base w-5 text-center"></i>
                                    <span 
                                        className="text-sm font-medium text-black"
                                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                    >
                                        General
                                    </span>
                                </div>
                                <i className="fa fa-chevron-right text-gray-400 text-xs"></i>
                            </button>

                            {/* Privacy */}
                            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <i className="fa-solid fa-shield-halved text-black text-base w-5 text-center"></i>
                                    <span 
                                        className="text-sm font-medium text-black"
                                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                    >
                                        Privacy
                                    </span>
                                </div>
                                <i className="fa fa-chevron-right text-gray-400 text-xs"></i>
                            </button>

                            {/* Notifications */}
                            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <i className="fa-solid fa-bell text-black text-base w-5 text-center"></i>
                                    <span 
                                        className="text-sm font-medium text-black"
                                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                    >
                                        Notifications
                                    </span>
                                </div>
                                <i className="fa fa-chevron-right text-gray-400 text-xs"></i>
                            </button>

                            {/* Appearance */}
                            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <i className="fa-solid fa-palette text-black text-base w-5 text-center"></i>
                                    <span 
                                        className="text-sm font-medium text-black"
                                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                    >
                                        Appearance
                                    </span>
                                </div>
                                <i className="fa fa-chevron-right text-gray-400 text-xs"></i>
                            </button>

                            {/* Advanced */}
                            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <i className="fa-solid fa-chart-line text-black text-base w-5 text-center"></i>
                                    <span 
                                        className="text-sm font-medium text-black"
                                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                    >
                                        Advanced
                                    </span>
                                </div>
                                <i className="fa fa-chevron-right text-gray-400 text-xs"></i>
                            </button>
                        </div>
                    </div>

                    {/* Support & Account Group - more compact */}
                    <div className="mb-3">
                        <div className="bg-gray-50 rounded-xl overflow-hidden">
                            {/* Help */}
                            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <i className="fa-solid fa-circle-question text-black text-base w-5 text-center"></i>
                                    <span 
                                        className="text-sm font-medium text-black"
                                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                    >
                                        Help
                                    </span>
                                </div>
                                <i className="fa fa-chevron-right text-gray-400 text-xs"></i>
                            </button>

                            {/* Log out */}
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <i className="fa-solid fa-arrow-right-from-bracket text-black text-base w-5 text-center"></i>
                                    <span 
                                        className="text-sm font-medium text-black"
                                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                    >
                                        Log out
                                    </span>
                                </div>
                                <i className="fa fa-chevron-right text-gray-400 text-xs"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;
