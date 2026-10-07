'use client';

import React, { useState } from 'react';
import { StorioStudentStatsResponse } from '@/types';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

interface StatisticsClientViewProps {
  stats: StorioStudentStatsResponse | null;
}

export default function StatisticsClientView({ stats }: StatisticsClientViewProps) {
  if (!stats) return null;

  const [selectedClassId, setSelectedClassId] = useState<number | 'all'>('all');

  const grandTotal = stats.grand_total || 0;
  const grandMale = stats.grand_total_male || 0;
  const grandFemale = stats.grand_total_female || 0;

  const malePercent = grandTotal > 0 ? Math.round((grandMale / grandTotal) * 100) : 50;
  const femalePercent = grandTotal > 0 ? Math.round((grandFemale / grandTotal) * 100) : 50;

  const classes = stats.classes || [];

  const displayClasses = selectedClassId === 'all'
    ? classes
    : classes.filter((c) => c.id === selectedClassId);

  return (
    <div className="space-y-10">
      {/* 1. Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Students */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="w-12 h-12 rounded-2xl bg-amber-50 text-secondary-color flex items-center justify-center font-bold">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-5.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
            </span>
            {stats.academic_year && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-purple-50 text-primary-color px-2.5 py-1 rounded-full">
                Session {stats.academic_year}
              </span>
            )}
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold font-fredoka text-gray-900">
              <AnimatedCounter end={grandTotal} />
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-1">
              Enrolled Students
            </p>
          </div>
        </div>

        {/* Boys / Male Students */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="w-12 h-12 rounded-2xl bg-sky-50 text-accent-blue flex items-center justify-center font-bold">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-sky-50 text-accent-blue px-2.5 py-1 rounded-full">
              {malePercent}% Total
            </span>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold font-fredoka text-accent-blue">
              <AnimatedCounter end={grandMale} />
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-1">
              Boys
            </p>
          </div>
        </div>

        {/* Girls / Female Students */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="w-12 h-12 rounded-2xl bg-pink-50 text-accent-pink flex items-center justify-center font-bold">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-pink-50 text-accent-pink px-2.5 py-1 rounded-full">
              {femalePercent}% Total
            </span>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold font-fredoka text-accent-pink">
              <AnimatedCounter end={grandFemale} />
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-1">
              Girls
            </p>
          </div>
        </div>

        {/* Active Class Sections */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="w-12 h-12 rounded-2xl bg-lime-50 text-accent-green flex items-center justify-center font-bold">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-lime-50 text-accent-green px-2.5 py-1 rounded-full">
              Active Sections
            </span>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold font-fredoka text-accent-green">
              <AnimatedCounter end={stats.total_sections || 0} />
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-1">
              Total Sections
            </p>
          </div>
        </div>
      </div>

      {/* 2. Gender Ratio Progress Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold font-fredoka text-gray-900">
              Campus Gender Balance
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="inline-flex items-center gap-1.5 text-accent-blue">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-blue" />
              Boys: {grandMale} ({malePercent}%)
            </span>
            <span className="inline-flex items-center gap-1.5 text-accent-pink">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-pink" />
              Girls: {grandFemale} ({femalePercent}%)
            </span>
          </div>
        </div>

        {/* Dual Bar */}
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-gray-100 shadow-inner">
          <div
            className="h-full bg-accent-blue transition-all duration-1000 ease-out"
            style={{ width: `${malePercent}%` }}
            title={`Boys: ${malePercent}%`}
          />
          <div
            className="h-full bg-accent-pink transition-all duration-1000 ease-out"
            style={{ width: `${femalePercent}%` }}
            title={`Girls: ${femalePercent}%`}
          />
        </div>
      </div>

      {/* 3. Class-by-Class Demographics Breakdown */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-extrabold font-fredoka text-gray-900">
              Grade-Wise Student Distribution
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedClassId('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedClassId === 'all'
                  ? 'bg-primary-color text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-purple-100 hover:bg-pastel-purple'
              }`}
            >
              All Grades
            </button>
            {classes.map((cls) => (
              <button
                key={cls.id}
                type="button"
                onClick={() => setSelectedClassId(cls.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedClassId === cls.id
                    ? 'bg-primary-color text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-purple-100 hover:bg-pastel-purple'
                }`}
              >
                {cls.class_name}
              </button>
            ))}
          </div>
        </div>

        {/* Classes Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayClasses.map((item, idx) => {
            const classTotal = item.total_students ?? ((item.total_male || 0) + (item.total_female || 0));
            const colorAccents = [
              { border: 'border-amber-200', tag: 'bg-amber-50 text-secondary-color' },
              { border: 'border-pink-200', tag: 'bg-pink-50 text-accent-pink' },
              { border: 'border-blue-200', tag: 'bg-sky-50 text-accent-blue' },
              { border: 'border-emerald-200', tag: 'bg-lime-50 text-accent-green' },
            ];
            const accent = colorAccents[idx % colorAccents.length];

            return (
              <div
                key={item.id || idx}
                className={`p-6 rounded-3xl bg-white border ${accent.border} shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {item.shift ? (
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${accent.tag}`}>
                        {item.shift} Shift
                      </span>
                    ) : <span />}
                    <span className="text-xs font-bold text-gray-400">
                      Total: {classTotal} Learners
                    </span>
                  </div>

                  <h4 className="text-xl font-bold font-fredoka text-gray-900">
                    {item.class_name}
                  </h4>
                  {item.class_name_en && (
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      {item.class_name_en}
                    </p>
                  )}

                  {/* Gender pill split */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-purple-50 text-center">
                    <div className="p-2.5 rounded-xl bg-sky-50/70">
                      <span className="text-[10px] font-bold text-gray-500 block">Boys</span>
                      <span className="text-base font-extrabold text-accent-blue font-fredoka">
                        {item.total_male || 0}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-pink-50/70">
                      <span className="text-[10px] font-bold text-gray-500 block">Girls</span>
                      <span className="text-base font-extrabold text-accent-pink font-fredoka">
                        {item.total_female || 0}
                      </span>
                    </div>
                  </div>

                  {/* Sections Breakdown */}
                  {item.groups && item.groups.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                        Wings / Groups:
                      </span>
                      <div className="space-y-1.5">
                        {item.groups.map((grp, gIdx) => (
                          <div
                            key={gIdx}
                            className="flex items-center justify-between text-xs p-2 rounded-xl bg-pastel-purple"
                          >
                            <span className="font-semibold text-gray-800">
                              {grp.group_name}
                            </span>
                            <span className="font-extrabold text-primary-color">
                              {grp.total_students || ((grp.total_male || 0) + (grp.total_female || 0))} students
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
