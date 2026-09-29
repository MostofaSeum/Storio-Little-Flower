import React from 'react';
import { StorioPromotion } from '@/types';
import TypewriterText from '@/components/ui/TypewriterText';

interface PromoCtaSectionProps {
  promo?: StorioPromotion | null;
}

export default function PromoCtaSection({ promo }: PromoCtaSectionProps) {
  if (!promo) return null;

  return (
    <section className="px-4 sm:px-8 py-10 max-w-7xl mx-auto w-full">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-300 via-amber-200 to-pink-200 p-8 sm:p-14 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 reveal-on-scroll">
        <div className="max-w-2xl space-y-3 text-center md:text-left">
          {promo.badge_text && (
            <span className="inline-block bg-white text-secondary-color font-bold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs animate-pulse">
              {promo.badge_text}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-color leading-tight min-h-[3rem] sm:min-h-[3.5rem] font-fredoka">
            <TypewriterText
              text={promo.title || "Early Bird Admissions 2026-2027 Open!"}
              speed={65}
              delay={150}
              cursorColor="var(--accent-pink)"
            />
          </h2>
          <p className="text-gray-700 text-sm sm:text-base font-medium">
            {promo.subtitle || promo.description}
          </p>
        </div>

        <div className="shrink-0">
          <a
            href={promo.cta_url || "/admission"}
            className="px-8 py-4 bg-button-dark hover:opacity-90 text-white font-bold text-sm sm:text-base rounded-full shadow-xl transition-all transform hover:-translate-y-1 hover:scale-105 inline-block"
          >
            {promo.cta_label || "Apply for Admission"}
          </a>
        </div>
      </div>
    </section>
  );
}
