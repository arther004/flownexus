/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TimetableSlot, UserRole } from '../../types/campus';
import {
  Clock,
  MapPin,
  User,
  Plus,
  X,
  Check
} from 'lucide-react';

interface TimetableViewProps {
  role: UserRole;
  timetable: TimetableSlot[];
  onAddSlot: (slot: Omit<TimetableSlot, 'id'>) => Promise<void>;
  onSelectRoom?: (roomId: string) => void;
}

const DAYS: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'> = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday'
];

export const TimetableView: React.FC<TimetableViewProps> = ({
  role,
  timetable,
  onAddSlot,
  onSelectRoom
}) => {
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [filterType, setFilterType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<any>('Monday');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:30');
  const [roomId, setRoomId] = useState('room-101');
  const [roomName, setRoomName] = useState('Turing Auditorium 101');
  const [building, setBuilding] = useState('Turing Hall');
  const [type, setType] = useState<any>('lecture');
  const [credits, setCredits] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredSlots = timetable.filter(slot => {
    const dayMatch = slot.dayOfWeek === selectedDay;
    const typeMatch = filterType === 'all' || slot.type === filterType;
    return dayMatch && typeMatch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseName.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddSlot({
        courseCode: courseCode.trim(),
        courseName: courseName.trim(),
        instructor: instructor.trim() || 'Staff Faculty',
        dayOfWeek,
        startTime,
        endTime,
        roomId,
        roomName,
        building,
        type,
        credits: Number(credits)
      });
      setIsModalOpen(false);
      // Reset
      setCourseCode('');
      setCourseName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Class Timetable & Schedules
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Synchronized course schedules with integrated smart classroom allocations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Type Segmented Control */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterType === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setFilterType('lecture')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterType === 'lecture'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Lectures
            </button>
            <button
              onClick={() => setFilterType('lab')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterType === 'lab'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Labs
            </button>
          </div>

          {(role === 'faculty' || role === 'admin') && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Lecture Slot</span>
            </button>
          )}
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {DAYS.map(day => {
          const count = timetable.filter(t => t.dayOfWeek === day).length;
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-2 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500'
              }`}
            >
              <span>{day}</span>
              <span
                className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded-md ${
                  isSelected
                    ? 'bg-emerald-700/60 text-emerald-100'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Schedule Slots Timeline */}
      {filteredSlots.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No Classes Scheduled for {selectedDay}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            You have no academic obligations matching this filter on {selectedDay}. Enjoy research and study hours!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSlots.map(slot => (
            <div
              key={slot.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-emerald-500/50 transition-all flex flex-col justify-between gap-4 group"
            >
              <div>
                {/* Meta row without pills */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {slot.courseCode}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{slot.type}</span>
                    <span aria-hidden="true">·</span>
                    <span>{slot.credits} Credits</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-xs font-semibold text-slate-900 dark:text-white">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{slot.startTime} – {slot.endTime}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {slot.courseName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mt-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{slot.instructor}</span>
                  </div>
                </div>
              </div>

              {/* Classroom location link */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{slot.roomName}</span>
                </div>
                {onSelectRoom && (
                  <button
                    onClick={() => onSelectRoom(slot.roomId)}
                    className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    View Room Sensors →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Slot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Add Academic Timetable Slot
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Publish a new lecture or lab session to the university database.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS-450"
                    value={courseCode}
                    onChange={e => setCourseCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Day of Week
                  </label>
                  <select
                    value={dayOfWeek}
                    onChange={e => setDayOfWeek(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  >
                    {DAYS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quantum Computing Algorithms"
                  value={courseName}
                  onChange={e => setCourseName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Instructor
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. A. Turing"
                    value={instructor}
                    onChange={e => setInstructor(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  >
                    <option value="lecture">Lecture</option>
                    <option value="lab">Laboratory</option>
                    <option value="seminar">Seminar</option>
                    <option value="tutorial">Tutorial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Room Allocation
                  </label>
                  <select
                    value={roomId}
                    onChange={e => {
                      setRoomId(e.target.value);
                      if (e.target.value === 'room-101') {
                        setRoomName('Turing Auditorium 101');
                        setBuilding('Turing Hall');
                      } else if (e.target.value === 'room-202') {
                        setRoomName('Lovelace Lab 202');
                        setBuilding('Ada Lovelace Center');
                      } else {
                        setRoomName('Newton Hardware Studio 305');
                        setBuilding('Newton Complex');
                      }
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  >
                    <option value="room-101">Turing Auditorium 101</option>
                    <option value="room-202">Lovelace Lab 202</option>
                    <option value="room-305">Newton Hardware Studio 305</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Credits
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={credits}
                    onChange={e => setCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Saving...' : 'Save Slot'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
