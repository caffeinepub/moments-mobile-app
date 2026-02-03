import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';

interface SavedPhoto {
    id: number;
    data: string;
    timestamp: number;
    type: string;
}

function MomentsPage() {
    const navigate = useNavigate();
    const [photos, setPhotos] = useState<SavedPhoto[]>([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const touchStartY = useRef<number>(0);
    const touchEndY = useRef<number>(0);

    // Load photos from localStorage on mount
    useEffect(() => {
        try {
            const savedPhotos = JSON.parse(localStorage.getItem('moments_photos') || '[]');
            setPhotos(savedPhotos);
        } catch (error) {
            console.error('Failed to load photos:', error);
            setPhotos([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Auto-play background music on mount
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play().catch(error => {
                console.log('Audio autoplay prevented:', error);
            });
        }

        // Cleanup: pause audio when component unmounts
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    // Handle touch gestures for vertical scrolling
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
        const swipeDistance = touchStartY.current - touchEndY.current;
        const minSwipeDistance = 50;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0 && currentPhotoIndex < photos.length - 1) {
                // Swipe up - next photo
                setCurrentPhotoIndex(prev => prev + 1);
            } else if (swipeDistance < 0 && currentPhotoIndex > 0) {
                // Swipe down - previous photo
                setCurrentPhotoIndex(prev => prev - 1);
            }
        }
    };

    // Handle wheel scroll for desktop
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        
        if (e.deltaY > 0 && currentPhotoIndex < photos.length - 1) {
            // Scroll down - next photo
            setCurrentPhotoIndex(prev => prev + 1);
        } else if (e.deltaY < 0 && currentPhotoIndex > 0) {
            // Scroll up - previous photo
            setCurrentPhotoIndex(prev => prev - 1);
        }
    };

    const handleBack = () => {
        navigate({ to: '/home' });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
            {/* Background music */}
            <audio
                ref={audioRef}
                src="/assets/generated/background-music.mp3"
                loop
                preload="auto"
                style={{ display: 'none' }}
            />

            {/* Mobile viewport container */}
            <div 
                className="relative w-full h-full max-w-[390px] max-h-[844px] overflow-hidden flex flex-col"
                style={{ background: '#ffffff' }}
            >
                {/* Header */}
                <header className="relative w-full px-6 py-4 bg-white z-50 flex items-center justify-between">
                    {/* Back arrow */}
                    <button
                        onClick={handleBack}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Back"
                    >
                        <i className="fa fa-arrow-left text-gray-800 text-lg"></i>
                    </button>

                    {/* Page title */}
                    <h1 
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-800 font-semibold"
                        style={{
                            fontFamily: "'Bricolage Grotesque', sans-serif",
                            fontSize: '16px'
                        }}
                    >
                        Moments
                    </h1>

                    {/* Menu icon */}
                    <button
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Menu"
                    >
                        <i className="fa fa-bars text-gray-800 text-lg"></i>
                    </button>
                </header>

                {/* Photo slideshow container */}
                <div 
                    ref={containerRef}
                    className="flex-1 relative overflow-hidden moments-scrollbar"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onWheel={handleWheel}
                >
                    {isLoading ? (
                        // Loading state
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-800 mx-auto mb-4"></div>
                                <p 
                                    className="text-gray-600"
                                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                                >
                                    Loading moments...
                                </p>
                            </div>
                        </div>
                    ) : photos.length === 0 ? (
                        // Empty state
                        <div className="absolute inset-0 flex items-center justify-center px-8">
                            <div className="text-center">
                                <i className="fa fa-camera text-gray-300 text-6xl mb-6"></i>
                                <h2 
                                    className="text-gray-800 font-semibold mb-2"
                                    style={{
                                        fontFamily: "'Bricolage Grotesque', sans-serif",
                                        fontSize: '18px'
                                    }}
                                >
                                    No Moments Yet
                                </h2>
                                <p 
                                    className="text-gray-500 mb-6"
                                    style={{
                                        fontFamily: "'Bricolage Grotesque', sans-serif",
                                        fontSize: '14px'
                                    }}
                                >
                                    Capture your first moment using the camera
                                </p>
                                <button
                                    onClick={() => navigate({ to: '/camera' })}
                                    className="yellow-button-small"
                                >
                                    Open Camera
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Photo slideshow
                        <div className="relative w-full h-full">
                            {photos.map((photo, index) => (
                                <div
                                    key={photo.id}
                                    className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out"
                                    style={{
                                        transform: `translateY(${(index - currentPhotoIndex) * 100}%)`,
                                        opacity: index === currentPhotoIndex ? 1 : 0,
                                        pointerEvents: index === currentPhotoIndex ? 'auto' : 'none'
                                    }}
                                >
                                    <img
                                        src={photo.data}
                                        alt={`Moment ${index + 1}`}
                                        className="w-full h-full object-contain"
                                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                                    />
                                </div>
                            ))}

                            {/* Photo counter */}
                            <div 
                                className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full"
                                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '12px' }}
                            >
                                {currentPhotoIndex + 1} / {photos.length}
                            </div>

                            {/* Scroll indicators */}
                            {currentPhotoIndex > 0 && (
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 animate-bounce">
                                    <i className="fa fa-chevron-up text-white text-2xl opacity-50"></i>
                                </div>
                            )}
                            {currentPhotoIndex < photos.length - 1 && (
                                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 animate-bounce">
                                    <i className="fa fa-chevron-down text-white text-2xl opacity-50"></i>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MomentsPage;
