import React from 'react';
import Link from 'next/link';
import { storio } from '@storio/template-sdk';
import { getTenantContext, getTemplateLayout } from '@/lib/storio';
import { resolveMediaUrl } from '@/lib/media';
import { StorioEvent } from '@/types';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';

export const metadata = {
  title: 'School Events & Calendar — Little Flowers',
  description: 'Upcoming campus gatherings, annual festivals, parent meetings, and academic milestones.',
};

export default async function EventsPage() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation } = await getTemplateLayout(tenantHost, isStandalone);

  const rawEvents = await storio.apiFetch<StorioEvent[] | { results: StorioEvent[] }>(
    '/api/events/',
    { tenantHost }
  );

  const events: StorioEvent[] = Array.isArray(rawEvents)
    ? rawEvents
    : Array.isArray((rawEvents as { results?: StorioEvent[] })?.results)
      ? (rawEvents as { results: StorioEvent[] }).results
      : [];

  const formatEventDate = (dateStr?: string) => {
    if (!dateStr) return { day: '15', month: 'OCT', year: '2026', time: '9:00 AM' };
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return { day, month, year, time };
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-pink-100 selection:text-pink-700">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-pastel-purple pt-8 pb-6 sm:pt-10 sm:pb-8 border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white text-primary-color border border-purple-200 shadow-2xs mb-2.5">
              <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse" />
              School Calendar & Life
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-fredoka text-gray-900 leading-tight">
              <SplitText
                text="Upcoming Events & Celebrations"
                className="inline-block text-primary-color"
                tag="span"
              />
            </h1>

            <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed font-quicksand max-w-2xl mx-auto">
              Stay connected with our school activities, seasonal celebrations, sports days, and parent-teacher gatherings.
            </p>
          </div>
        </section>

        {/* Events Content */}
        <section className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            {events.length === 0 ? (
              <div className="text-center py-16 px-4 bg-pastel-purple rounded-3xl border border-purple-100">
                <span className="text-4xl block mb-3">📅</span>
                <h3 className="text-xl font-bold font-fredoka text-gray-800 mb-2">No Upcoming Events</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  New campus events and celebration announcements will appear here soon.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => {
                  const { day, month, year, time } = formatEventDate(event.start_date);
                  const rawImg =
                    event.featured_image_detail?.file ||
                    (typeof event.featured_image === 'string' ? event.featured_image : null);
                  const imageUrl = resolveMediaUrl(rawImg) || '/homepage/Happy Memories/Trial 1.jpg';

                  return (
                    <article
                      key={event.id}
                      className="bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                    >
                      {/* Event Image Banner with Date Badge */}
                      <div className="relative aspect-16/10 overflow-hidden bg-purple-50">
                        <img
                          src={imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-md text-center min-w-[56px] border border-purple-100">
                          <span className="block text-xl font-black font-fredoka text-primary-color leading-none">
                            {day}
                          </span>
                          <span className="block text-[10px] font-bold tracking-wider text-accent-pink uppercase mt-0.5">
                            {month}
                          </span>
                        </div>

                        {event.is_featured && (
                          <span className="absolute top-4 right-4 bg-accent-pink text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Event Details Body */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-500">
                            <span className="inline-flex items-center gap-1 text-primary-color">
                              ⏰ {time}
                            </span>
                            {event.location && (
                              <span className="inline-flex items-center gap-1 text-gray-600">
                                • 📍 {event.location}
                              </span>
                            )}
                          </div>

                          <h2 className="text-xl font-bold font-fredoka text-gray-900 group-hover:text-primary-color transition-colors leading-snug">
                            {event.title}
                          </h2>

                          {(event.excerpt || event.content) && (
                            <p className="text-sm text-gray-600 font-quicksand line-clamp-3 leading-relaxed">
                              {event.excerpt || event.content}
                            </p>
                          )}
                        </div>

                        <div className="pt-4 border-t border-purple-50 flex items-center justify-between">
                          <span className="text-xs font-bold text-secondary-color">
                            {year}
                          </span>
                          <Link
                            href={`/event/${event.id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary-color group-hover:text-accent-pink transition-colors"
                          >
                            <span>Event Details</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
