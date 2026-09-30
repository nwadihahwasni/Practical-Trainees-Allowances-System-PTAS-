import React from 'react';

interface FooterProps {
  onOpenHelp: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenHelp }) => {
  return (
    <footer className="w-full bg-surface-container py-5 mt-10 border-t border-surface-container-high no-print">
      <div className="w-full px-gutter-desktop flex flex-col md:flex-row items-center justify-between gap-4 text-secondary font-label-sm text-[11px]">
        <div>
          © 2026 Media Prima Berhad (Company No. 200001024235 [530182-V]). Trainee Allowance Disbursement System • Confidential
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <button
            onClick={onOpenHelp}
            className="text-secondary hover:text-on-surface transition-colors cursor-pointer"
          >
            Group Payroll SLA
          </button>
          <button
            onClick={onOpenHelp}
            className="text-secondary hover:text-on-surface transition-colors cursor-pointer"
          >
            Statutory Compliance
          </button>
          <button
            onClick={onOpenHelp}
            className="text-secondary hover:text-on-surface transition-colors cursor-pointer"
          >
            Audit Records
          </button>
          <span className="font-code-tabular text-on-surface-variant font-medium bg-surface-container-lowest px-2 py-0.5 rounded border border-surface-container-high">
            v4.2.1-prod
          </span>
        </div>
      </div>
    </footer>
  );
};
