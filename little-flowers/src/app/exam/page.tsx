import React from 'react';
import Link from 'next/link';
import { getTenantContext, getTemplateLayout, getExamResults } from '@/lib/storio';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';
import ExamResultsClientView, { StorioExamResult } from '@/components/sections/ExamResultsClientView';

export async function generateMetadata() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings } = await getTemplateLayout(tenantHost, isStandalone).catch(() => ({ settings: null }));
  const schoolName = settings?.site_title || 'Exam Results';

  return {
    title: `Exam Results — ${schoolName}`,
    description: 'View academic performance summaries, class results, and official marks sheets.',
  };
}

export default async function ExamResultsPage() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation } = await getTemplateLayout(tenantHost, isStandalone);

  const rawExams = await getExamResults(tenantHost).catch(() => null);

  const results: StorioExamResult[] = Array.isArray(rawExams) ? rawExams : [];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-pink-100 selection:text-pink-700">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-pastel-purple pt-8 pb-6 sm:pt-10 sm:pb-8 border-b border-purple-100">
          <div className="site-container px-4 sm:px-8 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white text-primary-color border border-purple-200 shadow-2xs mb-2.5">
              <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
              Academic Performance
            </span>

            <h1 className="page-hero-title font-extrabold tracking-tight font-fredoka text-gray-900 leading-tight">
              <SplitText
                text="Exam Results"
                className="inline-block text-primary-color"
                tag="span"
                triggerOnMount={true}
              />
            </h1>

            <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed font-quicksand max-w-2xl mx-auto">
              Official assessment statistics, term milestones, and downloadable grade reports.
            </p>
          </div>
        </section>

        {/* Results Content with School, Public, Admission Tabs */}
        <section className="py-6 sm:py-8">
          <div className="site-container px-4 sm:px-8">
            <ExamResultsClientView results={results} />
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
