'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inspectionModalRef = useRef<HTMLDivElement>(null);

  // Close focus view on Escape key or outside click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocused) {
        setIsFocused(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused]);

  if (!messages || messages.length === 0) return null;

  // Transform messages to FlexCarouselItem list
  const carouselItems: FlexCarouselItem[] = useMemo(() => {
    return messages.map((msg) => {
      const rawUrl =
        msg.image_data?.file_url ||
        msg.image_data?.file ||
        (typeof msg.image === 'string' ? msg.image : null);

      // Prefer same-origin relative path for /media/ so WebGL canvas textures load cleanly without cross-origin blocking
      let src = '/homepage/Teachers/Teacher.jpg';
      if (rawUrl) {
        if (rawUrl.startsWith('/media/')) {
          src = rawUrl;
        } else {
          src = resolveMediaUrl(rawUrl);
        }
      }

      return {
        src,
        alt: `${msg.name} - ${msg.role || 'Leadership'}`,
        title: msg.name,
        subtitle: `${msg.role || 'Leadership'}${msg.company ? ` • ${msg.company}` : ''}`,
      };
    });
  }, [messages]);

  const currentMsg = messages[activeIndex] || messages[0];
  const currentPhotoSrc = carouselItems[activeIndex]?.src || '/homepage/Teachers/Teacher.jpg';

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
            Inspiring words and timeless wisdom guiding our students toward excellence, empathy, and lifelong learning.
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
            focusOnClick={false}
            captions={false}
            onChange={(idx) => setActiveIndex(idx)}
            onSelect={(idx) => {
              setActiveIndex(idx);
              setIsFocused(true);
            }}
            className="w-full h-full cursor-pointer"
          />

          {/* Leader Details Card Floating Overlay */}
          {!isFocused && currentMsg && (
            <div className="pointer-events-none absolute bottom-4 sm:bottom-6 inset-x-0 flex justify-center px-4 z-10 animate-fadeIn">
              <button
                type="button"
                onClick={() => setIsFocused(true)}
                className="pointer-events-auto group max-w-md w-full bg-white/92 backdrop-blur-md rounded-2xl border-2 border-purple-200/90 shadow-lg hover:shadow-xl p-3 sm:p-4 flex items-center justify-between gap-3 text-left transition-all hover:scale-[1.02] hover:border-primary-color active:scale-95 cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    {currentMsg.section_title && (
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${activeTheme.badgeBg}`}>
                        {currentMsg.section_title}
                      </span>
                    )}
                    <span className="text-[11px] font-bold text-accent-pink">
                      Click to read statement
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black font-fredoka text-gray-900 truncate group-hover:text-primary-color transition-colors">
                    {currentMsg.name}
                  </h4>
                  <p className="text-xs font-bold text-gray-600 truncate font-quicksand">
                    {currentMsg.role || 'Leadership'}
                    {currentMsg.company ? ` • ${currentMsg.company}` : ' • Little Flowers'}
                  </p>
                </div>

                <div className="w-9 h-9 rounded-xl bg-purple-50 text-primary-color group-hover:bg-primary-color group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* EXPANDED FOCUS VIEW: Photo moves to LEFT, Message on RIGHT with SplitText */}
          {/* ========================================================================= */}
          {isFocused && currentMsg && (
            <div
              className="absolute inset-0 z-30 bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setIsFocused(false);
                }
              }}
            >
              <div
                ref={inspectionModalRef}
                className="relative w-full max-w-4xl max-h-[92%] bg-white rounded-3xl border-2 border-purple-200 shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-500 animate-scaleUp"
              >
                {/* Close Button on top-right */}
                <button
                  type="button"
                  onClick={() => setIsFocused(false)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 flex items-center justify-center shadow-md border border-purple-100 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  aria-label="Close message view"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Left Side: Large Leader Photo with Identity Badge */}
                <div className="w-full md:w-5/12 bg-linear-to-b from-purple-100/50 via-pink-50/40 to-white p-5 sm:p-7 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-purple-100">
                  <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-3xl overflow-hidden shadow-xl border-4 border-white ring-4 ring-purple-100 bg-white shrink-0 relative group">
                    <img
                      src={currentPhotoSrc}
                      alt={currentMsg.name}
                      onError={(e) => {
                        e.currentTarget.src = '/homepage/Teachers/Teacher.jpg';
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-4 sm:mt-5 max-w-xs">
                    {currentMsg.section_title && (
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-2 ${activeTheme.badgeBg}`}>
                        {currentMsg.section_title}
                      </span>
                    )}
                    <h3 className="text-xl sm:text-2xl font-black font-fredoka text-gray-900 leading-snug">
                      {currentMsg.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-primary-color font-quicksand mt-1">
                      {currentMsg.role || 'Leadership'}
                    </p>
                    <p className="text-[11px] sm:text-xs font-semibold text-gray-500 mt-0.5">
                      {currentMsg.company || 'Little Flowers Educational Trust'}
                    </p>
                  </div>
                </div>

                {/* Right Side: Animated Leadership Message with SplitText */}
                <div className="w-full md:w-7/12 p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-y-auto">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-primary-color mb-3">
                      <ThemeIcon name="flower-blossom" size={16} />
                      <span>Official Leadership Address</span>
                    </div>

                    <div className="relative py-2 sm:py-3">
                      <span className="text-5xl sm:text-6xl font-serif text-purple-200/90 absolute -top-4 -left-2 select-none pointer-events-none font-black leading-none">
                        “
                      </span>
                      <div className="pl-6 sm:pl-7 text-gray-700 font-quicksand font-medium text-sm sm:text-base md:text-lg leading-relaxed italic">
                        <SplitText
                          text={currentMsg.message}
                          tag="p"
                          splitType="words"
                          delay={15}
                          duration={0.65}
                          ease="power3.out"
                          triggerOnMount={true}
                          textAlign="left"
                          className="whitespace-pre-line text-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer inside expanded view */}
                  <div className="mt-6 pt-4 border-t border-purple-100 flex flex-wrap items-center justify-between gap-4">
                    <Link
                      href="/administration/leadership-message"
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-primary-color hover:text-accent-pink transition-colors group/link"
                    >
                      <span>Read Governance Page</span>
                      <svg className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>

                    {signatureUrl ? (
                      <img
                        src={signatureUrl}
                        alt={`${currentMsg.name} Signature`}
                        className="h-8 sm:h-10 object-contain"
                      />
                    ) : (
                      <span className="text-[11px] font-bold text-gray-400 font-fredoka">
                        Little Flowers Governance
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

