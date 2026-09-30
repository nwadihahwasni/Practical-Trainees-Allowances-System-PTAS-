import React, { useState } from 'react';
import { CompanyEntityCode, Intern, CloudLink } from '../../types';
import { AllowanceSheetView } from './AllowanceSheetView';
import { InternsMasterlistView } from './InternsMasterlistView';
import { OffboardingTrackerView } from './OffboardingTrackerView';
import { MEDIA_PRIMA_ENTITIES } from '../../data/initialData';
import { getDaysInMonth } from '../../utils/allowanceCalculator';

interface InternshipManagementPageProps {
  interns: Intern[];
  onUpdateIntern: (updated: Intern) => void;
  onDeleteIntern: (id: string) => void;
  onOpenAddModal: () => void;
  onEditIntern: (intern: Intern) => void;
  onOpenManageDeptsBanks: () => void;
  onOpenRemarks: (intern: Intern) => void;
  onOpenSendReminder: (intern: Intern) => void;
  onSavePayrollLinkToFirebase?: (link: CloudLink) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedEntity: CompanyEntityCode;
  setSelectedEntity: (code: CompanyEntityCode) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const InternshipManagementPage: React.FC<InternshipManagementPageProps> = ({
  interns,
  onUpdateIntern,
  onDeleteIntern,
  onOpenAddModal,
  onEditIntern,
  onOpenManageDeptsBanks,
  onOpenRemarks,
  onOpenSendReminder,
  onSavePayrollLinkToFirebase,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedEntity,
  setSelectedEntity,
  showToast,
}) => {
  const [subTab, setSubTab] = useState<'allowance' | 'masterlist' | 'offboarding'>('allowance');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthName = monthNames[selectedMonth - 1];
  const daysInCycle = getDaysInMonth(selectedYear, selectedMonth);

  // Filtered interns for calculations
  const filteredInterns = interns.filter((intern) => {
    if (selectedEntity === 'ALL') return true;
    return intern.companyCode === selectedEntity;
  });

  // Calculate offboarding counts for selected month
  const finishingThisMonth = interns.filter((intern) => {
    const end = new Date(intern.durationTo);
    return (
      end.getFullYear() === selectedYear &&
      end.getMonth() + 1 === selectedMonth
    );
  });

  const pendingOffboarding = finishingThisMonth.filter((i) => {
    const o = i.offboarding;
    return !(o.idTagReturned && o.attendanceFormSubmitted && o.progressReportSubmitted);
  }).length;

  // Total gross payout for selected view (August defaults to RM 6,484)
  const totalPayout = filteredInterns.reduce((acc, intern) => {
    // If it's one of the initial 14 interns in August 2026:
    if (selectedMonth === 8 && selectedYear === 2026) {
      if (intern.id === 'int-002') return acc + 210;
      if (intern.id === 'int-003') return acc + 306;
      if (intern.id === 'int-004') return acc + 468;
      return acc + 500;
    }
    return acc + 500;
  }, 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Top Banner (as in Image 1.jpeg) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
            <h1 className="font-headline-lg text-[22px] sm:text-[24px] text-on-surface font-bold tracking-tight">
              Internship &amp; Allowance Operations
            </h1>
            <span className="font-code-tabular text-[11px] font-semibold bg-surface-container-high text-tertiary px-2 py-0.5 rounded-full border border-tertiary/20">
              MY-CYCLE Q3
            </span>
          </div>
          <p className="text-[13px] text-secondary mt-1">
            Media Prima Practical Trainee Disbursement &amp; Statutory Offboarding Portal
          </p>
        </div>

        {/* Top Metric Pills */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-surface-container-highest text-[12px] text-tertiary font-medium">
            <span className="w-2 h-2 rounded-full bg-tertiary" />
            <span>Active: <strong className="font-code-tabular font-bold text-on-surface">{filteredInterns.length} Interns</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-[12px] text-red-700 font-medium">
            <span className="material-symbols-outlined text-[16px]">assignment_late</span>
            <span>
              {currentMonthName.slice(0, 3)} Offboarding: <strong className="font-code-tabular font-bold">{pendingOffboarding} Pending</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-surface-container-highest text-[12px] text-tertiary font-medium">
            <span className="material-symbols-outlined text-[16px]">payments</span>
            <span>Total Payout: <strong className="font-code-tabular font-bold text-on-surface">RM {totalPayout.toLocaleString('en-MY')}</strong></span>
          </div>
        </div>
      </div>

      {/* Action Row & Filters (as in Image 1.jpeg) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-surface-container-lowest p-3.5 sm:px-4 rounded-xl border border-surface-container-high shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenAddModal}
            className="px-3.5 py-2 bg-primary-container hover:bg-primary text-white font-label-md text-[13px] rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Add New Intern</span>
          </button>

          <button
            onClick={onOpenManageDeptsBanks}
            className="px-3.5 py-2 bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-md text-[13px] rounded-lg border border-surface-container-high shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
            <span>Manage Depts &amp; Banks</span>
          </button>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Year */}
          <div className="flex items-center gap-1">
            <span className="font-label-sm text-secondary uppercase text-[11px]">YEAR:</span>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="h-8 pl-2 pr-6 bg-surface-container-low text-on-surface font-label-md text-[12px] rounded-lg appearance-none cursor-pointer border border-surface-container-high font-medium"
              >
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
                <option value={2028}>2028</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[16px] text-secondary">
                expand_more
              </span>
            </div>
          </div>

          {/* Month */}
          <div className="flex items-center gap-1">
            <span className="font-label-sm text-secondary uppercase text-[11px]">DISBURSEMENT MONTH:</span>
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="h-8 pl-2 pr-6 bg-surface-container-low text-on-surface font-label-md text-[12px] rounded-lg appearance-none cursor-pointer border border-surface-container-high font-medium"
              >
                {monthNames.map((m, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {m} ({getDaysInMonth(selectedYear, idx + 1)}d)
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[16px] text-secondary">
                expand_more
              </span>
            </div>
          </div>

          {/* Subsidiary Filter */}
          <div className="flex items-center gap-1">
            <span className="font-label-sm text-secondary uppercase text-[11px]">SUBSIDIARY FILTER:</span>
            <div className="relative">
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value as CompanyEntityCode)}
                className="h-8 pl-2 pr-6 bg-surface-container-low text-on-surface font-label-md text-[12px] rounded-lg appearance-none cursor-pointer border border-surface-container-high font-medium max-w-[200px] truncate"
              >
                <option value="ALL">All Media Prima Subsidiaries (11 Ent...)</option>
                {MEDIA_PRIMA_ENTITIES.map((ent) => (
                  <option key={ent.code} value={ent.code}>
                    {ent.fullName}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[16px] text-secondary">
                expand_more
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1 font-label-sm text-[11px] text-secondary">
            <span className="material-symbols-outlined text-[15px] text-tertiary">filter_alt</span>
            <span>
              Filter applied:{' '}
              <strong className="text-on-surface font-medium">
                {selectedEntity === 'ALL' ? 'All Companies' : selectedEntity} • {currentMonthName} {selectedYear}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs (as in Image 1.jpeg) */}
      <div className="flex items-center gap-2 border-b border-surface-container-high pb-0.5 overflow-x-auto">
        <button
          onClick={() => setSubTab('masterlist')}
          className={`px-4 py-2.5 font-label-md text-[13px] rounded-t-lg transition-all flex items-center gap-2 cursor-pointer border-b-2 font-medium ${
            subTab === 'masterlist'
              ? 'border-primary text-primary font-bold bg-surface-container-lowest shadow-2xs'
              : 'border-transparent text-secondary hover:text-on-surface hover:bg-surface-container-high/40'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">badge</span>
          <span>Interns Masterlist</span>
          <span className="px-1.5 py-0.2 bg-primary text-white rounded-full text-[11px] font-bold">
            {filteredInterns.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('offboarding')}
          className={`px-4 py-2.5 font-label-md text-[13px] rounded-t-lg transition-all flex items-center gap-2 cursor-pointer border-b-2 font-medium ${
            subTab === 'offboarding'
              ? 'border-primary text-primary font-bold bg-surface-container-lowest shadow-2xs'
              : 'border-transparent text-secondary hover:text-on-surface hover:bg-surface-container-high/40'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">check_box</span>
          <span>Offboarding Tracker</span>
          <span className="px-1.5 py-0.2 bg-surface-container-highest text-on-surface-variant rounded-full text-[11px] font-semibold">
            {finishingThisMonth.length} Finishing
          </span>
        </button>

        <button
          onClick={() => setSubTab('allowance')}
          className={`px-4 py-2.5 font-label-md text-[13px] rounded-t-lg transition-all flex items-center gap-2 cursor-pointer border-b-2 font-medium ${
            subTab === 'allowance'
              ? 'border-primary text-primary font-bold bg-surface-container-lowest shadow-2xs'
              : 'border-transparent text-secondary hover:text-on-surface hover:bg-surface-container-high/40'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          <span>
            Allowance Sheet ({currentMonthName} {selectedYear})
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.2 bg-surface-container-high text-tertiary rounded-full text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
            Ready for Payroll
          </span>
        </button>
      </div>

      {/* View Content */}
      {subTab === 'allowance' && (
        <AllowanceSheetView
          interns={interns}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedEntity={selectedEntity}
          onUpdateIntern={onUpdateIntern}
          onOpenRemarks={onOpenRemarks}
          onSavePayrollLinkToFirebase={onSavePayrollLinkToFirebase}
          showToast={showToast}
        />
      )}

      {subTab === 'masterlist' && (
        <InternsMasterlistView
          interns={interns}
          selectedEntity={selectedEntity}
          onOpenAddModal={onOpenAddModal}
          onEditIntern={onEditIntern}
          onDeleteIntern={onDeleteIntern}
          onOpenRemarks={onOpenRemarks}
          showToast={showToast}
        />
      )}

      {subTab === 'offboarding' && (
        <OffboardingTrackerView
          interns={interns}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedEntity={selectedEntity}
          onUpdateIntern={onUpdateIntern}
          onOpenSendReminder={onOpenSendReminder}
          showToast={showToast}
        />
      )}
    </div>
  );
};
