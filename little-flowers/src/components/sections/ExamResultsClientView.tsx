'use client';

import React, { useState } from 'react';
import { resolveMediaUrl } from '@/lib/media';

export interface StorioExamResult {
  id: number;
  exam_name: string;
  class_name: string;
  year: string | number;
  total_examinees?: number;
  passed?: number;
  failed?: number;
  aplus_count?: number;
  agrade_count?: number;
  pass_rate?: string | number;
  exam_type?: string;
  file_url?: string | null;
}

interface ExamResultsClientViewProps {
  results: StorioExamResult[];
}

export default function ExamResultsClientView({ results }: ExamResultsClientViewProps) {
  const [activeTab, setActiveTab] = useState<'school' | 'public' | 'admission'>('school');

  // Filter results strictly matching the selected tab
  const filteredResults = results.filter((res) => {
    const rawType = (res.exam_type || '').trim().toLowerCase();
    return rawType === activeTab;
  });

  const counts = {
    school: results.filter((r) => (r.exam_type || '').trim().toLowerCase() === 'school').length,
    public: results.filter((r) => (r.exam_type || '').trim().toLowerCase() === 'public').length,
    admission: results.filter((r) => (r.exam_type || '').trim().toLowerCase() === 'admission').length,
  };

  return (
    <div className="space-y-5">
      {/* 3 Interactive Category Tabs (School, Public, Admission) */}
      <div className="flex justify-center">
        <div className="flex flex-wrap items-center justify-center p-1 bg-pastel-purple border border-purple-100 rounded-2xl sm:rounded-full shadow-xs gap-1 max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab('school')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase transition-all duration-300 flex items-center gap-1.5 ${
              activeTab === 'school'
                ? 'bg-primary-color text-white shadow-md'
                : 'text-gray-600 hover:text-primary-color hover:bg-white/80'
            }`}
          >
            <span>School</span>
            <span
              className={`text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full ${
                activeTab === 'school'
                  ? 'bg-white/20 text-white'
                  : 'bg-purple-100 text-primary-color'
              }`}
            >
              {counts.school}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('public')}
            className={`px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase transition-all duration-300 flex items-center gap-1.5 sm:gap-2 ${
              activeTab === 'public'
                ? 'bg-secondary-color text-white shadow-md'
                : 'text-gray-600 hover:text-secondary-color hover:bg-white/80'
            }`}
          >
            <span>Public</span>
            <span
              className={`text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full ${
                activeTab === 'public'
                  ? 'bg-white/20 text-white'
                  : 'bg-amber-100 text-secondary-color'
              }`}
            >
              {counts.public}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admission')}
            className={`px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase transition-all duration-300 flex items-center gap-1.5 sm:gap-2 ${
              activeTab === 'admission'
                ? 'bg-accent-pink text-white shadow-md'
                : 'text-gray-600 hover:text-accent-pink hover:bg-white/80'
            }`}
          >
            <span>Admission</span>
            <span
              className={`text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full ${
                activeTab === 'admission'
                  ? 'bg-white/20 text-white'
                  : 'bg-pink-100 text-accent-pink'
              }`}
            >
              {counts.admission}
            </span>
          </button>
        </div>
      </div>

      {/* Results Content Table / Empty State */}
      {filteredResults.length === 0 ? (
        <div className="text-center py-16 px-4 bg-pastel-purple rounded-3xl border border-purple-100">
          <span className="text-4xl block mb-3">📊</span>
          <h3 className="text-xl font-bold font-fredoka text-gray-800 mb-2 capitalize">
            No {activeTab} Results Published
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            There are currently no {activeTab} examination records available to display.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-3xl border border-purple-100 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-purple-100 bg-pastel-purple text-xs font-bold uppercase tracking-wider text-gray-500">
                <th className="py-4 px-6">Examination</th>
                <th className="py-4 px-6">Class</th>
                <th className="py-4 px-6">Year</th>
                <th className="py-4 px-6 text-center">Examinees</th>
                <th className="py-4 px-6 text-center">Passed</th>
                <th className="py-4 px-6 text-center">Pass Rate</th>
                <th className="py-4 px-6 text-right">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50 text-sm font-medium text-gray-800">
              {filteredResults.map((res) => {
                const fileUrl = res.file_url ? resolveMediaUrl(res.file_url) : null;

                return (
                  <tr key={res.id} className="hover:bg-pastel-purple/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900 font-fredoka text-base">
                      {res.exam_name}
                      <span className="ml-2 text-xs font-normal text-gray-400 capitalize">
                        ({res.exam_type})
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {res.class_name ? (
                        <span className="inline-block px-3 py-1 rounded-full bg-pastel-purple text-primary-color text-xs font-bold">
                          {res.class_name}
                        </span>
                      ) : (
                        <span className="text-gray-300 font-bold">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-600">
                      {res.year}
                    </td>
                    <td className="py-4 px-6 text-center font-bold">
                      {res.total_examinees ?? '—'}
                    </td>
                    <td className="py-4 px-6 text-center text-accent-green font-bold">
                      {res.passed ?? '—'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full font-bold text-xs bg-emerald-50 text-emerald-700">
                        {res.pass_rate ?? '—'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {fileUrl ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-primary-color border border-purple-200 hover:bg-pastel-purple transition-all"
                        >
                          <span>Download</span>
                          <span>📥</span>
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No File</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
