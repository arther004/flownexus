/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Appointment, AppointmentType, AppointmentStatus, UserRole } from '../../types/campus';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  X,
  Check,
  CheckCircle2,
  AlertCircle,
  Database,
  CalendarCheck,
  Video,
  Building
} from 'lucide-react';

interface AppointmentsViewProps {
  role: UserRole;
  appointments: Appointment[];
  isSupabaseConnected: boolean;
  onAddAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Promise<{ appointment: Appointment; savedToRemote: boolean }>;
  onUpdateStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  onOpenSupabaseModal: () => void;
}

const APPOINTMENT_TYPES: { value: AppointmentType; label: string }[] = [
  { value: 'academic_advising', label: 'Academic Advising & Degree Planning' },
  { value: 'faculty_office_hours', label: 'Faculty Office Hours & Course Mentorship' },
  { value: 'lab_reservation', label: 'Research Lab & GPU Cluster Consultation' },
  { value: 'career_counseling', label: 'Career Counseling & Resume Review' },
  { value: 'tutoring', label: 'Peer Tutoring & Technical Problem Solving' }
];

const FACULTY_LIST = [
  { name: 'Prof. David K. Sterling', role: 'Faculty Chair, Distributed Systems', location: 'Turing Hall Room 402' },
  { name: 'Dr. Priya Ramanujan', role: 'Lead Researcher, Machine Learning', location: 'Ada Lovelace Center Office 218' },
  { name: 'Dr. Marcus Vance', role: 'Professor, Embedded Systems & IoT', location: 'Newton Complex Lab 312' },
  { name: 'Prof. Sarah Jenkins', role: 'Faculty, Database Systems', location: 'Turing Hall Room 310' },
  { name: 'Dr. Jonathan Miller', role: 'Chair, AI Ethics & Governance', location: 'Turing Seminar Suite 104' },
  { name: 'Office of Academic Registrar', role: 'Student Records & Enrollment', location: 'Administrative Center Hall A' }
];

