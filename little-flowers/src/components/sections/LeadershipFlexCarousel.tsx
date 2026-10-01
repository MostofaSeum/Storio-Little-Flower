'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { StorioLeadershipMessage } from '@/types';
import { resolveMediaUrl } from '@/lib/media';
import SplitText from '@/components/ui/SplitText';
import ThemeIcon from '@/components/ui/ThemeIcon';
import FlexCarousel, { FlexCarouselItem } from '@/components/ui/FlexCarousel';

interface LeadershipFlexCarouselProps {
  messages: StorioLeadershipMessage[];
}

export default function LeadershipFlexCarousel({ messages }: LeadershipFlexCarouselProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  if (!messages || messages.length === 0) return null;

  // Transform messages to FlexCarouselItem list
  const carouselItems: FlexCarouselItem[] = useMemo(() => {
    return messages.map((msg) => {
      const rawUrl =
        msg.image_data?.file_url ||
        msg.image_data?.file ||
        (typeof msg.image === 'string' ? msg.image : null);

      const src = rawUrl ? resolveMediaUrl(rawUrl) : '/homepage/Teachers/Teacher.jpg';

      return {
        src,
        alt: `${msg.name} - ${msg.role || 'Leadership'}`,
        title: msg.name,
        subtitle: msg.role || msg.section_title || 'Leadership',
      };
    });
  }, [messages]);

  const currentMsg = messages[activeIndex] || messages[0];
  const signatureUrl =
    currentMsg?.signature_data?.file_url || currentMsg?.signature_data?.file
      ? resolveMediaUrl(currentMsg.signature_data?.file_url || currentMsg.signature_data?.file)
      : null;

  const cardThemes = [
    {
      badgeBg: 'bg-amber-100 text-secondary-color',
      badgeBorder: 'border-amber-200',
      activeRing: 'ring-amber-200/80',
      activeBorder: 'border-secondary-color',
      accentColor: 'var(--secondary)',
      iconName: 'scroll-certificate' as const,
    },
    {
      badgeBg: 'bg-pink-100 text-accent-pink',
      badgeBorder: 'border-pink-200',
      activeRing: 'ring-pink-200/80',
      activeBorder: 'border-accent-pink',
      accentColor: 'var(--accent-pink)',
      iconName: 'flower-blossom' as const,
    },
    {
      badgeBg: 'bg-sky-100 text-accent-blue',
      badgeBorder: 'border-sky-200',
      activeRing: 'ring-sky-200/80',
      activeBorder: 'border-accent-blue',
      accentColor: 'var(--accent-blue)',
      iconName: 'sparkle-star' as const,
    },
    {
      badgeBg: 'bg-lime-100 text-accent-green',
      badgeBorder: 'border-lime-200',
      activeRing: 'ring-lime-200/80',
      activeBorder: 'border-accent-green',
      accentColor: 'var(--accent-green)',
      iconName: 'sprout-admissions' as const,
    },
  ];

  const activeTheme = cardThemes[activeIndex % cardThemes.length];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto w-full relative overflow-hidden">
      {/* Decorative ambient elements */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-linear-to-b from-purple-100/40 via-pink-50/20 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12 reveal-on-scroll">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-purple-100 text-primary-color mb-3 shadow-2xs">
            <ThemeIcon name="scroll-certificate" size={14} />
            <span>Guiding Principles</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-color leading-tight font-fredoka">
            <SplitText
              text="Messages from Our Leadership"
              tag="span"
              splitType="words, chars"
              delay={25}
              duration={0.7}
              ease="power3.out"
              className="inline-block"
            />
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2 font-medium font-quicksand">
            Drag, scroll, or click cards to experience our leadership vision through the interactive optical lens.
          </p>
        </div>

        <Link
          href="/administration/leadership-message"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-purple-200 text-xs sm:text-sm font-bold text-primary-color hover:bg-pastel-purple hover:border-primary-color transition-all self-start sm:self-auto shadow-2xs group"
        >
          <span>All Messages</span>
          <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* REACT BITS <FlexCarousel /> WebGL2 Canvas Container                       */}
      {/* ========================================================================= */}
      <div className="relative w-full rounded-3xl bg-linear-to-b from-purple-50/60 via-white to-pink-50/30 border-2 border-purple-100/80 shadow-xl overflow-hidden p-2 sm:p-4 mb-8">
        {/* Floating guidance helper */}
        <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-purple-100 text-[11px] font-bold text-purple-700 shadow-2xs select-none">
          <span className="w-2 h-2 rounded-full bg-accent-pink animate-ping" />
          <span>Interactive Lens • Drag or Scroll</span>
        </div>

        {/* The React Bits WebGL Component */}
        <div className="w-full h-[380px] sm:h-[480px] lg:h-[540px] relative">
          <FlexCarousel
            items={carouselItems}
            preset="liquid"
            intro="rise"
            cardHeight={0.62}
            gap={16}
            radius={20}
            squeeze={0.25}
            focusOnClick
            captions={false}
            onChange={(idx) => setActiveIndex(idx)}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ACTIVE LEADER MESSAGE CARD: Syncs seamlessly with the FlexCarousel state  */}
      {/* ========================================================================= */}
      {currentMsg && (
        <div
          key={currentMsg.id || activeIndex}
          className={`relative rounded-3xl bg-white border-2 ${activeTheme.activeBorder} ring-4 ${activeTheme.activeRing} shadow-xl p-6 sm:p-8 lg:p-10 transition-all duration-500 animate-fadeIn`}
        >
          {/* Top Row: Details & Role */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-purple-100/80">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-md border-2 border-white ring-2 ring-purple-100 bg-white shrink-0">
                <img
                  src={
                    currentMsg.image_data?.file_url || currentMsg.image_data?.file
                      ? resolveMediaUrl(currentMsg.image_data?.file_url || currentMsg.image_data?.file)
                      : typeof currentMsg.image === 'string'
                      ? resolveMediaUrl(currentMsg.image)
                      : '/homepage/Teachers/Teacher.jpg'
                  }
                  alt={currentMsg.name}
                  onError={(e) => {
                    e.currentTarget.src = '/homepage/Teachers/Teacher.jpg';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                {currentMsg.section_title && (
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-1 ${activeTheme.badgeBg}`}
                  >
                    {currentMsg.section_title}
                  </span>
                )}
                <h3 className="text-xl sm:text-2xl font-black font-fredoka text-gray-900 leading-snug">
                  {currentMsg.name}
                </h3>
                {currentMsg.role && (
                  <p className="text-xs sm:text-sm font-bold text-primary-color font-quicksand">
                    {currentMsg.role} {currentMsg.company && `• ${currentMsg.company}`}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Card Pagination Indicators */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              {messages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Jump to message ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeIndex === i
                      ? 'w-7 bg-primary-color'
                      : 'w-2.5 bg-purple-200 hover:bg-purple-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Center: Quote Body */}
          <div className="py-6 relative">
            <span className="text-6xl sm:text-7xl font-serif text-purple-200/80 absolute -top-4 -left-2 select-none pointer-events-none font-black leading-none">
              “
            </span>
            <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed font-quicksand font-medium relative z-10 pl-6 sm:pl-8 italic whitespace-pre-line">
              {currentMsg.message}
            </p>
          </div>

          {/* Footer: Read Full Link & Signature */}
          <div className="pt-4 border-t border-purple-100/80 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/administration/leadership-message"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-primary-color hover:text-accent-pink transition-colors group/link"
            >
              <span>Read Full Leadership Statement</span>
              <svg className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            {signatureUrl ? (
              <img
                src={signatureUrl}
                alt={`${currentMsg.name} Signature`}
                className="h-9 sm:h-12 object-contain"
              />
            ) : (
              <span className="text-[11px] font-bold text-gray-400 font-fredoka">
                Little Flowers Governance
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
