import React from 'react';
import { CompanyEntityCode, Intern } from '../../types';
import { formatDateDisplay } from '../../utils/validation';

interface OffboardingTrackerViewProps {
  interns: Intern[];
  selectedYear: number;
  selectedMonth: number;
  selectedEntity: CompanyEntityCode;
  onUpdateIntern: (updated: Intern) => void;
  onOpenSendReminder: (intern: Intern) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const OffboardingTrackerView: React.FC<OffboardingTrackerViewProps> = ({
  interns,
  selectedYear,
  selectedMonth,
  selectedEntity,
  onUpdateIntern,
  onOpenSendReminder,
  showToast,
}) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = monthNames[selectedMonth - 1];

  // TC-03: Auto-filters interns completing their tenure in the selected Month/Year filter
  const finishingInterns = interns.filter((intern) => {
    if (selectedEntity !== 'ALL' && intern.companyCode !== selectedEntity) {
      return false;
    }
    const end = new Date(intern.durationTo);
    const endYear = end.getFullYear();
    const endMonth = end.getMonth() + 1;
    return endYear === selectedYear && endMonth === selectedMonth;
  });

  const completeCount = finishingInterns.filter((i) => {
    const o = i.offboarding;
    return o.idTagReturned && o.attendanceFormSubmitted && o.progressReportSubmitted;
  }).length;

  const pendingCount = finishingInterns.length - completeCount;

