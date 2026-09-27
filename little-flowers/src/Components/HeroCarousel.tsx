'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { StorioHeroSlide } from '@storio/template-sdk';

interface HeroCarouselProps {
  slides: StorioHeroSlide[];
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const totalSlides = slides && slides.length > 0 ? slides.length : 1;

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating || index === currentIndex) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating, currentIndex]
  );

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % totalSlides);
  }, [currentIndex, totalSlides, goToSlide]);

  // Auto-play interval (every 6 seconds)
  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [totalSlides, nextSlide]);

  const activeSlide = slides[currentIndex] || slides[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[540px]">
      {/* Left Column: Illustration Showcase with fade transition */}
      <div className="lg:col-span-6 flex justify-center relative">
        <div className="relative w-full max-w-[360px] sm:max-w-[440px] md:max-w-[500px] lg:max-w-[530px] flex items-center justify-center">
          {/* Active Slide Image */}
          <div className="relative w-full flex items-center justify-center transition-all duration-700 ease-out">
            <img
              key={activeSlide?.image_url || currentIndex}
              src={activeSlide?.image_url || '/homepage/H1.webp'}
              alt={activeSlide?.title || 'School Kids'}
              className="w-full h-auto max-h-[580px] sm:max-h-[620px] object-contain transform hover:scale-102 transition-transform duration-500 animate-fadeIn"
            />
          </div>

          {/* Playful colored floating pins/dots around tall image */}
          <div className="absolute -top-3 left-4 w-6 h-6 bg-pink-500 rounded-full border-2 border-white animate-pulse"></div>
          <div className="absolute bottom-10 -left-4 w-7 h-7 bg-amber-400 rounded-full border-2 border-white"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 bg-sky-400 rounded-full border-2 border-white"></div>
          <div className="absolute top-1/4 -right-3 w-5 h-5 bg-lime-400 rounded-full border-2 border-white"></div>
        </div>
      </div>

      {/* Right Column: Hero Content & Organic Blob */}
      <div className="lg:col-span-6 relative z-10 lg:pl-6">
        {/* Background Sunny Yellow Organic Blob */}
        <div className="absolute -top-12 -left-10 w-64 h-64 bg-[#fde68a] rounded-[60%_40%_70%_30%/40%_50%_60%_50%] -z-10 opacity-60 animate-float"></div>

        {/* Diagonal striped decorative bubble */}
        <div
          className="absolute -bottom-8 right-6 w-32 h-32 rounded-[50%_50%_40%_60%/60%_40%_60%_40%] opacity-40 -z-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #38bdf8 0, #38bdf8 2px, transparent 0, transparent 8px)',
          }}
        ></div>

        {/* Dynamic Two-Tone Title */}
        <div key={`text-${currentIndex}`} className="space-y-1 transition-all duration-500 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#6c4298] leading-tight">
            {activeSlide?.title || 'Practical teaching &'}
          </h1>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#f39c12] leading-tight">
            {activeSlide?.subtitle || 'Social Development'}
          </h2>

          {/* Paragraph Text */}
          <p className="pt-4 text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl font-medium">
            We aim at success by creating skills necessary for kids to enrich &
            empower in studies & sports.
          </p>

          {/* Black Pill Button */}
          <div className="pt-6 flex items-center space-x-4">
            <a
              href={activeSlide?.button_url || '/about'}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-black hover:bg-gray-800 text-white font-bold text-sm rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              {activeSlide?.button_text || 'Learn More'}
            </a>
          </div>
        </div>

        {/* Interactive Carousel Indicator Dots */}
        {totalSlides > 1 && (
          <div className="mt-12 flex items-center space-x-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full focus:outline-hidden ${
                  currentIndex === idx
                    ? 'w-4 h-4 bg-[#ff4081] scale-110 shadow-xs ring-2 ring-pink-200'
                    : 'w-3 h-3 border-2 border-[#ff4081] bg-transparent hover:bg-pink-100'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
