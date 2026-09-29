/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CampusUser, UserRole } from '../../types/campus';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
  Database,
  User,
  CreditCard
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CampusUser;
  onSelectUser: (user: CampusUser) => void;
  availableUsers: CampusUser[];
  onRecordLogin: (
    details: {
      idNumber: string;
      name: string;
      email: string;
      role: UserRole;
      department?: string;
      titleOrMajor?: string;
    },
    method: 'credential_login' | 'role_preset'
  ) => Promise<void>;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  availableUsers,
  onRecordLogin
}) => {
  const [tab, setTab] = useState<'credentials' | 'presets'>('credentials');
  
  // Required Credential Fields
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Preset users
  const studentUser = availableUsers.find(u => u.role === 'student') || availableUsers[0];
  const facultyUser = availableUsers.find(u => u.role === 'faculty') || availableUsers[3];
  const adminUser = availableUsers.find(u => u.role === 'admin') || availableUsers[6];

  const handlePresetSelect = async (user: CampusUser) => {
    setIsSubmitting(true);
    try {
      await onRecordLogin(
        {
          idNumber: user.idNumber,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          titleOrMajor: user.titleOrMajor
        },
        'role_preset'
      );
      onSelectUser(user);
      onClose();
    } catch (e) {
      console.error(e);
      onSelectUser(user);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full legal or directory name.');
      return;
    }
    if (!idNumber.trim()) {
      setErrorMessage('Please enter your Student or Faculty ID number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid campus email address.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setErrorMessage('Please enter a password with at least 4 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      await onRecordLogin(
        {
          idNumber: idNumber.trim(),
          name: name.trim(),
          email: email.trim(),
          role: selectedRole
        },
        'credential_login'
      );

      setSaveSuccessMessage('Authentication details saved to Supabase users & login audit tables!');
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setErrorMessage('Failed to persist authentication record. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              NexusFlow Single Sign-On
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign in with your Name, Campus ID, and Email. Records sync to Supabase database.
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl my-4 text-xs">
          <button
            type="button"
            onClick={() => setTab('credentials')}
            className={`flex-1 py-2 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              tab === 'credentials'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-500" />
            <span>ID, Name & Email Login</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('presets')}
            className={`flex-1 py-2 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              tab === 'presets'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>1-Click Role Presets</span>
          </button>
        </div>

        {/* SUCCESS NOTIFICATION */}
        {saveSuccessMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
        )}

        {/* ERROR NOTIFICATION */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs">
            {errorMessage}
          </div>
        )}

        {/* TAB 1: ID, NAME, AND EMAIL FORM */}
        {tab === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Select Institutional Role Portal
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['student', 'faculty', 'admin'] as UserRole[]).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold capitalize transition-all cursor-pointer ${
                      selectedRole === r
                        ? r === 'student'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : r === 'faculty'
                          ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          : 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Member Full Name */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Rivera"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Student or Faculty ID Number */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Campus ID Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS-2024-8841"
                    value={idNumber}
                    onChange={e => setIdNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Institutional Email Address */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Institutional Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. a.rivera@campus.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password / Access PIN
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving to Database & Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In & Save Details to Database</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: 1-CLICK ROLE PRESETS */}
        {tab === 'presets' && (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Select any pre-configured identity below to log in and immediately record the session in the database:
            </p>

            {/* Student Preset Card */}
            {studentUser && (
              <button
                type="button"
                onClick={() => handlePresetSelect(studentUser)}
                disabled={isSubmitting}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer group ${
                  currentUser.id === studentUser.id
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {studentUser.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                        ID: {studentUser.idNumber}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {studentUser.email} · {studentUser.titleOrMajor}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </button>
            )}

            {/* Faculty Preset Card */}
            {facultyUser && (
              <button
                type="button"
                onClick={() => handlePresetSelect(facultyUser)}
                disabled={isSubmitting}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer group ${
                  currentUser.id === facultyUser.id
                    ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-purple-500/50 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {facultyUser.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 font-semibold uppercase">
                        ID: {facultyUser.idNumber}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {facultyUser.email} · {facultyUser.titleOrMajor}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
              </button>
            )}

            {/* Administrator Preset Card */}
            {adminUser && (
              <button
                type="button"
                onClick={() => handlePresetSelect(adminUser)}
                disabled={isSubmitting}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer group ${
                  currentUser.id === adminUser.id
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-rose-500/50 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {adminUser.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 font-semibold uppercase">
                        ID: {adminUser.idNumber}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {adminUser.email} · {adminUser.titleOrMajor}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
              </button>
            )}
          </div>
        )}

        {/* Database backend sync footer note */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-mono">
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span>Persisted to Supabase <code className="text-emerald-600 dark:text-emerald-400">users</code> & <code className="text-emerald-600 dark:text-emerald-400">login_logs</code></span>
          </div>
          <span className="text-slate-400 font-mono">v3.2</span>
        </div>
      </div>
    </div>
  );
};
