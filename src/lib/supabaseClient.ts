/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Announcement,
  TimetableSlot,
  SmartClassroom,
  Assignment,
  CampusEvent,
  Appointment,
  CampusUser,
  LoginAuditLog,
  UserRole,
  SupabaseConfig
} from '../types/campus';
import {
  initialAnnouncements,
  initialTimetable,
  initialClassrooms,
  initialAssignments,
  initialEvents,
  initialAppointments,
  initialUsers,
  initialLoginLogs
} from '../data/mockCampusData';

const CONFIG_STORAGE_KEY = 'nexusflow_supabase_config';
export const DEFAULT_SUPABASE_URL = 'https://ertsjdmupsqecxfpikql.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_E-VzwiLw1B7bQDQFRdON0Q_6qve0lN8';

const DATA_STORAGE_KEYS = {
  announcements: 'nexusflow_data_announcements',
  timetable: 'nexusflow_data_timetable',
  classrooms: 'nexusflow_data_classrooms',
  assignments: 'nexusflow_data_assignments',
  events: 'nexusflow_data_events',
  appointments: 'nexusflow_data_appointments',
  users: 'nexusflow_data_users',
  loginLogs: 'nexusflow_data_login_logs'
};

class CampusDataService {
  private client: SupabaseClient | null = null;
  private config: SupabaseConfig = {
    url: DEFAULT_SUPABASE_URL,
    anonKey: DEFAULT_SUPABASE_ANON_KEY,
    isConnected: true
  };

  constructor() {
    this.init();
  }

  private init() {
    // 1. Check local storage or environment or default user credentials
    try {
      const savedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
      let targetUrl = DEFAULT_SUPABASE_URL;
      let targetKey = DEFAULT_SUPABASE_ANON_KEY;

      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (parsed.url && parsed.anonKey) {
          targetUrl = parsed.url;
          targetKey = parsed.anonKey;
        }
      } else {
        const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
        const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
        if (envUrl && envKey) {
          targetUrl = envUrl;
          targetKey = envKey;
        }
      }

      this.config = {
        url: targetUrl,
        anonKey: targetKey,
        isConnected: true,
        lastSyncedAt: new Date().toISOString()
      };
      this.client = createClient(targetUrl, targetKey);
    } catch (e) {
      console.warn('Could not read Supabase configuration from storage', e);
      this.client = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
    }

