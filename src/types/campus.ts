/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'student' | 'faculty' | 'admin';

export type AnnouncementCategory = 'urgent' | 'academic' | 'campus' | 'career';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  isUrgent: boolean;
  publishedAt: string;
  authorName: string;
  authorRole: string;
  department: string;
}

export type ClassType = 'lecture' | 'lab' | 'seminar' | 'tutorial';

export interface TimetableSlot {
  id: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  roomId: string;
  roomName: string;
  building: string;
  type: ClassType;
  credits: number;
}

export interface SmartClassroom {
  id: string;
  name: string;
  code: string;
  building: string;
  floor: number;
  capacity: number;
  currentOccupancy: number;
  temperatureCelsius: number;
  airQualityAqi: number;
  noiseLevelDb: number;
  hasProjector: boolean;
  hasLectureRecording: boolean;
  hasGpuWorkstations: boolean;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
}

export type SubmissionStatus = 'pending' | 'submitted' | 'graded';

export interface Assignment {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string; // ISO string
  totalPoints: number;
  status: SubmissionStatus;
  grade?: number;
  feedback?: string;
  submittedAt?: string;
  submittedFileName?: string;
}

export type EventCategory = 'tech' | 'career' | 'academic' | 'cultural' | 'sports';

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  roomId?: string;
  capacity: number;
  registeredCount: number;
  isUserRegistered: boolean;
  speaker?: string;
  organizer: string;
  pointsAwarded?: number;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  lastSyncedAt?: string;
}

export type AppointmentType = 'academic_advising' | 'faculty_office_hours' | 'lab_reservation' | 'career_counseling' | 'tutoring';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  studentName: string;
  studentEmail: string;
  appointmentType: AppointmentType;
  facultyOrStaffName: string;
  preferredDate: string;
  preferredTime: string;
  purpose: string;
  location: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface CampusUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  titleOrMajor: string;
  idNumber: string;
  avatarUrl?: string;
  status: 'active' | 'suspended';
  joinedDate: string;
  lastLoginAt?: string;
  loginCount?: number;
}

export interface LoginAuditLog {
  id: string;
  userId?: string;
  name: string;
  email: string;
  idNumber: string;
  role: UserRole;
  department: string;
  timestamp: string;
  loginMethod: 'credential_login' | 'role_preset';
  ipSimulated?: string;
  status: 'authorized' | 'flagged';
}
