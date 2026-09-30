import React, { useState, useEffect } from 'react';
import { CompanyEntityCode, Intern, CloudLink } from './types';
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
import { CloudLinksModal } from './components/Modals/CloudLinksModal';
import { ChangePasswordModal } from './components/Modals/ChangePasswordModal';
import { SignOutModal } from './components/Modals/SignOutModal';
import { LoginPage } from './components/Auth/LoginPage';
import {
  ensureAuth,
  testConnection,
  subscribeToInterns,
  saveInternToFirestore,
  deleteInternFromFirestore,
  subscribeToDepartments,
  saveDepartmentsToFirestore,
  subscribeToBanks,
  saveBanksToFirestore,
  subscribeToLinks,
  saveLinkToFirestore,
  deleteLinkFromFirestore,
  getHRAuthSession,
  logoutHR,
  INITIAL_CLOUD_LINKS,
} from './firebase';

export default function App() {
  // Navigation & Scope State
  const [activeMainTab, setActiveMainTab] = useState<'management' | 'analytics'>('management');
  const [selectedEntity, setSelectedEntity] = useState<CompanyEntityCode>('ALL');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(8); // August 2026 active cycle

  // Real-time Firestore state with initial data fallback
  const [interns, setInterns] = useState<Intern[]>(INITIAL_INTERNS);
  const [departments, setDepartments] = useState<string[]>(DEFAULT_DEPARTMENTS);
  const [banks, setBanks] = useState<string[]>(DEFAULT_BANKS);
  const [links, setLinks] = useState<CloudLink[]>(INITIAL_CLOUD_LINKS);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);

  // Initialize Firebase Auth & Real-Time Firestore listeners
  useEffect(() => {
    let unsubInterns: (() => void) | undefined;
    let unsubDepts: (() => void) | undefined;
    let unsubBanks: (() => void) | undefined;
    let unsubLinks: (() => void) | undefined;

    async function initFirebase() {
      try {
        await ensureAuth();
        await testConnection();
        setIsCloudConnected(true);

        unsubInterns = subscribeToInterns((data) => {
          setInterns(data);
        });

        unsubDepts = subscribeToDepartments((depts) => {
          setDepartments(depts);
        });

        unsubBanks = subscribeToBanks((b) => {
          setBanks(b);
        });

        unsubLinks = subscribeToLinks((cloudLinks) => {
          setLinks(cloudLinks);
        });
      } catch (err) {
        console.warn('Firebase sync initialized in local-first mode:', err);
      }
    }

    initFirebase();

    return () => {
      if (unsubInterns) unsubInterns();
      if (unsubDepts) unsubDepts();
      if (unsubBanks) unsubBanks();
      if (unsubLinks) unsubLinks();
    };
  }, []);

  // Authentication state for exclusive HR Internship user
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getHRAuthSession());
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingIntern, setEditingIntern] = useState<Intern | null>(null);
  const [isManageDeptsBanksOpen, setIsManageDeptsBanksOpen] = useState(false);
  const [isCloudLinksModalOpen, setIsCloudLinksModalOpen] = useState(false);
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

  const handleLogout = () => {
    setIsSignOutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    setIsSignOutModalOpen(false);
    await logoutHR();
    setIsAuthenticated(false);
    showToast('Signed out successfully. Session terminated.', 'logout');
  };

  // CRUD Handlers with Firestore Persistence
  const handleSaveIntern = async (savedIntern: Intern) => {
    // Optimistic UI update
    setInterns((prev) => {
      const index = prev.findIndex((i) => i.id === savedIntern.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = savedIntern;
        return next;
      }
      return [savedIntern, ...prev];
    });

    try {
      await saveInternToFirestore(savedIntern);
    } catch (e) {
      console.error('Firestore save intern error:', e);
    }
  };

  const handleUpdateIntern = async (updated: Intern) => {
    // Optimistic update
    setInterns((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    try {
      await saveInternToFirestore(updated);
    } catch (e) {
      console.error('Firestore update intern error:', e);
    }
  };

  const handleDeleteIntern = async (id: string) => {
    // Optimistic delete
    setInterns((prev) => prev.filter((i) => i.id !== id));
    try {
      await deleteInternFromFirestore(id);
    } catch (e) {
      console.error('Firestore delete intern error:', e);
    }
  };

  const handleUpdateDepartments = async (newDepts: string[]) => {
    setDepartments(newDepts);
    try {
      await saveDepartmentsToFirestore(newDepts);
    } catch (e) {
      console.error('Firestore update departments error:', e);
    }
  };

  const handleUpdateBanks = async (newBanks: string[]) => {
    setBanks(newBanks);
    try {
      await saveBanksToFirestore(newBanks);
    } catch (e) {
      console.error('Firestore update banks error:', e);
    }
  };

  const handleSaveLink = async (newLink: CloudLink) => {
    setLinks((prev) => [newLink, ...prev.filter((l) => l.id !== newLink.id)]);
    try {
      await saveLinkToFirestore(newLink);
    } catch (e) {
      console.error('Firestore save link error:', e);
    }
  };

  const handleDeleteLink = async (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    try {
      await deleteLinkFromFirestore(id);
    } catch (e) {
      console.error('Firestore delete link error:', e);
    }
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-container-low">
        <LoginPage
          onLoginSuccess={() => setIsAuthenticated(true)}
          showToast={showToast}
        />
        <Toast toast={toast} />
      </div>
    );
  }

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
        onOpenCloudLinks={() => setIsCloudLinksModalOpen(true)}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
        onLogout={handleLogout}
        cloudLinksCount={links.length}
        isCloudConnected={isCloudConnected}
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
              onSavePayrollLinkToFirebase={handleSaveLink}
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
        setDepartments={handleUpdateDepartments}
        banks={banks}
        setBanks={handleUpdateBanks}
        showToast={showToast}
      />

      <CloudLinksModal
        isOpen={isCloudLinksModalOpen}
        onClose={() => setIsCloudLinksModalOpen(false)}
        links={links}
        onSaveLink={handleSaveLink}
        onDeleteLink={handleDeleteLink}
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

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        showToast={showToast}
      />

      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />

      {/* Floating Operational Toast */}
      <Toast toast={toast} />
    </div>
  );
}


