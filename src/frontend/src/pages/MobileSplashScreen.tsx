import { useState, useRef, useEffect, useCallback } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';

interface CardProps {
    backgroundColor: string;
    number: string;
    mediaSrc: string;
    textLine1: string;
    textLine2: string;
    isSecondCard?: boolean;
    isThirdCard?: boolean;
    isVideo?: boolean;
}

function SplashCard({ backgroundColor, number, mediaSrc, textLine1, textLine2, isSecondCard = false, isThirdCard = false, isVideo = false }: CardProps) {
    return (
        <div 
            className="w-full aspect-[280/480] max-w-[280px] rounded-[28px] border-[1.5px] border-white p-6 flex flex-col items-start justify-start text-white overflow-hidden shrink-0"
            style={{ backgroundColor }}
        >
            {/* Small number text at the top with slide-in animation */}
            <div className="text-sm font-normal mb-3 tracking-tighter animate-slide-in-1">
                {number}
            </div>
            
            {/* Main heading text with tighter letter spacing, lighter font weight, and reduced line spacing */}
            <div className="text-3xl font-semibold leading-[1.15] tracking-tighter mb-4">
                <div className="animate-slide-in-2">
                    {textLine1}
                </div>
                <div className="animate-slide-in-3">
                    {textLine2}
                </div>
            </div>

            {/* Media Content (Video or Image) with optimized loading */}
            <div className="flex-1 w-full flex items-end justify-center">
                {isVideo ? (
                    <video 
                        src={mediaSrc}
                        className="w-full h-auto object-contain object-bottom"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        disablePictureInPicture
                        controlsList="nodownload nofullscreen noremoteplayback"
                        style={{ pointerEvents: 'none' }}
                    />
                ) : (
                    <img 
                        src={mediaSrc}
                        alt="Character" 
                        className={`w-full h-auto object-contain ${isSecondCard ? 'object-bottom scale-[1.15] translate-y-[8%]' : isThirdCard ? 'object-bottom' : 'object-bottom'}`}
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                    />
                )}
            </div>
        </div>
    );
}

