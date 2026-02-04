import React, { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useProfile } from '../hooks/useProfile';
import InlineToast from '../components/InlineToast';
import { useBackSlideNavigation } from '../hooks/useBackSlideNavigation';
import { addNotification } from '../utils/localNotificationsStorage';

function ProfilePage() {
  const navigate = useNavigate();
  const { isExiting, handleBackWithSlide } = useBackSlideNavigation(() => navigate({ to: '/home' }));
  const { profile, updateProfile } = useProfile();
  const [displayName, setDisplayName] = useState(profile.displayName || '');
  const [location, setLocation] = useState(profile.location || '');
  const [profilePicture, setProfilePicture] = useState(profile.profilePicture || '');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const isFirstSave = !profile.displayName && displayName.trim();
    
    updateProfile({
      displayName: displayName.trim() || undefined,
      location: location.trim() || undefined,
      profilePicture: profilePicture || undefined,
    });
    setToastMessage('Profile saved successfully');
    setShowToast(true);
    
    // Trigger notification for first profile save
    if (isFirstSave) {
      addNotification('first-profile-save');
    }
    
    setTimeout(() => {
      navigate({ to: '/home' });
    }, 1500);
  };

  const handleCopyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(profile.inviteCode);
      setToastMessage('Copied to clipboard');
      setShowToast(true);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = profile.inviteCode;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setToastMessage('Copied to clipboard');
        setShowToast(true);
      } catch (err2) {
        setToastMessage('Failed to copy');
        setShowToast(true);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSettingsClick = () => {
    navigate({ to: '/settings' });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
      <div
        className={`relative w-full h-full max-w-[390px] max-h-[844px] overflow-hidden flex flex-col ${isExiting ? 'slide-back-exit' : ''}`}
        style={{ background: '#f5f0e8' }}
      >
        {/* Header */}
        <header className="relative w-full px-8 pt-8 pb-4 flex items-center justify-between">
          <button
            onClick={handleBackWithSlide}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Back to home"
          >
            <i className="fa fa-arrow-left text-gray-700 text-xl"></i>
          </button>
          <h1
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Profile
          </h1>
          <button
            onClick={handleSettingsClick}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Settings"
          >
            <i className="fa fa-cog text-gray-700 text-xl"></i>
          </button>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {/* Profile picture section */}
          <div className="flex flex-col items-center mt-6 mb-8">
            <div
              className="relative rounded-full overflow-hidden border-4 border-gray-300 mb-4"
              style={{ width: '120px', height: '120px' }}
            >
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <i className="fa fa-user text-gray-400 text-5xl"></i>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="yellow-button-small"
            >
              {profilePicture ? 'Change Photo' : 'Add Photo'}
            </button>
          </div>

          {/* Display name input */}
          <div className="mb-6">
            <label
              className="block text-sm font-semibold text-gray-700 mb-2"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl bg-white focus:outline-none focus:border-gray-500 transition-colors"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            />
          </div>

          {/* Location input */}
          <div className="mb-6">
            <label
              className="block text-sm font-semibold text-gray-700 mb-2"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl bg-white focus:outline-none focus:border-gray-500 transition-colors"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            />
          </div>

          {/* Invite code section */}
          <div className="mb-8">
            <label
              className="block text-sm font-semibold text-gray-700 mb-2"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Your Invite Code
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={profile.inviteCode}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl bg-gray-100 text-gray-700 font-mono text-lg"
                style={{ fontFamily: "'Courier New', monospace" }}
              />
              <button
                onClick={handleCopyInviteCode}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                aria-label="Copy invite code"
              >
                <i className="fa fa-copy text-gray-700 text-lg"></i>
              </button>
            </div>
            <p
              className="text-xs text-gray-500 mt-2"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Share this code with friends to invite them to your memories
            </p>
          </div>

          {/* Save button */}
          <button onClick={handleSave} className="yellow-button w-full">
            Save Profile
          </button>
        </div>

        {/* Toast notification */}
        {showToast && (
          <InlineToast
            message={toastMessage}
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
