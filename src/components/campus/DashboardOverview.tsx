/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  UserRole,
  Announcement,
  TimetableSlot,
  SmartClassroom,
  Assignment,
  CampusEvent,
  Appointment
} from '../../types/campus';
import {
  Clock,
  BookOpen,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Cpu,
  Plus,
  CalendarCheck
} from 'lucide-react';

interface DashboardOverviewProps {
  role: UserRole;
  announcements: Announcement[];
  timetable: TimetableSlot[];
  classrooms: SmartClassroom[];
  assignments: Assignment[];
  events: CampusEvent[];
  appointments?: Appointment[];
  onNavigate: (tab: string) => void;
  onOpenNewAnnouncement: () => void;
  onOpenNewAssignment: () => void;
  onOpenNewAppointment?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  role,
  announcements,
  timetable,
  classrooms,
  assignments,
  events,
  appointments = [],
  onNavigate,
  onOpenNewAnnouncement,
  onOpenNewAssignment,
  onOpenNewAppointment
}) => {
  // Compute key metrics
  const urgentNotice = announcements.find(a => a.isUrgent);
  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const registeredEvents = events.filter(e => e.isUserRegistered);

  // Compute smart classroom average occupancy
  const totalCapacity = classrooms.reduce((acc, c) => acc + c.capacity, 0);
  const totalOccupancy = classrooms.reduce((acc, c) => acc + c.currentOccupancy, 0);
  const occupancyPercent = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;

  // Next class today (Monday default for demo)
  const todayClasses = timetable.filter(t => t.dayOfWeek === 'Monday');
  const nextClass = todayClasses[0] || timetable[0];

  return (
    <div className="space-y-6">
      {/* Role Hero Card */}
      <div className="rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 dark:from-slate-900/90 dark:via-[#0E1526] dark:to-emerald-950/20 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Smart Campus · Academic Year 2026</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {role === 'student' && 'Welcome back, Alex Rivera'}
            {role === 'faculty' && 'Professor Portal: Dr. Sterling'}
            {role === 'admin' && 'Campus Operations & Academic Administration'}
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {role === 'student' &&
              'Track your lectures, submit coursework, reserve IoT smart classrooms, and register for campus events in one centralized space.'}
            {role === 'faculty' &&
              'Manage your course schedules, publish coursework rubrics, review student submissions, and monitor teaching laboratory telemetry.'}
            {role === 'admin' &&
              'Broadcast high-priority university announcements, audit building capacity across smart classrooms, and synchronize campus databases with Supabase.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {role === 'student' && (
              <>
                <button
                  onClick={() => onNavigate('timetable')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>Today's Schedule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('assignments')}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
                >
                  View Coursework ({pendingAssignments.length})
                </button>
                <button
                  onClick={() => onNavigate('appointments')}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Book Advising</span>
                </button>
              </>
            )}

            {role === 'faculty' && (
              <>
                <button
                  onClick={onOpenNewAssignment}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Assignment</span>
                </button>
                <button
                  onClick={() => onNavigate('assignments')}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
                >
                  Grade Submissions
                </button>
              </>
            )}

            {role === 'admin' && (
              <>
                <button
                  onClick={onOpenNewAnnouncement}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Post Announcement</span>
                </button>
                <button
                  onClick={() => onNavigate('classrooms')}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
                >
                  Classroom Sensor Monitor
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Urgent Announcement Alert Strip (if active) */}
      {urgentNotice && (
        <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 dark:bg-amber-950/20 text-slate-900 dark:text-slate-100 flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Official Campus Notice · {urgentNotice.category}
              </div>
              <div className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">
                {urgentNotice.title}
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('announcements')}
            className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline shrink-0 whitespace-nowrap"
          >
            Read Circular →
          </button>
        </div>
      )}

      {/* 4 Quantitative Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Next Lecture */}
        <div
          onClick={() => onNavigate('timetable')}
          className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-medium">Next Lecture</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {nextClass ? nextClass.courseCode : 'No Class'}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">
              {nextClass ? `${nextClass.startTime} – ${nextClass.endTime} · ${nextClass.roomName}` : 'All caught up today'}
            </div>
          </div>
        </div>

        {/* Metric 2: Pending Assignments */}
        <div
          onClick={() => onNavigate('assignments')}
          className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-medium">Due Coursework</span>
            <BookOpen className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {pendingAssignments.length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {pendingAssignments.length > 0 ? 'Upcoming in next 7 days' : 'Zero overdue tasks'}
            </div>
          </div>
        </div>

        {/* Metric 3: Campus Events */}
        <div
          onClick={() => onNavigate('events')}
          className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-medium">My Registered Events</span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {registeredEvents.length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {events.length} total events scheduled
            </div>
          </div>
        </div>

        {/* Metric 4: Smart Classroom Occupancy */}
        <div
          onClick={() => onNavigate('classrooms')}
          className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-medium">Campus Occupancy</span>
            <Cpu className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {occupancyPercent}%
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {classrooms.filter(c => c.status === 'available').length} of {classrooms.length} rooms free
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Today's Class Timeline & Upcoming Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule Card */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Today's Schedule (Monday)
              </h2>
            </div>
            <button
              onClick={() => onNavigate('timetable')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Full Week →
            </button>
          </div>

          <div className="space-y-3">
            {todayClasses.map(slot => (
              <div
                key={slot.id}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                      {slot.courseCode}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{slot.type}</span>
                    <span aria-hidden="true">·</span>
                    <span>{slot.credits} Credits</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {slot.courseName}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {slot.instructor} · {slot.roomName}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                    {slot.startTime} – {slot.endTime}
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {slot.building}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Assignments & Submissions */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Upcoming Coursework & Tasks
              </h2>
            </div>
            <button
              onClick={() => onNavigate('assignments')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              All Assignments →
            </button>
          </div>

          <div className="space-y-3">
            {assignments.slice(0, 3).map(asg => (
              <div
                key={asg.id}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                      {asg.courseCode}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{asg.totalPoints} pts</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {asg.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Due: {new Date(asg.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {asg.status === 'graded' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{asg.grade}/{asg.totalPoints}</span>
                    </span>
                  )}
                  {asg.status === 'submitted' && (
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Turned In
                    </span>
                  )}
                  {asg.status === 'pending' && (
                    <button
                      onClick={() => onNavigate('assignments')}
                      className="px-2.5 py-1 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
