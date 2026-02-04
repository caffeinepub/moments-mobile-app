import { MomentsPhoto } from '../utils/momentsPhotosStorage';
import { formatRelativeTime } from '../utils/timeFormat';
import { getFeelingEmoji } from '../utils/momentFeelings';

interface MomentsImageCardProps {
  moment: MomentsPhoto;
  userName?: string;
  userLocation?: string;
  userAvatar?: string;
}

function MomentsImageCard({ moment, userName, userLocation, userAvatar }: MomentsImageCardProps) {
  return (
    <div className="glass-card rounded-3xl overflow-hidden w-full max-w-md mx-auto">
      {/* Header row */}
      <div className="flex items-center gap-3 p-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          {userAvatar ? (
            <img src={userAvatar} alt={userName || 'User'} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm font-semibold">
              {userName?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>

        {/* Name and location */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">
            {userName || 'Anonymous'}
          </p>
          {userLocation && (
            <p className="text-xs text-gray-600 truncate">
              {userLocation}
            </p>
          )}
        </div>

        {/* Timestamp */}
        <p className="text-xs text-gray-500 flex-shrink-0">
          {formatRelativeTime(moment.timestamp)}
        </p>
      </div>

      {/* Large image */}
      <div className="relative w-full aspect-[3/4] bg-gray-100">
        <img
          src={moment.data}
          alt="Moment"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom metadata section - quiet, no social actions */}
      <div className="p-4 space-y-2">
        {/* Who */}
        {moment.who && (
          <p className="text-sm text-gray-700">
            <span className="font-medium">With:</span> {moment.who}
          </p>
        )}

        {/* Reflection */}
        {moment.reflection && (
          <p className="text-sm text-gray-700 italic">
            "{moment.reflection}"
          </p>
        )}

        {/* Feeling */}
        {moment.feeling && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-lg">{getFeelingEmoji(moment.feeling)}</span>
            <span className="font-medium">{moment.feeling}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MomentsImageCard;
