import React from 'react';
import { AUTHORIZED_HR_EMAIL } from '../../firebase';

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SignOutModal: React.FC<SignOutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-2xl w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-[26px]">logout</span>
          </div>
          <h3 className="font-headline-sm text-[17px] font-bold text-on-surface">
            Sign Out of PTAS
          </h3>
          <p className="text-[12px] text-secondary mt-1.5 leading-relaxed">
            Are you sure you want to sign out from the active session for{' '}
            <strong className="text-on-surface block font-mono mt-0.5">{AUTHORIZED_HR_EMAIL}</strong>?
          </p>
        </div>

        <div className="p-4 bg-surface-container-low border-t border-surface-container-high flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-3 bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-md text-[12px] rounded-lg border border-surface-container-high transition-colors font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-label-md text-[12px] rounded-lg shadow-xs transition-colors font-semibold cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Yes, Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
