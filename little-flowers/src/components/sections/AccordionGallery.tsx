'use client';

import React, { useState } from 'react';
import ThemeIcon from '@/components/ui/ThemeIcon';
import { StorioEvent } from '@/data/storioExtendedTypes';

interface AccordionGalleryProps {
  events: StorioEvent[];
}

export default function AccordionGallery({ events }: AccordionGalleryProps) {
  // Cap at a maximum of 4 events for balanced horizontal accordion layout
  const displayedEvents = (events || []).slice(0, 4);

  // Default first event open, or activeIndex
  const [activeIndex, setActiveIndex] = useState<number>(0);

  if (!displayedEvents || displayedEvents.length === 0) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return { day: '15', month: 'OCT', time: '9:00 AM' };
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return { day, month, time };
  };

  return (
    <div className="w-full">
      {/* Desktop & Tablet: Horizontal expanding accordion gallery */}
      <div className="hidden md:flex gap-3 lg:gap-4 h-[440px] w-full">
        {displayedEvents.map((event, idx) => {
          const isActive = activeIndex === idx;
          const { day, month, time } = formatDate(event.start_date);
          const borderAccents = [
            'border-amber-300',
            'border-pink-300',
            'border-sky-300',
            'border-lime-300',
          ];
          const badgeBg = [
            'bg-secondary-color text-white',
            'bg-accent-pink text-white',
            'bg-accent-blue text-white',
            'bg-accent-green text-white',
          ];

          const eventImage =
            event.featured_image_detail?.file
              ? (event.featured_image_detail.file.startsWith('http')
                  ? event.featured_image_detail.file
                  : `https://api.storio.cloud${event.featured_image_detail.file}`)
              : event.featured_image || '/homepage/Campus Life & Gatherings/1.jpg';

          return (
            <div
              key={event.id || idx}
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => setActiveIndex(idx)}
              className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] border-2 ${
                borderAccents[idx % 4]
              } ${
                isActive
                  ? 'flex-[3.5] shadow-2xl ring-4 ring-pink-100/50'
                  : 'flex-[1] opacity-80 hover:opacity-100 shadow-md'
              }`}
            >
              {/* Background Image */}
              <img
                src={eventImage}
                alt={event.title}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/homepage/Happy Memories/Trial 1.jpg')) {
                    target.src = '/homepage/Happy Memories/Trial 1.jpg';
                  }
                }}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient Dark Overlay */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${
                  isActive
                    ? 'bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-transparent'
                    : 'bg-gray-950/60 hover:bg-gray-950/50'
                }`}
              />

              {/* Top Floating Date Badge */}
              <div className="absolute top-4 left-4 z-10">
                <div
                  className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold shadow-lg transition-transform duration-300 ${
                    isActive ? 'scale-105' : 'scale-95'
                  } ${badgeBg[idx % 4]}`}
                >
                  <span className="text-lg leading-none font-black">{day}</span>
                  <span className="text-[10px] tracking-wider uppercase">{month}</span>
                </div>
              </div>

              {/* Status Badge */}
              {event.status && (
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full backdrop-blur-md transition-opacity duration-300 ${
                      isActive ? 'bg-white/90 text-gray-900 shadow-sm' : 'bg-black/40 text-white/90'
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
              )}

              {/* Collapsed State Title (Vertical text when not active) */}
              {!isActive && (
                <div className="absolute inset-0 top-20 flex items-center justify-center pointer-events-none p-2">
                  <span
                    className="text-white font-extrabold text-sm sm:text-base tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-1 select-none"
                    style={{
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                    }}
                  >
                    {event.title}
                  </span>
                </div>
              )}

              {/* Expanded Active State Content with smooth entrance */}
              {isActive && (
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 z-10 flex flex-col justify-end text-white animate-fadeIn">
                  {/* Category / Location & Time Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-amber-300 bg-amber-950/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-amber-400/30">
                      <img src="/icons/clock-time.svg" alt="Time" className="w-4 h-4 inline-block" /> {time}
                    </span>
                    {event.location && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-200 bg-sky-950/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-sky-400/30">
                        <ThemeIcon name="location-pin" size={13} /> {event.location}
                      </span>
                    )}
                  </div>

                  {/* Title using theme token var(--blob-yellow) from globals.css */}
                  <h3
                    style={{ color: 'var(--blob-yellow)' }}
                    className="text-2xl lg:text-3xl font-black font-fredoka leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
                  >
                    {event.title}
                  </h3>

                  {/* Snippet / Description */}
                  <p className="text-gray-200 text-xs sm:text-sm mt-2 line-clamp-2 max-w-xl font-medium leading-relaxed drop-shadow-sm">
                    {event.content || event.excerpt}
                  </p>

                  {/* CTA button */}
                  <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                    <a
                      href="/event"
                      className="text-xs font-bold text-pink-300 flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <span>Event Schedule & RSVP</span>
                      <span>→</span>
                    </a>
                    <span className="text-[11px] text-gray-300 font-semibold">
                      School Campus
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Screen: Vertical Stacking Accordion Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {displayedEvents.map((event, idx) => {
          const isActive = activeIndex === idx;
          const { day, month, time } = formatDate(event.start_date);
          const badgeBg = [
            'bg-secondary-color text-white',
            'bg-accent-pink text-white',
            'bg-accent-blue text-white',
            'bg-accent-green text-white',
          ];

          const eventImage =
            event.featured_image_detail?.file
              ? (event.featured_image_detail.file.startsWith('http')
                  ? event.featured_image_detail.file
                  : `https://api.storio.cloud${event.featured_image_detail.file}`)
              : event.featured_image || '/homepage/Campus Life & Gatherings/1.jpg';

          return (
            <div
              key={event.id || idx}
              onClick={() => setActiveIndex(isActive ? -1 : idx)}
              className="rounded-3xl overflow-hidden border-2 border-purple-100 bg-white shadow-md cursor-pointer transition-all duration-300"
            >
              <div className="relative h-44 w-full">
                <img
                  src={eventImage}
                  alt={event.title}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/homepage/Happy Memories/Trial 1.jpg')) {
                      target.src = '/homepage/Happy Memories/Trial 1.jpg';
                    }
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />

                <div className="absolute top-3 left-3">
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold shadow-md ${badgeBg[idx % 4]}`}>
                    <span className="text-base font-black leading-none">{day}</span>
                    <span className="text-[9px] uppercase">{month}</span>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4
                    style={{ color: 'var(--blob-yellow)' }}
                    className="font-extrabold text-base leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                  >
                    {event.title}
                  </h4>
                </div>
              </div>

              {isActive && (
                <div className="p-4 bg-white space-y-2 text-xs text-gray-600 animate-fadeIn">
                  <div className="flex items-center gap-2 text-primary-color font-bold">
                    <span><img src="/icons/clock-time.svg" alt="Time" className="w-4 h-4 inline-block" /> {time}</span>
                    {event.location && (
                      <span className="inline-flex items-center gap-1">• <ThemeIcon name="location-pin" size={13} /> {event.location}</span>
                    )}
                  </div>
                  <p className="leading-relaxed">{event.content || event.excerpt}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
