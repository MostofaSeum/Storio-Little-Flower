import React from 'react';
import { StorioTestimonial, LittleFlowersCustomizationConfig } from '@/types';
import SplitText from '@/components/ui/SplitText';
import TestimonialSlider from '@/components/sections/TestimonialSlider';

interface TestimonialsSectionProps {
  testimonials: StorioTestimonial[];
  siteTitle?: string;
  customization?: LittleFlowersCustomizationConfig | null;
}

export default function TestimonialsSection({ testimonials, siteTitle, customization }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  const defaultSubtitle = `Hear what parents say about their child’s joyful journey with ${siteTitle || 'our school'}.`;
  const badgeText = customization?.testimonials_section_badge || "Parent Voices";
  const titleText = customization?.testimonials_section_title || "Loved by Families";
  const subtitleText = customization?.testimonials_section_subtitle || defaultSubtitle;

  return (
    <section className="site-section-py site-section-px bg-gradient-to-b from-accent-soft-blue/70 to-pink-50/40 border-t border-sky-100 relative overflow-hidden">
      {/* Subtle floating background decorations */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-amber-200 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

      <div className="site-container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14 reveal-on-scroll">
          <span className="text-xs font-extrabold tracking-wider uppercase text-accent-pink bg-pink-100 px-3.5 py-1 rounded-full shadow-xs">
            {badgeText}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 font-fredoka">
            <SplitText
              text={titleText}
              tag="span"
              splitType="chars"
              delay={30}
              duration={0.7}
              ease="power3.out"
              className="inline-block"
            />
          </h2>
          <p className="text-gray-600 text-sm mt-2 font-medium">
            {subtitleText}
          </p>
        </div>

        {/* Interactive Testimonial Slider */}
        <TestimonialSlider testimonials={testimonials} />
      </div>
    </section>
  );
}
