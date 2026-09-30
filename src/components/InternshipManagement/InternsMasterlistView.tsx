import React, { useState } from 'react';
import { CompanyEntityCode, Intern } from '../../types';
import { formatDateDisplay, formatICDisplay } from '../../utils/validation';

interface InternsMasterlistViewProps {
  interns: Intern[];
  selectedEntity: CompanyEntityCode;
  onOpenAddModal: () => void;
  onEditIntern: (intern: Intern) => void;
  onDeleteIntern: (id: string) => void;
  onOpenRemarks: (intern: Intern) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const InternsMasterlistView: React.FC<InternsMasterlistViewProps> = ({
  interns,
  selectedEntity,
  onOpenAddModal,
  onEditIntern,
  onDeleteIntern,
  onOpenRemarks,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = interns.filter((intern) => {
    if (selectedEntity !== 'ALL' && intern.companyCode !== selectedEntity) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      intern.fullName.toLowerCase().includes(q) ||
      intern.icNumber.includes(q) ||
      intern.email.toLowerCase().includes(q) ||
      intern.department.toLowerCase().includes(q) ||
      intern.companyName.toLowerCase().includes(q) ||
      intern.bankName.toLowerCase().includes(q) ||
      intern.bankAccountNumber.includes(q)
    );
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove trainee record for ${name}?`)) {
      onDeleteIntern(id);
      showToast(`Trainee record for ${name} deleted`, 'delete');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high shadow-xs">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by intern name, IC number, department, bank..."
              className="w-full h-9 pl-9 pr-3 bg-surface-container-low rounded-lg font-label-md text-[13px] text-on-surface focus:outline-none focus:bg-surface-container-high transition-colors border border-surface-container-high"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-secondary">
              search
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-secondary text-xs">
            Showing <strong className="text-on-surface">{filtered.length}</strong> of {interns.length} interns
          </span>
          <button
            onClick={onOpenAddModal}
            className="px-3.5 py-2 bg-primary-container hover:bg-primary text-white font-label-md text-[12px] rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>+ Add New Intern</span>
          </button>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-xs overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="h-10 bg-surface-container-low text-secondary font-label-sm text-[11px] uppercase tracking-wider border-b border-surface-container-high">
                <th className="px-4 py-2 font-semibold">Trainee Profile</th>
                <th className="px-4 py-2 font-semibold">Company &amp; Division</th>
                <th className="px-4 py-2 font-semibold">Contact &amp; Address</th>
                <th className="px-3 py-2 font-semibold">Placement Duration</th>
                <th className="px-4 py-2 font-semibold">Banking Details</th>
                <th className="px-3 py-2 font-semibold text-center">Batch Status</th>
                <th className="px-3 py-2 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/40 text-[13px]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-secondary">
                    <span className="material-symbols-outlined text-[36px] text-secondary/40 block mb-2">search_off</span>
                    No intern profiles match your current search or filter.
                  </td>
                </tr>
              ) : (
                filtered.map((intern) => (
                  <tr key={intern.id} className="hover:bg-surface-container-low/50 transition-colors">
                    {/* Trainee Profile */}
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-on-surface text-[14px]">
                            {intern.fullName}
                          </span>
                          {intern.documentUrl && (
                            <a
                              href={intern.documentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-tertiary hover:text-primary transition-colors inline-flex items-center gap-0.5 bg-surface-container-high px-1.5 py-0.2 rounded text-[11px] font-medium"
                              title={`Cloud Document Link: ${intern.documentUrl}`}
                            >
                              <span className="material-symbols-outlined text-[13px]">attachment</span>
                              <span>Document Link</span>
                            </a>
                          )}
                        </div>
                        <span className="font-code-tabular text-[12px] text-primary font-medium mt-0.5">
                          {formatICDisplay(intern.icNumber)}
                        </span>
                        <span className="text-[11px] text-secondary font-code-tabular">
                          Raw IC: {intern.icNumber}
                        </span>
                      </div>
                    </td>

                    {/* Company & Division */}
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col">
                        <span className="font-medium text-on-surface">{intern.companyName}</span>
                        <span className="text-[12px] text-secondary">{intern.department}</span>
                      </div>
                    </td>

                    {/* Contact & Address */}
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col">
                        <span className="text-[12px] text-on-surface font-medium">{intern.email}</span>
                        <span className="text-[11px] text-secondary font-code-tabular">{intern.phoneNumber}</span>
                        <span className="text-[11px] text-secondary truncate max-w-xs mt-0.5" title={intern.address}>
                          {intern.address}
                        </span>
                      </div>
                    </td>

                    {/* Placement Duration */}
                    <td className="px-3 py-3 align-top">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-[12px] text-on-surface">
                          <span className="font-code-tabular font-medium">{formatDateDisplay(intern.durationFrom)}</span>
                          <span className="text-secondary">to</span>
                          <span className="font-code-tabular font-medium">{formatDateDisplay(intern.durationTo)}</span>
                        </div>
                        <span className="text-[11px] text-secondary mt-0.5">Strict DD/MM/YYYY</span>
                      </div>
                    </td>

                    {/* Banking Details */}
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col">
                        <span className="font-medium text-on-surface text-[12px]">{intern.bankName}</span>
                        <span className="font-code-tabular text-[12px] text-secondary">{intern.bankAccountNumber}</span>
                      </div>
                    </td>

                    {/* Batch Status */}
                    <td className="px-3 py-3 align-top text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-semibold ${
                          intern.paymentStatus === 'Release Batch'
                            ? 'bg-surface-container-high text-tertiary'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {intern.paymentStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3 align-top text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onOpenRemarks(intern)}
                          className="p-1 rounded text-secondary hover:text-primary transition-colors cursor-pointer"
                          title="View / Edit Remarks"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {intern.remarks ? 'comment' : 'chat_bubble_outline'}
                          </span>
                        </button>

                        <button
                          onClick={() => onEditIntern(intern)}
                          className="p-1 rounded text-secondary hover:text-on-surface transition-colors cursor-pointer"
                          title="Edit Intern Profile"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>

                        <button
                          onClick={() => handleDelete(intern.id, intern.fullName)}
                          className="p-1 rounded text-secondary hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
