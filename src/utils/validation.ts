/**
 * Validates Malaysian NRIC (IC Number).
 * Must be exactly 12 numeric digits without hyphens or spaces.
 */
export function validateIC(ic: string): { isValid: boolean; message: string } {
  const cleaned = ic.trim();
  
  if (!cleaned) {
    return { isValid: false, message: 'IC Number is required.' };
  }

  if (cleaned.includes('-')) {
    return { isValid: false, message: 'Enter 12 digits without hyphens (e.g. 020415105824).' };
  }

  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, message: 'IC Number must contain only numeric digits.' };
  }

  if (cleaned.length !== 12) {
    return {
      isValid: false,
      message: `IC Number must be exactly 12 digits. Current length: ${cleaned.length} digits.`,
    };
  }

  return { isValid: true, message: '' };
}

/**
 * Formats a 12-digit IC into standard display format: XXXXXX-XX-XXXX
 */
export function formatICDisplay(ic: string): string {
  const digits = ic.replace(/\D/g, '');
  if (digits.length === 12) {
    return `${digits.slice(0, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 12)}`;
  }
  return ic;
}

/**
 * Formats standard ISO YYYY-MM-DD to DD/MM/YYYY
 */
export function formatDateDisplay(isoDateString: string): string {
  if (!isoDateString) return '-';
  const parts = isoDateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return isoDateString;
}

/**
 * Formats date object to DD/MM/YYYY
 */
export function formatDateObjectDisplay(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Validates email address format
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Validates Malaysian phone numbers (e.g., 012-3456789 or +60123456789)
 */
export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^(\+?60|0)[1-9]\d{7,8}$/.test(cleaned);
}
