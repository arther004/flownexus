/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Announcement, UserRole } from '../../types/campus';
import {
  Bell,
  AlertTriangle,
  Calendar,
  Building,
  Plus,
  X,
  Check
} from 'lucide-react';

interface AnnouncementsViewProps {
  role: UserRole;
  announcements: Announcement[];
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'publishedAt'>) => Promise<void>;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  role,
  announcements,
  onAddAnnouncement
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<any>('academic');
  const [isUrgent, setIsUrgent] = useState(false);
  const [department, setDepartment] = useState('Academic Affairs');
  const [authorName, setAuthorName] = useState('Registrar Office');
  const [authorRole, setAuthorRole] = useState('Academic Dean');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredAnnouncements = announcements.filter(a => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'urgent') return a.isUrgent;
    return a.category === categoryFilter;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddAnnouncement({
        title: title.trim(),
        content: content.trim(),
        category,
        isUrgent,
        department,
        authorName,
        authorRole
      });
      setModalOpen(false);
      setTitle('');
      setContent('');
      setIsUrgent(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Campus Bulletin & Announcements
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Official circulars, academic notices, and emergency campus bulletins.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Segmented Filter Tabs */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setCategoryFilter('academic')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                categoryFilter === 'academic'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Academic
            </button>
            <button
              onClick={() => setCategoryFilter('campus')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                categoryFilter === 'campus'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Campus Life
            </button>
            <button
              onClick={() => setCategoryFilter('urgent')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                categoryFilter === 'urgent'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Urgent Only
            </button>
          </div>

          {(role === 'admin' || role === 'faculty') && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Broadcast Notice</span>
            </button>
          )}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map(notice => (
          <div
            key={notice.id}
            className={`p-6 rounded-2xl border transition-all ${
              notice.isUrgent
                ? 'border-amber-500/40 bg-amber-500/[0.04] dark:bg-amber-950/20'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
            } shadow-sm hover:border-emerald-500/50 space-y-3`}
          >
            {/* Unboxed Metadata row */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                {notice.isUrgent && (
                  <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Priority Directive</span>
                    <span aria-hidden="true">·</span>
                  </span>
                )}
                <span className="capitalize font-medium text-slate-700 dark:text-slate-300">
                  {notice.category}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Building className="w-3 h-3 text-slate-400" />
                  <span>{notice.department}</span>
                </span>
              </div>

              <div className="flex items-center gap-1 font-mono text-slate-500 dark:text-slate-400">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(notice.publishedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {notice.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {notice.content}
            </p>

            {/* Author Attribution */}
            <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span>Published by</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{notice.authorName}</span>
              <span aria-hidden="true">·</span>
              <span>{notice.authorRole}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Broadcast University Announcement
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Post an official notice to the university bulletin board and database.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Circular Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Campus Wi-Fi 6E Upgrade Schedule"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  >
                    <option value="academic">Academic</option>
                    <option value="campus">Campus Life</option>
                    <option value="career">Career</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Announcement Details
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write the full announcement text for students and faculty..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              {/* Urgent Priority Checkbox */}
              <label className="flex items-center gap-2 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={e => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                />
                <div>
                  <div className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                    Mark as Urgent Campus Alert
                  </div>
                  <div className="text-[11px] text-amber-700/80 dark:text-amber-400">
                    Pins to top banner of all student and faculty dashboards.
                  </div>
                </div>
              </label>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Publishing...' : 'Publish Circular'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
