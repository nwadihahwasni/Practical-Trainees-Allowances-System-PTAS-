import React, { useState } from 'react';
import { CompanyEntityCode } from '../../types';
import { printAllowanceSheet } from '../../utils/exportUtils';

interface ExecutiveAnalyticsDashboardProps {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  selectedEntity: CompanyEntityCode;
  setSelectedEntity: (code: CompanyEntityCode) => void;
  onDrilldownToSheet: (entityCode: CompanyEntityCode) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const ExecutiveAnalyticsDashboard: React.FC<ExecutiveAnalyticsDashboardProps> = ({
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedEntity,
  setSelectedEntity,
  onDrilldownToSheet,
  showToast,
}) => {
  const [isFullYearView, setIsFullYearView] = useState(false);
  const [activeFiscalYear, setActiveFiscalYear] = useState('2026');
  const [sortMode, setSortMode] = useState<'headcount' | 'spend'>('headcount');
  const [auditSearch, setAuditSearch] = useState('');
  const [focusedEntity, setFocusedEntity] = useState<string>('ALL');

  const toggleTimeframe = () => {
    const nextState = !isFullYearView;
    setIsFullYearView(nextState);
    if (nextState) {
      showToast('Switched to Full Year (YTD 2026) consolidated metrics.', 'bar_chart');
    } else {
      showToast('Switched to August 2026 active cycle metrics.', 'calendar_today');
    }
  };

  const handleYearSelect = (year: string) => {
    setActiveFiscalYear(year);
    setSelectedYear(parseInt(year, 10));
    showToast(`Fiscal data scope set to ${year}`, 'calendar_month');
  };

  const triggerExport = (format: 'PDF' | 'Excel') => {
    showToast(`Compiling ${format} Executive Summary Report (PRD F08)...`, 'downloading');
    setTimeout(() => {
      if (format === 'PDF') {
        printAllowanceSheet();
      }
      showToast(`${format} Summary Report generated successfully.`, 'file_download_done');
    }, 1000);
  };

  // 11 Entities Roster Data matching Image 3
  const entitiesData = [
    {
      code: 'TV3',
      num: '01',
      name: 'Sistem Televisyen Malaysia Berhad',
      subName: 'TV3 • Sri Pentas, Bandar Utama',
      tag: 'Broadcast Hub',
      headcount: 38,
      payout: 18650,
      ytdPayout: 96200,
      share: '26.1%',
      barWidth: '100%',
      barColor: 'bg-primary',
      badgeColor: 'bg-primary-container text-white',
      offboardingCleared: '29/30 Cleared',
      paymentStatus: '100% Released',
      auditHealth: 'Pass (AAA)',
    },
    {
      code: 'REV',
      num: '02',
      name: 'REV Media Group',
      subName: 'Digital Publishing & Vocket / SAYS',
      tag: 'Digital Media',
      headcount: 26,
      payout: 12800,
      ytdPayout: 64500,
      share: '17.9%',
      barWidth: '68.4%',
      barColor: 'bg-tertiary',
      badgeColor: 'bg-tertiary text-white',
      offboardingCleared: '19/19 Cleared',
      paymentStatus: '100% Released',
      auditHealth: 'Pass (AAA)',
    },
    {
      code: 'NSTP',
      num: '03',
      name: 'The New Straits Times Press (Malaysia) Berhad',
      subName: 'NSTP • Balai Berita, Bangsar',
      tag: 'Publishing & News',
      headcount: 22,
      payout: 10750,
      ytdPayout: 52300,
      share: '15.0%',
      barWidth: '57.9%',
      barColor: 'bg-secondary',
      badgeColor: 'bg-secondary text-white',
      offboardingCleared: '16/17 Cleared',
      paymentStatus: '100% Released',
      auditHealth: 'Pass (AAA)',
    },
    {
      code: 'OMNIA',
      num: '04',
      name: 'Media Prima Omnia Sdn Bhd',
      subName: 'Omni-Channel Sales & Marketing',
      tag: 'Commercial Solutions',
      headcount: 18,
      payout: 8900,
      ytdPayout: 44100,
      share: '12.5%',
      barWidth: '47.3%',
      barColor: 'bg-tertiary-container',
      badgeColor: 'bg-surface-container-highest text-on-surface',
      offboardingCleared: '14/14 Cleared',
      paymentStatus: '100% Released',
      auditHealth: 'Pass (AAA)',
    },
    {
      code: 'BTO',
      num: '05',
      name: 'Big Tree Outdoor Sdn Bhd',
      subName: 'OOH Advertising & Expressway Sites',
      tag: 'Out-Of-Home Advertising',
      headcount: 14,
      payout: 6850,
      ytdPayout: 33600,
      share: '9.6%',
      barWidth: '36.8%',
      barColor: 'bg-surface-tint',
      badgeColor: 'bg-surface-container-highest text-on-surface',
      offboardingCleared: '11/12 Cleared',
      paymentStatus: '100% Released',
      auditHealth: 'Pass (AAA)',
    },
    {
      code: 'HQ',
      num: '06',
      name: 'Media Prima Berhad (Corporate HQ)',
      subName: 'Legal, Finance, Group People & Culture',
      tag: 'Group Functions',
      headcount: 12,
      payout: 5900,
      ytdPayout: 29800,
      share: '8.3%',
      barWidth: '31.5%',
      barColor: 'bg-secondary-container',
      badgeColor: 'bg-surface-container-highest text-on-surface',
      offboardingCleared: '9/9 Cleared',
      paymentStatus: '100% Released',
      auditHealth: 'Pass (AAA)',
    },
    {
      code: 'SYNCHRO',
      num: '07',
      name: 'Synchrosound Studio Sdn Bhd',
      subName: 'Fly FM, Hot FM, Kool 101, Molek FM',
      tag: 'Audio & Radio',
      headcount: 8,
      payout: 3900,
      ytdPayout: 19500,
      share: '5.5%',
      barWidth: '21.0%',
      barColor: 'bg-outline-variant',
      badgeColor: 'bg-surface-container-highest text-on-surface',
      offboardingCleared: '6/6 Cleared',
      paymentStatus: '100% Released',
      auditHealth: 'Pass (AAA)',
    },
    {
      code: 'WOW',
      num: '08',
      name: 'Sistem Televisyen Malaysia Berhad (Wowshop)',
      subName: 'E-Commerce Live Studio Operations',
      tag: 'Home Shopping',
      headcount: 6,
      payout: 2950,
      ytdPayout: 14800,
      share: '4.1%',
      barWidth: '15.7%',
      barColor: 'bg-surface-container-highest',
      badgeColor: 'bg-surface-container-highest text-on-surface',
      offboardingCleared: '5/5 Cleared',
      paymentStatus: '100% Released',
      auditHealth: 'Pass (AAA)',
    },
    {
      code: 'NTV7',
      num: '09',
      name: 'Natseven Sdn Bhd',
      subName: 'NTV7 • Educational Content Division',
      tag: 'Educational Content',
      headcount: 4,
      payout: 1950,
      ytdPayout: 9800,
      share: '2.7%',
      barWidth: '10.5%',
      barColor: 'bg-primary/70',
      badgeColor: 'bg-primary/70 text-white',
      offboardingCleared: '3/3 Cleared',
      paymentStatus: '100% Released',
      auditHealth: 'Pass (AAA)',
    },
    {
      code: '8TV',
      num: '10',
      name: 'Metropolitan TV Sdn Bhd',
      subName: '8TV • Chinese Language Content Hub',
      tag: 'Chinese Content',
      headcount: 4,
      payout: 1950,
      ytdPayout: 9800,
      share: '2.7%',
      barWidth: '10.5%',
      barColor: 'bg-primary/70',
      badgeColor: 'bg-primary/70 text-white',
      offboardingCleared: '3/3 Cleared',
      paymentStatus: '100% Released',
      auditHealth: 'Pass (AAA)',
    },
    {
      code: 'CH9',
      num: '11',
      name: 'Ch-9 Media Sdn Bhd',
      subName: 'TV9 • Family Entertainment',
      tag: 'Family Entertainment',
      headcount: 2,
      payout: 980,
      ytdPayout: 4900,
      share: '1.4%',
      barWidth: '5.2%',
      barColor: 'bg-primary/70',
      badgeColor: 'bg-primary/70 text-white',
      offboardingCleared: '1/1 Cleared',
      paymentStatus: '100% Released',
      auditHealth: 'Pass (AAA)',
    },
  ];

  // Sorting
  const sortedEntities = [...entitiesData].sort((a, b) => {
    if (sortMode === 'spend') {
      return b.payout - a.payout;
    }
    return b.headcount - a.headcount;
  });

  // Table filtering
  const filteredAuditEntities = entitiesData.filter((e) => {
    if (!auditSearch.trim()) return true;
    const q = auditSearch.toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      e.subName.toLowerCase().includes(q) ||
      e.tag.toLowerCase().includes(q) ||
      e.code.toLowerCase().includes(q) ||
      e.auditHealth.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Interactive View State Controller & Page Header */}
      <div>
        {/* Breadcrumb & Live Sync Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-label-sm text-secondary uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-tertiary">query_stats</span>
              Executive Governance &amp; Talent Analytics
            </span>
            <span className="font-label-sm text-outline-variant">•</span>
            <span className="font-code-tabular text-[12px] text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
              PRD-F08 Compliant Data Source
            </span>
            <span className="font-label-sm text-outline-variant">•</span>
            <span className="inline-flex items-center gap-1 font-label-sm text-tertiary font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping" />
              Live Payroll Sync: 28 Aug 2026 14:30 MYT
            </span>
          </div>

          {/* Action Panel & Quick Export Suite */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={toggleTimeframe}
              className="px-3.5 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-[13px] rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer border border-surface-container-high"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">swap_horiz</span>
              <span>
                View:{' '}
                <strong className="font-semibold text-primary">
                  {isFullYearView ? 'Full Year 2026 (YTD Consolidated)' : 'August 2026 (Active Cycle)'}
                </strong>
              </span>
            </button>

            <button
              onClick={() => triggerExport('PDF')}
              className="px-3 py-1.5 bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-md text-[12px] rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 border border-surface-container-high cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">picture_as_pdf</span>
              <span className="hidden sm:inline">Export PDF</span>
            </button>

            <button
              onClick={() => triggerExport('Excel')}
              className="px-3.5 py-1.5 bg-primary-container hover:bg-primary text-white font-label-md text-[12px] rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Download Summary Report (PDF/Excel)</span>
            </button>
          </div>
        </div>

        {/* Active Filter Ribbon Bar */}
        <div className="bg-surface-container-lowest rounded-xl p-3 sm:px-4 border border-surface-container-high shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Fiscal Year Pill */}
            <div className="flex items-center gap-1.5">
              <span className="font-label-sm text-secondary uppercase text-[11px]">Fiscal Year:</span>
              <div className="flex bg-surface-container-low rounded-lg p-0.5 border border-surface-container-high">
                {['2026', '2027', '2028'].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => handleYearSelect(yr)}
                    className={`px-2.5 py-1 font-label-sm text-[11px] rounded-md transition-all cursor-pointer ${
                      activeFiscalYear === yr
                        ? 'bg-surface-container-lowest text-primary font-bold shadow-2xs'
                        : 'text-secondary hover:text-on-surface'
                    }`}
                  >
                    {yr} {yr !== '2026' ? '(Plan)' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-5 w-px bg-surface-container-highest hidden md:block" />

            {/* Month Filter Selector */}
            <div className="flex items-center gap-1.5">
              <span className="font-label-sm text-secondary uppercase text-[11px]">Month View:</span>
              <select
                value={isFullYearView ? 'ytd' : 'august'}
                onChange={(e) => {
                  if (e.target.value === 'ytd') {
                    setIsFullYearView(true);
                  } else {
                    setIsFullYearView(false);
                  }
                }}
                className="h-8 pl-2.5 pr-7 bg-surface-container-low text-on-surface font-label-md text-[12px] rounded-lg focus:outline-none cursor-pointer hover:bg-surface-container-high transition-colors border border-surface-container-high font-medium"
              >
                <option value="august">August 2026 (Current Payroll)</option>
                <option value="ytd">All Year Overall (YTD 2026)</option>
                <option value="jan">January 2026</option>
                <option value="feb">February 2026</option>
                <option value="mar">March 2026</option>
                <option value="apr">April 2026</option>
                <option value="may">May 2026</option>
                <option value="jun">June 2026</option>
                <option value="jul">July 2026</option>
                <option value="sep">September 2026 (Projected)</option>
                <option value="q4">Q4 2026 Forecast</option>
              </select>
            </div>

            <div className="h-5 w-px bg-surface-container-highest hidden md:block" />

            {/* Entity Scope Selector */}
            <div className="flex items-center gap-1.5">
              <span className="font-label-sm text-secondary uppercase text-[11px]">Entity Filter:</span>
              <select
                value={focusedEntity}
                onChange={(e) => setFocusedEntity(e.target.value)}
                className="h-8 pl-2.5 pr-7 bg-surface-container-low text-on-surface font-label-md text-[12px] rounded-lg focus:outline-none cursor-pointer hover:bg-surface-container-high transition-colors font-medium border border-surface-container-high"
              >
                <option value="ALL">All 11 Media Prima Subsidiaries</option>
                {entitiesData.map((e) => (
                  <option key={e.code} value={e.code}>
                    {e.code} - {e.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Compliance Ceiling Audit Indicator */}
          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-surface-container-high shrink-0">
            <span className="material-symbols-outlined text-[18px] text-tertiary">policy</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-on-surface font-medium leading-none text-[11px]">
                Statutory Policy Ceiling
              </span>
              <span className="font-code-tabular text-[11px] text-secondary">Max RM 500.00 / month / intern</span>
            </div>
            <span className="ml-2 font-label-sm text-[10px] bg-surface-container-lowest text-tertiary px-2 py-0.5 rounded font-semibold border border-tertiary/20">
              100% Enforced
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: Executive Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1: Headcount */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-high shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-secondary uppercase tracking-wider block text-[11px]">
                Total Active Interns
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display-lg text-[32px] text-on-surface font-bold tracking-tight">
                  {isFullYearView ? '148' : '28'}
                </span>
                <span className="font-headline-sm text-secondary font-medium text-[16px]">Interns</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center text-primary border border-surface-container-high">
              <span className="material-symbols-outlined text-[24px]">school</span>
            </div>
          </div>
          <div className="mt-4 pt-3 bg-surface-container-low/50 -mx-5 -mb-5 px-5 py-3 rounded-b-xl flex flex-col gap-1.5 border-t border-surface-container-high/40">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-on-surface-variant font-medium">
                {isFullYearView ? 'Cumulative across 11 entities' : '+12% vs previous quarter'}
              </span>
              <span className="font-code-tabular text-[12px] text-tertiary font-semibold">94% target</span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
              <div className="bg-tertiary h-full rounded-full transition-all duration-500" style={{ width: '94%' }} />
            </div>
            <span className="font-label-sm text-[11px] text-secondary">
              Context:{' '}
              <span className="font-medium text-on-surface">
                {isFullYearView ? 'YTD Consolidated 2026' : 'August 2026 (YTD Total: 148 Interns)'}
              </span>
            </span>
          </div>
        </div>

        {/* KPI 2: Allowance Disbursed */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-high shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-secondary uppercase tracking-wider block text-[11px]">
                Allowance Disbursed (MYR)
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-headline-md text-[20px] text-primary font-bold">RM</span>
                <span className="font-display-lg text-[32px] text-on-surface font-bold tracking-tight font-code-tabular">
                  {isFullYearView ? '71,450' : '13,820'}
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container border border-surface-container-high">
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </div>
          </div>
          <div className="mt-4 pt-3 bg-surface-container-low/50 -mx-5 -mb-5 px-5 py-3 rounded-b-xl flex flex-col gap-1.5 border-t border-surface-container-high/40">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-on-surface-variant">
                Avg <strong className="font-code-tabular font-medium text-on-surface">RM 493.50</strong> / intern / mo
              </span>
              <span className="font-label-sm text-[10px] bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded font-medium">
                100% compliant
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-secondary">
              <span className="material-symbols-outlined text-[14px] text-tertiary">check_circle</span>
              <span className="font-label-sm text-[11px]">
                {isFullYearView ? 'YTD Cap: RM 110,250' : 'Within Q3 Budget Allocation (RM 85,000)'}
              </span>
            </div>
            <span className="font-label-sm text-[11px] text-secondary">
              Context:{' '}
              <span className="font-medium text-on-surface">
                {isFullYearView ? 'YTD Aggregate Disbursed' : 'August 2026 (YTD: RM 71,450)'}
              </span>
            </span>
          </div>
        </div>

        {/* KPI 3: Offboarding Clearance */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-high shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-secondary uppercase tracking-wider block text-[11px]">
                Offboarding Clearance Rate
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display-lg text-[32px] text-on-surface font-bold tracking-tight">
                  96.4%
                </span>
                <span className="font-label-md text-tertiary font-semibold text-[13px]">Audit Ready</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center text-tertiary border border-surface-container-high">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
          </div>
          <div className="mt-4 pt-3 bg-surface-container-low/50 -mx-5 -mb-5 px-5 py-3 rounded-b-xl flex flex-col gap-1.5 border-t border-surface-container-high/40">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-on-surface">
                <span className="font-code-tabular font-semibold">107</span> of 111 docs submitted
              </span>
              <span className="font-label-sm text-[10px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded font-semibold">
                4 Pending
              </span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary-container h-full rounded-full" style={{ width: '96.4%' }} />
            </div>
            <span className="font-label-sm text-[11px] text-secondary">
              Strict HR SLA: Final allowance released upon 100% sign-off.
            </span>
          </div>
        </div>

        {/* KPI 4: Top Talent Absorber */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-high shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-sm text-secondary uppercase tracking-wider block text-[11px]">
                Top Talent Absorber
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-headline-lg text-[22px] text-on-surface font-bold">TV3 (STMB)</span>
                <span className="font-headline-sm text-primary font-bold text-[16px]">34%</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary border border-surface-container-high">
              <span className="material-symbols-outlined text-[24px]">corporate_fare</span>
            </div>
          </div>
          <div className="mt-4 pt-3 bg-surface-container-low/50 -mx-5 -mb-5 px-5 py-3 rounded-b-xl flex flex-col gap-1.5 border-t border-surface-container-high/40">
            <span className="text-[12px] text-on-surface-variant font-medium">
              Followed by REV Media (22%) and NSTP (18%)
            </span>
            <div className="flex items-center gap-1 w-full mt-1">
              <div className="h-2 bg-primary rounded-l-sm" style={{ width: '34%' }} title="TV3: 34%" />
              <div className="h-2 bg-tertiary" style={{ width: '22%' }} title="REV Media: 22%" />
              <div className="h-2 bg-secondary" style={{ width: '18%' }} title="NSTP: 18%" />
              <div className="h-2 bg-surface-container-highest rounded-r-sm" style={{ width: '26%' }} title="Other 8 entities: 26%" />
            </div>
            <span className="font-label-sm text-[11px] text-secondary flex justify-between items-center">
              <span>Broadcast &amp; News hub dominance</span>
              <span className="font-code-tabular font-medium text-on-surface">11 Subsidiaries</span>
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: Visual Breakdown & Chart Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Chart 1: Monthly Allowance Payout Trends (2026) - 8 Cols */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-5 rounded-xl border border-surface-container-high shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <h2 className="font-headline-md text-[18px] text-on-surface font-semibold tracking-tight">
                  Monthly Allowance Payout Trends (2026)
                </h2>
              </div>
              <p className="text-[12px] text-secondary mt-0.5">
                Disbursement actuals (Jan–Aug 2026) vs Approved Group Forecast (Sep–Dec 2026) in MYR
              </p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-primary" />
                <span className="font-label-sm text-secondary text-[11px]">Actual Disbursed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-surface-container-highest" />
                <span className="font-label-sm text-secondary text-[11px]">Q4 Budget Cap</span>
              </div>
            </div>
          </div>

          {/* Inline Trend Chart */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[620px] h-64 relative flex flex-col justify-end pt-4 pb-2">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 text-secondary font-code-tabular text-[10px]">
                <div className="flex items-center justify-between border-b border-surface-container-high/60 w-full">
                  <span>RM 18,000</span>
                  <span className="text-right">Max Cap Limit</span>
                </div>
                <div className="flex items-center justify-between border-b border-surface-container-high/60 w-full">
                  <span>RM 13,500</span>
                  <span />
                </div>
                <div className="flex items-center justify-between border-b border-surface-container-high/60 w-full">
                  <span>RM 9,000</span>
                  <span />
                </div>
                <div className="flex items-center justify-between border-b border-surface-container-high/60 w-full">
                  <span>RM 4,500</span>
                  <span />
                </div>
                <div className="flex items-center justify-between border-b border-surface-container-high/60 w-full">
                  <span>RM 0</span>
                  <span />
                </div>
              </div>

              {/* Month Bars */}
              <div className="relative z-10 grid grid-cols-12 gap-2 h-48 items-end px-4">
                {[
                  { m: 'Jan', h: '48%', val: 'RM 8,400', count: '17 Interns', isPeak: false, isFcst: false },
                  { m: 'Feb', h: '52%', val: 'RM 9,150', count: '19 Interns', isPeak: false, isFcst: false },
                  { m: 'Mar', h: '44%', val: 'RM 7,800', count: '16 Interns', isPeak: false, isFcst: false },
                  { m: 'Apr', h: '49%', val: 'RM 8,700', count: '18 Interns', isPeak: false, isFcst: false },
                  { m: 'May', h: '56%', val: 'RM 9,980', count: '21 Interns', isPeak: false, isFcst: false },
                  { m: 'Jun', h: '64%', val: 'RM 11,400', count: '24 Interns', isPeak: false, isFcst: false },
                  { m: 'Jul', h: '66%', val: 'RM 11,800', count: '24 Interns', isPeak: false, isFcst: false },
                  { m: 'Aug*', h: '78%', val: 'RM 13,820', count: '28 Interns (Peak)', isPeak: true, isFcst: false },
                  { m: 'Sep', h: '70%', val: 'RM 12,500', count: '26 Interns Est.', isPeak: false, isFcst: true },
                  { m: 'Oct', h: '60%', val: 'RM 10,800', count: '22 Interns Est.', isPeak: false, isFcst: true },
                  { m: 'Nov', h: '48%', val: 'RM 8,600', count: '18 Interns Est.', isPeak: false, isFcst: true },
                  { m: 'Dec', h: '38%', val: 'RM 6,900', count: '14 Interns Est.', isPeak: false, isFcst: true },
                ].map((bar) => (
                  <div key={bar.m} className="group relative flex flex-col items-center h-full justify-end">
                    <div
                      className={`w-full rounded-t-sm transition-all duration-300 relative ${
                        bar.isPeak
                          ? 'bg-primary shadow-sm'
                          : bar.isFcst
                          ? 'bg-surface-container-highest hover:bg-surface-dim'
                          : 'bg-primary/80 hover:bg-primary'
                      }`}
                      style={{ height: bar.h }}
                    >
                      {bar.isPeak && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary" />
                      )}

                      {/* Tooltip */}
                      <div
                        className={`transition-all duration-200 absolute -top-14 left-1/2 -translate-x-1/2 px-2 py-1 rounded shadow-md text-center z-20 whitespace-nowrap pointer-events-none ${
                          bar.isPeak
                            ? 'bg-primary text-white scale-100 opacity-100'
                            : 'opacity-0 group-hover:opacity-100 bg-inverse-surface text-inverse-on-surface'
                        }`}
                      >
                        <div className="font-code-tabular text-[12px] font-bold">{bar.val}</div>
                        <div className="font-label-sm text-[10px]">{bar.count}</div>
                      </div>
                    </div>
                    <span
                      className={`font-code-tabular text-[12px] mt-2 ${
                        bar.isPeak ? 'text-primary font-bold' : 'text-secondary'
                      }`}
                    >
                      {bar.m}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Indicator */}
          <div className="mt-4 pt-2 bg-surface-container-low px-4 py-2 rounded-lg border border-surface-container-high flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-tertiary">analytics</span>
              <span className="font-label-sm text-[12px] text-secondary">
                Actual YTD Spend: <strong className="font-code-tabular text-on-surface">RM 71,450.00</strong> | Projected Total FY2026:{' '}
                <strong className="font-code-tabular text-on-surface">RM 110,250.00</strong>
              </span>
            </div>
            <span className="font-code-tabular text-[11px] text-secondary font-medium">
              Group Audit Variance: ±0.00%
            </span>
          </div>
        </div>

        {/* Chart 2: Department Allocation Breakdown - 4 Cols */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-5 rounded-xl border border-surface-container-high shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                <h2 className="font-headline-md text-[18px] text-on-surface font-semibold tracking-tight">
                  Department Distribution
                </h2>
              </div>
              <span className="font-label-sm text-secondary font-code-tabular text-[11px]">6 Divisions</span>
            </div>
            <p className="text-[12px] text-secondary mb-3">
              Intern resource allocation across key operating functional units.
            </p>

            {/* SVG Donut Chart */}
            <div className="flex items-center justify-center my-2 relative">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-surface-container-high"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="38"
                  stroke="currentColor"
                  strokeWidth="14"
                />
                {/* Segments */}
                <circle
                  className="text-primary"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="38"
                  stroke="currentColor"
                  strokeDasharray="76.4 162.3"
                  strokeDashoffset="0"
                  strokeWidth="14"
                />
                <circle
                  className="text-tertiary"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="38"
                  stroke="currentColor"
                  strokeDasharray="57.3 181.4"
                  strokeDashoffset="-76.4"
                  strokeWidth="14"
                />
                <circle
                  className="text-secondary"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="38"
                  stroke="currentColor"
                  strokeDasharray="47.7 191.0"
                  strokeDashoffset="-133.7"
                  strokeWidth="14"
                />
                <circle
                  className="text-tertiary-container"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="38"
                  stroke="currentColor"
                  strokeDasharray="28.6 210.1"
                  strokeDashoffset="-181.4"
                  strokeWidth="14"
                />
                <circle
                  className="text-primary-container"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="38"
                  stroke="currentColor"
                  strokeDasharray="16.7 222.0"
                  strokeDashoffset="-210.0"
                  strokeWidth="14"
                />
                <circle
                  className="text-surface-tint"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="38"
                  stroke="currentColor"
                  strokeDasharray="11.9 226.8"
                  strokeDashoffset="-226.7"
                  strokeWidth="14"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-display-lg text-[24px] font-bold text-on-surface">148</span>
                <span className="font-label-sm text-[10px] text-secondary uppercase tracking-wider">
                  YTD Total Interns
                </span>
              </div>
            </div>

            {/* Division Breakdown List */}
            <div className="space-y-1.5 mt-3 text-[13px]">
              {[
                { name: 'Creative Content & Production', count: '47 (32%)', color: 'bg-primary' },
                { name: 'Group Digital & Tech (REV)', count: '36 (24%)', color: 'bg-tertiary' },
                { name: 'News & Current Affairs (NSTP/TV3)', count: '30 (20%)', color: 'bg-secondary' },
                { name: 'Sales & Omnia Commercial', count: '18 (12%)', color: 'bg-tertiary-container' },
                { name: 'Corporate People & Culture', count: '10 (7%)', color: 'bg-primary-container' },
                { name: 'Broadcast Engineering', count: '7 (5%)', color: 'bg-surface-tint' },
              ].map((d) => (
                <div
                  key={d.name}
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container-low transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-sm ${d.color}`} />
                    <span className="font-label-md text-[12px] text-on-surface">{d.name}</span>
                  </div>
                  <span className="font-code-tabular text-[12px] text-secondary font-medium">{d.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-surface-container-high/60 text-center">
            <span className="font-label-sm text-[11px] text-secondary">
              Cross-divisional mobility rate: <strong>14.2%</strong>
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 4: Headcount & Payout Distribution by Media Prima Entity */}
      <div className="bg-surface-container-lowest p-5 rounded-xl border border-surface-container-high shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
              <h2 className="font-headline-md text-[18px] text-on-surface font-semibold tracking-tight">
                Headcount &amp; Payout Distribution Across All 11 Media Prima Entities
              </h2>
            </div>
            <p className="text-[12px] text-secondary mt-0.5">
              Complete ranking of trainee allocation, monthly payroll liability, and total disbursed allowance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-[11px] text-secondary">Sort:</span>
            <button
              onClick={() => setSortMode('headcount')}
              className={`px-2.5 py-1 font-label-sm text-[11px] rounded transition-all cursor-pointer ${
                sortMode === 'headcount'
                  ? 'bg-surface-container-low text-on-surface font-bold border border-surface-container-high'
                  : 'bg-surface-container-lowest text-secondary hover:text-on-surface'
              }`}
            >
              By Headcount
            </button>
            <button
              onClick={() => setSortMode('spend')}
              className={`px-2.5 py-1 font-label-sm text-[11px] rounded transition-all cursor-pointer ${
                sortMode === 'spend'
                  ? 'bg-surface-container-low text-on-surface font-bold border border-surface-container-high'
                  : 'bg-surface-container-lowest text-secondary hover:text-on-surface'
              }`}
            >
              By Spend (MYR)
            </button>
          </div>
        </div>

        {/* 11 Entity Rows */}
        <div className="space-y-3">
          {sortedEntities.slice(0, 8).map((entity) => {
            const isDimmed = focusedEntity !== 'ALL' && focusedEntity !== entity.code;
            return (
              <div
                key={entity.code}
                className={`p-2.5 rounded-lg hover:bg-surface-container-low transition-all duration-200 border border-transparent hover:border-surface-container-high ${
                  isDimmed ? 'opacity-35' : 'opacity-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`w-6 h-6 rounded font-code-tabular text-[11px] flex items-center justify-center font-bold ${entity.badgeColor}`}
                    >
                      {entity.num}
                    </span>
                    <span className="font-label-lg text-[13px] text-on-surface font-semibold">
                      {entity.name}
                    </span>
                    <span className="font-label-sm text-[11px] bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded">
                      {entity.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-code-tabular text-[13px] text-on-surface font-semibold">
                      {entity.headcount} Interns
                    </span>
                    <span className="font-code-tabular text-[13px] text-primary font-bold">
                      RM {entity.payout.toLocaleString('en-MY')}
                    </span>
                    <span className="font-label-sm text-[11px] text-secondary font-code-tabular">
                      {entity.share}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${entity.barColor} h-full rounded-full transition-all duration-700`}
                    style={{ width: entity.barWidth }}
                  />
                </div>
              </div>
            );
          })}

          {/* Remaining 3 entities compressed in 3-column subgrid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {sortedEntities.slice(8).map((entity) => {
              const isDimmed = focusedEntity !== 'ALL' && focusedEntity !== entity.code;
              return (
                <div
                  key={entity.code}
                  className={`p-3 rounded-lg bg-surface-container-low border border-surface-container-high flex flex-col justify-between transition-all duration-200 ${
                    isDimmed ? 'opacity-35' : 'opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-label-md text-[12px] text-on-surface font-semibold truncate">
                      {entity.name}
                    </span>
                    <span className="font-code-tabular text-[12px] text-primary font-bold">
                      RM {entity.payout.toLocaleString('en-MY')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-label-sm text-[11px] text-secondary">
                    <span>{entity.headcount} Interns</span>
                    <span>{entity.share}</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-primary/70 h-full rounded-full" style={{ width: entity.barWidth }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 5: Detailed Subsidiary Financial Compliance & Audit Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-xs overflow-hidden">
        {/* Table Header & Search */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container-high/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">account_balance</span>
              <h2 className="font-headline-md text-[18px] text-on-surface font-semibold tracking-tight">
                Subsidiary Financial Compliance &amp; Audit Roster
              </h2>
            </div>
            <p className="text-[12px] text-secondary mt-0.5">
              Operational sign-offs, active disbursements, bank account verifications, and HR offboarding compliance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Filter subsidiary or status..."
                className="h-8 pl-8 pr-3 bg-surface-container-low rounded-lg font-label-md text-[12px] text-on-surface focus:outline-none focus:bg-surface-container-high transition-colors w-56 sm:w-64 border border-surface-container-high"
              />
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[16px] text-secondary">
                search
              </span>
            </div>
            {auditSearch && (
              <button
                onClick={() => setAuditSearch('')}
                className="h-8 px-2.5 bg-surface-container-low hover:bg-surface-container-high text-secondary rounded-lg font-label-sm text-[11px] transition-colors border border-surface-container-high cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="h-10 bg-surface-container-low text-secondary font-label-sm text-[11px] uppercase tracking-wider border-b border-surface-container-high">
                <th className="px-4 py-2 font-semibold">Media Prima Operating Entity</th>
                <th className="px-4 py-2 font-semibold text-center">Active Interns</th>
                <th className="px-4 py-2 font-semibold text-center">Offboarding Status</th>
                <th className="px-4 py-2 font-semibold text-right">Active Month Payout</th>
                <th className="px-4 py-2 font-semibold text-right">YTD Total Disbursed</th>
                <th className="px-4 py-2 font-semibold text-center">Payment Release Status</th>
                <th className="px-4 py-2 font-semibold text-center">Audit Health</th>
                <th className="px-4 py-2 font-semibold text-right">Operational Drilldown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/40 text-[13px]">
              {filteredAuditEntities.map((entity) => (
                <tr key={entity.code} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${entity.barColor}`} />
                      <div className="flex flex-col">
                        <span className="font-label-lg text-[13px] text-on-surface font-semibold">
                          {entity.name}
                        </span>
                        <span className="font-label-sm text-[11px] text-secondary">
                          {entity.subName}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-center font-code-tabular font-medium text-on-surface">
                    {entity.headcount}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className="inline-flex items-center gap-1 font-label-sm text-[11px] bg-surface-container-high text-on-surface px-2 py-0.5 rounded-full font-medium">
                      <span className="material-symbols-outlined text-[13px] text-tertiary">check_circle</span>
                      {entity.offboardingCleared}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-code-tabular font-semibold text-on-surface">
                    RM {entity.payout.toLocaleString('en-MY')}.00
                  </td>
                  <td className="px-4 py-2.5 text-right font-code-tabular text-secondary">
                    RM {entity.ytdPayout.toLocaleString('en-MY')}.00
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-[11px] bg-surface-container text-tertiary font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                      {entity.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded font-label-sm text-[11px] bg-surface-container-lowest text-tertiary font-bold shadow-2xs border border-surface-container-high">
                      {entity.auditHealth}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => onDrilldownToSheet(entity.code as CompanyEntityCode)}
                      className="inline-flex items-center gap-1 text-primary hover:text-on-surface-variant font-label-sm text-[12px] font-semibold transition-colors cursor-pointer"
                    >
                      <span>View Sheet</span>
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Aggregate Summary Footer */}
        <div className="p-4 bg-surface-container-low border-t border-surface-container-high flex flex-col md:flex-row items-center justify-between gap-3 font-label-md text-[12px]">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <span className="text-secondary font-medium">Consolidated Audit Totals (11 Entities):</span>
            <span className="text-on-surface">
              Headcount: <strong className="font-code-tabular font-semibold">148 Active Interns</strong>
            </span>
            <span className="text-on-surface">
              Total Payout: <strong className="font-code-tabular font-semibold text-primary">RM 71,450.00</strong>
            </span>
            <span className="text-on-surface">
              Offboarding Compliance:{' '}
              <strong className="font-code-tabular font-semibold text-tertiary">96.4% Verified</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-secondary font-code-tabular text-[11px]">
            <span className="material-symbols-outlined text-[16px] text-tertiary">lock</span>
            <span>Maybank Corporate Autopay Hash Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
