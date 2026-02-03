import { useState, useEffect } from 'react';
import { X, Users, User, Heart, UserCircle, Sparkles, Plus, Minus } from 'lucide-react';

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
  const [hours, setHours] = useState('12');
  const [minutes, setMinutes] = useState('00');
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

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      setHours('');
    } else {
      const num = parseInt(value, 10);
      if (num >= 0 && num <= 23) {
        setHours(value);
      }
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      setMinutes('');
    } else {
      const num = parseInt(value, 10);
      if (num >= 0 && num <= 59) {
        setMinutes(value);
      }
    }
  };

  const incrementHours = () => {
    const current = hours === '' ? 0 : parseInt(hours, 10);
    const next = (current + 1) % 24;
    setHours(String(next).padStart(2, '0'));
  };

  const decrementHours = () => {
    const current = hours === '' ? 0 : parseInt(hours, 10);
    const prev = current === 0 ? 23 : current - 1;
    setHours(String(prev).padStart(2, '0'));
  };

  const incrementMinutes = () => {
    const current = minutes === '' ? 0 : parseInt(minutes, 10);
    const next = (current + 1) % 60;
    setMinutes(String(next).padStart(2, '0'));
  };

  const decrementMinutes = () => {
    const current = minutes === '' ? 0 : parseInt(minutes, 10);
    const prev = current === 0 ? 59 : current - 1;
    setMinutes(String(prev).padStart(2, '0'));
  };

  const handleSave = () => {
    const normalizedHours = hours === '' ? '00' : String(parseInt(hours, 10)).padStart(2, '0');
    const normalizedMinutes = minutes === '' ? '00' : String(parseInt(minutes, 10)).padStart(2, '0');
    const time = `${normalizedHours}:${normalizedMinutes}`;

    if (!withWho) return;

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
    setHours('12');
    setMinutes('00');
    setTitle('');
    setWithWho(null);
    onClose();
  };

  const handleCancel = () => {
    setHours('12');
    setMinutes('00');
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

  const canSave = (hours !== '' || minutes !== '') && withWho;

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
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-100"
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

            {/* Time Picker with Steppers */}
            <div>
              <label
                className="block text-xs font-medium text-gray-700 mb-1.5"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Time <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center justify-center gap-2">
                {/* Hours */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={incrementHours}
                    className="time-stepper-button"
                    aria-label="Increment hours"
                  >
                    <Plus size={14} />
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={hours}
                    onChange={handleHoursChange}
                    onBlur={() => {
                      if (hours !== '') {
                        setHours(String(parseInt(hours, 10)).padStart(2, '0'));
                      }
                    }}
                    className="time-input-box"
                    placeholder="00"
                    maxLength={2}
                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                  />
                  <button
                    type="button"
                    onClick={decrementHours}
                    className="time-stepper-button"
                    aria-label="Decrement hours"
                  >
                    <Minus size={14} />
                  </button>
                </div>

                <span className="text-2xl font-bold text-gray-400 pb-6">:</span>

                {/* Minutes */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={incrementMinutes}
                    className="time-stepper-button"
                    aria-label="Increment minutes"
                  >
                    <Plus size={14} />
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={minutes}
                    onChange={handleMinutesChange}
                    onBlur={() => {
                      if (minutes !== '') {
                        setMinutes(String(parseInt(minutes, 10)).padStart(2, '0'));
                      }
                    }}
                    className="time-input-box"
                    placeholder="00"
                    maxLength={2}
                    style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                  />
                  <button
                    type="button"
                    onClick={decrementMinutes}
                    className="time-stepper-button"
                    aria-label="Decrement minutes"
                  >
                    <Minus size={14} />
                  </button>
                </div>
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

            {/* With Who Options - Pill/Segmented Style */}
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
                      className={`with-who-pill ${
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
              className="bottom-sheet-action-button bottom-sheet-action-button-cancel"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="bottom-sheet-action-button bottom-sheet-action-button-save"
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
