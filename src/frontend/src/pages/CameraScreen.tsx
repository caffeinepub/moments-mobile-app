import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCamera } from '../camera/useCamera';

function CameraScreen() {
    const navigate = useNavigate();
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [isFlashOn, setIsFlashOn] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const {
        isActive,
        isSupported,
        error,
        isLoading,
        currentFacingMode,
        startCamera,
        stopCamera,
        capturePhoto,
        switchCamera,
        retry,
        videoRef,
        canvasRef
    } = useCamera({
        facingMode: 'environment',
        width: 1920,
        height: 1080,
        quality: 0.95,
        format: 'image/jpeg'
    });

    // Auto-start camera on mount
    useEffect(() => {
        if (isSupported && !isActive && !capturedPhoto) {
            startCamera();
        }
    }, [isSupported, isActive, capturedPhoto, startCamera]);

    const handleCapture = async () => {
        const photo = await capturePhoto();
        if (photo) {
            const url = URL.createObjectURL(photo);
            setCapturedPhoto(url);
        }
    };

    const handleSavePhoto = async () => {
        if (!capturedPhoto) return;
        
        setIsSaving(true);
        try {
            // Convert blob URL to actual blob data
            const response = await fetch(capturedPhoto);
            const blob = await response.blob();
            
            // Convert blob to base64 for localStorage persistence
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result as string;
                
                // Get existing photos from Moments collection
                const savedPhotos = JSON.parse(localStorage.getItem('moments_photos') || '[]');
                
                // Add new photo with metadata
                savedPhotos.push({
                    id: Date.now(),
                    data: base64data,
                    timestamp: Date.now(),
                    type: blob.type
                });
                
                // Save back to localStorage
                localStorage.setItem('moments_photos', JSON.stringify(savedPhotos));
                
                // Dispatch custom event for same-tab updates
                window.dispatchEvent(new Event('moments_photos_updated'));
                
                // Navigate back to home
                navigate({ to: '/home' });
            };
            reader.readAsDataURL(blob);
        } catch (err) {
            console.error('Failed to save photo:', err);
            setIsSaving(false);
        }
    };

    const handleRetake = () => {
        if (capturedPhoto) {
            URL.revokeObjectURL(capturedPhoto);
        }
        setCapturedPhoto(null);
    };

    const handleClose = () => {
        stopCamera();
        navigate({ to: '/home' });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setCapturedPhoto(url);
        }
    };

    if (isSupported === false) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black">
                <div className="text-white text-center p-8">
                    <p className="text-xl mb-4">Camera not supported on this device</p>
                    <button
                        onClick={handleClose}
                        className="yellow-button"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
            {/* Mobile viewport container */}
            <div 
                className="relative w-full h-full max-w-[390px] max-h-[844px] overflow-hidden flex flex-col"
                style={{ background: '#000000' }}
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="Close camera"
                >
                    <i className="fa fa-times text-xl"></i>
                </button>

                {/* Camera preview or captured photo */}
                <div className="flex-1 relative overflow-hidden">
                    {capturedPhoto ? (
                        // Show captured photo
                        <img
                            src={capturedPhoto}
                            alt="Captured"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <>
                            {/* Live camera feed */}
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                                style={{ transform: currentFacingMode === 'user' ? 'scaleX(-1)' : 'none' }}
                            />
                            <canvas ref={canvasRef} style={{ display: 'none' }} />

                            {/* Error message */}
                            {error && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                                    <div className="text-white text-center p-8 max-w-sm">
                                        <i className="fa fa-exclamation-triangle text-4xl mb-4 text-yellow-500"></i>
                                        <p className="text-lg mb-2 font-semibold">Camera Error</p>
                                        <p className="text-sm mb-6 opacity-90">{error.message}</p>
                                        <button
                                            onClick={retry}
                                            disabled={isLoading}
                                            className="yellow-button"
                                        >
                                            {isLoading ? 'Retrying...' : 'Try Again'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Loading state */}
                            {isLoading && !error && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                                    <div className="text-white text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                                        <p>Starting camera...</p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Camera controls */}
                <div className="relative bg-black py-8 px-6">
                    {capturedPhoto ? (
                        // Photo review controls
                        <div className="flex items-center justify-around">
                            <button
                                onClick={handleRetake}
                                className="flex flex-col items-center gap-2 text-white hover:opacity-70 transition-opacity"
                            >
                                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                                    <i className="fa fa-redo text-2xl"></i>
                                </div>
                                <span className="text-xs" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                                    Retake
                                </span>
                            </button>

                            <button
                                onClick={handleSavePhoto}
                                disabled={isSaving}
                                className="yellow-button-camera"
                            >
                                {isSaving ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-black border-t-transparent"></div>
                                ) : (
                                    <i className="fa fa-check text-2xl text-black"></i>
                                )}
                            </button>
                        </div>
                    ) : (
                        // Camera capture controls
                        <div className="flex items-center justify-between">
                            {/* Flash toggle */}
                            <button
                                onClick={() => setIsFlashOn(!isFlashOn)}
                                disabled={!isActive}
                                className="flex flex-col items-center gap-1 text-white hover:opacity-70 transition-opacity disabled:opacity-30"
                                aria-label="Toggle flash"
                            >
                                <i 
                                    className={`fa-solid fa-bolt text-2xl ${isFlashOn ? 'text-yellow-400' : ''}`}
                                    style={{ fontSize: '28px' }}
                                ></i>
                            </button>

                            {/* Capture button - yellow styled */}
                            <button
                                onClick={handleCapture}
                                disabled={!isActive || isLoading}
                                className="yellow-button-camera"
                                aria-label="Capture photo"
                            >
                                <i className="fa-solid fa-camera text-black text-2xl"></i>
                            </button>

                            {/* Switch camera */}
                            <button
                                onClick={() => switchCamera()}
                                disabled={!isActive || isLoading}
                                className="flex flex-col items-center gap-1 text-white hover:opacity-70 transition-opacity disabled:opacity-30"
                                aria-label="Switch camera"
                            >
                                <i 
                                    className="fa-solid fa-rotate-right text-2xl"
                                    style={{ fontSize: '28px' }}
                                ></i>
                            </button>
                        </div>
                    )}

                    {/* Manual upload option */}
                    {!capturedPhoto && (
                        <div className="mt-6 text-center">
                            <label className="text-white text-sm cursor-pointer hover:opacity-70 transition-opacity">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                                    or upload from gallery
                                </span>
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CameraScreen;
