import React, { useState } from 'react';
import { resetPasswordHR, AUTHORIZED_HR_EMAIL, DEFAULT_HR_PASSWORD } from '../../firebase';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string, icon?: string) => void;
  onResetSuccess?: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  showToast,
  onResetSuccess,
}) => {
  const [emailInput, setEmailInput] = useState(AUTHORIZED_HR_EMAIL);
  const [customNewPass, setCustomNewPass] = useState('');
  const [resetMethod, setResetMethod] = useState<'link' | 'instant'>('link');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const passParam = resetMethod === 'instant' && customNewPass.trim() ? customNewPass.trim() : undefined;
      const res = await resetPasswordHR(emailInput, passParam);

      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        showToast(res.message, 'mark_email_read');
        if (onResetSuccess) {
          onResetSuccess();
        }
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Error occurred while processing reset request.' });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDefaultRestore = async () => {
    setLoading(true);
    try {
      const res = await resetPasswordHR(AUTHORIZED_HR_EMAIL);
      setMessage({
        type: 'success',
        text: `Official default password (${DEFAULT_HR_PASSWORD}) has been restored for ${AUTHORIZED_HR_EMAIL}.`,
      });
      showToast(`Password restored to "${DEFAULT_HR_PASSWORD}"`, 'key');
      if (onResetSuccess) {
        onResetSuccess();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to restore default password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-tertiary-container text-white flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">forward_to_inbox</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-[16px] text-on-surface font-semibold">
                Reset HR Password
              </h3>
              <p className="font-label-sm text-[11px] text-secondary">
                Linked to official email {AUTHORIZED_HR_EMAIL}
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {message && (
            <div
              className={`p-3 rounded-lg text-[12px] flex items-start gap-2 border ${
                message.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
                {message.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <span>{message.text}</span>
            </div>
          )}

          <div>
            <label className="block font-label-sm text-secondary uppercase text-[11px] mb-1 font-medium">
              Linked Official HR Email <span className="text-primary">*</span>
            </label>
            <input
              type="email"
              required
              readOnly
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full h-9 px-3 bg-surface-container-high/60 rounded-lg font-label-md text-[13px] text-on-surface border border-surface-container-high font-medium cursor-not-allowed"
            />
            <p className="mt-1 text-[10px] text-secondary">
              This system is restricted to a single official user account ({AUTHORIZED_HR_EMAIL}).
            </p>
          </div>

          {/* Reset Options */}
          <div className="space-y-2">
            <span className="block font-label-sm text-secondary uppercase text-[11px] font-medium">
              Password Reset Options:
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setResetMethod('link')}
                className={`p-2.5 rounded-lg border text-left text-[12px] cursor-pointer transition-all ${
                  resetMethod === 'link'
                    ? 'border-tertiary bg-tertiary/10 text-on-surface font-semibold'
                    : 'border-surface-container-high bg-surface-container-low text-secondary'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">mail</span>
                  <span>Email Reset Link</span>
                </div>
                <span className="text-[10px] text-secondary block">
                  Send reset link to your official inbox
                </span>
              </button>

              <button
                type="button"
                onClick={() => setResetMethod('instant')}
                className={`p-2.5 rounded-lg border text-left text-[12px] cursor-pointer transition-all ${
                  resetMethod === 'instant'
                    ? 'border-tertiary bg-tertiary/10 text-on-surface font-semibold'
                    : 'border-surface-container-high bg-surface-container-low text-secondary'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">key</span>
                  <span>Instant Reset</span>
                </div>
                <span className="text-[10px] text-secondary block">
                  Set a new password immediately
                </span>
              </button>
            </div>
          </div>

          {resetMethod === 'instant' && (
            <div>
              <label className="block font-label-sm text-secondary uppercase text-[11px] mb-1 font-medium">
                New Password (Instant)
              </label>
              <input
                type="text"
                value={customNewPass}
                onChange={(e) => setCustomNewPass(e.target.value)}
                placeholder="e.g., Internship2026! (minimum 6 characters)"
                className="w-full h-9 px-3 bg-surface-container-low rounded-lg font-label-md text-[13px] text-on-surface border border-surface-container-high focus:outline-none"
              />
            </div>
          )}

          {/* Quick Default Reset Option */}
          <div className="p-3 bg-surface-container-low rounded-lg border border-surface-container-high flex items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-on-surface text-[12px] block">
                Restore Default Password:
              </span>
              <span className="font-mono text-[11px] text-secondary">
                {DEFAULT_HR_PASSWORD}
              </span>
            </div>
            <button
              type="button"
              onClick={handleQuickDefaultRestore}
              className="px-2.5 py-1 bg-surface-container-highest hover:bg-surface-container-low text-primary text-[11px] font-semibold rounded border border-surface-container-high transition-colors cursor-pointer"
            >
              Activate {DEFAULT_HR_PASSWORD}
            </button>
          </div>

          <div className="pt-2 border-t border-surface-container-high flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-[12px] rounded-lg border border-surface-container-high cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-tertiary hover:bg-blue-700 text-white font-label-md text-[12px] rounded-lg shadow-xs font-semibold cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>{loading ? 'Processing...' : resetMethod === 'link' ? 'Send Reset Link' : 'Save New Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
