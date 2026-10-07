import React from 'react';
import { getTenantContext, getTemplateLayout, getClassRoutines, getSyllabuses, getStudentStats } from '@/lib/storio';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';
import { StorioStudentStatsResponse } from '@/types';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';
import AcademicsNavTabs from '@/components/sections/AcademicsNavTabs';
import StatisticsClientView from '@/components/sections/StatisticsClientView';

export async function generateMetadata() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings } = await getTemplateLayout(tenantHost, isStandalone).catch(() => ({ settings: null }));
  const schoolName = settings?.site_title || 'Little Flowers';

  return {
    title: `Student Demographics & Academic Statistics — ${schoolName}`,
    description: `Official enrollment demographics, gender breakdown, class sections, and student statistics for ${schoolName}.`,
  };
}

export default async function StatisticsPage() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation, importantLinks } = await getTemplateLayout(tenantHost, isStandalone);

  const [rawRoutines, rawSyllabuses, rawStats] = await Promise.all([
    getClassRoutines(tenantHost).catch(() => null),
    getSyllabuses(tenantHost).catch(() => null),
    getStudentStats(tenantHost).catch(() => null),
  ]);

  // Apply Storio Rule 1
  const stats: StorioStudentStatsResponse =
    rawStats && rawStats.classes && rawStats.classes.length > 0
      ? rawStats
      : isStandalone
        ? DEFAULT_DEMO_DATA.studentStats
        : {
            academic_year: new Date().getFullYear(),
            grand_total_male: 0,
            grand_total_female: 0,
            grand_total: 0,
            total_sections: 0,
            classes: [],
          };

  const routineCount = Array.isArray(rawRoutines) && rawRoutines.length > 0
    ? rawRoutines.length
    : isStandalone
      ? DEFAULT_DEMO_DATA.classRoutines.length
      : 0;

  const syllabusCount = Array.isArray(rawSyllabuses) && rawSyllabuses.length > 0
    ? rawSyllabuses.length
    : isStandalone
      ? DEFAULT_DEMO_DATA.syllabuses.length
      : 0;

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-pink-100 selection:text-pink-700">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Banner Hero */}
        <section className="relative overflow-hidden bg-pastel-purple pt-10 pb-8 sm:pt-14 sm:pb-10 border-b border-purple-100">
          <div className="site-container px-4 sm:px-8 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-white text-primary-color border border-purple-200 shadow-2xs mb-3">
              <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse" />
              Enrollment Transparency
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-fredoka text-gray-900 leading-tight">
              <SplitText
                text="Student Demographics & Statistics"
                className="inline-block text-primary-color"
                tag="span"
                triggerOnMount={true}
              />
            </h1>

            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed font-quicksand max-w-2xl mx-auto">
              Transparent institutional student strength, gender parity, and class-wise section allocation.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="site-section-py site-section-px site-container w-full">
          <AcademicsNavTabs
            routineCount={routineCount}
            syllabusCount={syllabusCount}
            classesCount={stats.classes.length}
          />

          <StatisticsClientView stats={stats} />
        </section>
      </main>

      <Footer settings={settings} importantLinks={importantLinks} />
    </div>
  );
}
