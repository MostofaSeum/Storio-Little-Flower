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
      icon: '📅',
      count: routineCount,
      activeColor: 'var(--primary)',
    },
    {
      id: 'syllabus',
      label: 'Curriculum Syllabuses',
      href: '/academics/syllabus',
      icon: '📚',
      count: syllabusCount,
      activeColor: 'var(--secondary)',
    },
    {
      id: 'statistics',
      label: 'Student Demographics',
      href: '/academics/statistics',
      icon: '📊',
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
              <span className="text-base sm:text-lg">{tab.icon}</span>
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
