import React from 'react';
import { getTenantContext, getTemplateLayout, getEvents, getCalendarEvents } from '@/lib/storio';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';
import { StorioEvent, StorioCalendarEvent } from '@/types';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';
import EventsAndCalendarClient from '@/components/sections/EventsAndCalendarClient';

export async function generateMetadata() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings } = await getTemplateLayout(tenantHost, isStandalone).catch(() => ({ settings: null }));
  const schoolName = settings?.site_title || 'Events';

  return {
    title: `School Events & Academic Calendar — ${schoolName}`,
    description: 'Upcoming campus gatherings, annual festivals, academic schedule, exams, and school holidays.',
  };
}

export default async function EventsPage() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation, importantLinks } = await getTemplateLayout(tenantHost, isStandalone);

  // Fetch events and calendar items in parallel via storio.ts helpers
  const [rawEvents, rawCalendar] = await Promise.all([
    getEvents(tenantHost).catch(() => null),
    getCalendarEvents(tenantHost).catch(() => null),
  ]);

  const rawEventsList: StorioEvent[] = Array.isArray(rawEvents)
    ? rawEvents
    : Array.isArray((rawEvents as unknown as { results?: StorioEvent[] })?.results)
      ? ((rawEvents as unknown as { results: StorioEvent[] }).results)
      : [];

  const events: StorioEvent[] =
    rawEventsList.length > 0
      ? rawEventsList
      : isStandalone
        ? (DEFAULT_DEMO_DATA.events as unknown as StorioEvent[])
        : [];

  const calendarEvents: StorioCalendarEvent[] = Array.isArray(rawCalendar) && rawCalendar.length > 0
    ? rawCalendar
    : isStandalone
      ? (DEFAULT_DEMO_DATA.calendarEvents || [])
      : [];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-pink-100 selection:text-pink-700">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-pastel-purple pt-8 pb-6 sm:pt-10 sm:pb-8 border-b border-purple-100">
          <div className="site-container px-4 sm:px-8 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white text-primary-color border border-purple-200 shadow-2xs mb-2.5">
              <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse" />
              School Calendar & Life
            </span>

            <h1 className="page-hero-title font-extrabold tracking-tight font-fredoka text-gray-900 leading-tight">
              <SplitText
                text="Events & Academic Calendar"
                className="inline-block text-primary-color"
                tag="span"
                triggerOnMount={true}
              />
            </h1>

            <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed font-quicksand max-w-2xl mx-auto">
              Stay connected with our campus life, celebrations, examination milestones, and scheduled holidays.
            </p>
          </div>
        </section>

        {/* Client Component with Events & Calendar Tabs */}
        <EventsAndCalendarClient
          events={events}
          calendarEvents={calendarEvents}
          siteTitle={settings?.site_title}
        />
      </main>

      <Footer settings={settings} importantLinks={importantLinks} />
    </div>
  );
}
