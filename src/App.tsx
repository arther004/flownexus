/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserRole,
  Announcement,
  TimetableSlot,
  SmartClassroom,
  Assignment,
  CampusEvent,
  Appointment,
  AppointmentStatus,
  CampusUser,
  LoginAuditLog,
  SupabaseConfig
} from './types/campus';
import { campusDb } from './lib/supabaseClient';
import { CampusNavbar } from './components/campus/CampusNavbar';
import { DashboardOverview } from './components/campus/DashboardOverview';
import { TimetableView } from './components/campus/TimetableView';
import { SmartClassroomsView } from './components/campus/SmartClassroomsView';
import { AssignmentsView } from './components/campus/AssignmentsView';
import { AnnouncementsView } from './components/campus/AnnouncementsView';
import { EventsDirectory } from './components/campus/EventsDirectory';
import { AppointmentsView } from './components/campus/AppointmentsView';
import { AdminPanelView } from './components/campus/AdminPanelView';
import { LoginModal } from './components/campus/LoginModal';
import { SupabaseConfigModal } from './components/campus/SupabaseConfigModal';
import {
  LayoutDashboard,
  CalendarDays,
  Cpu,
  BookOpen,
  Bell,
  Ticket,
  GraduationCap,
  CalendarCheck,
  ShieldCheck,
  Database
} from 'lucide-react';
import logoImage from './assets/images/regenerated_image_1790657374366.jpg';
import { initialUsers } from './data/mockCampusData';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [currentUser, setCurrentUser] = useState<CampusUser>(initialUsers[0]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Campus Data State
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [classrooms, setClassrooms] = useState<SmartClassroom[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<CampusUser[]>(initialUsers);
  const [loginLogs, setLoginLogs] = useState<LoginAuditLog[]>([]);
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(campusDb.getConfig());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync dark mode class on document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Load all initial campus data
  const loadData = async () => {
    try {
      const [annData, timeData, roomData, asgData, evtData, aptData, usrData, logData] = await Promise.all([
        campusDb.getAnnouncements(),
        campusDb.getTimetable(),
        campusDb.getClassrooms(),
        campusDb.getAssignments(),
        campusDb.getEvents(),
        campusDb.getAppointments(),
        campusDb.getUsers(),
        campusDb.getLoginLogs()
      ]);
      setAnnouncements(annData);
      setTimetable(timeData);
      setClassrooms(roomData);
      setAssignments(asgData);
      setEvents(evtData);
      setAppointments(aptData);
      setUsers(usrData);
      setLoginLogs(logData);
      if (usrData.length > 0) {
        // Keep current user role in sync
        const matchingUser = usrData.find(u => u.role === currentRole) || usrData[0];
        setCurrentUser(matchingUser);
      }
      setSupabaseConfig(campusDb.getConfig());
    } catch (e) {
      console.error('Failed to load campus records', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRecordLogin = async (
    details: {
      idNumber: string;
      name: string;
      email: string;
      role: UserRole;
      department?: string;
      titleOrMajor?: string;
    },
    method: 'credential_login' | 'role_preset'
  ) => {
    const { user, log } = await campusDb.recordLogin(details, method);
    setCurrentUser(user);
    setCurrentRole(user.role);
    setUsers(prev => {
      const exists = prev.some(u => u.id === user.id);
      return exists ? prev.map(u => (u.id === user.id ? user : u)) : [user, ...prev];
    });
    setLoginLogs(prev => [log, ...prev]);
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    const matching = users.find(u => u.role === role);
    if (matching) {
      setCurrentUser(matching);
    }
  };

  const handleSelectUser = (user: CampusUser) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
  };

  const handleAddUser = async (user: Omit<CampusUser, 'id' | 'joinedDate'>) => {
    const created = await campusDb.createUser(user);
    setUsers(prev => [created, ...prev]);
  };

  const handleUpdateUser = async (id: string, updates: Partial<CampusUser>) => {
    const updated = await campusDb.updateUser(id, updates);
    if (updated) {
      setUsers(prev => prev.map(u => (u.id === id ? updated : u)));
      if (currentUser.id === id) {
        setCurrentUser(updated);
        if (updates.role) setCurrentRole(updates.role);
      }
    }
  };

  const handleDeleteUser = async (id: string) => {
    await campusDb.deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleOverrideClassroom = async (roomId: string, overrides: Partial<SmartClassroom>) => {
    const updated = await campusDb.overrideClassroomSensors(roomId, overrides);
    if (updated) {
      setClassrooms(prev => prev.map(c => (c.id === roomId ? updated : c)));
    }
  };

  const handleAddAppointment = async (aptData: Omit<Appointment, 'id' | 'createdAt'>) => {
    const result = await campusDb.createAppointment(aptData);
    setAppointments(prev => [result.appointment, ...prev.filter(a => a.id !== result.appointment.id)]);
    return result;
  };

  const handleUpdateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    const updated = await campusDb.updateAppointmentStatus(id, status);
    if (updated) {
      setAppointments(prev => prev.map(a => a.id === id ? updated : a));
    }
  };

  // Handlers for data operations
  const handleAddAnnouncement = async (announcement: Omit<Announcement, 'id' | 'publishedAt'>) => {
    const created = await campusDb.createAnnouncement(announcement);
    setAnnouncements(prev => [created, ...prev]);
  };

  const handleAddSlot = async (slot: Omit<TimetableSlot, 'id'>) => {
    const created = await campusDb.addTimetableSlot(slot);
    setTimetable(prev => [...prev, created]);
  };

  const handleToggleReservation = async (roomId: string) => {
    const updated = await campusDb.reserveClassroom(roomId);
    if (updated) {
      setClassrooms(prev => prev.map(c => c.id === roomId ? updated : c));
    }
  };

  const handleSubmitAssignment = async (assignmentId: string, fileName: string) => {
    const updated = await campusDb.submitAssignment(assignmentId, fileName);
    if (updated) {
      setAssignments(prev => prev.map(a => a.id === assignmentId ? updated : a));
    }
  };

  const handleGradeAssignment = async (assignmentId: string, grade: number, feedback: string) => {
    const updated = await campusDb.gradeAssignment(assignmentId, grade, feedback);
    if (updated) {
      setAssignments(prev => prev.map(a => a.id === assignmentId ? updated : a));
    }
  };

  const handleAddNewAssignment = async (asgData: Omit<Assignment, 'id' | 'status'>) => {
    const newAsg: Assignment = {
      ...asgData,
      id: `asg-${Date.now()}`,
      status: 'pending'
    };
    const current = await campusDb.getAssignments();
    const updatedList = [newAsg, ...current];
    localStorage.setItem('omnicampus_data_assignments', JSON.stringify(updatedList));
    setAssignments(updatedList);
  };

  const handleToggleRegister = async (eventId: string) => {
    const updated = await campusDb.toggleEventRegistration(eventId);
    if (updated) {
      setEvents(prev => prev.map(e => e.id === eventId ? updated : e));
    }
  };

  const urgentCount = announcements.filter(a => a.isUrgent).length;
  const pendingAssignmentCount = assignments.filter(a => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060A13] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Academic Navigation Bar */}
      <CampusNavbar
        currentRole={currentRole}
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        isSupabaseConnected={supabaseConfig.isConnected}
        onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
        urgentAnnouncementsCount={urgentCount}
        onOpenAnnouncements={() => setActiveTab('announcements')}
      />

      {/* Main Container Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          {/* Persona Card */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                Active Identity
              </span>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
              >
                Switch / Login
              </button>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  currentUser.name.charAt(0)
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {currentUser.titleOrMajor}
                </div>
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-500 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span>{currentUser.idNumber}</span>
              <span className="capitalize font-semibold text-emerald-600 dark:text-emerald-400">{currentUser.role}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('timetable')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'timetable'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CalendarDays className="w-4 h-4" />
                <span>Timetable & Schedule</span>
              </div>
              <span className="font-mono text-[11px] tabular-nums opacity-80">
                {timetable.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('classrooms')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'classrooms'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4" />
                <span>Smart Classrooms & IoT</span>
              </div>
              <span className="font-mono text-[11px] tabular-nums opacity-80">
                {classrooms.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('assignments')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'assignments'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4" />
                <span>Coursework & Tasks</span>
              </div>
              {pendingAssignmentCount > 0 && (
                <span className={`font-mono text-[10px] tabular-nums font-semibold px-1.5 py-0.5 rounded-md ${
                  activeTab === 'assignments' ? 'bg-emerald-700 text-white' : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                }`}>
                  {pendingAssignmentCount} due
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('announcements')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'announcements'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4" />
                <span>Campus Announcements</span>
              </div>
              {urgentCount > 0 && (
                <span className={`font-mono text-[10px] tabular-nums font-semibold px-1.5 py-0.5 rounded-md ${
                  activeTab === 'announcements' ? 'bg-emerald-700 text-white' : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                }`}>
                  {urgentCount} alert
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Ticket className="w-4 h-4" />
                <span>Events & Workshops</span>
              </div>
              <span className="font-mono text-[11px] tabular-nums opacity-80">
                {events.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'appointments'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CalendarCheck className="w-4 h-4" />
                <span>Appointments & Advising</span>
              </div>
              <span className="font-mono text-[11px] tabular-nums opacity-80">
                {appointments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-rose-600 text-white shadow-sm font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Operations</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold uppercase ${
                currentRole === 'admin'
                  ? activeTab === 'admin'
                    ? 'bg-white/20 text-white'
                    : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                  : 'text-slate-400'
              }`}>
                {currentRole === 'admin' ? 'Active' : 'Locked'}
              </span>
            </button>
          </nav>

          {/* Quick Database Status Summary Box */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2 mt-6">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Database Layer</span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                {supabaseConfig.isConnected ? 'Remote Supabase' : 'Offline Storage'}
              </span>
            </div>
            <button
              onClick={() => setSupabaseModalOpen(true)}
              className="w-full py-1.5 px-2.5 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer text-center block"
            >
              Configure Connection →
            </button>
          </div>
        </aside>

        {/* Main Viewport Content */}
        <main className="flex-1 min-w-0">
          {isLoading ? (
            <div className="p-16 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500">Loading campus registry records...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardOverview
                  role={currentRole}
                  announcements={announcements}
                  timetable={timetable}
                  classrooms={classrooms}
                  assignments={assignments}
                  events={events}
                  appointments={appointments}
                  onNavigate={setActiveTab}
                  onOpenNewAnnouncement={() => setActiveTab('announcements')}
                  onOpenNewAssignment={() => setActiveTab('assignments')}
                  onOpenNewAppointment={() => setActiveTab('appointments')}
                />
              )}

              {activeTab === 'timetable' && (
                <TimetableView
                  role={currentRole}
                  timetable={timetable}
                  onAddSlot={handleAddSlot}
                  onSelectRoom={_roomId => setActiveTab('classrooms')}
                />
              )}

              {activeTab === 'classrooms' && (
                <SmartClassroomsView
                  role={currentRole}
                  classrooms={classrooms}
                  onToggleReservation={handleToggleReservation}
                />
              )}

              {activeTab === 'assignments' && (
                <AssignmentsView
                  role={currentRole}
                  assignments={assignments}
                  onSubmitAssignment={handleSubmitAssignment}
                  onGradeAssignment={handleGradeAssignment}
                  onAddNewAssignment={handleAddNewAssignment}
                />
              )}

              {activeTab === 'announcements' && (
                <AnnouncementsView
                  role={currentRole}
                  announcements={announcements}
                  onAddAnnouncement={handleAddAnnouncement}
                />
              )}

              {activeTab === 'events' && (
                <EventsDirectory
                  role={currentRole}
                  events={events}
                  onToggleRegister={handleToggleRegister}
                />
              )}

              {activeTab === 'appointments' && (
                <AppointmentsView
                  role={currentRole}
                  appointments={appointments}
                  isSupabaseConnected={supabaseConfig.isConnected}
                  onAddAppointment={handleAddAppointment}
                  onUpdateStatus={handleUpdateAppointmentStatus}
                  onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
                />
              )}

              {activeTab === 'admin' && (
                <AdminPanelView
                  currentRole={currentRole}
                  users={users}
                  appointments={appointments}
                  classrooms={classrooms}
                  loginLogs={loginLogs}
                  onAddUser={handleAddUser}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                  onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
                  onOverrideClassroom={handleOverrideClassroom}
                  onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
                  onSwitchToAdminRole={() => {
                    const adminUser = users.find(u => u.role === 'admin') || initialUsers[6];
                    handleSelectUser(adminUser);
                  }}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Supabase Configuration Modal */}
      <SupabaseConfigModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
        config={supabaseConfig}
        onConfigUpdated={() => {
          setSupabaseConfig(campusDb.getConfig());
          loadData();
        }}
      />

      {/* Dual-Mode Login & Role Preset Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        availableUsers={users}
        onRecordLogin={handleRecordLogin}
      />

      {/* Streamlined Single-Row Institutional Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#070B14]/95 backdrop-blur-md py-3 px-4 sm:px-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Brand & Copyright */}
          <div className="flex items-center gap-2 shrink-0">
            <img
              src={logoImage}
              alt="NexusFlow Logo"
              className="w-4 h-4 object-contain rounded"
            />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              NexusFlow
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              v3.2
            </span>
            <span className="text-slate-400" aria-hidden="true">·</span>
            <span className="text-slate-500">© 2026 Smart University System</span>
          </div>

          {/* Rapid Navigation Links */}
          <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-1 text-slate-600 dark:text-slate-400 text-xs">
            <button
              onClick={() => setActiveTab('timetable')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Schedule
            </button>
            <button
              onClick={() => setActiveTab('classrooms')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              IoT Facilities
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Coursework
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Announcements
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className="hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors cursor-pointer"
            >
              Admin Panel
            </button>
          </div>

          {/* Database Connection Status Trigger */}
          <div className="flex items-center gap-2.5 shrink-0 text-[11px] font-mono">
            <button
              onClick={() => setSupabaseModalOpen(true)}
              className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              <Database className="w-3 h-3 text-emerald-500" />
              <span>Supabase {supabaseConfig.isConnected ? 'Connected' : 'Offline'}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