  // Toggle specific checklist item
  const handleToggleDoc = (
    intern: Intern,
    field: 'idTagReturned' | 'attendanceFormSubmitted' | 'progressReportSubmitted'
  ) => {
    const currentVal = intern.offboarding[field];
    const newOffboarding = {
      ...intern.offboarding,
      [field]: !currentVal,
    };

    const isAllComplete =
      newOffboarding.idTagReturned &&
      newOffboarding.attendanceFormSubmitted &&
      newOffboarding.progressReportSubmitted;

    if (isAllComplete) {
      newOffboarding.clearanceDate = new Date().toISOString().split('T')[0];
      newOffboarding.clearedBy = 'HR Admin Ops';
    }

    onUpdateIntern({
      ...intern,
      offboarding: newOffboarding,
    });

    const docLabels = {
      idTagReturned: 'ID Tag / Access Card',
      attendanceFormSubmitted: 'Attendance Form',
      progressReportSubmitted: 'Progress Report',
    };

    if (isAllComplete) {
      showToast(`All 3 documents complete for ${intern.fullName}! Status: Complete`, 'verified');
    } else {
      showToast(
        `${docLabels[field]} marked as ${!currentVal ? 'Submitted' : 'Pending'} for ${intern.fullName}`,
        'checklist'
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* SLA Guideline Banner */}
      <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-container-low text-primary flex items-center justify-center shrink-0 mt-0.5 border border-surface-container-high">
            <span className="material-symbols-outlined text-[24px]">assignment_turned_in</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-headline-sm text-[15px] sm:text-[16px] text-on-surface font-semibold">
                Statutory Offboarding Checklist &amp; Final Clearance SLA
              </h3>
              <span className="font-label-sm text-[11px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium">
                HR-TR-04 SLA
              </span>
            </div>
            <p className="font-body-sm text-[12px] sm:text-[13px] text-secondary mt-1">
              Final month allowance disbursement requires mandatory hardcopy verification of all 3 documents:
              (1) ID Tag / Access Card, (2) Attendance Form, and (3) Progress Report.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-surface-container-low px-3 py-1.5 rounded-lg border border-surface-container-high text-center">
            <span className="font-label-sm text-secondary block text-[10px] uppercase">Finishing Tenure</span>
            <span className="font-headline-sm text-on-surface font-bold text-[15px] font-code-tabular">
              {finishingInterns.length} Interns
            </span>
          </div>
          <div className="bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-center">
            <span className="font-label-sm text-emerald-700 block text-[10px] uppercase">Completed</span>
            <span className="font-headline-sm text-emerald-700 font-bold text-[15px] font-code-tabular">
              {completeCount}
            </span>
          </div>
          <div className="bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 text-center">
            <span className="font-label-sm text-amber-700 block text-[10px] uppercase">Pending</span>
            <span className="font-headline-sm text-amber-700 font-bold text-[15px] font-code-tabular">
              {pendingCount}
            </span>
          </div>
        </div>
      </div>

      {/* Finishing Roster Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-xs overflow-hidden">
        <div className="p-3 bg-surface-container-low border-b border-surface-container-high flex items-center justify-between">
          <span className="font-label-md text-on-surface font-semibold text-[13px]">
            Interns Completing Tenure in {monthName} {selectedYear} ({finishingInterns.length})
          </span>
          <span className="font-label-sm text-secondary text-[12px]">
            Auto-filtered by tenure completion date
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="h-10 bg-surface-container-low text-secondary font-label-sm text-[11px] uppercase tracking-wider border-b border-surface-container-high">
                <th className="px-4 py-2 font-semibold">Trainee</th>
                <th className="px-4 py-2 font-semibold">Entity &amp; Dept</th>
                <th className="px-3 py-2 font-semibold text-center">Tenure End Date</th>
                <th className="px-4 py-2 font-semibold text-center">1. ID Tag / Access Card</th>
                <th className="px-4 py-2 font-semibold text-center">2. Attendance Form</th>
                <th className="px-4 py-2 font-semibold text-center">3. Progress Report</th>
                <th className="px-3 py-2 font-semibold text-center">Clearance Status</th>
                <th className="px-4 py-2 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/40 text-[13px]">
              {finishingInterns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-secondary">
                    <span className="material-symbols-outlined text-[36px] text-secondary/40 block mb-2">event_available</span>
                    No interns are scheduled to finish their tenure in {monthName} {selectedYear}.
                  </td>
                </tr>
              ) : (
                finishingInterns.map((intern) => {
                  const o = intern.offboarding;
                  const isComplete = o.idTagReturned && o.attendanceFormSubmitted && o.progressReportSubmitted;

                  return (
                    <tr key={intern.id} className="hover:bg-surface-container-low/50 transition-colors">
                      {/* Trainee */}
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-col">
                          <span className="font-semibold text-on-surface text-[14px]">
                            {intern.fullName}
                          </span>
                          <span className="text-[12px] text-secondary font-code-tabular">
                            {intern.email}
                          </span>
                        </div>
                      </td>

                      {/* Entity & Dept */}
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-col">
                          <span className="font-medium text-on-surface">{intern.companyName}</span>
                          <span className="text-[12px] text-secondary">{intern.department}</span>
                        </div>
                      </td>

                      {/* Tenure End Date */}
                      <td className="px-3 py-3 align-top text-center">
                        <span className="font-code-tabular text-[12px] font-medium text-on-surface bg-surface-container px-2 py-0.5 rounded">
                          {formatDateDisplay(intern.durationTo)}
                        </span>
                      </td>

                      {/* 1. ID Tag */}
                      <td className="px-4 py-3 align-top text-center">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={o.idTagReturned}
                            onChange={() => handleToggleDoc(intern, 'idTagReturned')}
                            className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer accent-[#b90027]"
                          />
                          <span className={`text-[12px] ${o.idTagReturned ? 'text-emerald-700 font-medium' : 'text-secondary'}`}>
                            {o.idTagReturned ? 'Returned' : 'Pending'}
                          </span>
                        </label>
                      </td>

                      {/* 2. Attendance Form */}
                      <td className="px-4 py-3 align-top text-center">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={o.attendanceFormSubmitted}
                            onChange={() => handleToggleDoc(intern, 'attendanceFormSubmitted')}
                            className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer accent-[#b90027]"
                          />
                          <span className={`text-[12px] ${o.attendanceFormSubmitted ? 'text-emerald-700 font-medium' : 'text-secondary'}`}>
                            {o.attendanceFormSubmitted ? 'Submitted' : 'Pending'}
                          </span>
                        </label>
                      </td>

                      {/* 3. Progress Report */}
                      <td className="px-4 py-3 align-top text-center">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={o.progressReportSubmitted}
                            onChange={() => handleToggleDoc(intern, 'progressReportSubmitted')}
                            className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer accent-[#b90027]"
                          />
                          <span className={`text-[12px] ${o.progressReportSubmitted ? 'text-emerald-700 font-medium' : 'text-secondary'}`}>
                            {o.progressReportSubmitted ? 'Submitted' : 'Pending'}
                          </span>
                        </label>
                      </td>

                      {/* Clearance Status */}
                      <td className="px-3 py-3 align-top text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-semibold ${
                            isComplete
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {isComplete ? 'verified' : 'hourglass_top'}
                          </span>
                          <span>{isComplete ? 'Complete' : 'Pending'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 align-top text-right">
                        <button
                          onClick={() => onOpenSendReminder(intern)}
                          className="px-3 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-[12px] rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer border border-surface-container-high"
                          title="Send Email Reminder"
                        >
                          <span className="material-symbols-outlined text-[15px] text-tertiary">outgoing_mail</span>
                          <span>Send Reminder</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
