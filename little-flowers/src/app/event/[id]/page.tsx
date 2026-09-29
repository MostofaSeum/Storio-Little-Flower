import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { storio } from '@storio/template-sdk';
import { getTenantContext, getTemplateLayout } from '@/lib/storio';
import { resolveMediaUrl } from '@/lib/media';
import { StorioEvent } from '@/types';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EventDetailPageProps) {
  const { id } = await params;
  const { tenantHost } = await getTenantContext();

  // Try fetching by ID first
  const event = await storio.apiFetch<StorioEvent>(`/api/events/${id}/`, { tenantHost });

  if (!event) {
    return {
      title: 'Event Details — Little Flowers',
    };
  }

  return {
    title: `${event.title} — Little Flowers Event`,
    description: event.excerpt || event.content?.slice(0, 160) || 'School event details',
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation } = await getTemplateLayout(tenantHost, isStandalone);

  let event: StorioEvent | null = null;

  // 1. Try direct fetch by ID (/api/events/${id}/)
  if (!isNaN(Number(id))) {
    event = await storio.apiFetch<StorioEvent>(`/api/events/${id}/`, { tenantHost });
  }

  // 2. If id was a slug or direct ID fetch returned null, search in list
  if (!event) {
    const listRes = await storio.apiFetch<StorioEvent[] | { results: StorioEvent[] }>('/api/events/', { tenantHost });
    const list = Array.isArray(listRes) ? listRes : listRes?.results || [];
    event = list.find((e) => String(e.id) === id || e.slug === id) || null;
  }

  if (!event) {
    notFound();
  }

  const formatEventDate = (dateStr?: string) => {
    if (!dateStr) return { dateFormatted: 'TBA', timeFormatted: '' };
    const date = new Date(dateStr);
    return {
      dateFormatted: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      timeFormatted: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const startInfo = formatEventDate(event.start_date);
  const endInfo = event.end_date ? formatEventDate(event.end_date) : null;

  const rawImg =
    event.featured_image_detail?.file ||
    (typeof event.featured_image === 'string' ? event.featured_image : null);
  const heroImage = resolveMediaUrl(rawImg);

  const categories =
    (event as unknown as { categories_detail?: Array<{ id: number; name: string }> })?.categories_detail || [];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-pink-100 selection:text-pink-700">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Breadcrumb / Top Bar */}
        <section className="bg-pastel-purple border-b border-purple-100 py-4">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 flex items-center gap-2 text-xs font-bold text-gray-500">
            <Link href="/" className="hover:text-primary-color transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/event" className="hover:text-primary-color transition-colors">
              Events
            </Link>
            <span>/</span>
            <span className="text-primary-color truncate max-w-xs">{event.title}</span>
          </div>
        </section>

        {/* Event Detail Container */}
        <article className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          
          {/* Category badges & featured marker */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {categories.map((cat) => (
              <span
                key={cat.id}
                className="px-3 py-1 rounded-full text-xs font-bold bg-pastel-purple text-primary-color border border-purple-200"
              >
                {cat.name}
              </span>
            ))}
            {event.is_featured && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-pink text-white uppercase tracking-wider">
                Featured Event
              </span>
            )}
            {event.status && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                {event.status}
              </span>
            )}
          </div>

          {/* Event Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 font-fredoka leading-tight tracking-tight mb-6">
            <SplitText
              text={event.title}
              className="inline-block text-primary-color"
              tag="span"
            />
          </h1>

          {/* Quick Schedule Bar */}
          <div className="bg-pastel-purple rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Start Date & Time */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-primary-color text-white flex items-center justify-center text-lg shrink-0">
                📅
              </div>
              <div>
                <span className="block text-xs font-bold uppercase text-gray-400">Date & Start Time</span>
                <span className="block text-sm font-extrabold text-gray-900 mt-0.5">{startInfo.dateFormatted}</span>
                {startInfo.timeFormatted && (
                  <span className="block text-xs font-semibold text-primary-color">{startInfo.timeFormatted}</span>
                )}
              </div>
            </div>

            {/* End Date if present */}
            {endInfo && (
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-secondary-color text-white flex items-center justify-center text-lg shrink-0">
                  ⏳
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase text-gray-400">Conclusion</span>
                  <span className="block text-sm font-extrabold text-gray-900 mt-0.5">{endInfo.dateFormatted}</span>
                  {endInfo.timeFormatted && (
                    <span className="block text-xs font-semibold text-secondary-color">{endInfo.timeFormatted}</span>
                  )}
                </div>
              </div>
            )}

            {/* Location */}
            {event.location && (
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-accent-pink text-white flex items-center justify-center text-lg shrink-0">
                  📍
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase text-gray-400">Location & Venue</span>
                  <span className="block text-sm font-extrabold text-gray-900 mt-0.5">{event.location}</span>
                </div>
              </div>
            )}
          </div>

          {/* Featured Image Banner */}
          {heroImage && (
            <div className="rounded-3xl overflow-hidden shadow-lg border border-purple-100 mb-10 bg-purple-50">
              <img
                src={heroImage}
                alt={event.title}
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* Main Content & Excerpt */}
          <div className="prose max-w-none font-quicksand text-gray-700 leading-relaxed text-base sm:text-lg space-y-6">
            {event.excerpt && (
              <p className="text-lg sm:text-xl font-semibold text-primary-color border-l-4 border-primary-color pl-4 italic">
                {event.excerpt}
              </p>
            )}

            {event.content ? (
              <div className="whitespace-pre-line leading-relaxed">
                {event.content}
              </div>
            ) : (
              <p className="text-gray-400 italic">No further details provided for this event.</p>
            )}
          </div>

          {/* Navigation / Back Action */}
          <div className="mt-12 pt-6 border-t border-purple-100 flex items-center justify-between">
            <Link
              href="/event"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pastel-purple text-primary-color font-bold text-xs hover:bg-purple-100 transition-colors"
            >
              <span>← Back to All Events</span>
            </Link>

            <Link
              href="/admission"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-color text-white font-bold text-xs hover:opacity-90 transition-opacity shadow-md"
            >
              <span>Enroll / Inquire Now</span>
              <span>↗</span>
            </Link>
          </div>

        </article>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