    // 2. Ensure initial seed data exists in local storage fallback
    this.ensureLocalSeedData();
  }

  private ensureLocalSeedData() {
    try {
      if (!localStorage.getItem(DATA_STORAGE_KEYS.announcements)) {
        localStorage.setItem(DATA_STORAGE_KEYS.announcements, JSON.stringify(initialAnnouncements));
      }
      if (!localStorage.getItem(DATA_STORAGE_KEYS.timetable)) {
        localStorage.setItem(DATA_STORAGE_KEYS.timetable, JSON.stringify(initialTimetable));
      }
      if (!localStorage.getItem(DATA_STORAGE_KEYS.classrooms)) {
        localStorage.setItem(DATA_STORAGE_KEYS.classrooms, JSON.stringify(initialClassrooms));
      }
      if (!localStorage.getItem(DATA_STORAGE_KEYS.assignments)) {
        localStorage.setItem(DATA_STORAGE_KEYS.assignments, JSON.stringify(initialAssignments));
      }
      if (!localStorage.getItem(DATA_STORAGE_KEYS.events)) {
        localStorage.setItem(DATA_STORAGE_KEYS.events, JSON.stringify(initialEvents));
      }
      if (!localStorage.getItem(DATA_STORAGE_KEYS.appointments)) {
        localStorage.setItem(DATA_STORAGE_KEYS.appointments, JSON.stringify(initialAppointments));
      }
      if (!localStorage.getItem(DATA_STORAGE_KEYS.users)) {
        localStorage.setItem(DATA_STORAGE_KEYS.users, JSON.stringify(initialUsers));
      }
      if (!localStorage.getItem(DATA_STORAGE_KEYS.loginLogs)) {
        localStorage.setItem(DATA_STORAGE_KEYS.loginLogs, JSON.stringify(initialLoginLogs));
      }
    } catch (e) {
      console.warn('Unable to populate local storage fallback', e);
    }
  }

  // Configuration management
  public getConfig(): SupabaseConfig {
    return { ...this.config };
  }

  public async setConfig(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!url.trim() || !anonKey.trim()) {
        this.client = null;
        this.config = { url: '', anonKey: '', isConnected: false };
        localStorage.removeItem(CONFIG_STORAGE_KEY);
        return { success: true, message: 'Supabase disconnected. Using local persistent storage.' };
      }

      // Test connection
      const testClient = createClient(url.trim(), anonKey.trim());
      // Ping check
      const { error } = await testClient.from('announcements').select('id').limit(1);

      // If connection succeeds or error is just "relation does not exist" (needs bootstrap)
      const isConnected = !error || (error && (error.code === '42P01' || error.message?.includes('does not exist')));

      if (isConnected) {
        this.client = testClient;
        this.config = {
          url: url.trim(),
          anonKey: anonKey.trim(),
          isConnected: true,
          lastSyncedAt: new Date().toISOString()
        };
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.config));
        return {
          success: true,
          message: error?.code === '42P01'
            ? 'Connected to Supabase! Tables need to be initialized using the SQL script provided.'
            : 'Successfully connected to remote Supabase instance!'
        };
      } else {
        return { success: false, message: `Connection failed: ${error?.message || 'Invalid credentials'}` };
      }
    } catch (err: any) {
      return { success: false, message: `Connection error: ${err?.message || 'Check URL format'}` };
    }
  }

  // --- Announcements ---
  public async getAnnouncements(): Promise<Announcement[]> {
    if (this.client && this.config.isConnected) {
      try {
        const { data, error } = await this.client
          .from('announcements')
          .select('*')
          .order('isUrgent', { ascending: false });
        if (!error && data && data.length > 0) return data as Announcement[];
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to local store', e);
      }
    }
    const local = localStorage.getItem(DATA_STORAGE_KEYS.announcements);
    return local ? JSON.parse(local) : initialAnnouncements;
  }

  public async createAnnouncement(announcement: Omit<Announcement, 'id' | 'publishedAt'>): Promise<Announcement> {
    const newRecord: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`,
      publishedAt: new Date().toISOString()
    };

    if (this.client && this.config.isConnected) {
      try {
        await this.client.from('announcements').insert(newRecord);
      } catch (e) {
        console.warn('Supabase insert failed, saving locally', e);
      }
    }

    const current = await this.getAnnouncements();
    const updated = [newRecord, ...current];
    localStorage.setItem(DATA_STORAGE_KEYS.announcements, JSON.stringify(updated));
    return newRecord;
  }

  // --- Timetable ---
  public async getTimetable(): Promise<TimetableSlot[]> {
    if (this.client && this.config.isConnected) {
      try {
        const { data, error } = await this.client.from('timetables').select('*');
        if (!error && data && data.length > 0) return data as TimetableSlot[];
      } catch (e) {
        console.warn('Supabase timetable fetch failed, falling back', e);
      }
    }
    const local = localStorage.getItem(DATA_STORAGE_KEYS.timetable);
    return local ? JSON.parse(local) : initialTimetable;
  }

  public async addTimetableSlot(slot: Omit<TimetableSlot, 'id'>): Promise<TimetableSlot> {
    const newSlot: TimetableSlot = { ...slot, id: `time-${Date.now()}` };
    if (this.client && this.config.isConnected) {
      try {
        await this.client.from('timetables').insert(newSlot);
      } catch (e) {
        console.warn('Supabase slot insert failed', e);
      }
    }
    const current = await this.getTimetable();
    const updated = [...current, newSlot];
    localStorage.setItem(DATA_STORAGE_KEYS.timetable, JSON.stringify(updated));
    return newSlot;
  }

  // --- Smart Classrooms ---
  public async getClassrooms(): Promise<SmartClassroom[]> {
    if (this.client && this.config.isConnected) {
      try {
        const { data, error } = await this.client.from('classrooms').select('*');
        if (!error && data && data.length > 0) return data as SmartClassroom[];
      } catch (e) {
        console.warn('Supabase classrooms fetch failed', e);
      }
    }
    const local = localStorage.getItem(DATA_STORAGE_KEYS.classrooms);
    return local ? JSON.parse(local) : initialClassrooms;
  }

  public async reserveClassroom(classroomId: string): Promise<SmartClassroom | null> {
    const current = await this.getClassrooms();
    const target = current.find(c => c.id === classroomId);
    if (!target) return null;

    const newStatus: 'available' | 'reserved' = target.status === 'available' ? 'reserved' : 'available';
    const updated: SmartClassroom[] = current.map(c => c.id === classroomId ? { ...c, status: newStatus } : c);
    localStorage.setItem(DATA_STORAGE_KEYS.classrooms, JSON.stringify(updated));

    if (this.client && this.config.isConnected) {
      try {
        await this.client.from('classrooms').update({ status: newStatus }).eq('id', classroomId);
      } catch (e) {
        console.warn('Supabase classroom update failed', e);
      }
    }
    return updated.find(c => c.id === classroomId) || null;
  }

  // --- Assignments ---
  public async getAssignments(): Promise<Assignment[]> {
    if (this.client && this.config.isConnected) {
      try {
        const { data, error } = await this.client.from('assignments').select('*');
        if (!error && data && data.length > 0) return data as Assignment[];
      } catch (e) {
        console.warn('Supabase assignments fetch failed', e);
      }
    }
    const local = localStorage.getItem(DATA_STORAGE_KEYS.assignments);
    return local ? JSON.parse(local) : initialAssignments;
  }

  public async submitAssignment(assignmentId: string, fileName: string): Promise<Assignment | null> {
    const current = await this.getAssignments();
    const now = new Date().toISOString();
    const updated = current.map(asg => {
      if (asg.id === assignmentId) {
        return {
          ...asg,
          status: 'submitted' as const,
          submittedAt: now,
          submittedFileName: fileName
        };
      }
      return asg;
    });

    localStorage.setItem(DATA_STORAGE_KEYS.assignments, JSON.stringify(updated));

    if (this.client && this.config.isConnected) {
      try {
        await this.client.from('assignments').update({
          status: 'submitted',
          submittedAt: now,
          submittedFileName: fileName
        }).eq('id', assignmentId);
      } catch (e) {
        console.warn('Supabase assignment update failed', e);
      }
    }

    return updated.find(a => a.id === assignmentId) || null;
  }

  public async gradeAssignment(assignmentId: string, grade: number, feedback: string): Promise<Assignment | null> {
    const current = await this.getAssignments();
    const updated = current.map(asg => {
      if (asg.id === assignmentId) {
        return {
          ...asg,
          status: 'graded' as const,
          grade,
          feedback
        };
      }
      return asg;
    });

    localStorage.setItem(DATA_STORAGE_KEYS.assignments, JSON.stringify(updated));

    if (this.client && this.config.isConnected) {
      try {
        await this.client.from('assignments').update({
          status: 'graded',
          grade,
          feedback
        }).eq('id', assignmentId);
      } catch (e) {
        console.warn('Supabase grade update failed', e);
      }
    }

    return updated.find(a => a.id === assignmentId) || null;
  }

  // --- Campus Events ---
  public async getEvents(): Promise<CampusEvent[]> {
    if (this.client && this.config.isConnected) {
      try {
        const { data, error } = await this.client.from('events').select('*');
        if (!error && data && data.length > 0) return data as CampusEvent[];
      } catch (e) {
        console.warn('Supabase events fetch failed', e);
      }
    }
    const local = localStorage.getItem(DATA_STORAGE_KEYS.events);
    return local ? JSON.parse(local) : initialEvents;
  }

  public async toggleEventRegistration(eventId: string): Promise<CampusEvent | null> {
    const current = await this.getEvents();
    const target = current.find(e => e.id === eventId);
    if (!target) return null;

    const willRegister = !target.isUserRegistered;
    const newCount = willRegister ? target.registeredCount + 1 : Math.max(0, target.registeredCount - 1);

    const updated = current.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          isUserRegistered: willRegister,
          registeredCount: newCount
        };
      }
      return e;
    });

    localStorage.setItem(DATA_STORAGE_KEYS.events, JSON.stringify(updated));

    if (this.client && this.config.isConnected) {
      try {
        await this.client.from('events').update({
          isUserRegistered: willRegister,
          registeredCount: newCount
        }).eq('id', eventId);
      } catch (e) {
        console.warn('Supabase event registration failed', e);
      }
    }

    return updated.find(e => e.id === eventId) || null;
  }

  // --- Appointments & Advising ---
  public async getAppointments(): Promise<Appointment[]> {
    if (this.client && this.config.isConnected) {
      try {
        const { data, error } = await this.client
          .from('appointments')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const normalized: Appointment[] = data.map((row: any) => ({
            id: row.id,
            studentName: row.student_name || row.studentName || 'Student',
            studentEmail: row.student_email || row.studentEmail || 'student@campus.edu',
            appointmentType: row.appointment_type || row.appointmentType || 'academic_advising',
            facultyOrStaffName: row.faculty_or_staff_name || row.facultyOrStaffName || 'Staff Member',
            preferredDate: row.preferred_date || row.preferredDate || new Date().toISOString().slice(0, 10),
            preferredTime: row.preferred_time || row.preferredTime || '10:00',
            purpose: row.purpose || '',
            location: row.location || 'Campus Center',
            status: row.status || 'pending',
            createdAt: row.created_at || row.createdAt || new Date().toISOString()
          }));
          return normalized;
        }
      } catch (e) {
        console.warn('Supabase appointments fetch failed, using local storage fallback', e);
      }
    }
    const local = localStorage.getItem(DATA_STORAGE_KEYS.appointments);
    return local ? JSON.parse(local) : initialAppointments;
  }

  public async createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt'>): Promise<{ appointment: Appointment; savedToRemote: boolean }> {
    const newRecord: Appointment = {
      ...appointment,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    let savedToRemote = false;

    if (this.client && this.config.isConnected) {
      try {
        const payload = {
          id: newRecord.id,
          student_name: newRecord.studentName,
          student_email: newRecord.studentEmail,
          appointment_type: newRecord.appointmentType,
          faculty_or_staff_name: newRecord.facultyOrStaffName,
          preferred_date: newRecord.preferredDate,
          preferred_time: newRecord.preferredTime,
          purpose: newRecord.purpose,
          location: newRecord.location,
          status: newRecord.status,
          created_at: newRecord.createdAt
        };

        const { error } = await this.client.from('appointments').insert(payload);

        if (!error) {
          savedToRemote = true;
        } else {
          console.warn('Supabase remote insert error on appointments:', error.message);
        }
      } catch (e) {
        console.warn('Supabase remote write exception on appointments:', e);
      }
    }

    const current = await this.getAppointments();
    const updated = [newRecord, ...current.filter(a => a.id !== newRecord.id)];
    localStorage.setItem(DATA_STORAGE_KEYS.appointments, JSON.stringify(updated));
    return { appointment: newRecord, savedToRemote };
  }

  public async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment | null> {
    const current = await this.getAppointments();
    const updated = current.map(apt => (apt.id === id ? { ...apt, status } : apt));
    localStorage.setItem(DATA_STORAGE_KEYS.appointments, JSON.stringify(updated));

    if (this.client && this.config.isConnected) {
      try {
        await this.client.from('appointments').update({ status }).eq('id', id);
      } catch (e) {
        console.warn('Supabase appointment status update failed', e);
      }
    }

    return updated.find(a => a.id === id) || null;
  }

  // --- User Directory & Roles ---
  public async getUsers(): Promise<CampusUser[]> {
    if (this.client && this.config.isConnected) {
      try {
        const { data, error } = await this.client
          .from('users')
          .select('*')
          .order('name', { ascending: true });

        if (!error && data && data.length > 0) {
          const normalized: CampusUser[] = data.map((row: any) => ({
            id: row.id,
            name: row.name,
            email: row.email,
            role: row.role || 'student',
            department: row.department || '',
            titleOrMajor: row.title_or_major || row.titleOrMajor || '',
            idNumber: row.id_number || row.idNumber || '',
            avatarUrl: row.avatar_url || row.avatarUrl,
            status: row.status || 'active',
            joinedDate: row.joined_date || row.joinedDate || '2024'
          }));
          return normalized;
        }
      } catch (e) {
        console.warn('Supabase users fetch failed, using local storage fallback', e);
      }
    }
    const local = localStorage.getItem(DATA_STORAGE_KEYS.users);
    return local ? JSON.parse(local) : initialUsers;
  }

  public async createUser(user: Omit<CampusUser, 'id' | 'joinedDate'>): Promise<CampusUser> {
    const newRecord: CampusUser = {
      ...user,
      id: `usr-${Date.now()}`,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    if (this.client && this.config.isConnected) {
      try {
        await this.client.from('users').insert({
          id: newRecord.id,
          name: newRecord.name,
          email: newRecord.email,
          role: newRecord.role,
          department: newRecord.department,
          title_or_major: newRecord.titleOrMajor,
          id_number: newRecord.idNumber,
          avatar_url: newRecord.avatarUrl,
          status: newRecord.status,
          joined_date: newRecord.joinedDate
        });
      } catch (e) {
        console.warn('Supabase user insert failed, stored locally', e);
      }
    }

    const current = await this.getUsers();
    const updated = [newRecord, ...current];
    localStorage.setItem(DATA_STORAGE_KEYS.users, JSON.stringify(updated));
    return newRecord;
  }

  public async updateUser(id: string, updates: Partial<CampusUser>): Promise<CampusUser | null> {
    const current = await this.getUsers();
    const updated = current.map(u => (u.id === id ? { ...u, ...updates } : u));
    localStorage.setItem(DATA_STORAGE_KEYS.users, JSON.stringify(updated));

    if (this.client && this.config.isConnected) {
      try {
        await this.client.from('users').update({
          ...updates,
          title_or_major: updates.titleOrMajor,
          id_number: updates.idNumber,
          avatar_url: updates.avatarUrl
        }).eq('id', id);
      } catch (e) {
        console.warn('Supabase user update failed', e);
      }
    }

    return updated.find(u => u.id === id) || null;
  }

  public async deleteUser(id: string): Promise<boolean> {
    const current = await this.getUsers();
    const filtered = current.filter(u => u.id !== id);
    localStorage.setItem(DATA_STORAGE_KEYS.users, JSON.stringify(filtered));

    if (this.client && this.config.isConnected) {
      try {
        await this.client.from('users').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase user delete failed', e);
      }
    }
    return true;
  }

  // --- Smart Classroom & IoT Sensor Overrides ---
  public async overrideClassroomSensors(roomId: string, overrides: Partial<SmartClassroom>): Promise<SmartClassroom | null> {
    const current = await this.getClassrooms();
    const updated = current.map(c => (c.id === roomId ? { ...c, ...overrides } : c));
    localStorage.setItem(DATA_STORAGE_KEYS.classrooms, JSON.stringify(updated));

    if (this.client && this.config.isConnected) {
      try {
        await this.client.from('classrooms').update(overrides).eq('id', roomId);
      } catch (e) {
        console.warn('Supabase classroom override failed', e);
      }
    }

    return updated.find(c => c.id === roomId) || null;
  }

  // --- Login History & Authentication Audit Logs ---
  public async getLoginLogs(): Promise<LoginAuditLog[]> {
    if (this.client && this.config.isConnected) {
      try {
        const { data, error } = await this.client
          .from('login_logs')
          .select('*')
          .order('timestamp', { ascending: false });

        if (!error && data && data.length > 0) {
          const normalized: LoginAuditLog[] = data.map((row: any) => ({
            id: row.id,
            userId: row.user_id || row.userId,
            name: row.name,
            email: row.email,
            idNumber: row.id_number || row.idNumber || '',
            role: row.role || 'student',
            department: row.department || '',
            timestamp: row.timestamp || new Date().toISOString(),
            loginMethod: row.login_method || row.loginMethod || 'credential_login',
            ipSimulated: row.ip_simulated || row.ipSimulated || '10.24.12.8 (Campus Node)',
            status: row.status || 'authorized'
          }));
          return normalized;
        }
      } catch (e) {
        console.warn('Supabase login_logs fetch failed, using local fallback', e);
      }
    }
    const local = localStorage.getItem(DATA_STORAGE_KEYS.loginLogs);
    return local ? JSON.parse(local) : initialLoginLogs;
  }

  public async recordLogin(details: {
    idNumber: string;
    name: string;
    email: string;
    role: UserRole;
    department?: string;
    titleOrMajor?: string;
  }, method: 'credential_login' | 'role_preset'): Promise<{ user: CampusUser; log: LoginAuditLog }> {
    const currentUsers = await this.getUsers();
    const normalizedEmail = details.email.trim().toLowerCase();
    const normalizedId = details.idNumber.trim().toUpperCase();
    const nowIso = new Date().toISOString();

    // 1. Locate or create member in user directory
    let targetUser = currentUsers.find(
      u => u.email.trim().toLowerCase() === normalizedEmail ||
           u.idNumber.trim().toUpperCase() === normalizedId
    );

    if (targetUser) {
      targetUser = {
        ...targetUser,
        name: details.name.trim() || targetUser.name,
        idNumber: details.idNumber.trim() || targetUser.idNumber,
        role: details.role || targetUser.role,
        department: details.department || targetUser.department,
        titleOrMajor: details.titleOrMajor || targetUser.titleOrMajor,
        lastLoginAt: nowIso,
        loginCount: (targetUser.loginCount || 1) + 1
      };
      await this.updateUser(targetUser.id, targetUser);
    } else {
      const defaultDept = details.department || (
        details.role === 'faculty' ? 'Faculty Academic Board' :
        details.role === 'admin' ? 'Campus Administration' : 'School of Computer Science'
      );
      const defaultTitle = details.titleOrMajor || (
        details.role === 'faculty' ? 'Faculty Instructor' :
        details.role === 'admin' ? 'Administrative Officer' : 'B.S. Candidate'
      );

      const newUserPayload = {
        name: details.name.trim(),
        email: details.email.trim(),
        role: details.role,
        department: defaultDept,
        titleOrMajor: defaultTitle,
        idNumber: details.idNumber.trim(),
        status: 'active' as const,
        lastLoginAt: nowIso,
        loginCount: 1
      };
      targetUser = await this.createUser(newUserPayload);
    }

    // 2. Create immutable Login Audit Log
    const logRecord: LoginAuditLog = {
      id: `log-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      userId: targetUser.id,
      name: targetUser.name,
      email: targetUser.email,
      idNumber: targetUser.idNumber,
      role: targetUser.role,
      department: targetUser.department,
      timestamp: nowIso,
      loginMethod: method,
      ipSimulated: `10.24.${Math.floor(10 + Math.random() * 80)}.${Math.floor(10 + Math.random() * 200)} (Campus Node)`,
      status: 'authorized'
    };

    // 3. Persist to Supabase login_logs table
    if (this.client && this.config.isConnected) {
      try {
        await this.client.from('login_logs').insert({
          id: logRecord.id,
          user_id: logRecord.userId,
          name: logRecord.name,
          email: logRecord.email,
          id_number: logRecord.idNumber,
          role: logRecord.role,
          department: logRecord.department,
          timestamp: logRecord.timestamp,
          login_method: logRecord.loginMethod,
          ip_simulated: logRecord.ipSimulated,
          status: logRecord.status
        });
      } catch (e) {
        console.warn('Supabase login_logs insert failed, cached locally', e);
      }
    }

    // 4. Update local storage audit stream
    const existingLogs = await this.getLoginLogs();
    const updatedLogs = [logRecord, ...existingLogs];
    localStorage.setItem(DATA_STORAGE_KEYS.loginLogs, JSON.stringify(updatedLogs));

    return { user: targetUser, log: logRecord };
  }

  // Reset to factory seed data
  public resetToDefaults() {
    localStorage.setItem(DATA_STORAGE_KEYS.announcements, JSON.stringify(initialAnnouncements));
    localStorage.setItem(DATA_STORAGE_KEYS.timetable, JSON.stringify(initialTimetable));
    localStorage.setItem(DATA_STORAGE_KEYS.classrooms, JSON.stringify(initialClassrooms));
    localStorage.setItem(DATA_STORAGE_KEYS.assignments, JSON.stringify(initialAssignments));
    localStorage.setItem(DATA_STORAGE_KEYS.events, JSON.stringify(initialEvents));
    localStorage.setItem(DATA_STORAGE_KEYS.appointments, JSON.stringify(initialAppointments));
    localStorage.setItem(DATA_STORAGE_KEYS.users, JSON.stringify(initialUsers));
    localStorage.setItem(DATA_STORAGE_KEYS.loginLogs, JSON.stringify(initialLoginLogs));
  }

  // Export JSON dump
  public async exportAllData(): Promise<string> {
    const data = {
      announcements: await this.getAnnouncements(),
      timetable: await this.getTimetable(),
      classrooms: await this.getClassrooms(),
      assignments: await this.getAssignments(),
      events: await this.getEvents(),
      appointments: await this.getAppointments(),
      users: await this.getUsers(),
      loginLogs: await this.getLoginLogs(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  // SQL Script for Supabase Table Generation
  public getBootstrapSql(): string {
    return `-- =========================================================
-- OmniCampus Smart University Management System Schema
-- Run this in your Supabase Project > SQL Editor
-- =========================================================

-- 1. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  "isUrgent" BOOLEAN DEFAULT false,
  "publishedAt" TIMESTAMPTZ DEFAULT now(),
  "authorName" TEXT,
  "authorRole" TEXT,
  department TEXT
);

-- 2. Timetables Table
CREATE TABLE IF NOT EXISTS timetables (
  id TEXT PRIMARY KEY,
  "courseCode" TEXT NOT NULL,
  "courseName" TEXT NOT NULL,
  instructor TEXT NOT NULL,
  "dayOfWeek" TEXT NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  "roomId" TEXT NOT NULL,
  "roomName" TEXT,
  building TEXT,
  type TEXT DEFAULT 'lecture',
  credits INT DEFAULT 3
);

-- 3. Smart Classrooms & IoT Sensors Table
CREATE TABLE IF NOT EXISTS classrooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  building TEXT NOT NULL,
  floor INT DEFAULT 1,
  capacity INT NOT NULL,
  "currentOccupancy" INT DEFAULT 0,
  "temperatureCelsius" NUMERIC DEFAULT 21.0,
  "airQualityAqi" INT DEFAULT 25,
  "noiseLevelDb" INT DEFAULT 35,
  "hasProjector" BOOLEAN DEFAULT true,
  "hasLectureRecording" BOOLEAN DEFAULT true,
  "hasGpuWorkstations" BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'available'
);

-- 4. Coursework Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
  id TEXT PRIMARY KEY,
  "courseCode" TEXT NOT NULL,
  "courseName" TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  "dueDate" TIMESTAMPTZ NOT NULL,
  "totalPoints" INT DEFAULT 100,
  status TEXT DEFAULT 'pending',
  grade INT,
  feedback TEXT,
  "submittedAt" TIMESTAMPTZ,
  "submittedFileName" TEXT
);

-- 5. Campus Events & Registration Table
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  "roomId" TEXT,
  capacity INT NOT NULL,
  "registeredCount" INT DEFAULT 0,
  "isUserRegistered" BOOLEAN DEFAULT false,
  speaker TEXT,
  organizer TEXT,
  "pointsAwarded" INT DEFAULT 10
);

-- 6. Campus Appointments & Advising Table
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  appointment_type TEXT NOT NULL,
  faculty_or_staff_name TEXT NOT NULL,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  purpose TEXT,
  location TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Campus Users Directory Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  department TEXT,
  title_or_major TEXT,
  id_number TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'active',
  joined_date TEXT,
  last_login_at TIMESTAMPTZ,
  login_count INT DEFAULT 1
);

-- 8. Campus Authentication & Login History Audit Table
CREATE TABLE IF NOT EXISTS login_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  id_number TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT,
  timestamp TIMESTAMPTZ DEFAULT now(),
  login_method TEXT NOT NULL,
  ip_simulated TEXT,
  status TEXT DEFAULT 'authorized'
);

-- Enable Row Level Security (RLS) with Public Access
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write announcements" ON announcements FOR ALL USING (true);
CREATE POLICY "Allow public read/write timetables" ON timetables FOR ALL USING (true);
CREATE POLICY "Allow public read/write classrooms" ON classrooms FOR ALL USING (true);
CREATE POLICY "Allow public read/write assignments" ON assignments FOR ALL USING (true);
CREATE POLICY "Allow public read/write events" ON events FOR ALL USING (true);
CREATE POLICY "Allow public read/write appointments" ON appointments FOR ALL USING (true);
CREATE POLICY "Allow public read/write users" ON users FOR ALL USING (true);
CREATE POLICY "Allow public read/write login_logs" ON login_logs FOR ALL USING (true);
`;
  }
}

export const campusDb = new CampusDataService();
