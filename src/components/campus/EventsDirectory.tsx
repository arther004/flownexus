/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CampusEvent, UserRole } from '../../types/campus';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  Ticket,
  QrCode,
  X,
  Award,
  Sparkles
} from 'lucide-react';

interface EventsDirectoryProps {
  role: UserRole;
  events: CampusEvent[];
  onToggleRegister: (eventId: string) => Promise<void>;
}

export const EventsDirectory: React.FC<EventsDirectoryProps> = ({
  role: _role,
  events,
  onToggleRegister
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedPassEvent, setSelectedPassEvent] = useState<CampusEvent | null>(null);
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  const filteredEvents = events.filter(e => {
    if (categoryFilter === 'all') return true;
    return e.category === categoryFilter;
  });

  const handleRegister = async (eventId: string) => {
    setRegisteringId(eventId);
    try {
      await onToggleRegister(eventId);
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Campus Events & Workshop Registration
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Discover upcoming hackathons, tech talks, industry symposiums, and cultural festivals.
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs overflow-x-auto">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-md transition-colors shrink-0 ${
              categoryFilter === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All ({events.length})
          </button>
          <button
            onClick={() => setCategoryFilter('tech')}
            className={`px-2.5 py-1 rounded-md transition-colors shrink-0 ${
              categoryFilter === 'tech'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Hackathons & Tech
          </button>
          <button
            onClick={() => setCategoryFilter('career')}
            className={`px-2.5 py-1 rounded-md transition-colors shrink-0 ${
              categoryFilter === 'career'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Career & Fairs
          </button>
          <button
            onClick={() => setCategoryFilter('cultural')}
            className={`px-2.5 py-1 rounded-md transition-colors shrink-0 ${
              categoryFilter === 'cultural'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Cultural & Arts
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map(evt => {
          const fillPercentage = Math.round((evt.registeredCount / evt.capacity) * 100);
          const isAlmostFull = fillPercentage >= 85;

          return (
            <div
              key={evt.id}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-emerald-500/50 transition-all flex flex-col justify-between gap-5 group"
            >
              <div className="space-y-3">
                {/* Unboxed Metadata row */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="capitalize font-bold text-emerald-600 dark:text-emerald-400">
                      {evt.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{evt.organizer}</span>
                  </div>

                  {evt.pointsAwarded && (
                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-mono font-semibold text-xs">
                      <Award className="w-3.5 h-3.5" />
                      <span>+{evt.pointsAwarded} Extracurricular Pts</span>
                    </span>
                  )}
                </div>

                {/* Event Title */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {evt.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {evt.description}
                </p>

                {evt.speaker && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{evt.speaker}</span>
                  </div>
                )}

                {/* Date, Time, Location details */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                </div>

                {/* Registration Capacity Meter */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>Reserved Capacity</span>
                    </span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                      {evt.registeredCount} / {evt.capacity} ({fillPercentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isAlmostFull ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, fillPercentage)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                <button
                  onClick={() => handleRegister(evt.id)}
                  disabled={registeringId === evt.id}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    evt.isUserRegistered
                      ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                  }`}
                >
                  {evt.isUserRegistered ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Registered (Click to Cancel)</span>
                    </>
                  ) : (
                    <>
                      <Ticket className="w-4 h-4" />
                      <span>Register for Event</span>
                    </>
                  )}
                </button>

                {evt.isUserRegistered && (
                  <button
                    onClick={() => setSelectedPassEvent(evt)}
                    className="py-2.5 px-3 rounded-xl border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Pass</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Digital Event Pass Modal */}
      {selectedPassEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl relative text-center">
            <button
              onClick={() => setSelectedPassEvent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <Ticket className="w-6 h-6" />
            </div>

            <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
              Official Campus Pass
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {selectedPassEvent.title}
            </h3>

            {/* QR Code Graphic Simulator */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 dark:border-slate-700 max-w-[180px] mx-auto my-4 shadow-sm">
              <div className="w-full aspect-square bg-slate-900 flex flex-col items-center justify-center rounded-lg p-2 text-white">
                <QrCode className="w-24 h-24 text-white" />
                <span className="font-mono text-[9px] mt-1 tracking-widest text-slate-300">
                  PASS-{selectedPassEvent.id.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mb-4">
              <div>Attendee: Alex Rivera · CS-2026</div>
              <div>Location: {selectedPassEvent.location}</div>
              <div>Date: {selectedPassEvent.date} · {selectedPassEvent.time}</div>
            </div>

            <button
              onClick={() => setSelectedPassEvent(null)}
              className="w-full py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
