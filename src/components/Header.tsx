import React from 'react';
import { CompanyEntityCode } from '../types';
import { MEDIA_PRIMA_ENTITIES } from '../data/initialData';

interface HeaderProps {
  activeMainTab: 'management' | 'analytics';
  setActiveMainTab: (tab: 'management' | 'analytics') => void;
  selectedEntity: CompanyEntityCode;
  setSelectedEntity: (code: CompanyEntityCode) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  onOpenHelp: () => void;
  onOpenCloudLinks: () => void;
  onOpenChangePassword: () => void;
  onLogout: () => void;
  cloudLinksCount: number;
  isCloudConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeMainTab,
  setActiveMainTab,
  selectedEntity,
  setSelectedEntity,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  onOpenHelp,
  onOpenCloudLinks,
  onOpenChangePassword,
  onLogout,
  cloudLinksCount,
  isCloudConnected,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const profileMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const cycleMonthStr = String(selectedMonth).padStart(2, '0');
  const auditedCycleCode = `MY-PR-${selectedYear}-M${cycleMonthStr}`;

  return (
    <header className="sticky top-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] no-print">
      {/* Primary Top Bar */}
      <div className="h-16 px-gutter-desktop flex items-center justify-between border-b border-surface-container-high/40">
        {/* Left: Brand Identity & Navigation */}
        <div className="flex items-center gap-space-lg">
          <div className="flex items-center gap-3">
            <img
              alt="Media Prima Trainee Allowance Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VeHW8yD2t6ZrhU_StqUmyuU2toG_Zb_nHv_hNzNueMLlJs5puCd32GwxclpfNr8cJUORJTUpjCiyHMbpPNZ5jBL-3JrX_jxMDOJVOlhzgAT0nkvYglz1e3kUaaMuU-ywba80TlhmhJi2rMcjKk6egRmFdZ--vrLyaKzxXgA8CZU3djCvhnEGonrDAOcQyR2-1nUSqGXjMYgVWwW5zLhOdJWTDvnN0iwBtuoDohfom9GPdQCh7QGAPPG3OZ"
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-[15px] sm:text-[16px] text-on-surface tracking-tight leading-none font-semibold">
                Trainee Allowance Management System
              </span>
              <span className="font-label-sm text-[11px] text-secondary uppercase tracking-wider mt-0.5">
                Group People &amp; Culture • Media Prima Berhad
              </span>
            </div>
          </div>

          <div className="h-7 w-px bg-surface-container-highest mx-1 hidden lg:block" />

          {/* Primary View Switcher Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-surface-container-low rounded-xl">
            <button
              onClick={() => setActiveMainTab('management')}
              className={`px-3.5 py-1.5 font-label-lg text-[13px] rounded-lg transition-all duration-200 cursor-pointer ${
                activeMainTab === 'management'
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              Internship &amp; Allowance Management
            </button>
            <button
              onClick={() => setActiveMainTab('analytics')}
              className={`px-3.5 py-1.5 font-label-lg text-[13px] rounded-lg transition-all duration-200 cursor-pointer ${
                activeMainTab === 'analytics'
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              Executive Analytics Dashboard
            </button>
          </nav>
        </div>

        {/* Right: Operational Manual & Profile Details */}
        <div className="flex items-center gap-3">
          {/* Mobile Tab Toggle */}
          <div className="flex md:hidden bg-surface-container-low p-0.5 rounded-lg">
            <button
              onClick={() => setActiveMainTab('management')}
              className={`p-1.5 rounded-md ${activeMainTab === 'management' ? 'bg-primary-container text-white' : 'text-secondary'}`}
              title="Internship & Allowance Management"
            >
              <span className="material-symbols-outlined text-[18px]">table_chart</span>
            </button>
            <button
              onClick={() => setActiveMainTab('analytics')}
              className={`p-1.5 rounded-md ${activeMainTab === 'analytics' ? 'bg-primary-container text-white' : 'text-secondary'}`}
              title="Executive Analytics Dashboard"
            >
              <span className="material-symbols-outlined text-[18px]">query_stats</span>
            </button>
          </div>

          {/* Cloud Links Repository Button */}
          <button
            onClick={onOpenCloudLinks}
            className="h-9 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer border border-surface-container-high shadow-2xs font-label-md text-[12px]"
            title="Pusat Simpanan Link & Dokumen Firebase"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">cloud_sync</span>
            <span className="hidden sm:inline font-medium">Link &amp; Dokumen</span>
            <span className="px-1.5 py-0.2 bg-primary text-white text-[10px] font-bold rounded-full">
              {cloudLinksCount}
            </span>
          </button>

          <button
            onClick={onOpenHelp}
            className="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-secondary hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
            title="Operation Manual &amp; Compliance Guide"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
          </button>

          {/* Exclusive HR Internship Profile Pill & Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 pl-3 py-1 pr-1.5 bg-surface-container-low hover:bg-surface-container-high rounded-full border border-surface-container-high/60 transition-all cursor-pointer shadow-2xs"
              title="Profil Pengguna: HR Internship"
            >
              <div className="flex flex-col text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="font-label-md text-label-md text-on-surface font-semibold text-[12px]">HR Internship</span>
                  <span
                    className="inline-block w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-surface-container-lowest animate-pulse"
                    title="Akaun HR Internship Aktif"
                  />
                </div>
                <span className="font-label-sm text-[10px] text-secondary font-mono">Internship@mediaprima.com.my</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-xs shadow-xs">
                <span className="material-symbols-outlined text-on-primary text-[18px]">admin_panel_settings</span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-12 w-64 bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-surface-container-high/60 mb-1">
                  <span className="text-[10px] text-secondary uppercase font-semibold block">Akaun Pengguna Sah</span>
                  <span className="font-semibold text-[13px] text-on-surface block">HR Internship</span>
                  <span className="font-mono text-[11px] text-secondary truncate block">Internship@mediaprima.com.my</span>
                  <span className="inline-block mt-1 text-[10px] bg-red-50 text-primary border border-red-200 px-1.5 py-0.2 rounded font-bold">
                    Akses Pentadbir Tunggal
                  </span>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenChangePassword();
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-[12px] font-medium text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px] text-tertiary">lock_reset</span>
                    <span>Tukar Kata Laluan</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenCloudLinks();
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-[12px] font-medium text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px] text-secondary">cloud_sync</span>
                    <span>Pusat Link &amp; Dokumen</span>
                  </button>

                  <div className="border-t border-surface-container-high/60 my-1" />

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-[12px] font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px]">logout</span>
                    <span>Log Keluar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Operational Scope Ribbon */}
      <div className="h-12 px-gutter-desktop bg-surface-container-low flex items-center justify-between gap-4 overflow-x-auto border-b border-surface-container-high/40">
        <div className="flex items-center gap-4 sm:gap-6 flex-nowrap">
          {/* Operating Entity Selector */}
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 uppercase tracking-wider whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px] text-tertiary">domain</span>
              Operating Entity
            </span>
            <div className="relative">
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value as CompanyEntityCode)}
                className="h-8 pl-2.5 pr-8 bg-surface-container-lowest rounded-lg font-label-md text-[13px] text-on-surface appearance-none focus:outline-none cursor-pointer hover:bg-surface-container-high transition-colors border border-surface-container-high shadow-2xs font-medium"
              >
                <option value="ALL">All 11 Media Prima Entities</option>
                {MEDIA_PRIMA_ENTITIES.map((ent) => (
                  <option key={ent.code} value={ent.code}>
                    {ent.fullName}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-secondary">
                expand_more
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-surface-container-highest hidden sm:block" />

          {/* Period Selector */}
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 uppercase tracking-wider whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px] text-tertiary">calendar_today</span>
              Period
            </span>
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="h-8 pl-2.5 pr-7 bg-surface-container-lowest rounded-lg font-label-md text-[13px] text-on-surface appearance-none focus:outline-none cursor-pointer hover:bg-surface-container-high transition-colors border border-surface-container-high shadow-2xs font-medium"
                >
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                  <option value={2028}>2028</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[18px] text-secondary">
                  expand_more
                </span>
              </div>
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="h-8 pl-2.5 pr-7 bg-surface-container-lowest rounded-lg font-label-md text-[13px] text-on-surface appearance-none focus:outline-none cursor-pointer hover:bg-surface-container-high transition-colors border border-surface-container-high shadow-2xs font-medium"
                >
                  {monthNames.map((name, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      {name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[18px] text-secondary">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Audited Cycle Code & Cloud Sync Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-secondary font-label-sm text-[12px] whitespace-nowrap">
            <span
              className={`w-2 h-2 rounded-full ${
                isCloudConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="text-[11px] font-medium text-on-surface hidden md:inline">
              Firebase: <span className="text-emerald-700 font-semibold">Tersimpan di Cloud</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-secondary font-label-sm text-[12px] whitespace-nowrap">
            <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
            <span>
              Audited Cycle:{' '}
              <span className="font-code-tabular text-code-tabular text-on-surface font-semibold bg-surface-container-lowest px-1.5 py-0.5 rounded border border-surface-container-high">
                {auditedCycleCode}
              </span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
