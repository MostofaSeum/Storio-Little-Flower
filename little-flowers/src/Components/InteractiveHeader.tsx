'use client';

import React, { useState, useEffect } from 'react';
import { StorioSettingsResponse } from '@storio/template-sdk';

interface InteractiveHeaderProps {
  settings: StorioSettingsResponse;
}

export default function InteractiveHeader({ settings }: InteractiveHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/', colorClass: 'text-lime-600 hover:text-lime-700' },
    { label: 'About', href: '#about', colorClass: 'text-pink-600 hover:text-pink-700' },
    { label: 'Programs', href: '#programs', colorClass: 'text-sky-500 hover:text-sky-600' },
    { label: 'Teachers', href: '#teachers', colorClass: 'text-lime-600 hover:text-lime-700' },
    { label: 'Gallery', href: '#gallery', colorClass: 'text-indigo-600 hover:text-indigo-700' },
    { label: 'Admission', href: '/admission', colorClass: 'text-amber-600 hover:text-amber-700' },
    { label: 'Notices', href: '#notices', colorClass: 'text-pink-500 hover:text-pink-600' },
    { label: 'Contact', href: '#contact', colorClass: 'text-purple-600 hover:text-purple-700' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'py-2 bg-white/90 backdrop-blur-md shadow-md border-b border-purple-50'
            : 'py-3.5 bg-white border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Logo with playful wiggle hover */}
          <a href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-300 via-pink-400 to-sky-400 p-2 flex items-center justify-center shadow-md transform group-hover:rotate-12 group-hover:scale-105 transition-all duration-300">
              <img
                src="/icons/school.png"
                alt="School Logo"
                className="w-full h-full object-contain brightness-0 invert drop-shadow-xs"
              />
            </div>
            <div>
              <span className="text-2xl sm:text-2xl font-bold tracking-tight text-gray-900 font-fredoka flex items-center gap-1.5">
                {settings?.site_title || 'Little Flowers'}
                <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse"></span>
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`py-1.5 px-2 rounded-lg transition-all transform hover:-translate-y-0.5 ${item.colorClass}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Action: Visit Campus Button & Mobile Hamburger */}
          <div className="flex items-center space-x-3">
            <a
              href="/admission"
              className="hidden sm:inline-flex items-center space-x-2 px-5 py-2.5 bg-primary-color hover:bg-purple-800 text-white font-bold text-xs rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>Enroll Now</span>
              <span>→</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
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

        {/* Mobile Dropdown Menu with smooth transition */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/98 backdrop-blur-lg border-b border-gray-200 px-6 py-4 animate-fadeIn">
            <nav className="flex flex-col space-y-3 font-semibold text-sm">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 px-3 rounded-lg hover:bg-gray-50 ${item.colorClass}`}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-2">
                <a
                  href="/admission"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center py-3 bg-secondary-color text-white font-bold rounded-xl shadow-md text-sm"
                >
                  Enroll Now →
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
