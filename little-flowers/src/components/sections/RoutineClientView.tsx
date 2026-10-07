'use client';

import React, { useState, useMemo } from 'react';
import { StorioClassRoutine } from '@/types';
import { resolveMediaUrl } from '@/lib/media';

interface RoutineClientViewProps {
  routines: StorioClassRoutine[];
}

export default function RoutineClientView({ routines }: RoutineClientViewProps) {
  // Extract all available classes
  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    routines.forEach((r) => {
      if (r.class_name) set.add(r.class_name);
    });
    return Array.from(set);
  }, [routines]);

  // Default selected class
  const [selectedClass, setSelectedClass] = useState<string>(
    availableClasses[0] || 'All'
  );
  const [selectedShift, setSelectedShift] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active day selection for the current routine view
  const [selectedDay, setSelectedDay] = useState<string>('Sunday');

  // Filter routines
  const filteredRoutines = useMemo(() => {
    return routines.filter((r) => {
      const matchClass =
        selectedClass === 'All' || r.class_name.toLowerCase() === selectedClass.toLowerCase();
      const matchShift =
        selectedShift === 'All' ||
        (r.shift || '').toLowerCase() === selectedShift.toLowerCase();
      const matchSearch =
        !searchQuery ||
        r.class_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.section || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchClass && matchShift && matchSearch;
    });
  }, [routines, selectedClass, selectedShift, searchQuery]);

  // Current active routine to display schedule
  const activeRoutine = filteredRoutines[0] || null;

  // Extract schedule days (supporting both SDK .schedule and API raw .schedule_json)
  const scheduleDays = useMemo(() => {
    if (!activeRoutine) return [];
    const sched = activeRoutine.schedule || (activeRoutine as any).schedule_json;
    if (!sched) return [];
    if (Array.isArray(sched)) {
      return sched;
    }
    // Object format { days: [...] }
    const schedObj = sched as Record<string, unknown>;
    if (Array.isArray(schedObj.days)) {
      return schedObj.days as Array<{ day: string; periods?: any[]; slots?: any[] }>;
    }
    return [];
  }, [activeRoutine]);

  // Currently selected day schedule
  const currentDaySchedule = useMemo(() => {
    if (scheduleDays.length === 0) return null;
    const match = scheduleDays.find(
      (d) => d.day?.toLowerCase() === selectedDay.toLowerCase()
    );
    return match || scheduleDays[0];
  }, [scheduleDays, selectedDay]);

  const routineFile =
    activeRoutine?.routine_file_url ||
    (typeof activeRoutine?.routine_file === 'string'
      ? resolveMediaUrl(activeRoutine.routine_file)
      : null);

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-pastel-purple border border-purple-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Class Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mr-2">
              Select Grade:
            </span>
            {availableClasses.map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => {
                  setSelectedClass(cls);
                }}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  selectedClass.toLowerCase() === cls.toLowerCase()
                    ? 'bg-primary-color text-white shadow-md'
                    : 'bg-white text-gray-700 border border-purple-100 hover:border-primary-color'
                }`}
              >
                {cls}
              </button>
            ))}
            {availableClasses.length > 1 && (
              <button
                type="button"
                onClick={() => setSelectedClass('All')}
                className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedClass === 'All'
                    ? 'bg-primary-color text-white shadow-md'
                    : 'bg-white text-gray-600 border border-purple-100'
                }`}
              >
                All Classes
              </button>
            )}
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search section or period..."
              className="w-full pl-9 pr-4 py-2.5 rounded-full text-xs sm:text-sm bg-white border border-purple-100 focus:outline-hidden focus:border-primary-color text-gray-800 placeholder-gray-400 shadow-2xs"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Routine Main Stage */}
      {filteredRoutines.length === 0 ? (
        <div className="text-center py-20 px-4 bg-pastel-purple rounded-3xl border border-purple-100 max-w-xl mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-amber-100 text-secondary-color flex items-center justify-center text-3xl font-bold">
            📅
          </div>
          <h3 className="text-xl font-bold font-fredoka text-gray-800 mb-2">No Routine Found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            There are no class timetables matching your selected criteria. Please try another grade or clear your search.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Routine Card Header */}
          {activeRoutine && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-50 text-secondary-color">
                    Academic Year {activeRoutine.academic_year || 2026}
                  </span>
                  {activeRoutine.shift && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-50 text-accent-blue">
                      {activeRoutine.shift} Shift
                    </span>
                  )}
                  {activeRoutine.section && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-pink-50 text-accent-pink">
                      Section: {activeRoutine.section}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-gray-900">
                  {activeRoutine.class_name} Class Routine
                </h2>
                {activeRoutine.effective_from && (
                  <p className="text-xs text-gray-500 mt-1">
                    Effective From: {new Date(activeRoutine.effective_from).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                )}
              </div>

              {/* PDF Routine Download Button */}
              {routineFile && (
                <a
                  href={routineFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-button-dark hover:opacity-90 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 shrink-0"
                >
                  <svg className="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download Routine PDF</span>
                </a>
              )}
            </div>
          )}

          {/* Day of Week Selector */}
          {scheduleDays.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pb-2">
              {scheduleDays.map((d) => {
                const dayName = d.day || 'Day';
                const isCurrent =
                  currentDaySchedule?.day?.toLowerCase() === dayName.toLowerCase();
                return (
                  <button
                    key={dayName}
                    type="button"
                    onClick={() => setSelectedDay(dayName)}
                    className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                      isCurrent
                        ? 'bg-secondary-color text-white shadow-md transform -translate-y-0.5'
                        : 'bg-white text-gray-700 border border-purple-100 hover:bg-pastel-purple'
                    }`}
                  >
                    {dayName}
                  </button>
                );
              })}
            </div>
          )}

          {/* Periods Timetable Grid */}
          {currentDaySchedule && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(currentDaySchedule.periods || currentDaySchedule.slots || []).map(
                (item: any, idx: number) => {
                  const periodTitle = item.period || `Period ${idx + 1}`;
                  const subjectName = item.subject || 'Creative Activity';
                  const teacherName = item.teacher || 'Class Mentor';
                  const roomName = item.room || 'Main Hall';
                  const periodTime = item.time || (item.start_time && item.end_time ? `${item.start_time} - ${item.end_time}` : 'Morning');

                  const colorStyles = [
                    { border: 'border-l-secondary-color', badgeBg: 'bg-amber-50 text-secondary-color' },
                    { border: 'border-l-accent-pink', badgeBg: 'bg-pink-50 text-accent-pink' },
                    { border: 'border-l-accent-blue', badgeBg: 'bg-sky-50 text-accent-blue' },
                    { border: 'border-l-accent-green', badgeBg: 'bg-lime-50 text-accent-green' },
                  ];
                  const currentStyle = colorStyles[idx % colorStyles.length];

                  return (
                    <div
                      key={idx}
                      className={`p-5 rounded-2xl bg-white border border-purple-100/80 shadow-xs hover:shadow-md transition-all border-l-4 ${currentStyle.border} flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${currentStyle.badgeBg}`}>
                            {periodTitle}
                          </span>
                          <span className="text-xs font-semibold text-gray-500">
                            {periodTime}
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold font-fredoka text-gray-900 mt-1">
                          {subjectName}
                        </h4>
                      </div>

                      <div className="mt-4 pt-3 border-t border-purple-50 flex items-center justify-between text-xs text-gray-600">
                        <span className="inline-flex items-center gap-1 font-medium">
                          <span>👩‍🏫</span> {teacherName}
                        </span>
                        <span className="inline-flex items-center gap-1 text-gray-500 font-semibold bg-pastel-purple px-2 py-0.5 rounded-md">
                          <span>📍</span> {roomName}
                        </span>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
