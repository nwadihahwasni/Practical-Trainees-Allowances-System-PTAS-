import React, { useState } from 'react';
import { CloudLink, CompanyEntityCode } from '../../types';
import { MEDIA_PRIMA_ENTITIES } from '../../data/initialData';

interface CloudLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: CloudLink[];
  onSaveLink: (link: CloudLink) => void;
  onDeleteLink: (id: string) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const CloudLinksModal: React.FC<CloudLinksModalProps> = ({
  isOpen,
  onClose,
  links,
  onSaveLink,
  onDeleteLink,
  showToast,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<CloudLink['category']>('Google Drive');
  const [description, setDescription] = useState('');
  const [entityCode, setEntityCode] = useState<CompanyEntityCode>('ALL');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    let validUrl = url.trim();
    if (!/^https?:\/\//i.test(validUrl)) {
      validUrl = 'https://' + validUrl;
    }

    const newLink: CloudLink = {
      id: `link-${Date.now()}`,
      title: title.trim(),
      url: validUrl,
      category,
      description: description.trim(),
      entityCode: entityCode === 'ALL' ? undefined : entityCode,
      createdAt: new Date().toISOString(),
      createdBy: 'HR Admin Ops',
    };

    onSaveLink(newLink);
    showToast(`Link "${title}" successfully saved to Firebase!`, 'cloud_done');

    // Reset form
    setTitle('');
    setUrl('');
    setDescription('');
    setIsAdding(false);
  };

  const handleCopy = (linkUrl: string, linkTitle: string) => {
    navigator.clipboard.writeText(linkUrl);
    showToast(`Link "${linkTitle}" copied to clipboard`, 'content_copy');
  };

  const handleDelete = (id: string, linkTitle: string) => {
    if (window.confirm(`Delete link "${linkTitle}" from Firebase?`)) {
      onDeleteLink(id);
      showToast(`Link "${linkTitle}" deleted from Firebase`, 'delete');
    }
  };

  const filteredLinks = links.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.url.toLowerCase().includes(search.toLowerCase()) ||
      (l.description && l.description.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = activeCategory === 'ALL' || l.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const categories: CloudLink['category'][] = [
    'Google Drive',
    'Payroll Sheet',
    'Statutory Document',
    'Bank Autopay',
    'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-xl w-full max-w-2xl max-h-[88vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-container text-white flex items-center justify-center font-bold shadow-xs">
              <span className="material-symbols-outlined text-[20px]">cloud_sync</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-[16px] text-on-surface font-semibold">
                  Cloud Links &amp; Documents Repository
                </h3>
                <span className="inline-flex items-center gap-1 font-label-sm text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live Firestore
                </span>
              </div>
              <p className="font-label-sm text-[11px] text-secondary">
                All cloud links, Google Drive folders, payroll reports, and documents stored directly in Firebase
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

        {/* Action & Filter Toolbar */}
        <div className="p-4 bg-surface-container-low/60 border-b border-surface-container-high flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by link title, URL, or description..."
              className="w-full h-8 pl-8 pr-3 bg-surface-container-lowest rounded-lg font-label-md text-[12px] text-on-surface focus:outline-none border border-surface-container-high"
            />
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[16px] text-secondary">
              search
            </span>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`px-3 py-1.5 font-label-md text-[12px] rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer font-semibold shadow-2xs ${
              isAdding
                ? 'bg-surface-container-high text-on-surface border border-surface-container-highest'
                : 'bg-primary-container hover:bg-primary text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isAdding ? 'expand_less' : 'add_link'}
            </span>
            <span>{isAdding ? 'Close Form' : '+ Add New Link'}</span>
          </button>
        </div>

        {/* Add Link Form Drawer */}
        {isAdding && (
          <form
            onSubmit={handleSubmit}
            className="p-5 bg-surface-container-low/30 border-b border-surface-container-high space-y-3 animate-in fade-in duration-150"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-sm text-[12px] font-semibold text-primary uppercase tracking-wide flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                Save New Link to Firebase
              </span>
              <span className="text-[11px] text-secondary">Database: Cloud Firestore</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-label-sm text-[11px] text-secondary mb-1">
                  Document / Link Title <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Trainee Signed Attendance Form Drive Folder"
                  className="w-full h-8 px-2.5 bg-surface-container-lowest rounded-lg font-label-md text-[12px] text-on-surface border border-surface-container-high focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-label-sm text-[11px] text-secondary mb-1">
                  Document Category <span className="text-primary">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CloudLink['category'])}
                  className="w-full h-8 px-2.5 bg-surface-container-lowest rounded-lg font-label-md text-[12px] text-on-surface border border-surface-container-high focus:outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-label-sm text-[11px] text-secondary mb-1">
                URL / Web Link <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://drive.google.com/... or https://..."
                className="w-full h-8 px-2.5 bg-surface-container-lowest rounded-lg font-mono text-[12px] text-on-surface border border-surface-container-high focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-label-sm text-[11px] text-secondary mb-1">
                  Associated Media Prima Entity (Optional)
                </label>
                <select
                  value={entityCode}
                  onChange={(e) => setEntityCode(e.target.value as CompanyEntityCode)}
                  className="w-full h-8 px-2.5 bg-surface-container-lowest rounded-lg font-label-md text-[12px] text-on-surface border border-surface-container-high focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Entities (Group-Wide)</option>
                  {MEDIA_PRIMA_ENTITIES.map((ent) => (
                    <option key={ent.code} value={ent.code}>
                      {ent.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-label-sm text-[11px] text-secondary mb-1">
                  Brief Description / Notes
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Verified monthly attendance records"
                  className="w-full h-8 px-2.5 bg-surface-container-lowest rounded-lg font-label-md text-[12px] text-on-surface border border-surface-container-high focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 bg-surface-container text-secondary text-[12px] rounded-lg border border-surface-container-high"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-primary-container hover:bg-primary text-white text-[12px] font-semibold rounded-lg shadow-xs flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">cloud_upload</span>
                <span>Save to Firebase</span>
              </button>
            </div>
          </form>
        )}

        {/* Category Filter Pills */}
        <div className="px-6 py-2 bg-surface-container-lowest border-b border-surface-container-high flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-2.5 py-0.5 rounded-full font-label-sm text-[11px] transition-colors cursor-pointer ${
              activeCategory === 'ALL'
                ? 'bg-primary text-white font-bold'
                : 'bg-surface-container-low text-secondary hover:text-on-surface'
            }`}
          >
            All ({links.length})
          </button>
          {categories.map((c) => {
            const count = links.filter((l) => l.category === c).length;
            return (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-2.5 py-0.5 rounded-full font-label-sm text-[11px] transition-colors cursor-pointer whitespace-nowrap ${
                  activeCategory === c
                    ? 'bg-primary text-white font-bold'
                    : 'bg-surface-container-low text-secondary hover:text-on-surface'
                }`}
              >
                {c} ({count})
              </button>
            );
          })}
        </div>

        {/* Links List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {filteredLinks.length === 0 ? (
            <div className="py-12 text-center text-secondary">
              <span className="material-symbols-outlined text-[36px] text-secondary/40 block mb-2">
                link_off
              </span>
              <p className="text-[13px] font-medium text-on-surface">No links found</p>
              <p className="text-[11px] text-secondary mt-1">
                Click "+ Add New Link" above to store your first link in Firebase.
              </p>
            </div>
          ) : (
            filteredLinks.map((link) => (
              <div
                key={link.id}
                className="p-3.5 rounded-xl bg-surface-container-low/70 border border-surface-container-high hover:border-surface-container-highest transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container text-tertiary flex items-center justify-center shrink-0 border border-surface-container-high mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">
                      {link.category === 'Google Drive'
                        ? 'folder_shared'
                        : link.category === 'Payroll Sheet'
                        ? 'table_chart'
                        : link.category === 'Bank Autopay'
                        ? 'account_balance'
                        : 'link'}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-[13px] text-on-surface truncate">
                        {link.title}
                      </h4>
                      <span className="font-label-sm text-[10px] bg-surface-container-high text-tertiary px-2 py-0.5 rounded-full font-medium">
                        {link.category}
                      </span>
                      {link.entityCode && (
                        <span className="font-label-sm text-[10px] bg-red-50 text-primary border border-red-200 px-1.5 py-0.2 rounded font-bold">
                          {link.entityCode}
                        </span>
                      )}
                    </div>

                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] text-tertiary hover:underline truncate block mt-0.5 max-w-md"
                      title={link.url}
                    >
                      {link.url}
                    </a>

                    {link.description && (
                      <p className="text-[11px] text-secondary mt-1 line-clamp-2">
                        {link.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleCopy(link.url, link.title)}
                    className="p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                    title="Copy Link"
                  >
                    <span className="material-symbols-outlined text-[17px]">content_copy</span>
                  </button>

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-tertiary hover:bg-surface-container transition-colors cursor-pointer"
                    title="Open Link"
                  >
                    <span className="material-symbols-outlined text-[17px]">open_in_new</span>
                  </a>

                  <button
                    onClick={() => handleDelete(link.id, link.title)}
                    className="p-1.5 rounded-lg text-secondary hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete from Firebase"
                  >
                    <span className="material-symbols-outlined text-[17px]">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-surface-container-low border-t border-surface-container-high flex items-center justify-between text-[11px] text-secondary">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">cloud_done</span>
            <span>All links are permanently stored in Firebase Firestore</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-[12px] rounded-lg border border-surface-container-high cursor-pointer font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
