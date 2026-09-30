import React, { useState } from 'react';

interface ManageDeptsBanksModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: string[];
  setDepartments: (depts: string[]) => void;
  banks: string[];
  setBanks: (banks: string[]) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const ManageDeptsBanksModal: React.FC<ManageDeptsBanksModalProps> = ({
  isOpen,
  onClose,
  departments,
  setDepartments,
  banks,
  setBanks,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'depts' | 'banks'>('depts');
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  if (!isOpen) return null;

  const currentList = activeTab === 'depts' ? departments : banks;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newItem.trim();
    if (!val) return;

    if (activeTab === 'depts') {
      if (departments.includes(val)) {
        showToast('Department already exists', 'warning');
        return;
      }
      const updated = [...departments, val];
      setDepartments(updated);
      showToast(`Added new department: "${val}"`, 'add_circle');
    } else {
      if (banks.includes(val)) {
        showToast('Bank already exists', 'warning');
        return;
      }
      const updated = [...banks, val];
      setBanks(updated);
      showToast(`Added new bank: "${val}"`, 'add_circle');
    }
    setNewItem('');
  };

  const handleStartEdit = (index: number, val: string) => {
    setEditingIndex(index);
    setEditValue(val);
  };

  const handleSaveEdit = (index: number) => {
    const val = editValue.trim();
    if (!val) return;

    if (activeTab === 'depts') {
      const updated = [...departments];
      updated[index] = val;
      setDepartments(updated);
      showToast(`Updated department name to "${val}"`, 'edit');
    } else {
      const updated = [...banks];
      updated[index] = val;
      setBanks(updated);
      showToast(`Updated bank name to "${val}"`, 'edit');
    }
    setEditingIndex(null);
  };

  const handleDelete = (index: number, name: string) => {
    if (currentList.length <= 1) {
      showToast('At least one choice must remain', 'error');
      return;
    }
    if (window.confirm(`Remove "${name}" from options?`)) {
      if (activeTab === 'depts') {
        const updated = departments.filter((_, i) => i !== index);
        setDepartments(updated);
        showToast(`Removed department "${name}"`, 'delete');
      } else {
        const updated = banks.filter((_, i) => i !== index);
        setBanks(updated);
        showToast(`Removed bank "${name}"`, 'delete');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-container text-on-surface flex items-center justify-center font-bold border border-surface-container-high">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-[16px] text-on-surface font-semibold">
                Manage Departments &amp; Banks
              </h3>
              <p className="font-label-sm text-[11px] text-secondary">
                F02 Dynamic Dropdown Management • Updates Globally Across All Forms
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

        {/* Tab Switcher */}
        <div className="p-3 bg-surface-container-low/60 border-b border-surface-container-high flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('depts');
              setEditingIndex(null);
            }}
            className={`flex-1 py-1.5 rounded-lg font-label-md text-[13px] font-semibold transition-all cursor-pointer ${
              activeTab === 'depts'
                ? 'bg-surface-container-lowest text-primary shadow-xs border border-surface-container-high'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Departments ({departments.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('banks');
              setEditingIndex(null);
            }}
            className={`flex-1 py-1.5 rounded-lg font-label-md text-[13px] font-semibold transition-all cursor-pointer ${
              activeTab === 'banks'
                ? 'bg-surface-container-lowest text-primary shadow-xs border border-surface-container-high'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Banks ({banks.length})
          </button>
        </div>

        {/* Add New Input */}
        <div className="p-4 border-b border-surface-container-high bg-surface-container-lowest">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={
                activeTab === 'depts' ? 'Add new department name...' : 'Add new banking institution name...'
              }
              className="flex-1 h-9 px-3 bg-surface-container-low rounded-lg font-label-md text-[13px] text-on-surface focus:outline-none focus:bg-surface-container-high border border-surface-container-high"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-primary-container hover:bg-primary text-white font-label-md text-[12px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-semibold shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Items List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          {currentList.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container-high flex items-center justify-between gap-2 hover:bg-surface-container-high/60 transition-colors"
            >
              {editingIndex === idx ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 h-8 px-2 bg-surface-container-lowest rounded font-label-md text-[13px] border border-surface-container-high"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit(idx)}
                    className="p-1 rounded text-emerald-700 hover:bg-emerald-100"
                    title="Save"
                  >
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  </button>
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="p-1 rounded text-secondary hover:bg-surface-container"
                    title="Cancel"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      {activeTab === 'depts' ? 'corporate_fare' : 'account_balance'}
                    </span>
                    <span className="font-label-md text-[13px] text-on-surface font-medium">
                      {item}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(idx, item)}
                      className="p-1 rounded text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(idx, item)}
                      className="p-1 rounded text-secondary hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-surface-container-low border-t border-surface-container-high flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-[13px] rounded-lg border border-surface-container-high cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
