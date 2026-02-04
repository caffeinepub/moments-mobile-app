import { useState, useEffect } from 'react';
import { X, Clock, ChevronUp } from 'lucide-react';
import { getColorForDate } from '../utils/plannedMomentsStorage';

interface PlannedMomentBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSave: (moment: {
    date: string;
    time: string;
    title?: string;
    color: string;
  }) => void;
  onVisibilityChange?: (isVisible: boolean) => void;
  onChangeDate?: (newDate: Date) => void;
}

export default function PlannedMomentBottomSheet({
  isOpen,
  onClose,
  selectedDate,
  onSave,
  onVisibilityChange,
  onChangeDate,
}: PlannedMomentBottomSheetProps) {
  const [time, setTime] = useState('12:00');
  const [title, setTitle] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      onVisibilityChange?.(true);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
        onVisibilityChange?.(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender, onVisibilityChange]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const handleSave = () => {
    if (!time) return;

    // Auto-assign color based on date using palette
    const dateStr = formatDateToISO(selectedDate);
    const color = getColorForDate(dateStr);

    onSave({
      date: dateStr,
      time,
      title: title.trim() || undefined,
      color,
    });

    // Reset form
    setTime('12:00');
    setTitle('');
    onClose();
  };

  const handleCancel = () => {
    setTime('12:00');
    setTitle('');
    onClose();
  };

  const handleChangeDateClick = () => {
    // Trigger native date picker via hidden input
    const input = document.getElementById('hidden-date-picker') as HTMLInputElement;
    if (input) {
      input.showPicker?.();
    }
  };

  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateStr = e.target.value;
    if (newDateStr && onChangeDate) {
      const [year, month, day] = newDateStr.split('-').map(Number);
      const newDate = new Date(year, month - 1, day);
      onChangeDate(newDate);
    }
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

  const canSave = time;

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
          <div className="px-4 py-3 space-y-3 overflow-y-auto flex-1">
            {/* Selected Date Display with Change Arrow */}
            <div className="relative bg-gray-50 rounded-lg p-2 text-center">
              <p
                className="text-xs font-medium text-gray-700"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                {formatDateDisplay(selectedDate)}
              </p>
              {onChangeDate && (
                <>
                  <button
                    onClick={handleChangeDateClick}
                    className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-200 no-pulse"
                    aria-label="Change date"
                  >
                    <ChevronUp size={14} />
                  </button>
                  {/* Hidden native date picker */}
                  <input
                    id="hidden-date-picker"
                    type="date"
                    value={formatDateToISO(selectedDate)}
                    onChange={handleDatePickerChange}
                    className="absolute opacity-0 pointer-events-none"
                    aria-hidden="true"
                  />
                </>
              )}
            </div>

            {/* Time Picker - Compact Mobile Input */}
            <div>
              <label
                className="block text-xs font-medium text-gray-700 mb-1.5"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Clock size={16} />
                </div>
                <input
                  type="time"
                  value={time}
                  onChange={handleTimeChange}
                  className="bottom-sheet-compact-input"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                />
              </div>
            </div>

            {/* Title Input (Optional) - Compact */}
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
                className="bottom-sheet-compact-input"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              />
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