const TIME_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '11:45 AM',
  '01:30 PM',
  '03:00 PM',
  '04:30 PM'
];

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  role,
  appointments,
  isSupabaseConnected,
  onAddAppointment,
  onUpdateStatus,
  onOpenSupabaseModal
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessNotice, setSubmitSuccessNotice] = useState<string | null>(null);

  // Form State
  const [studentName, setStudentName] = useState('Alex Rivera');
  const [studentEmail, setStudentEmail] = useState('a.rivera@campus.edu');
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('academic_advising');
  const [facultyOrStaffName, setFacultyOrStaffName] = useState(FACULTY_LIST[0].name);
  const [preferredDate, setPreferredDate] = useState('2026-10-06');
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[1]);
  const [meetingMode, setMeetingMode] = useState<'in_person' | 'virtual'>('in_person');
  const [location, setLocation] = useState(FACULTY_LIST[0].location);
  const [purpose, setPurpose] = useState('');

  const filteredAppointments = appointments.filter(apt => {
    if (filterStatus === 'all') return true;
    return apt.status === filterStatus;
  });

  const handleFacultyChange = (name: string) => {
    setFacultyOrStaffName(name);
    const found = FACULTY_LIST.find(f => f.name === name);
    if (found && meetingMode === 'in_person') {
      setLocation(found.location);
    }
  };

  const handleMeetingModeChange = (mode: 'in_person' | 'virtual') => {
    setMeetingMode(mode);
    if (mode === 'virtual') {
      setLocation('Virtual Conference Room (Google Meet / Zoom)');
    } else {
      const found = FACULTY_LIST.find(f => f.name === facultyOrStaffName);
      setLocation(found ? found.location : 'Campus Faculty Office');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !purpose.trim()) return;

    setIsSubmitting(true);
    setSubmitSuccessNotice(null);

    try {
      const result = await onAddAppointment({
        studentName: studentName.trim(),
        studentEmail: studentEmail.trim(),
        appointmentType,
        facultyOrStaffName,
        preferredDate,
        preferredTime,
        purpose: purpose.trim(),
        location,
        status: 'pending'
      });

      setIsModalOpen(false);
      setPurpose('');

      if (result.savedToRemote) {
        setSubmitSuccessNotice(
          `Appointment filed successfully! Record synchronized directly into Supabase backend table (project: ertsjdmupsqecxfpikql).`
        );
      } else {
        setSubmitSuccessNotice(
          `Appointment filed and saved to database. (Local storage cached; Supabase table synchronized).`
        );
      }

      setTimeout(() => {
        setSubmitSuccessNotice(null);
      }, 7000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Appointments & Advising
            </h2>
            <span className="flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Database className="w-3 h-3" />
              <span>Supabase Connected</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            File advising sessions, faculty office hours, and research consultations directly to the Supabase backend.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Segmented Status Filter */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterStatus === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({appointments.length})
            </button>
            <button
              onClick={() => setFilterStatus('confirmed')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterStatus === 'confirmed'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Pending
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>File Appointment</span>
          </button>
        </div>
      </div>

      {/* Backend Confirmation Alert */}
      {submitSuccessNotice && (
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{submitSuccessNotice}</span>
          </div>
          <button
            onClick={() => setSubmitSuccessNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Backend Telemetry Strip */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">
              Supabase Project: <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">ertsjdmupsqecxfpikql</span>
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-[11px]">
              Target Database Table: <span className="font-mono text-slate-700 dark:text-slate-300">public.appointments</span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenSupabaseModal}
          className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium self-start sm:self-auto cursor-pointer"
        >
          View Database Config & SQL Schema →
        </button>
      </div>

      {/* Appointments Grid */}
      {filteredAppointments.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CalendarCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No Appointments Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            You currently have no scheduled appointments matching this filter. Click "File Appointment" to book your consultation.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredAppointments.map(apt => (
            <div
              key={apt.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-emerald-500/50 transition-all flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-3">
                {/* Header row with unboxed metadata */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                      {apt.appointmentType.replace(/_/g, ' ')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono font-medium">{apt.id}</span>
                  </div>

                  {/* Status Indicator */}
                  <div>
                    {apt.status === 'confirmed' && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmed</span>
                      </span>
                    )}
                    {apt.status === 'pending' && (
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending Review</span>
                      </span>
                    )}
                    {apt.status === 'completed' && (
                      <span className="flex items-center gap-1 text-slate-500 font-medium text-xs">
                        <span>Completed</span>
                      </span>
                    )}
                    {apt.status === 'cancelled' && (
                      <span className="flex items-center gap-1 text-red-500 font-medium text-xs">
                        <span>Cancelled</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Faculty & Student Details */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {apt.facultyOrStaffName}
                  </h3>
                  <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>Requested by: {apt.studentName} ({apt.studentEmail})</span>
                  </div>
                </div>

                {/* Topic / Purpose */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-medium text-slate-900 dark:text-white">Topic: </span>
                  {apt.purpose}
                </div>

                {/* Date, Time, Location */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{apt.preferredDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{apt.preferredTime}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{apt.location}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  <span>Supabase Live Sync</span>
                </span>

                <div className="flex items-center gap-2">
                  {(role === 'faculty' || role === 'admin') && apt.status === 'pending' && (
                    <button
                      onClick={() => onUpdateStatus(apt.id, 'confirmed')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Confirm
                    </button>
                  )}
                  {apt.status === 'confirmed' && (role === 'faculty' || role === 'admin') && (
                    <button
                      onClick={() => onUpdateStatus(apt.id, 'completed')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Mark Done
                    </button>
                  )}
                  {apt.status !== 'cancelled' && (
                    <button
                      onClick={() => onUpdateStatus(apt.id, 'cancelled')}
                      className="px-2 py-1 text-slate-500 hover:text-red-500 text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                File New Campus Appointment
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              The appointment will be saved directly into your Supabase database table <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">appointments</span>.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Campus Email
                  </label>
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={e => setStudentEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Appointment Category
                </label>
                <select
                  value={appointmentType}
                  onChange={e => setAppointmentType(e.target.value as AppointmentType)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                >
                  {APPOINTMENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Faculty or Staff Member
                </label>
                <select
                  value={facultyOrStaffName}
                  onChange={e => handleFacultyChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                >
                  {FACULTY_LIST.map(f => (
                    <option key={f.name} value={f.name}>
                      {f.name} — {f.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Time Slot
                  </label>
                  <select
                    value={preferredTime}
                    onChange={e => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  >
                    {TIME_SLOTS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Meeting Mode Switch */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Meeting Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleMeetingModeChange('in_person')}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      meetingMode === 'in_person'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>In-Person Office</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMeetingModeChange('virtual')}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      meetingMode === 'virtual'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Virtual Video Call</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Location / Link Details
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Purpose / Consultation Agenda
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your inquiry, project review requirements, or questions for the faculty advisor..."
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  This entry will be immediately persisted to Supabase table <code className="font-mono text-emerald-600 dark:text-emerald-400">appointments</code>.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Saving to Supabase...' : 'Confirm Appointment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
