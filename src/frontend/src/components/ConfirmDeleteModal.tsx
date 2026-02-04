import { X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Delete Moment?',
  message = 'This planned moment will be permanently removed.',
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 confirm-delete-backdrop"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="confirm-delete-modal pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="confirm-delete-title">{title}</h3>
            <button
              onClick={onCancel}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-100 no-pulse"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Message */}
          <p className="confirm-delete-message mb-6">{message}</p>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="confirm-delete-button confirm-delete-button-cancel no-pulse"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="confirm-delete-button confirm-delete-button-delete no-pulse"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
