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

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
  }, [currentIndex, totalSlides, goToSlide]);

  // Auto-play interval (every 6.5s)
  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(timer);
  }, [totalSlides, nextSlide]);

  const activeSlide = slides[currentIndex] || slides[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
      {/* Left Column: Interactive Illustration Showcase with Floating Stat Badges */}
      <div className="lg:col-span-6 flex justify-center relative">
        <div className="relative w-full max-w-[360px] sm:max-w-[440px] md:max-w-[500px] lg:max-w-[530px] flex items-center justify-center">
          
          {/* Active Slide Image */}
          <div className="relative w-full flex items-center justify-center">
            <img
              key={activeSlide?.image_url || currentIndex}
              src={activeSlide?.image_url || '/homepage/H1.jpg'}
              alt={activeSlide?.title || 'School Kids'}
              className="w-full h-auto max-h-[580px] sm:max-h-[620px] object-contain transition-all duration-700 ease-out hover:scale-103 animate-fadeIn drop-shadow-xl"
            />
          </div>

          {/* Modern Floating Stat Badge 1: Top Right */}
          <div className="absolute top-8 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl shadow-xl border border-pink-100 flex items-center space-x-3 transform animate-float z-20 hover:scale-105 transition-transform cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-accent-pink flex items-center justify-center text-xl shadow-xs">
              🎨
            </div>
            <div>
              <span className="text-xs font-extrabold text-gray-900 block">Creative Arts</span>
              <span className="text-[10px] font-semibold text-accent-pink">Joyful Learning</span>
            </div>
          </div>

          {/* Modern Floating Stat Badge 2: Bottom Left */}
          <div className="absolute bottom-16 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl shadow-xl border border-amber-100 flex items-center space-x-3 transform animate-float-reverse z-20 hover:scale-105 transition-transform cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-secondary-color flex items-center justify-center text-xl shadow-xs">
              ⭐
            </div>
            <div>
              <span className="text-xs font-extrabold text-gray-900 block">4.9 / 5 Rating</span>
              <span className="text-[10px] font-semibold text-secondary-color">From 250+ Parents</span>
            </div>
          </div>

          {/* Modern Floating Stat Badge 3: Bottom Right */}
          <div className="absolute bottom-4 right-6 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-lg border border-sky-100 hidden sm:flex items-center space-x-2 animate-pulse-glow z-20">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[11px] font-bold text-gray-800">100% Safe Campus</span>
          </div>

          {/* Playful colored floating pins/dots around tall image */}
          <div className="absolute -top-3 left-6 w-6 h-6 bg-accent-pink rounded-full border-2 border-white shadow-md animate-pulse"></div>
          <div className="absolute top-1/3 -left-3 w-5 h-5 bg-secondary-color rounded-full border-2 border-white shadow-sm"></div>
          <div className="absolute bottom-2 -right-2 w-7 h-7 bg-accent-blue rounded-full border-2 border-white shadow-md"></div>
        </div>
      </div>

      {/* Right Column: Hero Content & Organic Blob */}
      <div className="lg:col-span-6 relative z-10 lg:pl-4">
        {/* Background Sunny Yellow Organic Blob */}
        <div className="absolute -top-12 -left-10 w-72 h-72 bg-blob-yellow rounded-[60%_40%_70%_30%/40%_50%_60%_50%] -z-10 opacity-70 animate-float blur-xs"></div>

        {/* Diagonal striped decorative bubble */}
        <div
          className="absolute -bottom-10 right-6 w-36 h-36 rounded-[50%_50%_40%_60%/60%_40%_60%_40%] opacity-40 -z-10 animate-float-reverse"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, var(--accent-blue) 0, var(--accent-blue) 2px, transparent 0, transparent 8px)',
          }}
        ></div>

        {/* Dynamic Category Pill */}
        <div className="inline-flex items-center space-x-2 bg-purple-100 text-primary-color font-bold text-xs uppercase px-4 py-1.5 rounded-full mb-4 shadow-xs">
          <span>✨ Welcome to Little Flowers</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary-color"></span>
          <span>Admissions 2026-27</span>
        </div>

        {/* Fixed Two-Tone Title and Information */}
        <div className="space-y-1">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-color leading-[1.15] tracking-tight">
            Practical teaching &
          </h1>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-secondary-color leading-[1.15] tracking-tight">
            Social Development
          </h2>

          {/* Paragraph Text */}
          <p className="pt-4 text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl font-medium">
            We aim at success by creating skills necessary for kids to enrich &
            empower in studies & sports through sensory play, imagination, and loving guidance.
          </p>

          {/* CTA Actions */}
          <div className="pt-6 flex flex-wrap items-center gap-4">
            <a
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 bg-button-dark hover:bg-gray-800 text-white font-bold text-sm rounded-full shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 hover:scale-102"
            >
              Explore Academy
            </a>
            <a
              href="/admission"
              className="inline-flex items-center justify-center px-7 py-4 bg-white hover:bg-pink-50 text-accent-pink font-bold text-sm rounded-full border-2 border-accent-pink shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <span>Book Campus Tour</span>
              <span className="ml-2">→</span>
            </a>
          </div>

          {/* Interactive Slide Controls & Modern Progress Indicators */}
          {totalSlides > 1 && (
            <div className="pt-10 flex items-center space-x-4">
              <div className="flex space-x-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      currentIndex === idx ? 'w-8 bg-accent-pink' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
              
              <div className="flex items-center space-x-1.5 text-xs text-gray-400 font-semibold pl-2">
                <span>0{currentIndex + 1}</span>
                <span>/</span>
                <span>0{totalSlides}</span>
              </div>

              {/* Prev / Next Mini Arrow Buttons */}
              <div className="flex items-center space-x-1 pl-4">
                <button
                  onClick={prevSlide}
                  className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 transition-colors shadow-xs"
                  aria-label="Previous slide"
                >
                  ‹
                </button>
                <button
                  onClick={nextSlide}
                  className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 transition-colors shadow-xs"
                  aria-label="Next slide"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
