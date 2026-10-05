'use client';

import React, { useState, useEffect } from 'react';
import { StorioTestimonial } from '@/data/storioExtendedTypes';

interface TestimonialSliderProps {
  testimonials: StorioTestimonial[];
}

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!testimonials || testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials]);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="relative max-w-5xl mx-auto">
      {/* 3 Grid layout on larger screens, interactive cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {testimonials.map((t, idx) => {
          const isFeatured = idx === activeIdx;
          const bgAccents = [
            'hover:border-amber-300',
            'hover:border-pink-300',
            'hover:border-sky-300',
          ];

          return (
            <div
              key={t.id || idx}
              onClick={() => setActiveIdx(idx)}
              className={`p-8 rounded-3xl backdrop-blur-md border-2 transition-all duration-500 flex flex-col justify-between cursor-pointer card-interactive relative ${
                isFeatured
                  ? 'border-accent-pink shadow-xl ring-4 ring-pink-100/50 -translate-y-2'
                  : `border-sky-100/80 opacity-90 ${bgAccents[idx % 3]}`
              }`}
              style={{ backgroundColor: 'var(--bg-surface, #ffffff)' }}
            >
              {/* Cute Quote Icon Watermark */}
              <div className="absolute top-4 right-5 text-gray-200 text-5xl font-serif font-black select-none pointer-events-none opacity-40">
                “
              </div>

              <div>
                {/* Star rating */}
                <div className="flex items-center space-x-1 text-secondary-color text-base mb-4">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <span key={i} className="transform hover:scale-125 transition-transform">★</span>
                  ))}
                </div>

                <p className="text-gray-700 text-sm leading-relaxed italic font-medium relative z-10 line-clamp-4">
                  "{t.message || t.quote || t.content}"
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100 flex items-center space-x-3.5">
                {(() => {
                  const photoSrc =
                    t.avatar_url ||
                    (t.photo_data?.file_url
                      ? (t.photo_data.file_url.startsWith('http')
                          ? t.photo_data.file_url
                          : `https://api.storio.cloud${t.photo_data.file_url}`)
                      : null);

                  return (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-pink-300 to-amber-200 flex items-center justify-center text-primary-color font-extrabold text-sm shadow-inner ring-2 ring-white overflow-hidden shrink-0">
                      {photoSrc ? (
                        <img
                          src={photoSrc}
                          alt={t.name}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span>{t.name?.charAt(0) || 'P'}</span>
                      )}
                    </div>
                  );
                })()}
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm">{t.name}</h4>
                  <span className="text-[11px] font-semibold text-accent-pink block">
                    {t.designation || t.role || (t.organization ? `Parent (${t.organization})` : 'Preschool Parent')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide Indicators for mobile & visual feedback */}
      <div className="flex justify-center items-center space-x-2.5 mt-8">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`transition-all duration-300 rounded-full h-2.5 ${
              activeIdx === idx ? 'w-8 bg-accent-pink' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to testimonial ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
