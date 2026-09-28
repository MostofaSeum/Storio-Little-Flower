'use client';

import React, { useState, useEffect } from 'react';
import { StorioSettingsResponse } from '@storio/template-sdk';

interface InteractiveHeaderProps {
  settings: StorioSettingsResponse;
}

export default function InteractiveHeader({ settings }: InteractiveHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Kindergarten theme colorful links using existing tokens from globals.css
  const navLinks = [
    { label: 'Home', href: '/', color: 'var(--accent-green)', bgHover: 'var(--accent-green)' },
    { label: 'About', href: '#about', color: 'var(--accent-pink)', bgHover: 'var(--accent-pink)' },
    { label: 'Programs', href: '#programs', color: 'var(--accent-blue)', bgHover: 'var(--accent-blue)' },
    { label: 'Teachers', href: '#teachers', color: 'var(--secondary)', bgHover: 'var(--secondary)' },
    { label: 'Gallery', href: '#gallery', color: 'var(--primary)', bgHover: 'var(--primary)' },
    { label: 'Events', href: '#events', color: 'var(--secondary)', bgHover: 'var(--secondary)' },
    { label: 'Admission', href: '/admission', color: 'var(--accent-pink)', bgHover: 'var(--accent-pink)' },
    { label: 'Notices', href: '#notices', color: 'var(--primary)', bgHover: 'var(--primary)' },
    { label: 'Contact', href: '#contact', color: 'var(--accent-blue)', bgHover: 'var(--accent-blue)' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'py-2.5 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100'
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

        {/* React Bits Authentic PillNav (Desktop) */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center rounded-full p-1 bg-pastel-purple border border-purple-100 shadow-xs"
        >
          <ul role="menubar" className="list-none flex items-center m-0 p-0 gap-1.5">
            {navLinks.map((item, i) => {
              const isActive = activeTab === item.label;
              const isHovered = hoveredIdx === i;

              return (
                <li key={item.label} role="none" className="relative flex items-center">
                  <a
                    role="menuitem"
                    href={item.href}
                    onClick={() => setActiveTab(item.label)}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="relative overflow-hidden inline-flex items-center justify-center h-9 px-4 rounded-full font-bold text-xs tracking-wide uppercase transition-all duration-300 group cursor-pointer select-none bg-white border border-gray-100/80 shadow-xs hover:shadow-md"
                    style={{
                      borderColor: isActive ? item.color : undefined,
                    }}
                  >
                    {/* React Bits Circular expanding background fill - fully covers entire pill */}
                    <span
                      className="absolute inset-0 m-auto rounded-full pointer-events-none transition-transform duration-300 ease-out z-[1]"
                      style={{
                        backgroundColor: item.bgHover,
                        width: '240px',
                        height: '240px',
                        transform: isHovered ? 'scale(1.2)' : 'scale(0)',
                        transformOrigin: 'center center',
                      }}
                      aria-hidden="true"
                    />

                    {/* React Bits Dual Label Stack: Default text translates UP, Hovered text translates IN */}
                    <span className="relative inline-block h-4 overflow-hidden z-[2]">
                      <span
                        className="block transition-transform duration-300 ease-out"
                        style={{
                          color: item.color,
                          transform: isHovered ? 'translateY(-100%)' : 'translateY(0)',
                        }}
                      >
                        {item.label}
                      </span>
                      <span
                        className="absolute inset-0 block text-white font-extrabold transition-transform duration-300 ease-out"
                        style={{
                          transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
                        }}
                        aria-hidden="true"
                      >
                        {item.label}
                      </span>
                    </span>

                    {/* Active Bottom Dot Pill Indicator */}
                    {isActive && (
                      <span
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full z-[3] transition-colors"
                        style={{
                          backgroundColor: isHovered ? '#ffffff' : item.color,
                        }}
                        aria-hidden="true"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Action: Enroll Button & Mobile Hamburger */}
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
                  className={`py-2 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'bg-pastel-purple shadow-xs font-extrabold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={{
                    color: item.color,
                  }}
                >
                  <span>{item.label}</span>
                  {isCurrent && (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  )}
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
