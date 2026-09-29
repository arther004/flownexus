/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CampusUser,
  UserRole,
  Appointment,
  AppointmentStatus,
  SmartClassroom,
  LoginAuditLog
} from '../../types/campus';
import {
  ShieldCheck,
  Users,
  CalendarCheck,
  Cpu,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Database,
  Thermometer,
  Wind,
  Volume2,
  Sliders,
  Check,
  X,
  Lock,
  Unlock,
  Building,
  AlertTriangle,
  RefreshCw,
  UserPlus,
  History,
  Download,
  KeyRound,
  Sparkles
} from 'lucide-react';

interface AdminPanelViewProps {
  currentRole: UserRole;
  users: CampusUser[];
  appointments: Appointment[];
  classrooms: SmartClassroom[];
  loginLogs: LoginAuditLog[];
  onAddUser: (user: Omit<CampusUser, 'id' | 'joinedDate'>) => Promise<void>;
  onUpdateUser: (id: string, updates: Partial<CampusUser>) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
  onUpdateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  onOverrideClassroom: (roomId: string, overrides: Partial<SmartClassroom>) => Promise<void>;
  onOpenSupabaseModal: () => void;
  onSwitchToAdminRole: () => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  currentRole,
  users,
  appointments,
  classrooms,
  loginLogs,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onUpdateAppointmentStatus,
  onOverrideClassroom,
  onOpenSupabaseModal,
  onSwitchToAdminRole
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'appointments' | 'iot' | 'audit'>('users');
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Login Audit Filter State
  const [auditSearch, setAuditSearch] = useState('');
  const [auditRoleFilter, setAuditRoleFilter] = useState<string>('all');

  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('student');
  const [newUserDept, setNewUserDept] = useState('Computer Science & Engineering');
  const [newUserTitle, setNewUserTitle] = useState('Undergraduate Candidate');
  const [newUserIdNumber, setNewUserIdNumber] = useState(`ID-${Math.floor(1000 + Math.random() * 9000)}`);

  // Selected Room for IoT Sensor Override
  const [selectedRoomId, setSelectedRoomId] = useState<string>(classrooms[0]?.id || '');
  const [iotSuccessMessage, setIotSuccessMessage] = useState<string | null>(null);

