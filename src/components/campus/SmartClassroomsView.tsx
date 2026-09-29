/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SmartClassroom, UserRole } from '../../types/campus';
import {
  Thermometer,
  Wind,
  Volume2,
  Video,
  Projector,
  Cpu,
  BookmarkCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface SmartClassroomsViewProps {
  role: UserRole;
  classrooms: SmartClassroom[];
  onToggleReservation: (classroomId: string) => Promise<void>;
}

export const SmartClassroomsView: React.FC<SmartClassroomsViewProps> = ({
  role: _role,
  classrooms,
  onToggleReservation
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [reservingId, setReservingId] = useState<string | null>(null);

  const buildings = ['all', 'Turing Hall', 'Ada Lovelace Center', 'Newton Complex'];

  const filteredRooms = classrooms.filter(room => {
    const buildingMatch = selectedBuilding === 'all' || room.building === selectedBuilding;
    const statusMatch = statusFilter === 'all' || room.status === statusFilter;
    return buildingMatch && statusMatch;
  });

  const handleReserve = async (id: string) => {
    setReservingId(id);
    try {
      await onToggleReservation(id);
    } finally {
      setReservingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Smart Classrooms & IoT Telemetry
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time occupancy sensors, environmental quality, and hardware amenities across campus.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Building Select */}
          <select
            value={selectedBuilding}
            onChange={e => setSelectedBuilding(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
          >
            {buildings.map(b => (
              <option key={b} value={b}>
                {b === 'all' ? 'All Buildings' : b}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'available'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Available
            </button>
            <button
              onClick={() => setStatusFilter('occupied')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'occupied'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Occupied
            </button>
          </div>
        </div>
      </div>

      {/* Classroom Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRooms.map(room => {
          const occupancyRate = Math.round((room.currentOccupancy / room.capacity) * 100);
          const isFull = occupancyRate >= 90;

          return (
            <div
              key={room.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-emerald-500/50 transition-all flex flex-col justify-between gap-5 group"
            >
              <div className="space-y-4">
                {/* Header row with unboxed metadata */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900 dark:text-white">
                    <span>{room.code}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-sans font-normal text-slate-500">Floor {room.floor}</span>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5">
                    {room.status === 'available' && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Available</span>
                      </span>
                    )}
                    {room.status === 'occupied' && (
                      <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-medium text-xs">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        <span>In Session</span>
                      </span>
                    )}
                    {room.status === 'reserved' && (
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium text-xs">
                        <BookmarkCheck className="w-3.5 h-3.5" />
                        <span>Reserved</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Room Title & Building */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {room.name}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {room.building}
                  </div>
                </div>

                {/* Real-time Occupancy Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>Live Occupancy</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                      {room.currentOccupancy} / {room.capacity} seats ({occupancyRate}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull
                          ? 'bg-amber-500'
                          : occupancyRate > 50
                          ? 'bg-cyan-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, occupancyRate)}%` }}
                    />
                  </div>
                </div>

                {/* IoT Sensor Readings */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <Thermometer className="w-3 h-3 text-emerald-500" />
                      <span>Temp</span>
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                      {room.temperatureCelsius}°C
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <Wind className="w-3 h-3 text-cyan-500" />
                      <span>AQI</span>
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                      {room.airQualityAqi} <span className="text-[10px] font-normal text-emerald-600">Good</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <Volume2 className="w-3 h-3 text-amber-500" />
                      <span>Acoustics</span>
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                      {room.noiseLevelDb} dB
                    </div>
                  </div>
                </div>

                {/* Equipment Amenities */}
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  {room.hasProjector && (
                    <span className="flex items-center gap-1" title="Dual 4K Projector Installed">
                      <Projector className="w-3.5 h-3.5 text-slate-400" />
                      <span>4K AV</span>
                    </span>
                  )}
                  {room.hasLectureRecording && (
                    <span className="flex items-center gap-1" title="Auto Lecture Capture Enabled">
                      <Video className="w-3.5 h-3.5 text-slate-400" />
                      <span>Capture</span>
                    </span>
                  )}
                  {room.hasGpuWorkstations && (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400" title="Dedicated GPU Compute Workstations">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>GPU Lab</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  onClick={() => handleReserve(room.id)}
                  disabled={reservingId === room.id}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    room.status === 'reserved'
                      ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                  }`}
                >
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>
                    {room.status === 'reserved' ? 'Release Reservation' : 'Reserve for Study Group'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No Classrooms Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try adjusting your building selection or status filters.
          </p>
        </div>
      )}
    </div>
  );
};
