import React, { useState, useEffect } from 'react';
import { CompanyEntityCode, Intern, PaymentStatus } from '../../types';
import { MEDIA_PRIMA_ENTITIES } from '../../data/initialData';
import { validateIC, validateEmail } from '../../utils/validation';

interface AddInternModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (intern: Intern) => void;
  existingIntern?: Intern | null;
  departments: string[];
  banks: string[];
  showToast: (msg: string, icon?: string) => void;
}

export const AddInternModal: React.FC<AddInternModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingIntern,
  departments,
  banks,
  showToast,
}) => {
  const [fullName, setFullName] = useState('');
  const [icNumber, setIcNumber] = useState('');
  const [address, setAddress] = useState('');
  const [companyCode, setCompanyCode] = useState<CompanyEntityCode>('TV3');
  const [department, setDepartment] = useState(departments[0] || 'Creative Content & Production');
  const [phoneNumber, setPhoneNumber] = useState('+6012-');
  const [email, setEmail] = useState('');
  const [durationFrom, setDurationFrom] = useState('2026-03-01');
  const [durationTo, setDurationTo] = useState('2026-08-31');
  const [bankName, setBankName] = useState(banks[0] || 'Maybank Berhad');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Release Batch');
  const [remarks, setRemarks] = useState('');

  // Validation errors
  const [icError, setIcError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [generalError, setGeneralError] = useState<string>('');

  useEffect(() => {
    if (existingIntern) {
      setFullName(existingIntern.fullName);
      setIcNumber(existingIntern.icNumber);
      setAddress(existingIntern.address);
      setCompanyCode(existingIntern.companyCode);
      setDepartment(existingIntern.department);
      setPhoneNumber(existingIntern.phoneNumber);
      setEmail(existingIntern.email);
      setDurationFrom(existingIntern.durationFrom);
      setDurationTo(existingIntern.durationTo);
      setBankName(existingIntern.bankName);
      setBankAccountNumber(existingIntern.bankAccountNumber);
      setPaymentStatus(existingIntern.paymentStatus);
      setRemarks(existingIntern.remarks || '');
    } else {
      // Defaults
      setFullName('');
      setIcNumber('');
      setAddress('');
      setCompanyCode('TV3');
      setDepartment(departments[0] || 'Creative Content & Production');
      setPhoneNumber('+6012-');
      setEmail('');
      setDurationFrom('2026-03-01');
      setDurationTo('2026-08-31');
      setBankName(banks[0] || 'Maybank Berhad');
      setBankAccountNumber('');
      setPaymentStatus('Release Batch');
      setRemarks('');
    }
    setIcError('');
    setEmailError('');
    setGeneralError('');
  }, [existingIntern, isOpen, departments, banks]);

  if (!isOpen) return null;

  // Real-time IC validation on change
  const handleIcChange = (val: string) => {
    setIcNumber(val);
    if (!val.trim()) {
      setIcError('');
      return;
    }
    const res = validateIC(val);
    if (!res.isValid) {
      setIcError(res.message);
    } else {
      setIcError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    // Strict IC Validation Check (PRD F01 & TC-02)
    const icValidation = validateIC(icNumber);
    if (!icValidation.isValid) {
      setIcError(icValidation.message);
      setGeneralError('Please fix the IC validation error before proceeding.');
      return;
    }

    if (!fullName.trim()) {
      setGeneralError('Full Name is required.');
      return;
    }

    if (!email.trim() || !validateEmail(email)) {
      setEmailError('Please enter a valid corporate or trainee email.');
      setGeneralError('Invalid email format.');
      return;
    }

    if (!bankAccountNumber.trim()) {
      setGeneralError('Bank Account Number is required.');
      return;
    }

    const matchedCompany = MEDIA_PRIMA_ENTITIES.find((e) => e.code === companyCode);
    const companyFullName = matchedCompany ? matchedCompany.fullName : companyCode;

    const newOrUpdated: Intern = {
      id: existingIntern ? existingIntern.id : `int-${Date.now()}`,
      fullName: fullName.trim(),
      icNumber: icNumber.trim(),
      address: address.trim() || 'Balai Berita, Bangsar, 59000 Kuala Lumpur',
      companyCode,
      companyName: companyFullName,
      department,
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      durationFrom,
      durationTo,
      bankName,
      bankAccountNumber: bankAccountNumber.trim(),
      leaveDays: existingIntern ? existingIntern.leaveDays : 0,
      paymentStatus,
      remarks: remarks.trim(),
      offboarding: existingIntern ? existingIntern.offboarding : {
        idTagReturned: false,
        attendanceFormSubmitted: false,
        progressReportSubmitted: false,
      },
    };

    onSave(newOrUpdated);
    showToast(
      existingIntern
        ? `Updated profile for ${newOrUpdated.fullName}`
        : `Successfully registered ${newOrUpdated.fullName} into Masterlist`,
      'person_add'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-white flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">
                {existingIntern ? 'edit' : 'person_add'}
              </span>
            </div>
            <div>
              <h3 className="font-headline-sm text-[16px] text-on-surface font-semibold">
                {existingIntern ? 'Edit Trainee Record' : 'Masterlist Entry: Register Practical Trainee'}
              </h3>
              <p className="font-label-sm text-[11px] text-secondary">
                F01 Compliant Data Entry • Strict 12-Digit IC Validation Rule
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

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {generalError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[12px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{generalError}</span>
            </div>
          )}

          {/* Full Name & IC Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-secondary uppercase text-[11px] mb-1">
                Full Name (as per IC) <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Nurul Izzati binti Azman"
                className="w-full h-9 px-3 bg-surface-container-low rounded-lg font-label-md text-[13px] text-on-surface focus:outline-none focus:bg-surface-container-high border border-surface-container-high"
              />
            </div>

            <div>
              <label className="block font-label-sm text-secondary uppercase text-[11px] mb-1">
                IC Number (12 Digits, No Hyphens) <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                required
                value={icNumber}
                onChange={(e) => handleIcChange(e.target.value)}
                placeholder="e.g. 020415105824"
                maxLength={12}
                className={`w-full h-9 px-3 bg-surface-container-low rounded-lg font-code-tabular text-[13px] focus:outline-none border ${
                  icError
                    ? 'border-red-500 bg-red-50/50 text-red-900 focus:bg-red-50'
                    : 'border-surface-container-high text-on-surface focus:bg-surface-container-high'
                }`}
              />
              {/* TC-02: Red inline error text */}
              {icError ? (
                <p className="mt-1 text-[11px] font-medium text-red-600 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  <span>{icError}</span>
                </p>
              ) : (
                <p className="mt-1 text-[10px] text-secondary">
                  Rule: Exactly 12 numeric digits without hyphens.
                </p>
              )}
            </div>
          </div>

          {/* Operating Entity & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-secondary uppercase text-[11px] mb-1">
                Media Prima Operating Entity <span className="text-primary">*</span>
              </label>
              <select
                value={companyCode}
                onChange={(e) => setCompanyCode(e.target.value as CompanyEntityCode)}
                className="w-full h-9 px-3 bg-surface-container-low rounded-lg font-label-md text-[13px] text-on-surface focus:outline-none border border-surface-container-high cursor-pointer"
              >
                {MEDIA_PRIMA_ENTITIES.map((ent) => (
                  <option key={ent.code} value={ent.code}>
                    {ent.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-label-sm text-secondary uppercase text-[11px] mb-1">
                Department / Division <span className="text-primary">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-9 px-3 bg-surface-container-low rounded-lg font-label-md text-[13px] text-on-surface focus:outline-none border border-surface-container-high cursor-pointer"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-secondary uppercase text-[11px] mb-1">
                Corporate / Trainee Email <span className="text-primary">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                placeholder="name@trainee.mediaprima.com.my"
                className={`w-full h-9 px-3 bg-surface-container-low rounded-lg font-label-md text-[13px] focus:outline-none border ${
                  emailError
                    ? 'border-red-500 bg-red-50/50 text-red-900'
                    : 'border-surface-container-high text-on-surface focus:bg-surface-container-high'
                }`}
              />
              {emailError && (
                <p className="mt-1 text-[11px] text-red-600">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block font-label-sm text-secondary uppercase text-[11px] mb-1">
                Phone Number (Malaysia) <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+6012-3456789"
                className="w-full h-9 px-3 bg-surface-container-low rounded-lg font-code-tabular text-[13px] text-on-surface focus:outline-none focus:bg-surface-container-high border border-surface-container-high"
              />
            </div>
          </div>

          {/* Placement Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-secondary uppercase text-[11px] mb-1">
                Duration From (Start Date) <span className="text-primary">*</span>
              </label>
              <input
                type="date"
                required
                value={durationFrom}
                onChange={(e) => setDurationFrom(e.target.value)}
                className="w-full h-9 px-3 bg-surface-container-low rounded-lg font-label-md text-[13px] text-on-surface focus:outline-none border border-surface-container-high cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-label-sm text-secondary uppercase text-[11px] mb-1">
                Duration To (End Date) <span className="text-primary">*</span>
              </label>
              <input
                type="date"
                required
                value={durationTo}
                onChange={(e) => setDurationTo(e.target.value)}
                className="w-full h-9 px-3 bg-surface-container-low rounded-lg font-label-md text-[13px] text-on-surface focus:outline-none border border-surface-container-high cursor-pointer"
              />
            </div>
          </div>

          {/* Residential Address */}
          <div>
            <label className="block font-label-sm text-secondary uppercase text-[11px] mb-1">
              Residential Address (Emergency &amp; Statutory Records)
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. No 45, Jalan SS21/37, Damansara Utama, 47400 Petaling Jaya, Selangor"
              className="w-full h-9 px-3 bg-surface-container-low rounded-lg font-label-md text-[13px] text-on-surface focus:outline-none focus:bg-surface-container-high border border-surface-container-high"
            />
          </div>

          {/* Bank Name & Account Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-secondary uppercase text-[11px] mb-1">
                Bank Name (For Autopay) <span className="text-primary">*</span>
              </label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full h-9 px-3 bg-surface-container-low rounded-lg font-label-md text-[13px] text-on-surface focus:outline-none border border-surface-container-high cursor-pointer"
              >
                {banks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-label-sm text-secondary uppercase text-[11px] mb-1">
                Bank Account Number <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                required
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 164285902194"
                className="w-full h-9 px-3 bg-surface-container-low rounded-lg font-code-tabular text-[13px] text-on-surface focus:outline-none focus:bg-surface-container-high border border-surface-container-high"
              />
            </div>
          </div>

          {/* Payment Status & Remarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-secondary uppercase text-[11px] mb-1">
                Initial Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full h-9 px-3 bg-surface-container-low rounded-lg font-label-md text-[13px] text-on-surface focus:outline-none border border-surface-container-high cursor-pointer"
              >
                <option value="Release Batch">Release Batch (Approved)</option>
                <option value="On Hold">On Hold (Pending Verification)</option>
              </select>
            </div>

            <div>
              <label className="block font-label-sm text-secondary uppercase text-[11px] mb-1">
                Finance / HR Remarks
              </label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Full clearance verified by supervisor"
                className="w-full h-9 px-3 bg-surface-container-low rounded-lg font-label-md text-[13px] text-on-surface focus:outline-none focus:bg-surface-container-high border border-surface-container-high"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-surface-container-high flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-[13px] rounded-lg transition-colors cursor-pointer border border-surface-container-high"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary-container hover:bg-primary text-white font-label-md text-[13px] rounded-lg shadow-sm transition-all cursor-pointer font-semibold flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>{existingIntern ? 'Save Changes' : 'Register Intern'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