function MobileSplashScreen() {
    // Always start from Slide 1 (index 0) on mount or reload
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');
    const [targetIndex, setTargetIndex] = useState(0);
    
    const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { login, loginStatus, identity, isLoginSuccess, isInitializing } = useInternetIdentity();
    const navigate = useNavigate();
    const hasNavigatedRef = useRef(false);

    const cards = [
        { 
            backgroundColor: '#523926', 
            number: '01', 
            mediaSrc: '/assets/sadboy.mp4',
            textLine1: 'End Boredom',
            textLine2: 'Build Moments',
            isSecondCard: false,
            isThirdCard: false,
            isVideo: true,
            bgColor: '#f4e8d8',
            dotColor: '#523926',
            ctaBg: '#F8DC75',
            ctaBgHover: '#d4b85f',
            ctaText: '#000000',
            navText: '#523926'
        },
        { 
            backgroundColor: '#416894', 
            number: '02', 
            mediaSrc: '/assets/Untitled design (1).png',
            textLine1: 'Add More Life To',
            textLine2: 'Your Days',
            isSecondCard: true,
            isThirdCard: false,
            isVideo: false,
            bgColor: '#d4e4f7',
            dotColor: '#416894',
            ctaBg: '#6b9fd9',
            ctaBgHover: '#5a8bc4',
            ctaText: '#ffffff',
            navText: '#416894'
        },
        { 
            backgroundColor: '#4e985d', 
            number: '03', 
            mediaSrc: '/assets/Untitled design (2).png',
            textLine1: 'Create Memories',
            textLine2: 'Not doom scrolling',
            isSecondCard: false,
            isThirdCard: true,
            isVideo: false,
            bgColor: '#c8e6d0',
            dotColor: '#4e985d',
            ctaBg: '#6bb87a',
            ctaBgHover: '#5aa569',
            ctaText: '#ffffff',
            navText: '#4e985d'
        },
    ];

    // Clear navigation state on mount to ensure fresh start from Slide 1
    useEffect(() => {
        localStorage.removeItem('moments-slide-index');
        localStorage.removeItem('moments-current-page');
    }, []);

    // Handle navigation to welcome page after successful sign-in or if already authenticated
    useEffect(() => {
        // Skip if we're still initializing or have already navigated
        if (isInitializing || hasNavigatedRef.current) {
            return;
        }

        // If user is authenticated and on slide 3, navigate to welcome
        if (identity && currentIndex === 2) {
            hasNavigatedRef.current = true;
            navigate({ to: '/welcome' });
        }
    }, [identity, currentIndex, navigate, isInitializing]);

    // Cleanup function for all timeouts
    const clearAllTimeouts = useCallback(() => {
        if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
            transitionTimeoutRef.current = null;
        }
        if (autoPlayTimeoutRef.current) {
            clearTimeout(autoPlayTimeoutRef.current);
            autoPlayTimeoutRef.current = null;
        }
    }, []);

    // Core transition function - handles all slide transitions
    const transitionToSlide = useCallback((newIndex: number, direction: 'forward' | 'backward') => {
        // Prevent invalid transitions
        if (newIndex < 0 || newIndex > 2 || newIndex === currentIndex || isTransitioning) {
            return;
        }

        // Clear any existing timeouts
        clearAllTimeouts();

        // Start transition
        setTargetIndex(newIndex);
        setTransitionDirection(direction);
        setIsTransitioning(true);

        // Complete transition after animation duration
        const animationDuration = 3500;
        transitionTimeoutRef.current = setTimeout(() => {
            setCurrentIndex(newIndex);
            setIsTransitioning(false);
            transitionTimeoutRef.current = null;
        }, animationDuration);
    }, [currentIndex, isTransitioning, clearAllTimeouts]);

    // Auto-play functionality with extended first slide duration and stopping on third card
    useEffect(() => {
        // Don't auto-play if on last slide or currently transitioning
        if (currentIndex >= 2 || isTransitioning) {
            return;
        }

        // Extended pause duration for first slide (7 seconds), standard for others (3.5 seconds)
        const pauseDuration = currentIndex === 0 ? 7000 : 3500;

        autoPlayTimeoutRef.current = setTimeout(() => {
            transitionToSlide(currentIndex + 1, 'forward');
        }, pauseDuration);

        return () => {
            if (autoPlayTimeoutRef.current) {
                clearTimeout(autoPlayTimeoutRef.current);
                autoPlayTimeoutRef.current = null;
            }
        };
    }, [currentIndex, isTransitioning, transitionToSlide]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearAllTimeouts();
        };
    }, [clearAllTimeouts]);

    // Determine progress dot color - uses targetIndex during transition for immediate sync
    const getDotColor = () => {
        const activeIndex = isTransitioning ? targetIndex : currentIndex;
        return cards[activeIndex].dotColor;
    };

    // Get current background color - uses targetIndex during transition for immediate sync
    const getBackgroundColor = () => {
        const activeIndex = isTransitioning ? targetIndex : currentIndex;
        return cards[activeIndex].bgColor;
    };

    // Get contextual theme variables for buttons
    const getThemeVariables = () => {
        const activeIndex = isTransitioning ? targetIndex : currentIndex;
        const card = cards[activeIndex];
        return {
            '--cta-bg': card.ctaBg,
            '--cta-bg-hover': card.ctaBgHover,
            '--cta-text': card.ctaText,
            '--nav-text': card.navText,
        } as React.CSSProperties;
    };

    // Get card animation state
    const getCardState = (cardIndex: number) => {
        if (isTransitioning) {
            if (cardIndex === currentIndex) {
                return 'exiting';
            }
            if (cardIndex === targetIndex) {
                return 'entering';
            }
            return 'hidden';
        }
        
        return cardIndex === currentIndex ? 'active' : 'hidden';
    };

    // Handle backward navigation
    const handlePrevClick = () => {
        if (currentIndex === 0 || isTransitioning) return;
        transitionToSlide(currentIndex - 1, 'backward');
    };

    // Handle forward navigation
    const handleNextClick = () => {
        if (currentIndex >= 2 || isTransitioning) return;
        transitionToSlide(currentIndex + 1, 'forward');
    };

    // Smart sign-in handler that detects existing authentication
    const handleSignInClick = () => {
        // Don't proceed if still initializing or already logging in
        if (isInitializing || loginStatus === 'logging-in') {
            return;
        }

        // If user is already authenticated, proceed directly to welcome page
        if (identity) {
            hasNavigatedRef.current = true;
            navigate({ to: '/welcome' });
            return;
        }

        // Otherwise, initiate login flow
        login();
    };

    // Determine button text based on authentication state
    const getButtonText = () => {
        if (isInitializing) return 'Loading...';
        if (loginStatus === 'logging-in') return 'Connecting...';
        if (identity) return 'Continue';
        return 'Sign In';
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black touch-none overflow-hidden">
            {/* Mobile viewport container - fills screen on mobile, centered with max dimensions on desktop */}
            <div 
                className="relative w-full h-full max-w-[390px] max-h-[844px] overflow-hidden transition-colors duration-500"
                style={{ backgroundColor: getBackgroundColor() }}
            >
                {/* Main content container - centered vertically with space for elements below */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 gap-4" style={getThemeVariables()}>
                    {/* Slideshow container with perspective for 3D effect */}
                    <div 
                        className="relative w-full max-w-[280px] aspect-[280/480]"
                        style={{ perspective: '1400px' }}
                    >
                        {cards.map((card, index) => {
                            const state = getCardState(index);
                            const animClass = transitionDirection === 'forward' 
                                ? (state === 'active' ? 'card-active-clockwise' :
                                   state === 'exiting' ? 'card-exiting-clockwise' :
                                   state === 'entering' ? 'card-entering-clockwise' :
                                   'card-hidden-clockwise')
                                : (state === 'active' ? 'card-active-clockwise' :
                                   state === 'exiting' ? 'card-exiting-backward' :
                                   state === 'entering' ? 'card-entering-backward' :
                                   'card-hidden-backward');
                            
                            // Calculate z-index to ensure proper layering
                            let zIndex = 1;
                            if (state === 'active') zIndex = 20;
                            else if (state === 'entering') zIndex = 15;
                            else if (state === 'exiting') zIndex = 10;
                            
                            return (
                                <div 
                                    key={index}
                                    className={`absolute inset-0 flex items-center justify-center transition-all duration-[3500ms] ease-in-out ${animClass}`}
                                    style={{ 
                                        transformStyle: 'preserve-3d',
                                        pointerEvents: state === 'active' ? 'auto' : 'none',
                                        zIndex,
                                        visibility: state === 'hidden' && !isTransitioning ? 'hidden' : 'visible'
                                    }}
                                >
                                    <SplashCard 
                                        backgroundColor={card.backgroundColor} 
                                        number={card.number}
                                        mediaSrc={card.mediaSrc}
                                        textLine1={card.textLine1}
                                        textLine2={card.textLine2}
                                        isSecondCard={card.isSecondCard}
                                        isThirdCard={card.isThirdCard}
                                        isVideo={card.isVideo}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Navigation controls container - positioned below rectangle with higher z-index */}
                    <div className="relative w-full max-w-[280px] flex items-center justify-between px-2 z-50">
                        {/* Prev text - bottom-left corner */}
                        <button
                            onClick={handlePrevClick}
                            disabled={currentIndex === 0 || isTransitioning}
                            className="nav-control-text"
                            style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                        >
                            Prev
                        </button>

                        {/* Next text - bottom-right corner */}
                        <button
                            onClick={handleNextClick}
                            disabled={currentIndex >= 2 || isTransitioning}
                            className="nav-control-text"
                            style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
                        >
                            Next
                        </button>
                    </div>

                    {/* Progress Dots (Slides 1 & 2) or Sign In Button (Slide 3) - with higher z-index */}
                    {currentIndex < 2 ? (
                        <div className="flex gap-2 items-center justify-center z-50">
                            <div 
                                className="w-2 h-2 rounded-full animate-wave-bounce-1 transition-colors duration-500"
                                style={{ backgroundColor: getDotColor() }}
                            ></div>
                            <div 
                                className="w-2 h-2 rounded-full animate-wave-bounce-2 transition-colors duration-500"
                                style={{ backgroundColor: getDotColor() }}
                            ></div>
                            <div 
                                className="w-2 h-2 rounded-full animate-wave-bounce-3 transition-colors duration-500"
                                style={{ backgroundColor: getDotColor() }}
                            ></div>
                        </div>
                    ) : (
                        <button 
                            onClick={handleSignInClick}
                            disabled={isInitializing || loginStatus === 'logging-in'}
                            className="contextual-cta-button z-50"
                        >
                            {getButtonText()}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MobileSplashScreen;
