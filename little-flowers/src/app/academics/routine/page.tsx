import React from 'react';
import { getTenantContext, getTemplateLayout, getClassRoutines, getSyllabuses, getStudentStats } from '@/lib/storio';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';
import { StorioClassRoutine } from '@/types';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';
import AcademicsNavTabs from '@/components/sections/AcademicsNavTabs';
import RoutineClientView from '@/components/sections/RoutineClientView';

export async function generateMetadata() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings } = await getTemplateLayout(tenantHost, isStandalone).catch(() => ({ settings: null }));
  const schoolName = settings?.site_title || 'Little Flowers';

  return {
    title: `Class Timetables & Daily Routines — ${schoolName}`,
    description: `Download official weekly timetables, classroom schedules, and study routines for all grades at ${schoolName}.`,
  };
}

export default async function RoutinePage() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation, importantLinks } = await getTemplateLayout(tenantHost, isStandalone);

  // Parallel fetch academic datasets
  const [rawRoutines, rawSyllabuses, rawStats] = await Promise.all([
    getClassRoutines(tenantHost).catch(() => null),
    getSyllabuses(tenantHost).catch(() => null),
    getStudentStats(tenantHost).catch(() => null),
  ]);

  // Apply Storio Rule 1: Real DB in live tenant, DEFAULT_DEMO_DATA in standalone preview
  const routines: StorioClassRoutine[] =
    Array.isArray(rawRoutines) && rawRoutines.length > 0
      ? rawRoutines
      : isStandalone
        ? DEFAULT_DEMO_DATA.classRoutines
        : [];

  const syllabusCount = Array.isArray(rawSyllabuses) && rawSyllabuses.length > 0
    ? rawSyllabuses.length
    : isStandalone
      ? DEFAULT_DEMO_DATA.syllabuses.length
      : 0;

  const classesCount = rawStats?.classes?.length || (isStandalone ? DEFAULT_DEMO_DATA.studentStats.classes.length : 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-pink-100 selection:text-pink-700">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Subpage Banner Hero */}
        <section className="relative overflow-hidden bg-pastel-purple pt-10 pb-8 sm:pt-14 sm:pb-10 border-b border-purple-100">
          <div className="site-container px-4 sm:px-8 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-white text-primary-color border border-purple-200 shadow-2xs mb-3">
              <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse" />
              Academic Schedules
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-fredoka text-gray-900 leading-tight">
              <SplitText
                text="Class Timetables & Daily Routines"
                className="inline-block text-primary-color"
                tag="span"
                triggerOnMount={true}
              />
            </h1>

            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed font-quicksand max-w-2xl mx-auto">
              Explore subject hours, teacher assignments, and download print-ready PDF routines for each grade.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="pt-6 sm:pt-8 pb-16 sm:pb-20 site-section-px site-container w-full">
          {/* Sub-navigation tabs */}
          <AcademicsNavTabs
            routineCount={routines.length}
            syllabusCount={syllabusCount}
            classesCount={classesCount}
          />

          {/* Interactive Routine Schedule Viewer */}
          <RoutineClientView routines={routines} />
        </section>
      </main>

      <Footer settings={settings} importantLinks={importantLinks} />
    </div>
  );
}
