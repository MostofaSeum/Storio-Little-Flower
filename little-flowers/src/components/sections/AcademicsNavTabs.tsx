'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AcademicsNavTabsProps {
  routineCount?: number;
  syllabusCount?: number;
  classesCount?: number;
}

export default function AcademicsNavTabs({
  routineCount,
  syllabusCount,
  classesCount,
}: AcademicsNavTabsProps) {
  const pathname = usePathname();

  const tabs = [
    {
      id: 'routine',
      label: 'Class Routines',
      href: '/academics/routine',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      count: routineCount,
      activeColor: 'var(--primary)',
    },
    {
      id: 'syllabus',
      label: 'Curriculum Syllabuses',
      href: '/academics/syllabus',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      count: syllabusCount,
      activeColor: 'var(--secondary)',
    },
    {
      id: 'statistics',
      label: 'Student Demographics',
      href: '/academics/statistics',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      count: classesCount,
      activeColor: 'var(--accent-pink)',
    },
  ];

  return (
    <div className="flex justify-center mb-5 sm:mb-6 reveal-on-scroll">
      <div className="inline-flex flex-wrap items-center justify-center p-1.5 bg-pastel-purple border border-purple-100 rounded-3xl shadow-xs gap-1.5 max-w-full">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname?.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? 'bg-white shadow-md font-extrabold transform scale-102'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
              }`}
              style={{
                color: isActive ? tab.activeColor : undefined,
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                    isActive ? 'bg-purple-100 text-primary-color' : 'bg-gray-200/70 text-gray-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
