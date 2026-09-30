import React, { useState, useEffect } from 'react';
import { Intern, PaymentStatus } from '../../types';

interface RemarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  intern: Intern | null;
  onSave: (updated: Intern) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const RemarksModal: React.FC<RemarksModalProps> = ({
  isOpen,
  onClose,
  intern,
  onSave,
  showToast,
}) => {
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState<PaymentStatus>('Release Batch');

  useEffect(() => {
    if (intern) {
      setRemarks(intern.remarks || '');
      setStatus(intern.paymentStatus);
    }
  }, [intern, isOpen]);

  if (!isOpen || !intern) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...intern,
      remarks: remarks.trim(),
      paymentStatus: status,
    });
    showToast(`Updated finance remarks for ${intern.fullName}`, 'save');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center font-bold border border-surface-container-high">
              <span className="material-symbols-outlined text-[20px]">edit_note</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-[16px] text-on-surface font-semibold">
                Finance Remarks &amp; Batch Status
              </h3>
              <p className="font-label-sm text-[11px] text-secondary">
                {intern.fullName} • {intern.companyName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container-high text-secondary hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block font-label-sm text-secondary uppercase text-[11px] mb-1">
              Payment Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PaymentStatus)}
              className="w-full h-9 px-3 bg-surface-container-low rounded-lg font-label-md text-[13px] text-on-surface focus:outline-none border border-surface-container-high cursor-pointer font-medium"
            >
              <option value="Release Batch">Release Batch (Disbursement Approved)</option>
              <option value="On Hold">On Hold (Pending Verification)</option>
            </select>
          </div>

          <div>
            <label className="block font-label-sm text-secondary uppercase text-[11px] mb-1">
              Custom Remarks / Audit Notes (for Group Finance)
            </label>
            <textarea
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Leave deductions verified by HR supervisor; bank statement submitted."
              className="w-full p-3 bg-surface-container-low rounded-lg font-label-md text-[13px] text-on-surface focus:outline-none focus:bg-surface-container-high border border-surface-container-high resize-none"
            />
          </div>

          <div className="pt-3 border-t border-surface-container-high flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-[13px] rounded-lg border border-surface-container-high cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary-container hover:bg-primary text-white font-label-md text-[13px] rounded-lg shadow-sm transition-all cursor-pointer font-semibold flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>Save Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
