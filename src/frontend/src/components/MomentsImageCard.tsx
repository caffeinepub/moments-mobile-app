import React from 'react';
import { MomentFeeling } from '../utils/momentsPhotosStorage';

interface MomentsImageCardProps {
  imageUrl: string;
  profilePicture?: string;
  displayName?: string;
  location?: string;
  timestamp: string;
  who?: string;
  reflection?: string;
  feeling?: MomentFeeling;
}

function MomentsImageCard({
  imageUrl,
  profilePicture,
  displayName,
  location,
  timestamp,
  who,
  reflection,
  feeling,
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

        {/* Bottom metadata section - quiet and private */}
        <div
          className="px-4 py-3 space-y-2"
          style={{
            backgroundColor: '#FFF9E6',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
          }}
        >
          {/* Who */}
          {who && (
            <p
              className="text-sm text-gray-700"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              <span className="font-semibold">With:</span> {who}
            </p>
          )}

          {/* Reflection */}
          {reflection && (
            <p
              className="text-sm text-gray-600 italic"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              "{reflection}"
            </p>
          )}

          {/* Feeling */}
          {feeling && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-lg">
                {feeling === 'Meaningful' && '❤️'}
                {feeling === 'Good' && '🙂'}
                {feeling === 'Okay' && '😐'}
              </span>
              <span
                className="text-xs text-gray-500"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                {feeling}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MomentsImageCard;
