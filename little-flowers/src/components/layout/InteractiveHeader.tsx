'use client';

import React, { useState, useEffect } from 'react';
import { StorioSettingsResponse } from '@storio/template-sdk';
import { StorioDynamicNavItem } from '@/data/storioExtendedTypes';

interface InteractiveHeaderProps {
  settings: StorioSettingsResponse;
  navigation?: StorioDynamicNavItem[];
}

export default function InteractiveHeader({ settings, navigation }: InteractiveHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [openDropdownIdx, setOpenDropdownIdx] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Playful kindergarten palette mapped in order to navigation links
  const colorPalette = [
    'var(--accent-green)',
    'var(--accent-pink)',
    'var(--accent-blue)',
    'var(--secondary)',
    'var(--primary)',
    'var(--accent-green)',
    'var(--secondary)',
    'var(--accent-pink)',
    'var(--accent-blue)',
  ];

  // Default fallback links if none returned
  const defaultNavLinks: StorioDynamicNavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '#about' },
    { name: 'Programs', href: '#programs' },
    { name: 'Teachers', href: '#teachers' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Events', href: '#events' },
    { name: 'Admission', href: '/admission' },
    { name: 'Notices', href: '#notices' },
    { name: 'Contact', href: '/contact' },
  ];

  const rawLinks = Array.isArray(navigation) && navigation.length > 0 ? navigation : defaultNavLinks;

  // Filter visible links and normalize label & href
  const navLinks = rawLinks
    .filter((item) => item.isVisible !== false)
    .map((item, index) => {
      const label = item.name || item.label || 'Link';
      const href = item.href || item.url || '#';
      const color = colorPalette[index % colorPalette.length];
      const children = item.subLinks || item.children || [];
      return {
        ...item,
        label,
        href,
        color,
        children,
        hasDropdown: children.length > 0,
      };
    });

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 print:hidden ${
        isScrolled
          ? 'py-2.5 bg-white/75 backdrop-blur-xl shadow-lg shadow-purple-500/5 border-b border-white/40'
          : 'py-3.5 bg-white/95 backdrop-blur-sm border-b border-gray-100'
      }`}
      style={{
        WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'blur(4px)',
      }}
    >
      <div className="max-w-[1536px] mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo with playful wiggle hover */}
        <a href="/" className="flex items-center space-x-2.5 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-300 via-pink-400 to-sky-400 p-1 flex items-center justify-center shadow-md transform group-hover:rotate-12 group-hover:scale-105 transition-all duration-300 overflow-hidden">
            {settings?.logo_url ? (
              <img
                src={settings.logo_url}
                alt={settings?.site_title || 'School Logo'}
                className="w-full h-full object-contain rounded-xl drop-shadow-xs"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement | null;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
            ) : null}
            <img
              src="/icons/school.png"
              alt={settings?.site_title || 'School Logo'}
              className={`w-full h-full object-contain brightness-0 invert drop-shadow-xs ${settings?.logo_url ? 'hidden' : 'block'}`}
            />
          </div>
          <div>
            <span className="text-lg sm:text-xl xl:text-2xl font-bold tracking-tight text-gray-900 font-fredoka flex items-center gap-1.5 whitespace-nowrap">
              {settings?.site_title || 'Little Flowers'}
              <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse shrink-0"></span>
            </span>
          </div>
        </a>

        {/* Dynamic Interactive PillNav (Desktop) */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center rounded-full p-1 bg-pastel-purple border border-purple-100 shadow-xs shrink"
        >
          <ul role="menubar" className="list-none flex items-center m-0 p-0 gap-1 xl:gap-1.5 flex-nowrap">
            {navLinks.map((item, i) => {
              const isActive = activeTab === item.label;
              const isHovered = hoveredIdx === i;
              const isDropdownOpen = openDropdownIdx === i;

              return (
                <li
                  key={item.id || item.label}
                  role="none"
                  className="relative flex items-center shrink-0"
                  onMouseEnter={() => {
                    setHoveredIdx(i);
                    if (item.hasDropdown) setOpenDropdownIdx(i);
                  }}
                  onMouseLeave={() => {
                    setHoveredIdx(null);
                    if (item.hasDropdown) setOpenDropdownIdx(null);
                  }}
                >
                  <a
                    role="menuitem"
                    href={item.href}
                    onClick={() => setActiveTab(item.label)}
                    className="relative overflow-hidden inline-flex items-center justify-center h-8.5 px-2.5 xl:px-3.5 rounded-full font-bold text-[11px] xl:text-xs tracking-wide uppercase transition-all duration-300 group cursor-pointer select-none bg-white border border-gray-100/80 shadow-xs hover:shadow-md gap-0.5"
                    style={{
                      borderColor: isActive ? item.color : undefined,
                    }}
                  >
                    {/* Expanding circular background fill */}
                    <span
                      className="absolute inset-0 m-auto rounded-full pointer-events-none transition-transform duration-300 ease-out z-[1]"
                      style={{
                        backgroundColor: item.color,
                        width: '240px',
                        height: '240px',
                        transform: isHovered ? 'scale(1.2)' : 'scale(0)',
                        transformOrigin: 'center center',
                      }}
                      aria-hidden="true"
                    />

                    {/* Dual Label Stack: Default translates UP, Hovered translates IN */}
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

                    {/* Dropdown Chevron indicator if children exist */}
                    {item.hasDropdown && (
                      <svg
                        className={`w-3 h-3 z-[2] transition-transform duration-200 ${
                          isHovered ? 'text-white' : 'text-gray-400'
                        } ${isDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}

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

                  {/* Dropdown Sub-menu Popover */}
                  {item.hasDropdown && isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 min-w-[200px] bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn">
                      {item.children.map((subItem) => {
                        const subLabel = subItem.name || subItem.label || '';
                        const subHref = subItem.href || subItem.url || '#';
                        return (
                          <a
                            key={subItem.id || subLabel}
                            href={subHref}
                            className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-pastel-purple hover:text-primary-color transition-colors"
                          >
                            {subLabel}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Action: Login / Enroll Button & Mobile Hamburger */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <a
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-purple-200 hover:bg-pastel-purple text-primary-color font-bold text-xs transition-all shadow-2xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Login</span>
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

      {/* Mobile Dropdown Menu with Pill items & Nested Sub-links */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-lg border-b border-gray-200 px-4 sm:px-6 py-4 animate-fadeIn max-h-[calc(100vh-80px)] overflow-y-auto">
          <nav className="flex flex-col space-y-2 font-semibold text-sm">
            {navLinks.map((item) => {
              const isCurrent = activeTab === item.label;
              return (
                <div key={item.id || item.label} className="flex flex-col">
                  <a
                    href={item.href}
                    onClick={() => {
                      setActiveTab(item.label);
                      if (!item.hasDropdown) setMobileMenuOpen(false);
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

                  {/* Mobile sub-links */}
                  {item.hasDropdown && (
                    <div className="pl-6 py-1 space-y-1">
                      {item.children.map((subItem) => (
                        <a
                          key={subItem.id || subItem.name || subItem.label}
                          href={subItem.href || subItem.url || '#'}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1.5 px-3 rounded-lg text-xs font-medium text-gray-500 hover:text-primary-color hover:bg-gray-50"
                        >
                          • {subItem.name || subItem.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <a
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center py-2.5 rounded-full border border-purple-200 text-primary-color font-bold text-xs hover:bg-pastel-purple text-center"
              >
                Portal Login
              </a>
              <a
                href="/admission"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center py-2.5 bg-secondary-color text-white font-bold rounded-full shadow-md text-xs text-center"
              >
                Enroll Now
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
