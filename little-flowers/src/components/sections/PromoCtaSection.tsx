import React from 'react';
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
  // Normalize promotions list: prioritize promotions array, fallback to single promo if provided
  const allPromos =
    Array.isArray(promotions) && promotions.length > 0
      ? promotions
      : promo
        ? [promo]
        : [];

  if (allPromos.length === 0) return null;

  // Rule: If multiple active promotions, show only the top 2 on the homepage
  const displayPromos = allPromos.slice(0, 2);
  const totalCount = allPromos.length;
  const hasMultiple = totalCount > 1;

  return (
    <section className="site-section-px py-10 site-container w-full space-y-6">
      {displayPromos.map((item, index) => {
        // Resolve promo image (handles /media/ prefixes from API)
        const rawImage =
          item.image_detail?.file ||
          item.image_detail?.file_url ||
          (typeof item.image === 'string' ? item.image : undefined);

        const bgImageUrl = rawImage
          ? rawImage.startsWith('http')
            ? rawImage
            : `https://api.storio.cloud${rawImage}`
          : null;

        // Gradient logic:
        // 1st badge (index 0): amber on left -> pink on right (from-amber-300 via-amber-200 to-pink-200)
        // 2nd badge (index 1): 90-degree / opposite rotation -> yellowish on the right: (from-pink-200 via-amber-200 to-amber-300)
        const isSecond = index === 1;
        const bannerGradient = isSecond
          ? 'bg-gradient-to-r from-pink-200 via-amber-200 to-amber-300'
          : 'bg-gradient-to-r from-amber-300 via-amber-200 to-pink-200';
        const overlayGradient = isSecond
          ? 'bg-gradient-to-r from-pink-200/40 via-amber-200/30 to-amber-300/40'
          : 'bg-gradient-to-r from-amber-300/40 via-amber-200/30 to-pink-200/40';

        return (
          <div
            key={item.id || index}
            className={`relative rounded-3xl overflow-hidden ${bannerGradient} p-8 sm:p-14 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 reveal-on-scroll`}
          >
            {/* Subtle Transparent Background Image from API */}
            {bgImageUrl && (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-20 mix-blend-overlay transition-opacity duration-700"
                  style={{ backgroundImage: `url(${bgImageUrl})` }}
                />
                {/* Soft tint gradient to ensure text readability */}
                <div className={`absolute inset-0 ${overlayGradient} pointer-events-none`} />
              </>
            )}

            <div className="relative z-10 max-w-2xl space-y-3 text-center md:text-left">
              {item.badge_text && (
                <span className="inline-block bg-white text-secondary-color font-bold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs animate-pulse">
                  {item.badge_text}
                </span>
              )}
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight min-h-[3rem] sm:min-h-[3.5rem] font-fredoka">
                <TypewriterText
                  text={item.title || 'Admissions Open'}
                  speed={65}
                  delay={150 + index * 100}
                  cursorColor="var(--accent-pink)"
                />
              </h2>
              {(item.subtitle || item.description) && (
                <p className="text-gray-700 text-sm sm:text-base font-medium">
                  {item.subtitle || item.description}
                </p>
              )}
            </div>

            <div className="relative z-10 shrink-0 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={item.cta_url || '/admission'}
                className="px-8 py-4 bg-button-dark hover:opacity-90 text-white font-bold text-sm sm:text-base rounded-full shadow-xl transition-all transform hover:-translate-y-1 hover:scale-105 inline-block text-center"
              >
                {item.cta_label || 'Apply for Admission'}
              </a>
            </div>
          </div>
        );
      })}

      {/* Button to see all promotions when there are promotions available */}
      {hasMultiple && (
        <div className="flex justify-center pt-2 reveal-on-scroll">
          <Link
            href="/promotions"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white hover:bg-pastel-purple text-primary-color font-bold text-sm border-2 border-purple-200 hover:border-primary-color shadow-sm hover:shadow-md transition-all group"
          >
            <span>See All Promotions</span>
            {totalCount > 2 && (
              <span className="px-2 py-0.5 rounded-full bg-pink-100 text-accent-pink text-xs font-extrabold">
                {totalCount}
              </span>
            )}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      )}
    </section>
  );
}
