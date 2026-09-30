import React, { useState, useEffect } from 'react';
import { Intern } from '../../types';
import { validateEmail, formatDateDisplay } from '../../utils/validation';

interface SendReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  intern: Intern | null;
  showToast: (msg: string, icon?: string) => void;
}

export const SendReminderModal: React.FC<SendReminderModalProps> = ({
  isOpen,
  onClose,
  intern,
  showToast,
}) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (intern) {
      setRecipientEmail(intern.email);
      setSubject(`[Urgent] Media Prima Trainee Offboarding Clearance - ${intern.fullName}`);
      
      const missingDocs: string[] = [];
      if (!intern.offboarding.idTagReturned) missingDocs.push('1. ID Tag / Access Card (Return to Sri Pentas / Balai Berita Security)');
      if (!intern.offboarding.attendanceFormSubmitted) missingDocs.push('2. Hardcopy Signed Monthly Attendance Form');
      if (!intern.offboarding.progressReportSubmitted) missingDocs.push('3. Completed Trainee Progress Report & Supervisor Evaluation');

      const template = `Dear ${intern.fullName},

This is an automated statutory notice from Media Prima Group People & Culture regarding your upcoming internship completion on ${formatDateDisplay(intern.durationTo)}.

In accordance with Media Prima Group Policy HR-TR-04, release of your final monthly allowance batch is subject to 100% hardcopy clearance of statutory documents.

Currently, our records show the following items remain PENDING:
${missingDocs.length > 0 ? missingDocs.join('\n') : '• All documents currently submitted. Please verify physical copies.'}

Please submit the required hardcopy forms to Group HR Operations immediately to prevent disbursement hold on your trainee account (${intern.bankName}: ${intern.bankAccountNumber}).

Thank you for your contributions to ${intern.companyName}.

Warm regards,
Group People & Culture
Media Prima Berhad
Sri Pentas, Bandar Utama / Balai Berita Bangsar`;

      setMessage(template);
      setEmailError('');
    }
  }, [intern, isOpen]);

  if (!isOpen || !intern) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientEmail.trim() || !validateEmail(recipientEmail)) {
      setEmailError('A valid trainee email address is required.');
      return;
    }

    showToast(`Offboarding reminder email dispatched to ${recipientEmail}`, 'mark_email_read');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-container text-tertiary flex items-center justify-center font-bold border border-surface-container-high">
              <span className="material-symbols-outlined text-[20px]">outgoing_mail</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-[16px] text-on-surface font-semibold">
                Send Offboarding Document Reminder
              </h3>
              <p className="font-label-sm text-[11px] text-secondary">
                F04 Statutory Reminder Modal • Pre-formatted Template
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

        {/* Form Body */}
        <form onSubmit={handleSend} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block font-label-sm text-secondary uppercase text-[11px] mb-1">
              Recipient Email <span className="text-primary">*</span>
            </label>
            <input
              type="email"
              required
              value={recipientEmail}
              onChange={(e) => {
                setRecipientEmail(e.target.value);
                setEmailError('');
              }}
              className={`w-full h-9 px-3 bg-surface-container-low rounded-lg font-label-md text-[13px] focus:outline-none border ${
                emailError
                  ? 'border-red-500 bg-red-50/50 text-red-900'
                  : 'border-surface-container-high text-on-surface focus:bg-surface-container-high'
              }`}
            />
            {emailError && <p className="mt-1 text-[11px] text-red-600">{emailError}</p>}
          </div>

          <div>
            <label className="block font-label-sm text-secondary uppercase text-[11px] mb-1">
              Subject Line
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full h-9 px-3 bg-surface-container-low rounded-lg font-label-md text-[13px] text-on-surface focus:outline-none focus:bg-surface-container-high border border-surface-container-high font-medium"
            />
          </div>

          <div>
            <label className="block font-label-sm text-secondary uppercase text-[11px] mb-1">
              Reminder Message Body
            </label>
            <textarea
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 bg-surface-container-low rounded-lg font-mono text-[12px] text-on-surface focus:outline-none focus:bg-surface-container-high border border-surface-container-high leading-relaxed resize-none"
            />
          </div>

          <div className="pt-3 border-t border-surface-container-high flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-[13px] rounded-lg border border-surface-container-high cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-tertiary hover:bg-blue-700 text-white font-label-md text-[13px] rounded-lg shadow-sm transition-all cursor-pointer font-semibold flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Send Reminder Notice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
