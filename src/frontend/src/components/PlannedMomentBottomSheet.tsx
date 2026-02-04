import { useState, useEffect } from 'react';
import { X, Users, User, Heart, Sparkles, Clock } from 'lucide-react';

interface PlannedMomentBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSave: (moment: {
    date: string;
    time: string;
    title?: string;
    withWho: 'Family' | 'Friends' | 'Partner' | 'Solo' | 'Custom';
    color: string;
  }) => void;
}

const WITH_WHO_OPTIONS = [
  { value: 'Family' as const, label: 'Family', icon: Users, color: 'oklch(65% 0.18 145)' }, // Green
  { value: 'Friends' as const, label: 'Friends', icon: Users, color: 'oklch(65% 0.18 220)' }, // Blue
  { value: 'Partner' as const, label: 'Partner', icon: Heart, color: 'oklch(65% 0.20 25)' }, // Red/Pink
  { value: 'Solo' as const, label: 'Solo', icon: User, color: 'oklch(47% 0.14 262)' }, // Purple
  { value: 'Custom' as const, label: 'Custom', icon: Sparkles, color: 'oklch(70% 0.15 60)' }, // Yellow/Gold
];

export default function PlannedMomentBottomSheet({
  isOpen,
  onClose,
  selectedDate,
  onSave,
}: PlannedMomentBottomSheetProps) {
  const [time, setTime] = useState('12:00');
  const [title, setTitle] = useState('');
  const [withWho, setWithWho] = useState<'Family' | 'Friends' | 'Partner' | 'Solo' | 'Custom' | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const handleSave = () => {
    if (!withWho || !time) return;

    const selectedOption = WITH_WHO_OPTIONS.find(opt => opt.value === withWho);
    const color = selectedOption?.color || 'oklch(47% 0.14 262)';

    const dateStr = formatDateToISO(selectedDate);
    onSave({
      date: dateStr,
      time,
      title: title.trim() || undefined,
      withWho,
      color,
    });

    // Reset form
    setTime('12:00');
    setTitle('');
    setWithWho(null);
    onClose();
  };

  const handleCancel = () => {
    setTime('12:00');
    setTitle('');
    setWithWho(null);
    onClose();
  };

  const formatDateToISO = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateDisplay = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!shouldRender) return null;

  const canSave = time && withWho;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 ${
          isClosing ? 'bottom-sheet-backdrop-close' : 'bottom-sheet-backdrop'
        }`}
        onClick={handleCancel}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 ${
          isClosing ? 'bottom-sheet-container-close' : 'bottom-sheet-container'
        }`}
      >
        <div className="bg-white rounded-t-3xl shadow-2xl max-w-[390px] mx-auto bottom-sheet-content max-h-[75vh] flex flex-col">
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 flex-shrink-0">
            <h2
              className="text-base font-semibold text-black"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Plan a Moment
            </h2>
            <button
              onClick={handleCancel}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-100 no-pulse"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content - scrollable */}
          <div className="px-4 py-3 space-y-4 overflow-y-auto flex-1">
            {/* Selected Date Display */}
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p
                className="text-xs font-medium text-gray-700"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                {formatDateDisplay(selectedDate)}
              </p>
            </div>

            {/* Time Picker - Clean Input */}
            <div>
              <label
                className="block text-xs font-medium text-gray-700 mb-1.5"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Clock size={18} />
                </div>
                <input
                  type="time"
                  value={time}
                  onChange={handleTimeChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                />
              </div>
            </div>

            {/* Title Input (Optional) */}
            <div>
              <label
                className="block text-xs font-medium text-gray-700 mb-1.5"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Title <span className="text-gray-400 text-[10px]">(optional)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Coffee with Sarah"
                className="bottom-sheet-pill-input"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              />
            </div>

            {/* With Who Options - Simple Icon-Based */}
            <div>
              <label
                className="block text-xs font-medium text-gray-700 mb-2"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                With who? <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {WITH_WHO_OPTIONS.map((option) => {
                  const IconComponent = option.icon;
                  const isSelected = withWho === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setWithWho(option.value)}
                      className={`with-who-pill no-pulse ${
                        isSelected ? 'with-who-pill-selected' : ''
                      }`}
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        ...(isSelected ? { backgroundColor: option.color, borderColor: option.color } : {}),
                      }}
                    >
                      <IconComponent size={16} />
                      <span className="text-xs font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 px-4 py-3 border-t border-gray-100 flex-shrink-0 justify-center">
            <button
              onClick={handleCancel}
              className="bottom-sheet-action-button bottom-sheet-action-button-cancel no-pulse"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="bottom-sheet-action-button bottom-sheet-action-button-save no-pulse"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
