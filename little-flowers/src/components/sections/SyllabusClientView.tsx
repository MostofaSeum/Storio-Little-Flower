'use client';

import React, { useState, useMemo } from 'react';
import { StorioSyllabus } from '@/types';
import { resolveMediaUrl } from '@/lib/media';

interface SyllabusClientViewProps {
  syllabuses: StorioSyllabus[];
}

export default function SyllabusClientView({ syllabuses }: SyllabusClientViewProps) {
  // Extract all available classes
  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    syllabuses.forEach((s) => {
      if (s.class_name) set.add(s.class_name);
    });
    return Array.from(set);
  }, [syllabuses]);

  // Extract all exam terms
  const availableExamTypes = useMemo(() => {
    const set = new Set<string>();
    syllabuses.forEach((s) => {
      if (s.exam_type) set.add(s.exam_type);
    });
    return Array.from(set);
  }, [syllabuses]);

  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedExamType, setSelectedExamType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter syllabuses
  const filteredSyllabuses = useMemo(() => {
    return syllabuses.filter((s) => {
      const matchClass =
        selectedClass === 'All' || s.class_name.toLowerCase() === selectedClass.toLowerCase();
      const matchExam =
        selectedExamType === 'All' ||
        (s.exam_type || '').toLowerCase() === selectedExamType.toLowerCase();
      const matchSearch =
        !searchQuery ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.class_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchClass && matchExam && matchSearch;
    });
  }, [syllabuses, selectedClass, selectedExamType, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-pastel-purple border border-purple-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Class Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mr-2">
              Grade:
            </span>
            <button
              type="button"
              onClick={() => setSelectedClass('All')}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                selectedClass === 'All'
                  ? 'bg-secondary-color text-white shadow-md'
                  : 'bg-white text-gray-700 border border-purple-100 hover:border-secondary-color'
              }`}
            >
              All Grades
            </button>
            {availableClasses.map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedClass(cls)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                  selectedClass.toLowerCase() === cls.toLowerCase()
                    ? 'bg-secondary-color text-white shadow-md'
                    : 'bg-white text-gray-700 border border-purple-100 hover:border-secondary-color'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search curriculum or chapter..."
              className="w-full pl-9 pr-4 py-2.5 rounded-full text-xs sm:text-sm bg-white border border-purple-100 focus:outline-hidden focus:border-secondary-color text-gray-800 placeholder-gray-400 shadow-2xs"
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

        {/* Exam Type Pills */}
        {availableExamTypes.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-purple-100/60">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mr-2">
              Exam Term:
            </span>
            <button
              type="button"
              onClick={() => setSelectedExamType('All')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedExamType === 'All'
                  ? 'bg-primary-color text-white shadow-xs'
                  : 'bg-white/80 text-gray-600 hover:text-gray-900 border border-purple-100'
              }`}
            >
              All Terms
            </button>
            {availableExamTypes.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setSelectedExamType(term)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedExamType.toLowerCase() === term.toLowerCase()
                    ? 'bg-primary-color text-white shadow-xs'
                    : 'bg-white/80 text-gray-600 hover:text-gray-900 border border-purple-100'
                }`}
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Syllabuses Grid */}
      {filteredSyllabuses.length === 0 ? (
        <div className="text-center py-20 px-4 bg-pastel-purple rounded-3xl border border-purple-100 max-w-xl mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-amber-100 text-secondary-color flex items-center justify-center font-bold">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-bold font-fredoka text-gray-800 mb-2">No Syllabus Found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            There are no curriculum documents matching your chosen filters. Please select another grade or clear search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSyllabuses.map((item, idx) => {
            const fileUrl = item.file_url
              ? resolveMediaUrl(item.file_url)
              : typeof item.file === 'string'
                ? resolveMediaUrl(item.file)
                : null;

            const badgePalette = [
              { bg: 'bg-amber-50 text-secondary-color border-amber-200' },
              { bg: 'bg-pink-50 text-accent-pink border-pink-200' },
              { bg: 'bg-sky-50 text-accent-blue border-sky-200' },
              { bg: 'bg-emerald-50 text-accent-green border-emerald-200' },
            ];
            const badgeStyle = badgePalette[idx % badgePalette.length];

            return (
              <div
                key={item.id || idx}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-purple-100 hover:border-pink-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${badgeStyle.bg}`}>
                      {item.class_name}
                    </span>
                    {item.exam_type && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {item.exam_type}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-fredoka text-gray-900 group-hover:text-primary-color transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-xs sm:text-sm text-gray-600 font-quicksand mt-2 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-purple-50 flex items-center justify-between gap-3">
                  <div className="text-xs text-gray-400 font-medium">
                    {item.file_size && <span>Size: {item.file_size}</span>}
                    {item.academic_year && <span className="ml-2 font-semibold text-gray-500">Year {item.academic_year}</span>}
                  </div>

                  {fileUrl ? (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-button-dark hover:opacity-90 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all inline-flex items-center gap-1.5 shrink-0"
                    >
                      <svg className="w-3.5 h-3.5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Download</span>
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 italic">No File Attached</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
