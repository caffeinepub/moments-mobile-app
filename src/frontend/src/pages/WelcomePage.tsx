import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

function WelcomePage() {
    const numberRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { clear } = useInternetIdentity();

    useEffect(() => {
        // Trigger CSS animation by adding a class
        if (numberRef.current) {
            numberRef.current.classList.add('welcome-number');
        }
        if (textRef.current) {
            textRef.current.classList.add('animate-welcome-text');
        }
    }, []);

    const handleGetStarted = () => {
        // Navigate to home screen with smooth transition
        navigate({ to: '/home' });
    };

    const handleSignOut = () => {
        // Clear authentication and navigate back to splash screen
        clear();
        navigate({ to: '/' });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
            {/* Mobile viewport container with purple background */}
            <div 
                className="relative w-full h-full max-w-[390px] max-h-[844px] overflow-hidden"
                style={{ 
                    background: 'linear-gradient(135deg, #e8d5f2 0%, #d4b5e8 50%, #c09dd9 100%)'
                }}
            >
                {/* Subtle sign out button in top-right corner */}
                <button
                    onClick={handleSignOut}
                    className="absolute top-4 right-4 z-50 text-white/70 hover:text-white text-sm font-medium transition-colors duration-200"
                    style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                >
                    Sign Out
                </button>

                {/* Main content container - centered vertically */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 gap-6">
                    {/* Purple rectangle matching slide 3's exact design */}
                    <div 
                        className="w-full aspect-[280/480] max-w-[280px] rounded-[28px] border-[1.5px] border-white flex flex-col items-start justify-start text-white overflow-hidden"
                        style={{ backgroundColor: '#8b5fb5' }}
                    >
                        {/* Small "04" number text at the top with slide-in animation */}
                        <div 
                            ref={numberRef}
                            className="text-sm font-normal mb-3 tracking-tighter px-6 pt-6"
                        >
                            04
                        </div>

                        {/* Welcome text with slide-in from right animation */}
                        <div 
                            ref={textRef}
                            className="text-3xl font-semibold leading-[1.15] tracking-tighter mb-4 px-6"
                        >
                            <div className="welcome-word-1">Welcome To</div>
                            <div className="welcome-word-2">Moments</div>
                        </div>

                        {/* Family Image - No padding or borders, pushed down to touch bottom edge */}
                        <div className="flex-1 w-full flex items-end justify-center overflow-hidden">
                            <img 
                                src="/assets/family.png"
                                alt="Family" 
                                className="w-full h-auto object-cover object-bottom"
                                style={{ 
                                    marginTop: 'auto',
                                    display: 'block'
                                }}
                                loading="eager"
                                decoding="async"
                                fetchPriority="high"
                            />
                        </div>
                    </div>

                    {/* Get Started Button - yellow with new styling */}
                    <button 
                        onClick={handleGetStarted}
                        className="yellow-button z-40"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;
