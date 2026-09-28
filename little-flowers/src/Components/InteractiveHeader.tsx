'use client';

import React, { useState, useEffect, useRef } from 'react';
import { StorioSettingsResponse } from '@storio/template-sdk';

interface InteractiveHeaderProps {
  settings: StorioSettingsResponse;
}

export default function InteractiveHeader({ settings }: InteractiveHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  // Pill indicator layout coordinates (Pill Nav effect)
  const navContainerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '#about' },
    { label: 'Programs', href: '#programs' },
    { label: 'Teachers', href: '#teachers' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Events', href: '#events' },
    { label: 'Admission', href: '/admission' },
    { label: 'Notices', href: '#notices' },
    { label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update pill position when active or hovered tab changes
  useEffect(() => {
    const targetLabel = hoveredTab || activeTab;
    if (!navContainerRef.current) return;

    const targetEl = navContainerRef.current.querySelector<HTMLElement>(
      `[data-nav-label="${targetLabel}"]`
    );

    if (targetEl) {
      setPillStyle({
        left: targetEl.offsetLeft,
        width: targetEl.offsetWidth,
        opacity: 1,
      });
    }
  }, [hoveredTab, activeTab]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'py-2 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100'
          : 'py-3.5 bg-white border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
        {/* Logo with playful wiggle hover */}
        <a href="/" className="flex items-center space-x-3 group shrink-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-300 via-pink-400 to-sky-400 p-2 flex items-center justify-center shadow-md transform group-hover:rotate-12 group-hover:scale-105 transition-all duration-300">
            <img
              src="/icons/school.png"
              alt="School Logo"
              className="w-full h-full object-contain brightness-0 invert drop-shadow-xs"
            />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 font-fredoka flex items-center gap-1.5">
              {settings?.site_title || 'Little Flowers'}
              <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse"></span>
            </span>
          </div>
        </a>

        {/* React Bits Pill Navigation Bar (Desktop) */}
        <div
          ref={navContainerRef}
          onMouseLeave={() => setHoveredTab(null)}
          className="hidden lg:flex items-center relative p-1.5 rounded-full bg-pastel-purple border border-purple-100/70 shadow-xs"
        >
          {/* Animated Sliding Pill Highlight */}
          <div
            className="absolute top-1.5 bottom-1.5 rounded-full bg-white shadow-sm border border-purple-100 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
            style={{
              left: `${pillStyle.left}px`,
              width: `${pillStyle.width}px`,
              opacity: pillStyle.opacity,
            }}
          />

          {navLinks.map((item) => {
            const isCurrent = activeTab === item.label;
            const isHovered = hoveredTab === item.label;

            return (
              <a
                key={item.label}
                href={item.href}
                data-nav-label={item.label}
                onMouseEnter={() => setHoveredTab(item.label)}
                onClick={() => {
                  setActiveTab(item.label);
                  setHoveredTab(null);
                }}
                className={`relative z-10 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors duration-200 select-none ${
                  isCurrent || isHovered
                    ? 'text-primary-color scale-[1.02]'
                    : 'text-gray-600 hover:text-primary-color'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Right Action: Visit Campus Button & Mobile Hamburger */}
        <div className="flex items-center space-x-3 shrink-0">
          <a
            href="/admission"
            className="hidden sm:inline-flex items-center space-x-2 px-5 py-2.5 bg-primary-color hover:opacity-90 text-white font-bold text-xs rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <span>Enroll Now</span>
            <span>→</span>
          </a>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-2xl bg-pastel-purple hover:bg-purple-100 text-primary-color transition-colors"
            aria-label="Toggle navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu with Pill items */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-lg border-b border-gray-200 px-6 py-4 animate-fadeIn">
          <nav className="flex flex-col space-y-2 font-semibold text-sm">
            {navLinks.map((item) => {
              const isCurrent = activeTab === item.label;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    setActiveTab(item.label);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-4 rounded-full text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-pastel-purple text-primary-color font-extrabold shadow-xs'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-color'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <div className="pt-2">
              <a
                href="/admission"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center py-2.5 bg-secondary-color text-white font-bold rounded-full shadow-md text-xs"
              >
                Enroll Now →
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
