import { Intern } from '../types';
import { calculateAllowance, formatMYR } from './allowanceCalculator';
import { formatDateDisplay, formatICDisplay } from './validation';

/**
 * Generates CSV content formatted according to Media Prima Group Payroll specifications.
 */
export function generateAllowanceCSV(
  interns: Intern[],
  year: number,
  month: number,
  entityName: string = 'All Operating Subsidiaries'
): string {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthStr = monthNames[month - 1];

  const headers = [
    'No.',
    'Intern Full Name',
    'IC Number (Formatted)',
    'IC Number (Raw)',
    'Company Entity',
    'Department',
    'Bank Name',
    'Bank Account Number',
    'Active Days',
    'Total Days',
    'Leave/MC Days',
    'Base Amount (RM)',
    'Leave Deductions (RM)',
    'Final Net Payout (RM)',
    'Batch Status',
    'Finance Remarks',
  ];

  const rows = interns.map((intern, index) => {
    const calc = calculateAllowance({
      durationFrom: intern.durationFrom,
      durationTo: intern.durationTo,
      year,
      month,
      leaveDays: intern.leaveDays,
      manualActiveDays: intern.id === 'int-002' ? 13 : intern.id === 'int-003' ? 20 : undefined,
    });

    return [
      index + 1,
      `"${intern.fullName.replace(/"/g, '""')}"`,
      `"${formatICDisplay(intern.icNumber)}"`,
      `"${intern.icNumber}"`,
      `"${intern.companyName.replace(/"/g, '""')}"`,
      `"${intern.department.replace(/"/g, '""')}"`,
      `"${intern.bankName.replace(/"/g, '""')}"`,
      `"\t${intern.bankAccountNumber}"`, // Tab prevents Excel scientific notation
      calc.activeDays,
      calc.totalDaysInMonth,
      intern.leaveDays,
      calc.baseAmount,
      calc.leaveDeductionAmount.toFixed(2),
      calc.finalNetPayout,
      `"${intern.paymentStatus}"`,
      `"${(intern.remarks || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  const metadataHeader = [
    `"MEDIA PRIMA BERHAD - TRAINEE ALLOWANCE DISBURSEMENT SHEET"`,
    `"Disbursement Period: ${monthStr} ${year}"`,
    `"Operating Entity Filter: ${entityName}"`,
    `"Standard Policy HR-TR-04: RM 500 / month (Strict Integer Rounding)"`,
    `"Generated On: ${new Date().toLocaleString('en-MY')}"`,
    '',
  ].join('\n');

  return `${metadataHeader}\n${headers.join(',')}\n${rows.join('\n')}`;
}

/**
 * Downloads a string as a file in the browser.
 */
export function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates TSV (Tab Separated Values) for copy-pasting directly into Google Sheets.
 */
export function generateGoogleSheetsTSV(
  interns: Intern[],
  year: number,
  month: number
): string {
  const headers = [
    'No.',
    'Intern Full Name',
    'IC Number',
    'Company Entity',
    'Department',
    'Bank Name',
    'Account Number',
    'Active Days',
    'Leave Days',
    'Net Payout (RM)',
    'Status',
  ];

  const rows = interns.map((intern, index) => {
    const calc = calculateAllowance({
      durationFrom: intern.durationFrom,
      durationTo: intern.durationTo,
      year,
      month,
      leaveDays: intern.leaveDays,
      manualActiveDays: intern.id === 'int-002' ? 13 : intern.id === 'int-003' ? 20 : undefined,
    });

    return [
      index + 1,
      intern.fullName,
      formatICDisplay(intern.icNumber),
      intern.companyName,
      intern.department,
      intern.bankName,
      `'${intern.bankAccountNumber}`,
      `${calc.activeDays}/${calc.totalDaysInMonth}`,
      intern.leaveDays,
      calc.finalNetPayout,
      intern.paymentStatus,
    ].join('\t');
  });

  return `${headers.join('\t')}\n${rows.join('\n')}`;
}

/**
 * Triggers browser print workflow with print stylesheet
 */
export function printAllowanceSheet(): void {
  window.print();
}
