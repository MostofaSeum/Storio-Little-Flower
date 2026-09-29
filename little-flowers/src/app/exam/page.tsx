import React from 'react';
import Link from 'next/link';
import { storio } from '@storio/template-sdk';
import { getTenantContext, getTemplateLayout } from '@/lib/storio';
import { resolveMediaUrl } from '@/lib/media';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';

interface StorioExamResult {
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

export const metadata = {
  title: 'Exam Results — Little Flowers',
  description: 'View academic performance summaries, class results, and official marks sheets.',
};

export default async function ExamResultsPage() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation } = await getTemplateLayout(tenantHost, isStandalone);

  const rawExams = await storio.apiFetch<StorioExamResult[]>(
    '/api/v2/template/exam-results/',
    { tenantHost }
  );

  const results: StorioExamResult[] = Array.isArray(rawExams) ? rawExams : [];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-accent-pink selection:text-white">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-pastel-purple py-12 sm:py-16 border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-white text-primary-color border border-purple-200 shadow-2xs mb-4">
              <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
              Academic Performance
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-fredoka text-gray-900 leading-tight">
              <SplitText
                text="Exam Results"
                className="inline-block text-primary-color"
                tag="span"
              />
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed font-quicksand max-w-2xl mx-auto">
              Official assessment statistics, term milestones, and downloadable grade reports.
            </p>
          </div>
        </section>

        {/* Results Content */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            {results.length === 0 ? (
              <div className="text-center py-16 px-4 bg-pastel-purple rounded-3xl border border-purple-100">
                <span className="text-4xl block mb-3">📊</span>
                <h3 className="text-xl font-bold font-fredoka text-gray-800 mb-2">No Exam Results Published</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Assessment results and term summaries will appear here once finalized by the examination cell.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Table for desktop, cards for mobile */}
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
                      {results.map((res) => {
                        const fileUrl = res.file_url ? resolveMediaUrl(res.file_url) : null;

                        return (
                          <tr key={res.id} className="hover:bg-pastel-purple/50 transition-colors">
                            <td className="py-4 px-6 font-bold text-gray-900 font-fredoka text-base">
                              {res.exam_name}
                              {res.exam_type && (
                                <span className="ml-2 text-xs font-normal text-gray-400 capitalize">
                                  ({res.exam_type})
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-block px-3 py-1 rounded-full bg-pastel-purple text-primary-color text-xs font-bold">
                                {res.class_name}
                              </span>
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
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
