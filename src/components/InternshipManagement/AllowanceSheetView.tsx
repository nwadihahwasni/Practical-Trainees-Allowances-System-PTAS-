import React, { useState } from 'react';
import { CompanyEntityCode, Intern, PaymentStatus, CloudLink } from '../../types';
import { calculateAllowance, formatMYR, getDaysInMonth } from '../../utils/allowanceCalculator';
import { formatICDisplay } from '../../utils/validation';
import {
  generateAllowanceCSV,
  downloadFile,
  generateGoogleSheetsTSV,
  printAllowanceSheet,
} from '../../utils/exportUtils';

interface AllowanceSheetViewProps {
  interns: Intern[];
  selectedYear: number;
  selectedMonth: number;
  selectedEntity: CompanyEntityCode;
  onUpdateIntern: (updated: Intern) => void;
  onOpenRemarks: (intern: Intern) => void;
  onSavePayrollLinkToFirebase?: (link: CloudLink) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const AllowanceSheetView: React.FC<AllowanceSheetViewProps> = ({
  interns,
  selectedYear,
  selectedMonth,
  selectedEntity,
  onUpdateIntern,
  onOpenRemarks,
  onSavePayrollLinkToFirebase,
  showToast,
}) => {
  const [activeDaysOverrides, setActiveDaysOverrides] = useState<Record<string, number>>({
    'int-002': 13, // PRD / Mockup: Muhammad Danish active 13 days
    'int-003': 20, // PRD / Mockup: Chong Wei Lun active 20 days
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = monthNames[selectedMonth - 1];
  const daysInCycle = getDaysInMonth(selectedYear, selectedMonth);

  // Filter interns by selected company entity
  const filteredInterns = interns.filter((intern) => {
    if (selectedEntity === 'ALL') return true;
    return intern.companyCode === selectedEntity;
  });

  // Calculate row details
  const rowsData = filteredInterns.map((intern) => {
    const manualDays = activeDaysOverrides[intern.id];
    const calc = calculateAllowance({
      durationFrom: intern.durationFrom,
      durationTo: intern.durationTo,
      year: selectedYear,
      month: selectedMonth,
      leaveDays: intern.leaveDays,
      manualActiveDays: manualDays,
    });
    return { intern, calc };
  });

  // Aggregates
  const totalTrainees = rowsData.length;
  const releasedCount = rowsData.filter((r) => r.intern.paymentStatus === 'Release Batch').length;
  const holdCount = rowsData.filter((r) => r.intern.paymentStatus === 'On Hold').length;
  const grossApprovedPayout = rowsData.reduce((sum, r) => sum + r.calc.finalNetPayout, 0);

  // Toggle single status
  const handleToggleStatus = (intern: Intern) => {
    const newStatus: PaymentStatus =
      intern.paymentStatus === 'Release Batch' ? 'On Hold' : 'Release Batch';
    onUpdateIntern({
      ...intern,
      paymentStatus: newStatus,
    });
    showToast(`${intern.fullName} batch status set to ${newStatus}`, 'verified');
  };

  // Batch toggle all
  const handleBatchReleaseAll = () => {
    filteredInterns.forEach((intern) => {
      if (intern.paymentStatus !== 'Release Batch') {
        onUpdateIntern({
          ...intern,
          paymentStatus: 'Release Batch',
        });
      }
    });
    showToast(`All ${filteredInterns.length} trainee disbursements marked for batch release`, 'done_all');
  };

  // Adjust leave days
  const handleAdjustLeave = (intern: Intern, delta: number) => {
    const newLeave = Math.max(0, Math.min(30, intern.leaveDays + delta));
    onUpdateIntern({
      ...intern,
      leaveDays: newLeave,
    });
    showToast(`Leave deduction updated to ${newLeave} days for ${intern.fullName}`, 'edit_calendar');
  };

  // Copy account number
  const handleCopyAccount = (acc: string, bank: string) => {
    navigator.clipboard.writeText(acc);
    showToast(`Copied ${bank} account: ${acc}`, 'content_copy');
  };

  // Exports
  const handleExportCSV = () => {
    const csv = generateAllowanceCSV(filteredInterns, selectedYear, selectedMonth, selectedEntity);
    downloadFile(csv, `MediaPrima_Allowance_${monthName}_${selectedYear}.csv`, 'text/csv;charset=utf-8;');
    showToast(`CSV payroll sheet downloaded successfully.`, 'file_download_done');
  };

  const handleExportExcel = () => {
    const csv = generateAllowanceCSV(filteredInterns, selectedYear, selectedMonth, selectedEntity);
    downloadFile(csv, `MediaPrima_Payroll_Batch_${monthName}_${selectedYear}.xlsx`, 'application/vnd.ms-excel;');
    showToast(`Excel payroll batch exported successfully.`, 'file_download_done');
  };

  const handleExportGoogleSheets = () => {
    const tsv = generateGoogleSheetsTSV(filteredInterns, selectedYear, selectedMonth);
    navigator.clipboard.writeText(tsv);
    showToast(`Allowance sheet copied in Google Sheets format! Paste into any spreadsheet.`, 'content_paste');
  };

  const handleSaveBatchLink = () => {
    if (onSavePayrollLinkToFirebase) {
      const link: CloudLink = {
        id: `link-payroll-${selectedYear}-${selectedMonth}-${selectedEntity}-${Date.now()}`,
        title: `Penyata Elaun Payroll: ${monthName} ${selectedYear} (${selectedEntity})`,
        url: `https://mediaprima-internal.web.app/payroll/${selectedYear}/${selectedMonth}/${selectedEntity}`,
        category: 'Payroll Sheet',
        description: `Disimpan ke Firebase: RM ${grossApprovedPayout.toLocaleString('en-MY')} bagi ${totalTrainees} pelatih (${releasedCount} released, ${holdCount} on hold).`,
        entityCode: selectedEntity === 'ALL' ? undefined : selectedEntity,
        createdAt: new Date().toISOString(),
        createdBy: 'HR Admin Ops',
      };
      onSavePayrollLinkToFirebase(link);
      showToast(`Penyata & link payroll ${monthName} ${selectedYear} disimpan ke Firebase!`, 'cloud_done');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Media Prima Allowance Disbursement Formula (Group Policy HR-TR-04) Banner */}
      <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-container-low text-tertiary flex items-center justify-center shrink-0 mt-0.5 border border-surface-container-high">
            <span className="material-symbols-outlined text-[24px]">calculate</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-headline-sm text-[15px] sm:text-[16px] text-on-surface font-semibold">
                Media Prima Allowance Disbursement Formula (Group Policy HR-TR-04)
              </h3>
              <span className="font-label-sm text-[11px] bg-surface-container-high text-on-surface px-2 py-0.5 rounded font-mono">
                Statutory Enforced
              </span>
            </div>
            <p className="font-body-sm text-[12px] sm:text-[13px] text-secondary mt-1">
              Standard Allowance: <strong className="text-on-surface font-medium">RM 500 / month</strong> • Proration:{' '}
              <span className="font-code-tabular text-on-surface font-medium">
                (RM500 / Days in Month) × Active Working Days
              </span>{' '}
              • Leave/MC Deduction applied • Rounding Rule:{' '}
              <strong className="text-primary font-medium">≥ 0.50 rounds UP, &lt; 0.50 rounds DOWN</strong> (Strict Integer RM).
            </p>
          </div>
        </div>

        <div className="shrink-0 bg-surface-container-low px-4 py-2 rounded-lg border border-surface-container-high text-right self-stretch md:self-auto flex md:flex-col justify-between items-center md:items-end">
          <span className="font-label-sm text-secondary uppercase text-[11px]">Days in Cycle</span>
          <span className="font-headline-sm text-primary font-bold text-[15px]">
            {daysInCycle} Days ({monthName} {selectedYear})
          </span>
        </div>
      </div>

      {/* Payroll Batch Export Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-3 sm:px-4 rounded-xl border border-surface-container-high shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="font-label-sm text-secondary uppercase text-[11px] tracking-wider font-semibold">
            Payroll Batch Export:
          </span>
          <span className="font-label-md text-on-surface font-medium text-[13px]">
            {monthName} {selectedYear} • {selectedEntity === 'ALL' ? 'All Operating Subsidiaries' : selectedEntity}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-[12px] rounded-lg transition-colors flex items-center gap-1.5 border border-surface-container-high cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">csv</span>
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-3 py-1.5 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-[12px] rounded-lg transition-colors flex items-center gap-1.5 border border-surface-container-high cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-tertiary">table_view</span>
            <span>Export Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportGoogleSheets}
            className="px-3 py-1.5 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-[12px] rounded-lg transition-colors flex items-center gap-1.5 border border-surface-container-high cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-600">grid_on</span>
            <span>Google Sheets Format</span>
          </button>

          <button
            onClick={handleSaveBatchLink}
            className="px-3 py-1.5 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-[12px] rounded-lg transition-colors flex items-center gap-1.5 border border-surface-container-high cursor-pointer"
            title="Simpan pautan rekod payroll ini ke Firebase Cloud"
          >
            <span className="material-symbols-outlined text-[16px] text-tertiary">cloud_upload</span>
            <span>Simpan Link ke Firebase</span>
          </button>

          <button
            onClick={printAllowanceSheet}
            className="px-3.5 py-1.5 bg-primary-container hover:bg-primary text-white font-label-md text-[12px] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Allowance Data Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-xs overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="h-10 bg-surface-container-low text-secondary font-label-sm text-[11px] uppercase tracking-wider border-b border-surface-container-high">
                <th className="px-4 py-2 font-semibold">Intern Details</th>
                <th className="px-4 py-2 font-semibold">Company &amp; Department</th>
                <th className="px-4 py-2 font-semibold">Bank Details (Bank &amp; Account No)</th>
                <th className="px-3 py-2 font-semibold text-center">Active Days ({monthName.slice(0, 3).toUpperCase()} {selectedYear})</th>
                <th className="px-4 py-2 font-semibold">Calculation Rule</th>
                <th className="px-3 py-2 font-semibold text-right">Base (RM)</th>
                <th className="px-3 py-2 font-semibold text-center">Leave/MC Deductions</th>
                <th className="px-4 py-2 font-semibold text-right">Final Net Payout</th>
                <th className="px-4 py-2 font-semibold text-center">Batch Status</th>
                <th className="px-3 py-2 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/40 text-[13px]">
              {rowsData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-secondary">
                    <span className="material-symbols-outlined text-[36px] text-secondary/40 block mb-2">person_off</span>
                    No trainee records found for the selected entity filter.
                  </td>
                </tr>
              ) : (
                rowsData.map(({ intern, calc }) => (
                  <tr
                    key={intern.id}
                    className="hover:bg-surface-container-low/60 transition-colors group"
                  >
                    {/* Intern Details */}
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-on-surface text-[14px]">
                            {intern.fullName}
                          </span>
                          {intern.documentUrl && (
                            <a
                              href={intern.documentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-tertiary hover:text-primary transition-colors inline-flex items-center"
                              title={`Pautan Dokumen Cloud: ${intern.documentUrl}`}
                            >
                              <span className="material-symbols-outlined text-[15px]">attachment</span>
                            </a>
                          )}
                        </div>
                        <span className="font-code-tabular text-[12px] text-secondary mt-0.5">
                          {formatICDisplay(intern.icNumber)}
                        </span>
                      </div>
                    </td>

                    {/* Company & Department */}
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col">
                        <span className="font-medium text-on-surface">
                          {intern.companyName}
                        </span>
                        <span className="text-[12px] text-secondary">
                          {intern.department}
                        </span>
                      </div>
                    </td>

                    {/* Bank Details */}
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-on-surface text-[12px]">
                            {intern.bankName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-code-tabular text-[12px] text-secondary tracking-wide">
                            {intern.bankAccountNumber}
                          </span>
                          <button
                            onClick={() => handleCopyAccount(intern.bankAccountNumber, intern.bankName)}
                            className="opacity-0 group-hover:opacity-100 hover:text-primary transition-opacity text-secondary"
                            title="Copy Account Number"
                          >
                            <span className="material-symbols-outlined text-[14px]">content_copy</span>
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Active Days */}
                    <td className="px-3 py-3 align-top text-center">
                      <div className="inline-flex flex-col items-center">
                        <div className="flex items-baseline gap-1 font-semibold text-on-surface">
                          <span className="text-[15px] font-code-tabular">{calc.activeDays}</span>
                          <span className="text-[11px] text-secondary font-normal">/ {calc.totalDaysInMonth}</span>
                        </div>
                        <span className="text-[10px] text-secondary uppercase">Days</span>
                      </div>
                    </td>

                    {/* Calculation Rule */}
                    <td className="px-4 py-3 align-top">
                      <div className="font-code-tabular text-[11px] text-secondary bg-surface-container-low/70 px-2 py-1 rounded border border-surface-container-high/60 inline-block max-w-sm">
                        {calc.calculationExplanation}
                      </div>
                    </td>

                    {/* Base (RM) */}
                    <td className="px-3 py-3 align-top text-right font-code-tabular text-[13px] text-secondary">
                      RM {calc.baseAmount}
                    </td>

                    {/* Leave / MC Deductions */}
                    <td className="px-3 py-3 align-top text-center">
                      <div className="inline-flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded border border-surface-container-high">
                        <button
                          onClick={() => handleAdjustLeave(intern, -1)}
                          disabled={intern.leaveDays <= 0}
                          className="w-4 h-4 rounded text-secondary hover:text-on-surface disabled:opacity-30 cursor-pointer flex items-center justify-center font-bold"
                          title="Decrease Leave"
                        >
                          -
                        </button>
                        <span className="font-code-tabular text-[12px] font-medium text-on-surface px-1">
                          {intern.leaveDays} {intern.leaveDays === 1 ? 'day' : 'days'}
                        </span>
                        <button
                          onClick={() => handleAdjustLeave(intern, 1)}
                          className="w-4 h-4 rounded text-secondary hover:text-on-surface cursor-pointer flex items-center justify-center font-bold"
                          title="Add 1 Day Leave"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Final Net Payout */}
                    <td className="px-4 py-3 align-top text-right">
                      <span className="font-code-tabular font-bold text-[14px] text-on-surface">
                        RM {calc.finalNetPayout}
                      </span>
                    </td>

                    {/* Batch Status */}
                    <td className="px-4 py-3 align-top text-center">
                      <button
                        onClick={() => handleToggleStatus(intern)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-sm text-[11px] font-semibold transition-all cursor-pointer shadow-2xs ${
                          intern.paymentStatus === 'Release Batch'
                            ? 'bg-surface-container-high hover:bg-surface-container-highest text-tertiary border border-tertiary/20'
                            : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                        }`}
                        title="Click to toggle status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            intern.paymentStatus === 'Release Batch' ? 'bg-tertiary' : 'bg-red-600'
                          }`}
                        />
                        <span>{intern.paymentStatus}</span>
                      </button>
                    </td>

                    {/* Actions & Remarks */}
                    <td className="px-3 py-3 align-top text-center">
                      <button
                        onClick={() => onOpenRemarks(intern)}
                        className={`p-1.5 rounded-lg hover:bg-surface-container-high transition-colors ${
                          intern.remarks ? 'text-primary' : 'text-secondary hover:text-on-surface'
                        }`}
                        title={intern.remarks ? `Remarks: ${intern.remarks}` : 'Add Remarks'}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {intern.remarks ? 'comment' : 'chat_bubble_outline'}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary Bar (matching Image 1) */}
        <div className="p-4 bg-surface-container-low border-t border-surface-container-high flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-label-md text-[13px]">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="font-semibold text-on-surface">
                Total Month Disbursement:{' '}
                <strong className="font-code-tabular">{totalTrainees} Active Trainees</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-secondary">Batches Released:</span>
              <span className="bg-surface-container-highest text-tertiary px-2 py-0.5 rounded font-semibold text-[12px]">
                {releasedCount} Released
              </span>
              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold text-[12px]">
                {holdCount} On Hold
              </span>
            </div>

            {holdCount > 0 && (
              <button
                onClick={handleBatchReleaseAll}
                className="text-xs text-tertiary hover:underline font-semibold cursor-pointer"
              >
                Release All Batches ({holdCount} pending)
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-label-sm text-secondary uppercase tracking-wider font-semibold">
              Gross Approved Payout:
            </span>
            <div className="flex items-baseline gap-1 bg-surface-container-lowest px-3 py-1 rounded-lg border border-surface-container-high shadow-2xs">
              <span className="text-[13px] font-bold text-primary">RM</span>
              <span className="font-display-lg text-[22px] font-bold text-on-surface font-code-tabular">
                {grossApprovedPayout.toLocaleString('en-MY')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
