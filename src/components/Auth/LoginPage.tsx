import React, { useState } from 'react';
import {
  loginHR,
  AUTHORIZED_HR_EMAIL,
  DEFAULT_HR_PASSWORD,
  getEffectiveHRPassword,
} from '../../firebase';
import { ResetPasswordModal } from '../Modals/ResetPasswordModal';

interface LoginPageProps {
  onLoginSuccess: () => void;
  showToast: (msg: string, icon?: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, showToast }) => {
  const [email, setEmail] = useState(AUTHORIZED_HR_EMAIL);
  const [password, setPassword] = useState(getEffectiveHRPassword());
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginHR(email, password);
      if (res.success) {
        showToast(`Selamat datang, HR Internship! Log masuk berjaya.`, 'verified_user');
        onLoginSuccess();
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Ralat log masuk. Sila cuba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillCredentials = () => {
    setEmail(AUTHORIZED_HR_EMAIL);
    setPassword(getEffectiveHRPassword());
    setError('');
    showToast('Kredensial rasmi HR Internship diisi secara automatik.', 'key');
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-surface-container-low/60 relative overflow-hidden selection:bg-primary selection:text-white">
      {/* Background Decorative Accent Gradients */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="h-16 px-6 sm:px-10 flex items-center justify-between border-b border-surface-container-high/60 bg-surface-container-lowest/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img
            alt="Media Prima Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VeHW8yD2t6ZrhU_StqUmyuU2toG_Zb_nHv_hNzNueMLlJs5puCd32GwxclpfNr8cJUORJTUpjCiyHMbpPNZ5jBL-3JrX_jxMDOJVOlhzgAT0nkvYglz1e3kUaaMuU-ywba80TlhmhJi2rMcjKk6egRmFdZ--vrLyaKzxXgA8CZU3djCvhnEGonrDAOcQyR2-1nUSqGXjMYgVWwW5zLhOdJWTDvnN0iwBtuoDohfom9GPdQCh7QGAPPG3OZ"
          />
          <div className="hidden sm:flex flex-col">
            <span className="font-headline-sm text-[15px] text-on-surface font-semibold leading-tight">
              Media Prima Berhad
            </span>
            <span className="font-label-sm text-[10px] text-secondary uppercase tracking-wider">
              Group People &amp; Culture • PTAS Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high font-label-sm text-[11px] text-tertiary font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sistem Keselamatan Statutori Aktif</span>
          </span>
        </div>
      </header>

      {/* Center Login Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto z-10">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Card Top Title Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-surface-container-low to-surface-container-lowest border-b border-surface-container-high/60 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary-container text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
              <span className="material-symbols-outlined text-[26px]">badge</span>
            </div>
            <h1 className="font-headline-md text-[20px] font-bold text-on-surface tracking-tight">
              Log Masuk HR Internship
            </h1>
            <p className="text-[12px] text-secondary mt-1 max-w-xs mx-auto">
              Practical Trainee Allowance System (PTAS) — Sistem Pengurusan &amp; Pembayaran Elaun Pelatih
            </p>

            {/* Single User Authority Pill */}
            <div className="mt-3.5 inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-primary px-3 py-1 rounded-full text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              <span>Pengguna Tunggal: HR Internship</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[12px] flex items-start gap-2 animate-in fade-in duration-150">
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block font-label-sm text-secondary uppercase text-[11px] mb-1 font-medium">
                Emel Rasmi HR <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Internship@mediaprima.com.my"
                  className="w-full h-10 pl-9 pr-3 bg-surface-container-low rounded-lg font-label-md text-[13px] text-on-surface focus:outline-none focus:bg-surface-container-high border border-surface-container-high transition-colors"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-secondary">
                  mail
                </span>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-label-sm text-secondary uppercase text-[11px] font-medium">
                  Kata Laluan <span className="text-primary">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsResetOpen(true)}
                  className="text-[11px] text-tertiary hover:underline font-semibold cursor-pointer"
                >
                  Lupa Kata Laluan?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata laluan"
                  className="w-full h-10 pl-9 pr-10 bg-surface-container-low rounded-lg font-label-md text-[13px] text-on-surface focus:outline-none focus:bg-surface-container-high border border-surface-container-high transition-colors"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-secondary">
                  lock
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface p-1 rounded cursor-pointer"
                  title={showPassword ? 'Sembunyikan' : 'Papar'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me & Quick Fill button */}
            <div className="flex items-center justify-between pt-1">
              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer accent-[#b90027]"
                />
                <span className="text-[12px] text-secondary">Ingat sesi saya</span>
              </label>

              <button
                type="button"
                onClick={handleFillCredentials}
                className="text-[11px] text-primary hover:text-primary-container font-semibold inline-flex items-center gap-1 cursor-pointer bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded transition-colors"
                title="Isi automatik kredensial rasmi HR Internship"
              >
                <span className="material-symbols-outlined text-[13px]">key</span>
                <span>Isi Kredensial HR</span>
              </button>
            </div>

            {/* Login CTA Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary-container hover:bg-primary text-white font-label-md text-[13px] rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-semibold disabled:opacity-60 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Mengesahkan Kredensial...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Log Masuk ke Sistem PTAS</span>
                </>
              )}
            </button>
          </form>

          {/* Card Footer Info */}
          <div className="p-4 bg-surface-container-low/70 border-t border-surface-container-high/60 text-center text-[11px] text-secondary">
            <span>Akaun rasmi: </span>
            <strong className="text-on-surface font-mono">{AUTHORIZED_HR_EMAIL}</strong>
            <span className="block mt-0.5">
              Kata laluan asal lalai: <strong className="font-mono text-primary">{DEFAULT_HR_PASSWORD}</strong> (Boleh ditukar)
            </span>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="py-4 text-center text-[11px] text-secondary border-t border-surface-container-high/40 bg-surface-container-lowest/50">
        © 2026 Media Prima Berhad (Company No. 200001024235 [530182-V]). Hak Cipta Terpelihara • Portal Keselamatan HR
      </footer>

      {/* Password Reset Modal */}
      <ResetPasswordModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        showToast={showToast}
        onResetSuccess={() => {
          setPassword(getEffectiveHRPassword());
          setIsResetOpen(false);
        }}
      />
    </div>
  );
};
