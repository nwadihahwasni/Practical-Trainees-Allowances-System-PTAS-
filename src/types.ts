export type CompanyEntityCode =
  | 'ALL'
  | 'TV3'
  | 'REV'
  | 'NSTP'
  | 'OMNIA'
  | 'BTO'
  | 'HQ'
  | 'SYNCHRO'
  | 'WOW'
  | 'NTV7'
  | '8TV'
  | 'CH9';

export interface CompanyEntity {
  id: string;
  code: CompanyEntityCode;
  name: string;
  fullName: string;
  category: string;
  location: string;
  color: string;
  accentClass: string;
}

export interface OffboardingChecklist {
  idTagReturned: boolean;
  attendanceFormSubmitted: boolean;
  progressReportSubmitted: boolean;
  clearanceDate?: string;
  clearedBy?: string;
}

export type PaymentStatus = 'Release Batch' | 'On Hold';

export interface Intern {
  id: string;
  fullName: string;
  icNumber: string; // 12 numeric digits without hyphens
  address: string;
  companyCode: CompanyEntityCode;
  companyName: string;
  department: string;
  phoneNumber: string;
  email: string;
  durationFrom: string; // YYYY-MM-DD
  durationTo: string;   // YYYY-MM-DD
  bankName: string;
  bankAccountNumber: string;
  leaveDays: number;
  paymentStatus: PaymentStatus;
  remarks?: string;
  offboarding: OffboardingChecklist;
  avatarSeed?: string;
}

export interface AllowanceCalculationResult {
  totalDaysInMonth: number;
  activeDays: number;
  baseAmount: number;
  leaveDaysDeducted: number;
  dailyRate: number;
  leaveDeductionAmount: number;
  grossAmount: number;
  finalNetPayout: number;
  calculationExplanation: string;
}
