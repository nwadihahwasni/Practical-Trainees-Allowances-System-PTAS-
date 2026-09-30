import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-container text-tertiary flex items-center justify-center font-bold border border-surface-container-high">
              <span className="material-symbols-outlined text-[20px]">menu_book</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-[16px] text-on-surface font-semibold">
                PTAS Operation Manual &amp; Statutory Guidelines
              </h3>
              <p className="font-label-sm text-[11px] text-secondary">
                Group People &amp; Culture • Media Prima Berhad • Policy HR-TR-04
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-[13px] leading-relaxed text-on-surface">
          <div className="bg-surface-container-low p-4 rounded-lg border border-surface-container-high">
            <h4 className="font-headline-sm text-[14px] font-semibold text-primary mb-1">
              Allowance Disbursement Formula (Group Policy HR-TR-04)
            </h4>
            <p className="text-secondary text-[12px] mb-2">
              All 11 Media Prima subsidiaries adhere strictly to Group Policy HR-TR-04 for practical trainee stipend processing:
            </p>
            <div className="bg-surface-container-lowest p-3 rounded font-mono text-[12px] border border-surface-container-high">
              Allowance = [(RM500 / Total Days in Month) × Working Days Active] - Leave Deductions
            </div>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-secondary text-[12px]">
              <li><strong>Standard Baseline:</strong> RM 500.00 per full calendar month.</li>
              <li><strong>Integer Rounding Rule:</strong> Standard financial rounding. Decimals ≥ 0.50 round UP to nearest Ringgit; decimals &lt; 0.50 round DOWN. Zero sen/decimals displayed.</li>
              <li><strong>Leave Deductions:</strong> Each day of unapproved leave or approved medical leave past quota is deducted at the daily rate `(RM500 / Days in Month)`.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline-sm text-[14px] font-semibold text-on-surface mb-2">
              Mandatory Offboarding Checklist (Strict HR SLA)
            </h4>
            <p className="text-secondary text-[12px] mb-2">
              Final allowance release is blocked or held until 100% hardcopy clearance of the following 3 documents:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded bg-surface-container-low border border-surface-container-high">
                <span className="font-semibold block text-[12px]">1. ID Tag / Access Card</span>
                <span className="text-[11px] text-secondary">Returned to Security Reception</span>
              </div>
              <div className="p-2.5 rounded bg-surface-container-low border border-surface-container-high">
                <span className="font-semibold block text-[12px]">2. Attendance Form</span>
                <span className="text-[11px] text-secondary">Signed monthly timesheets</span>
              </div>
              <div className="p-2.5 rounded bg-surface-container-low border border-surface-container-high">
                <span className="font-semibold block text-[12px]">3. Progress Report</span>
                <span className="text-[11px] text-secondary">Supervisor evaluation review</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-headline-sm text-[14px] font-semibold text-on-surface mb-2">
              Strict Data Validation Specifications (F01)
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-secondary text-[12px]">
              <li><strong>Malaysian IC:</strong> Must be entered as exactly 12 numeric digits without hyphens. Inputs with dashes or non-12 length trigger red inline error text and block submission.</li>
              <li><strong>Date Formats:</strong> Displayed strictly as DD/MM/YYYY across all masterlists, payroll sheets, and audit exports.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline-sm text-[14px] font-semibold text-on-surface mb-2">
              11 Operating Media Prima Entities
            </h4>
            <p className="text-[12px] text-secondary">
              TV3, REV Media Group, The New Straits Times Press (Malaysia) Berhad, Media Prima Omnia, Big Tree Outdoor, Media Prima Berhad HQ, Synchrosound Studio, Wowshop, Natseven Sdn Bhd (NTV7), Metropolitan TV (8TV), Ch-9 Media (TV9).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-surface-container-low border-t border-surface-container-high flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-primary-container hover:bg-primary text-white font-label-md text-[13px] rounded-lg transition-colors cursor-pointer font-semibold"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
