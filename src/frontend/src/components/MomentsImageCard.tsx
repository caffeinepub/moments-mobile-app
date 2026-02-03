import React from 'react';

interface MomentsImageCardProps {
  imageUrl: string;
  profilePicture?: string;
  displayName?: string;
  location?: string;
  timestamp: string;
}

function MomentsImageCard({
  imageUrl,
  profilePicture,
  displayName,
  location,
  timestamp,
}: MomentsImageCardProps) {
  return (
    <div className="w-full px-10">
      <div
        className="glass-card relative w-full overflow-hidden"
        style={{
          borderRadius: '20px',
        }}
      >
        {/* Header row with avatar, name, location, timestamp */}
        <div className="flex items-center gap-3 p-4">
          {/* Profile avatar */}
          <div
            className="flex-shrink-0 rounded-full overflow-hidden border-2 border-gray-200"
            style={{ width: '48px', height: '48px' }}
          >
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <i className="fa fa-user text-gray-400 text-xl"></i>
              </div>
            )}
          </div>

          {/* Name and location */}
          <div className="flex-1 min-w-0">
            <p
              className="font-semibold text-gray-900 truncate"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: '15px',
              }}
            >
              {displayName || 'Anonymous'}
            </p>
            <p
              className="text-gray-500 text-xs truncate"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              {location || 'Location not set'}
            </p>
          </div>

          {/* Timestamp */}
          <div
            className="text-gray-400 text-xs flex-shrink-0"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
            }}
          >
            {timestamp}
          </div>
        </div>

        {/* Main image */}
        <div className="relative w-full" style={{ aspectRatio: '4 / 5' }}>
          <img
            src={imageUrl}
            alt="Moment"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bottom engagement bar */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{
            backgroundColor: '#FFF9E6',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
          }}
        >
          <div className="flex items-center gap-4">
            {/* Heart icon */}
            <button
              className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
              aria-label="Like"
            >
              <i className="fa-regular fa-heart text-lg"></i>
            </button>

            {/* Comment icon */}
            <button
              className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors"
              aria-label="Comment"
            >
              <i className="fa-regular fa-comment text-lg"></i>
              <span
                className="text-xs"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                12 comments
              </span>
            </button>
          </div>

          {/* Share icon */}
          <button
            className="text-gray-600 hover:text-green-500 transition-colors"
            aria-label="Share"
          >
            <i className="fa-solid fa-share-nodes text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MomentsImageCard;
