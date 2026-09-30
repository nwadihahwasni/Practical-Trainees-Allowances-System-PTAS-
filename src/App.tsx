import React, { useState, useEffect } from 'react';
import { CompanyEntityCode, Intern } from './types';
import {
  INITIAL_INTERNS,
  DEFAULT_DEPARTMENTS,
  DEFAULT_BANKS,
} from './data/initialData';
import { Header } from './components/Header';
import { InternshipManagementPage } from './components/InternshipManagement/InternshipManagementPage';
import { ExecutiveAnalyticsDashboard } from './components/Analytics/ExecutiveAnalyticsDashboard';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { AddInternModal } from './components/Modals/AddInternModal';
import { ManageDeptsBanksModal } from './components/Modals/ManageDeptsBanksModal';
import { SendReminderModal } from './components/Modals/SendReminderModal';
import { RemarksModal } from './components/Modals/RemarksModal';
import { HelpModal } from './components/Modals/HelpModal';

const STORAGE_KEY_INTERNS = 'mediaprima_ptas_interns_v1';
const STORAGE_KEY_DEPTS = 'mediaprima_ptas_depts_v1';
const STORAGE_KEY_BANKS = 'mediaprima_ptas_banks_v1';

export default function App() {
  // Navigation & Scope State
  const [activeMainTab, setActiveMainTab] = useState<'management' | 'analytics'>('management');
  const [selectedEntity, setSelectedEntity] = useState<CompanyEntityCode>('ALL');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(8); // August 2026 active cycle

  // Data persistence in LocalStorage (PRD In-Scope & Implementation Stage 1)
  const [interns, setInterns] = useState<Intern[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INTERNS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load interns from storage', e);
    }
    return INITIAL_INTERNS;
  });

  const [departments, setDepartments] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DEPTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load departments from storage', e);
    }
    return DEFAULT_DEPARTMENTS;
  });

  const [banks, setBanks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BANKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load banks from storage', e);
    }
    return DEFAULT_BANKS;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INTERNS, JSON.stringify(interns));
    } catch (e) {
      console.error('Failed to save interns', e);
    }
  }, [interns]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DEPTS, JSON.stringify(departments));
    } catch (e) {
      console.error('Failed to save departments', e);
    }
  }, [departments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BANKS, JSON.stringify(banks));
    } catch (e) {
      console.error('Failed to save banks', e);
    }
  }, [banks]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingIntern, setEditingIntern] = useState<Intern | null>(null);
  const [isManageDeptsBanksOpen, setIsManageDeptsBanksOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [remarksIntern, setRemarksIntern] = useState<Intern | null>(null);
  const [reminderIntern, setReminderIntern] = useState<Intern | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; icon?: string } | null>(null);

  const showToast = (message: string, icon?: string) => {
    setToast({ message, icon });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // CRUD Handlers
  const handleSaveIntern = (savedIntern: Intern) => {
    setInterns((prev) => {
      const index = prev.findIndex((i) => i.id === savedIntern.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = savedIntern;
        return next;
      }
      return [savedIntern, ...prev];
    });
  };

  const handleUpdateIntern = (updated: Intern) => {
    setInterns((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleDeleteIntern = (id: string) => {
    setInterns((prev) => prev.filter((i) => i.id !== id));
  };

  const handleOpenEdit = (intern: Intern) => {
    setEditingIntern(intern);
    setIsAddModalOpen(true);
  };

  const handleDrilldownToSheet = (entityCode: CompanyEntityCode) => {
    setSelectedEntity(entityCode);
    setActiveMainTab('management');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Focused on ${entityCode} payroll allowance sheet`, 'open_in_new');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
      {/* Primary Corporate Navigation Bar */}
      <Header
        activeMainTab={activeMainTab}
        setActiveMainTab={setActiveMainTab}
        selectedEntity={selectedEntity}
        setSelectedEntity={setSelectedEntity}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 w-full px-gutter-desktop py-6">
        <div className="max-w-[1600px] mx-auto">
          {activeMainTab === 'management' ? (
            <InternshipManagementPage
              interns={interns}
              onUpdateIntern={handleUpdateIntern}
              onDeleteIntern={handleDeleteIntern}
              onOpenAddModal={() => {
                setEditingIntern(null);
                setIsAddModalOpen(true);
              }}
              onEditIntern={handleOpenEdit}
              onOpenManageDeptsBanks={() => setIsManageDeptsBanksOpen(true)}
              onOpenRemarks={(intern) => setRemarksIntern(intern)}
              onOpenSendReminder={(intern) => setReminderIntern(intern)}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedEntity={selectedEntity}
              setSelectedEntity={setSelectedEntity}
              showToast={showToast}
            />
          ) : (
            <ExecutiveAnalyticsDashboard
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedEntity={selectedEntity}
              setSelectedEntity={setSelectedEntity}
              onDrilldownToSheet={handleDrilldownToSheet}
              showToast={showToast}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer onOpenHelp={() => setIsHelpOpen(true)} />

      {/* Modals & Drawers */}
      <AddInternModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingIntern(null);
        }}
        onSave={handleSaveIntern}
        existingIntern={editingIntern}
        departments={departments}
        banks={banks}
        showToast={showToast}
      />

      <ManageDeptsBanksModal
        isOpen={isManageDeptsBanksOpen}
        onClose={() => setIsManageDeptsBanksOpen(false)}
        departments={departments}
        setDepartments={setDepartments}
        banks={banks}
        setBanks={setBanks}
        showToast={showToast}
      />

      <SendReminderModal
        isOpen={!!reminderIntern}
        onClose={() => setReminderIntern(null)}
        intern={reminderIntern}
        showToast={showToast}
      />

      <RemarksModal
        isOpen={!!remarksIntern}
        onClose={() => setRemarksIntern(null)}
        intern={remarksIntern}
        onSave={handleUpdateIntern}
        showToast={showToast}
      />

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Floating Operational Toast */}
      <Toast toast={toast} />
    </div>
  );
}
