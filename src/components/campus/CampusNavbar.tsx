/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserRole, CampusUser } from '../../types/campus';
import {
  GraduationCap,
  Database,
  Moon,
  Sun,
  UserCheck,
  ShieldCheck,
  BookOpen,
  LogIn,
  User
} from 'lucide-react';
import logoImage from '../../assets/images/regenerated_image_1790657374366.jpg';

interface CampusNavbarProps {
  currentRole: UserRole;
  currentUser: CampusUser;
  onRoleChange: (role: UserRole) => void;
  onOpenLoginModal: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isSupabaseConnected: boolean;
  onOpenSupabaseModal: () => void;
  urgentAnnouncementsCount: number;
  onOpenAnnouncements: () => void;
}

export const CampusNavbar: React.FC<CampusNavbarProps> = ({
  currentRole,
  currentUser,
  onRoleChange,
  onOpenLoginModal,
  isDark,
  onToggleTheme,
  isSupabaseConnected,
  onOpenSupabaseModal,
  urgentAnnouncementsCount,
  onOpenAnnouncements
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#090E1A]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone: Clean Wordmark & Academic Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src={logoImage}
            alt="NexusFlow Logo"
            className="w-10 h-10 object-contain rounded-xl shadow-sm border border-emerald-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                NexusFlow
              </span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                EDTECH
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Smart University Management
            </div>
          </div>
        </div>

        {/* Center Zone: Multi-Role Switcher */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-inner">
          <button
            onClick={() => onRoleChange('student')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentRole === 'student'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>

          <button
            onClick={() => onRoleChange('faculty')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentRole === 'faculty'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Faculty</span>
          </button>

          <button
            onClick={() => onRoleChange('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentRole === 'admin'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Right Zone: User Profile, Database Sync Indicator, Alert, & Theme Switch */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Active User Identity Lockup & Login Trigger */}
          <button
            onClick={onOpenLoginModal}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-slate-50 dark:bg-slate-900 transition-colors cursor-pointer group"
            title="Click to switch account or sign in with credentials"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs overflow-hidden shrink-0">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                currentUser.name.charAt(0)
              )}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-500 capitalize">
                {currentUser.role} · {currentUser.idNumber}
              </div>
            </div>
            <LogIn className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors ml-0.5 hidden sm:block" />
          </button>

          {/* Supabase Persistence Trigger Button */}
          <button
            onClick={onOpenSupabaseModal}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              isSupabaseConnected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500'
            }`}
            title="Configure Supabase Database"
          >
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden xl:inline">
              {isSupabaseConnected ? 'Supabase' : 'DB'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
          </button>

          {/* Urgent Announcement Indicator */}
          {urgentAnnouncementsCount > 0 && (
            <button
              onClick={onOpenAnnouncements}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-all"
              title="Urgent Announcements"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span className="tabular-nums font-semibold">{urgentAnnouncementsCount} Alert</span>
            </button>
          )}

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
