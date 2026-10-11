'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { StorioPromotion } from '@/types';
import TypewriterText from '@/components/ui/TypewriterText';

interface PromoCtaSectionProps {
  promotions?: StorioPromotion[];
  promo?: StorioPromotion | null;
}

export default function PromoCtaSection({
  promotions = [],
  promo,
}: PromoCtaSectionProps) {
  // Normalize promotions list
  const allPromos =
    Array.isArray(promotions) && promotions.length > 0
      ? promotions
      : promo
        ? [promo]
        : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [rollDirection, setRollDirection] = useState<'up' | 'down'>('up');
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = allPromos.length;

  // Auto-roll timer: smooth rollover every 6.5 seconds when not hovered and multiple promos exist
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      triggerRoll('next');
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isPaused, currentIndex]);

  const triggerRoll = (dir: 'next' | 'prev') => {
    if (isRolling || total <= 1) return;
    setIsRolling(true);
    setRollDirection(dir === 'next' ? 'up' : 'down');

    // Wait for the exit transition before switching index
    setTimeout(() => {
      setCurrentIndex((prev) => {
        if (dir === 'next') {
          return (prev + 1) % total;
        } else {
          return (prev - 1 + total) % total;
        }
      });
      // Allow new card to mount and animate in
      setTimeout(() => {
        setIsRolling(false);
      }, 50);
    }, 450);
  };

  if (total === 0) return null;

  const currentItem = allPromos[currentIndex];
  const isSecond = currentIndex % 2 === 1;

  // Resolve promo image
  const rawImage =
    (typeof currentItem.image_detail === 'string' ? currentItem.image_detail : undefined) ||
    (typeof currentItem.image === 'string' ? currentItem.image : undefined);

  const bgImageUrl = rawImage
    ? rawImage.startsWith('http')
      ? rawImage
      : `https://api.storio.cloud${rawImage}`
    : null;

  // Alternating playful gradient themes
  const bannerGradient = isSecond
    ? 'bg-gradient-to-r from-pink-200 via-amber-200 to-amber-300'
    : 'bg-gradient-to-r from-amber-300 via-amber-200 to-pink-200';
  const overlayGradient = isSecond
    ? 'bg-gradient-to-r from-pink-200/40 via-amber-200/30 to-amber-300/40'
    : 'bg-gradient-to-r from-amber-300/40 via-amber-200/30 to-pink-200/40';

  return (
    <section className="site-section-px py-6 sm:py-10 site-container w-full">
      {/* Outer Card: Stable, premium rounded card with ambient background */}
      <div
        className={`relative overflow-hidden rounded-3xl shadow-xl border border-amber-200/80 ${bannerGradient} transition-colors duration-700`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Subtle Transparent Background Image */}
        {bgImageUrl && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-20 mix-blend-overlay transition-opacity duration-700"
              style={{ backgroundImage: `url(${bgImageUrl})` }}
            />
            <div className={`absolute inset-0 ${overlayGradient} pointer-events-none`} />
          </>
        )}

        {/* Content Wrapper with smooth vertical roll-over and crossfade */}
        <div className="relative p-8 sm:p-14 min-h-[180px] sm:min-h-[190px] flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Text Segment with smooth roll and typewriter */}
          <div
            key={`promo-content-${currentItem.id || currentIndex}`}
            className={`relative z-10 max-w-2xl space-y-3 text-center md:text-left transition-all duration-500 cubic-bezier(0.16,1,0.3,1) ${
              isRolling
                ? '-translate-y-5 opacity-0'
                : 'translate-y-0 opacity-100'
            }`}
          >
            {currentItem.badge_text && (
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="inline-block bg-white text-secondary-color font-bold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs animate-pulse">
                  {currentItem.badge_text}
                </span>
                {total > 1 && (
                  <span className="text-[11px] font-extrabold text-amber-900/80 bg-white/70 px-2.5 py-0.5 rounded-full shadow-2xs">
                    {currentIndex + 1} of {total}
                  </span>
                )}
              </div>
            )}

            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight min-h-[3.2rem] sm:min-h-[4.2rem] font-fredoka text-gray-900">
              <TypewriterText
                key={`typewriter-${currentItem.id || currentIndex}-${currentItem.title}`}
                text={currentItem.title || 'Admissions Open'}
                speed={45}
                delay={80}
                cursorColor="var(--accent-pink)"
              />
            </h2>

            {(currentItem.subtitle || currentItem.description) && (
              <p className="text-gray-700 text-sm sm:text-base font-medium line-clamp-2">
                {currentItem.subtitle || currentItem.description}
              </p>
            )}
          </div>

          {/* Right Action Button (Clean, no extra triangle buttons) */}
          <div className="relative z-10 shrink-0 flex items-center">
            <a
              href={currentItem.cta_url || '/admission'}
              className="px-8 py-3.5 sm:py-4 bg-button-dark hover:opacity-90 text-white font-bold text-sm sm:text-base rounded-full shadow-xl transition-all transform hover:-translate-y-1 hover:scale-105 inline-block text-center cursor-pointer"
            >
              {currentItem.cta_label || 'Apply for Admission'}
            </a>
          </div>
        </div>

        {/* Carousel indicator dots bar at the bottom */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1 bg-white/70 backdrop-blur-xs rounded-full shadow-2xs border border-amber-200/50">
            {allPromos.map((_, dotIdx) => (
              <button
                key={`dot-${dotIdx}`}
                type="button"
                onClick={() => {
                  if (dotIdx !== currentIndex && !isRolling) {
                    setIsRolling(true);
                    setRollDirection(dotIdx > currentIndex ? 'up' : 'down');
                    setTimeout(() => {
                      setCurrentIndex(dotIdx);
                      setTimeout(() => setIsRolling(false), 50);
                    }, 350);
                  }
                }}
                aria-label={`Go to promotion ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  dotIdx === currentIndex
                    ? 'w-6 h-2 bg-primary-color'
                    : 'w-2 h-2 bg-gray-400/60 hover:bg-gray-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Optional Link to All Promotions */}
      {total > 1 && (
        <div className="flex justify-center pt-4">
          <Link
            href="/promotions"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-pastel-purple text-primary-color font-bold text-xs sm:text-sm border border-purple-200 hover:border-primary-color shadow-xs hover:shadow-sm transition-all group"
          >
            <span>View All Active Offers</span>
            <span className="px-2 py-0.5 rounded-full bg-pink-100 text-accent-pink text-[11px] font-extrabold">
              {total}
            </span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      )}
    </section>
  );
}
