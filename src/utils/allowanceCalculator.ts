import { AllowanceCalculationResult } from '../types';

export const STANDARD_BASE_ALLOWANCE = 500;

/**
 * Returns the number of days in a given month and year.
 * month is 1-indexed (1 for Jan, 8 for Aug, 12 for Dec).
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Calculates active calendar days of internship within a specific target month.
 */
export function calculateActiveDaysInMonth(
  durationFrom: string, // YYYY-MM-DD
  durationTo: string,   // YYYY-MM-DD
  year: number,
  month: number         // 1-indexed (e.g. 8 for August)
): number {
  const totalDaysInMonth = getDaysInMonth(year, month);
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month - 1, totalDaysInMonth);

  const startDate = new Date(durationFrom);
  const endDate = new Date(durationTo);

  // If the internship ends before the month starts or starts after the month ends:
  if (endDate < monthStart || startDate > monthEnd) {
    return 0;
  }

  // Effective start and end within this month
  const effectiveStart = startDate > monthStart ? startDate : monthStart;
  const effectiveEnd = endDate < monthEnd ? endDate : monthEnd;

  // Calculate day difference (inclusive)
  const diffTime = effectiveEnd.getTime() - effectiveStart.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return Math.max(0, Math.min(totalDaysInMonth, diffDays));
}

/**
 * Integer Rounding Rule as specified in PRD (HR-TR-04):
 * Decimals >= 0.50 round UP to nearest Ringgit; decimals < 0.50 round DOWN.
 * Zero sen/decimals displayed.
 */
export function roundToNearestRinggit(amount: number): number {
  if (amount <= 0) return 0;
  return Math.round(amount);
}

/**
 * Computes the complete allowance calculation breakdown for an intern for a specified month/year.
 * Supports manual override of activeDays if specified.
 */
export function calculateAllowance({
  durationFrom,
  durationTo,
  year,
  month,
  leaveDays = 0,
  manualActiveDays,
}: {
  durationFrom: string;
  durationTo: string;
  year: number;
  month: number;
  leaveDays?: number;
  manualActiveDays?: number;
}): AllowanceCalculationResult {
  const totalDaysInMonth = getDaysInMonth(year, month);
  
  const activeDays = manualActiveDays !== undefined
    ? Math.min(totalDaysInMonth, Math.max(0, manualActiveDays))
    : calculateActiveDaysInMonth(durationFrom, durationTo, year, month);

  const dailyRate = STANDARD_BASE_ALLOWANCE / totalDaysInMonth;
  const proratedGross = (STANDARD_BASE_ALLOWANCE / totalDaysInMonth) * activeDays;
  const leaveDeductionAmount = leaveDays * dailyRate;

  // Unrounded net amount
  const rawNetPayout = Math.max(0, proratedGross - leaveDeductionAmount);
  const finalNetPayout = roundToNearestRinggit(rawNetPayout);
  const baseRounded = roundToNearestRinggit(proratedGross);

  // Build the explanation formula matching Image 1
  let calculationExplanation = '';
  if (activeDays === totalDaysInMonth) {
    if (leaveDays > 0) {
      calculationExplanation = `(RM${STANDARD_BASE_ALLOWANCE} / ${totalDaysInMonth}) × ${activeDays}d = RM${proratedGross.toFixed(2)} - (${leaveDays}d leave @ RM${leaveDeductionAmount.toFixed(2)}) → RM ${finalNetPayout}`;
    } else {
      calculationExplanation = `(RM${STANDARD_BASE_ALLOWANCE} / ${totalDaysInMonth}) × ${activeDays}d = RM${proratedGross.toFixed(2)} → RM ${finalNetPayout}`;
    }
  } else {
    if (leaveDays > 0) {
      calculationExplanation = `(RM${STANDARD_BASE_ALLOWANCE} / ${totalDaysInMonth}) × ${activeDays}d = RM${proratedGross.toFixed(2)} - (${leaveDays}d leave @ RM${leaveDeductionAmount.toFixed(2)}) → RM ${finalNetPayout}`;
    } else {
      calculationExplanation = `(RM${STANDARD_BASE_ALLOWANCE} / ${totalDaysInMonth}) × ${activeDays}d = RM${proratedGross.toFixed(2)} → RM ${finalNetPayout}`;
    }
  }

  return {
    totalDaysInMonth,
    activeDays,
    baseAmount: baseRounded,
    leaveDaysDeducted: leaveDays,
    dailyRate,
    leaveDeductionAmount,
    grossAmount: proratedGross,
    finalNetPayout,
    calculationExplanation,
  };
}

/**
 * Formats a currency number in Malaysian Ringgit (e.g., RM 500 or RM 13,820.00)
 */
export function formatMYR(amount: number, showDecimals: boolean = false): string {
  if (showDecimals) {
    return `RM ${amount.toLocaleString('en-MY', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `RM ${amount.toLocaleString('en-MY')}`;
}