  // Quick stats
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalFaculty = users.filter(u => u.role === 'faculty').length;
  const activeClassrooms = classrooms.filter(c => c.status !== 'maintenance').length;

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.idNumber.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.department.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Filtered Login Audit Logs
  const filteredAuditLogs = loginLogs.filter(log => {
    const matchesSearch =
      log.name.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.email.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.idNumber.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.department.toLowerCase().includes(auditSearch.toLowerCase());
    const matchesRole = auditRoleFilter === 'all' || log.role === auditRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleExportAuditLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(loginLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nexusflow-login-audit-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    await onAddUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      department: newUserDept.trim(),
      titleOrMajor: newUserTitle.trim(),
      idNumber: newUserIdNumber.trim(),
      status: 'active'
    });

    setIsAddUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserIdNumber(`ID-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const selectedClassroom = classrooms.find(c => c.id === selectedRoomId) || classrooms[0];

  const handleOverrideSensor = async (overrides: Partial<SmartClassroom>) => {
    if (!selectedClassroom) return;
    await onOverrideClassroom(selectedClassroom.id, overrides);
    setIotSuccessMessage(`Sensor telemetry updated and persisted for ${selectedClassroom.name}`);
    setTimeout(() => setIotSuccessMessage(null), 4000);
  };

  // If user is not admin, show institutional admin gate
  if (currentRole !== 'admin') {
    return (
      <div className="p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm max-w-xl mx-auto space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Administrative Access Required
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            You are currently signed in with the <span className="font-semibold uppercase text-slate-700 dark:text-slate-300">{currentRole}</span> role. Switch to the Administrator identity to access the user directory, appointment dispatch queue, and IoT environmental overrides.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={onSwitchToAdminRole}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Switch to Dean Marcus Vance (Administrator)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Institutional Admin Operations
            </h2>
            <span className="flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <ShieldCheck className="w-3 h-3" />
              <span>SUPER ADMIN</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full governance suite: manage student & faculty records, approve campus appointments, and override IoT smart classroom telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSupabaseModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-medium hover:border-emerald-500 transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span>Supabase Schema</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Total Directory Users</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {users.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {totalStudents} Students · {totalFaculty} Faculty
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Authentication Audits</span>
            <History className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
            <span>{loginLogs.length}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold font-sans">
              Recorded in DB
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Synced with <code className="font-mono text-emerald-600 dark:text-emerald-400">login_logs</code>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Appointment Requests</span>
            <CalendarCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
            <span>{appointments.length}</span>
            {pendingAppointments.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold font-sans">
                {pendingAppointments.length} pending
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Synced with <code className="font-mono text-emerald-600 dark:text-emerald-400">appointments</code>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>IoT Smart Facilities</span>
            <Cpu className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {activeClassrooms}/{classrooms.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Environmental telemetry active
          </div>
        </div>
      </div>

      {/* Main Feature Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs flex-wrap">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <History className="w-3.5 h-3.5 text-emerald-500" />
          <span>Live Login Audit Stream ({loginLogs.length})</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'appointments'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Appointments ({appointments.length})</span>
          {pendingAppointments.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('iot')}
          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'iot'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Classroom IoT Overrides</span>
        </button>
      </div>

      {/* TAB A: USER DIRECTORY & ROLES */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user, ID, department..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
                {(['all', 'student', 'faculty', 'admin'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                      roleFilter === r
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* User Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
                  <tr>
                    <th className="py-3 px-4">Member Name & Identity</th>
                    <th className="py-3 px-4">Institutional Role</th>
                    <th className="py-3 px-4">Department & Major</th>
                    <th className="py-3 px-4">ID Number</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              user.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={user.role}
                          onChange={e => onUpdateUser(user.id, { role: e.target.value as UserRole })}
                          className={`px-2 py-1 rounded-lg text-xs font-semibold border outline-none cursor-pointer ${
                            user.role === 'admin'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                              : user.role === 'faculty'
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          }`}
                        >
                          <option value="student">Student</option>
                          <option value="faculty">Faculty</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-900 dark:text-white font-medium">
                          {user.department}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {user.titleOrMajor}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                        {user.idNumber}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => onUpdateUser(user.id, { status: user.status === 'active' ? 'suspended' : 'active' })}
                          className={`px-2 py-0.5 rounded-full text-[11px] font-medium cursor-pointer ${
                            user.status === 'active'
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              : 'bg-red-500/15 text-red-600 dark:text-red-400'
                          }`}
                        >
                          {user.status === 'active' ? 'Active' : 'Suspended'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onDeleteUser(user.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: LIVE LOGIN AUDIT STREAM & DATABASE LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by ID, name, email..."
                value={auditSearch}
                onChange={e => setAuditSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
                {(['all', 'student', 'faculty', 'admin'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setAuditRoleFilter(r)}
                    className={`px-2.5 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                      auditRoleFilter === r
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button
                onClick={handleExportAuditLogs}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                title="Export audit log as JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit Log</span>
              </button>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
                  <tr>
                    <th className="py-3 px-4">Member Name & ID Number</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Department / Affiliation</th>
                    <th className="py-3 px-4">Authentication Method</th>
                    <th className="py-3 px-4">Login Timestamp</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                        No login audit records found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredAuditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0">
                              {log.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-white">
                                {log.name}
                              </div>
                              <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                                {log.idNumber}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                          {log.email}
                        </td>

                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                            log.role === 'admin'
                              ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                              : log.role === 'faculty'
                              ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {log.role}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-[180px] truncate">
                          {log.department || 'Campus General'}
                        </td>

                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                            {log.loginMethod === 'credential_login' ? (
                              <>
                                <KeyRound className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                <span>Credentials</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                                <span>Role Preset</span>
                              </>
                            )}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          {new Date(log.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Authorized</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: APPOINTMENT APPROVALS & DISPATCH QUEUE */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Review and manage university advising & consultation requests directly synchronizing with Supabase table <code className="font-mono text-emerald-600 dark:text-emerald-400">appointments</code>.
            </span>
            <span className="font-mono font-medium">
              {appointments.length} Total Appointments
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map(apt => (
              <div
                key={apt.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase">
                      {apt.appointmentType.replace(/_/g, ' ')}
                    </span>
                    <div>
                      {apt.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-medium text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Pending Approval</span>
                        </span>
                      )}
                      {apt.status === 'confirmed' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approved & Confirmed</span>
                        </span>
                      )}
                      {apt.status === 'completed' && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-500 font-medium text-[11px]">
                          Completed
                        </span>
                      )}
                      {apt.status === 'cancelled' && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-600 font-medium text-[11px]">
                          Cancelled / Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2.5 space-y-1">
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {apt.facultyOrStaffName}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      Applicant: <span className="font-semibold text-slate-900 dark:text-white">{apt.studentName}</span> ({apt.studentEmail})
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Date & Time: <span className="font-medium text-slate-700 dark:text-slate-300">{apt.preferredDate} at {apt.preferredTime}</span> · {apt.location}
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 mt-2">
                      <span className="font-medium">Agenda: </span>
                      {apt.purpose}
                    </div>
                  </div>
                </div>

                {/* Dispatch Action Buttons */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    <span>Supabase Live Sync</span>
                  </span>

                  <div className="flex items-center gap-2">
                    {apt.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onUpdateAppointmentStatus(apt.id, 'confirmed')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Dispatch</span>
                        </button>
                        <button
                          onClick={() => onUpdateAppointmentStatus(apt.id, 'cancelled')}
                          className="px-2.5 py-1.5 border border-red-200 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => onUpdateAppointmentStatus(apt.id, 'completed')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB C: SMART CLASSROOM IOT SENSOR OVERRIDES */}
      {activeTab === 'iot' && (
        <div className="space-y-5">
          {iotSuccessMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{iotSuccessMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Room Selector Column */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                Select Facility Node
              </h3>
              <div className="space-y-1.5">
                {classrooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      selectedRoomId === room.id
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs">{room.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {room.building} · Cap: {room.capacity} · {room.currentOccupancy} present
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded capitalize ${
                      room.status === 'available' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-amber-500/20 text-amber-600'
                    }`}>
                      {room.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Overrides Control Deck */}
            {selectedClassroom && (
              <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      IoT Environmental Calibration: {selectedClassroom.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Room Code: <span className="font-mono text-emerald-600 dark:text-emerald-400">{selectedClassroom.code}</span> · {selectedClassroom.building} Floor {selectedClassroom.floor}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOverrideSensor({
                      status: selectedClassroom.status === 'maintenance' ? 'available' : 'maintenance'
                    })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      selectedClassroom.status === 'maintenance'
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{selectedClassroom.status === 'maintenance' ? 'Exit Maintenance' : 'Trigger Facility Maintenance'}</span>
                  </button>
                </div>

                {/* Sliders & Calibration Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Occupancy Override */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        <span>Live Occupancy Count</span>
                      </span>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                        {selectedClassroom.currentOccupancy} / {selectedClassroom.capacity}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={selectedClassroom.capacity}
                      value={selectedClassroom.currentOccupancy}
                      onChange={e => handleOverrideSensor({ currentOccupancy: parseInt(e.target.value) })}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>0 (Empty)</span>
                      <span>Full Capacity</span>
                    </div>
                  </div>

                  {/* Thermostat Temperature Override */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
                      <span className="flex items-center gap-1.5">
                        <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                        <span>Thermostat Temperature</span>
                      </span>
                      <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">
                        {selectedClassroom.temperatureCelsius}°C
                      </span>
                    </div>
                    <input
                      type="range"
                      min={16}
                      max={28}
                      step={0.5}
                      value={selectedClassroom.temperatureCelsius}
                      onChange={e => handleOverrideSensor({ temperatureCelsius: parseFloat(e.target.value) })}
                      className="w-full accent-rose-600 cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>16°C (Cool)</span>
                      <span>28°C (Warm)</span>
                    </div>
                  </div>

                  {/* Air Quality AQI Override */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
                      <span className="flex items-center gap-1.5">
                        <Wind className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Air Quality Index (AQI)</span>
                      </span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {selectedClassroom.airQualityAqi} AQI
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={90}
                      value={selectedClassroom.airQualityAqi}
                      onChange={e => handleOverrideSensor({ airQualityAqi: parseInt(e.target.value) })}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>10 (HEPA Purified)</span>
                      <span>90 (Moderate)</span>
                    </div>
                  </div>

                  {/* Sound & Noise DB Override */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
                      <span className="flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-purple-500" />
                        <span>Acoustic Sensor Level</span>
                      </span>
                      <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">
                        {selectedClassroom.noiseLevelDb} dB
                      </span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={85}
                      value={selectedClassroom.noiseLevelDb}
                      onChange={e => handleOverrideSensor({ noiseLevelDb: parseInt(e.target.value) })}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>20 dB (Whisper)</span>
                      <span>85 dB (Loud)</span>
                    </div>
                  </div>
                </div>

                {/* Hardware Toggle Array */}
                <div className="pt-2">
                  <div className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                    Facility Equipment Power State
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleOverrideSensor({ hasProjector: !selectedClassroom.hasProjector })}
                      className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between cursor-pointer ${
                        selectedClassroom.hasProjector
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      <span>4K Laser Projector</span>
                      <span className="font-mono text-[10px]">{selectedClassroom.hasProjector ? 'ON' : 'OFF'}</span>
                    </button>

                    <button
                      onClick={() => handleOverrideSensor({ hasLectureRecording: !selectedClassroom.hasLectureRecording })}
                      className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between cursor-pointer ${
                        selectedClassroom.hasLectureRecording
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      <span>Lecture Recording PTZ</span>
                      <span className="font-mono text-[10px]">{selectedClassroom.hasLectureRecording ? 'ACTIVE' : 'OFF'}</span>
                    </button>

                    <button
                      onClick={() => handleOverrideSensor({ hasGpuWorkstations: !selectedClassroom.hasGpuWorkstations })}
                      className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between cursor-pointer ${
                        selectedClassroom.hasGpuWorkstations
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      <span>GPU Workstation Nodes</span>
                      <span className="font-mono text-[10px]">{selectedClassroom.hasGpuWorkstations ? 'ONLINE' : 'STANDBY'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl relative">
            <button
              onClick={() => setIsAddUserModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Add Campus Member
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Register a student, faculty instructor, or administrator to the institutional directory.
            </p>

            <form onSubmit={handleCreateUserSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Arthur Pendelton"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Institutional Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. a.pendelton@campus.edu"
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Role
                  </label>
                  <select
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    ID Number
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserIdNumber}
                    onChange={e => setNewUserIdNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Department of Computer Science"
                  value={newUserDept}
                  onChange={e => setNewUserDept(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Title / Degree Major
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Associate Professor in Robotics"
                  value={newUserTitle}
                  onChange={e => setNewUserTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Create Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
