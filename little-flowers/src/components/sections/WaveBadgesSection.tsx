import React from 'react';
import Link from 'next/link';
import { LittleFlowersCustomizationConfig, StorioActivityItem } from '@/types';

interface WaveBadgesSectionProps {
  customization?: LittleFlowersCustomizationConfig | null;
  activities?: StorioActivityItem[];
  showWaveDivider?: boolean;
}

const badgeColorPalette = [
  {
    bg: 'bg-secondary-color',
    textHover: 'group-hover:text-secondary-color',
    defaultIcon: '/icons/book.png',
  },
  {
    bg: 'bg-accent-pink',
    textHover: 'group-hover:text-accent-pink',
    defaultIcon: '/icons/user.png',
  },
  {
    bg: 'bg-accent-blue',
    textHover: 'group-hover:text-accent-blue',
    defaultIcon: '/icons/happiness.png',
  },
  {
    bg: 'bg-accent-green',
    textHover: 'group-hover:text-accent-green',
    defaultIcon: '/icons/security.png',
  },
];

export default function WaveBadgesSection({
  customization,
  activities = [],
  showWaveDivider = true,
}: WaveBadgesSectionProps) {
  // Check if badges should be visible (default: true)
  const showBadges = customization?.showWaveBadges !== false;

  // 1. If connected to real database with activities, build badges from real DB activities
  const hasDbActivities = Array.isArray(activities) && activities.length > 0;

  // 2. Fallback items from customization config or template defaults
  const fallbackBadges = [
    {
      title: (customization?.badge1_text as string) || 'Creative Learning',
      icon: '/icons/book.png',
      href: '/activity',
    },
    {
      title: (customization?.badge2_text as string) || 'Caring Mentors',
      icon: '/icons/user.png',
      href: '/staff',
    },
    {
      title: (customization?.badge3_text as string) || 'Healthy Growth',
      icon: '/icons/happiness.png',
      href: '/about',
    },
    {
      title: (customization?.badge4_text as string) || 'Safe & Nurturing',
      icon: '/icons/security.png',
      href: '/admission',
    },
  ];

  const displayBadges = hasDbActivities
    ? activities.slice(0, 4).map((act, idx) => ({
        title: act.title,
        icon: badgeColorPalette[idx % badgeColorPalette.length].defaultIcon,
        href: `/activity/${act.slug || act.id}`,
      }))
    : fallbackBadges;

  return (
    <div className="relative mt-auto">
      {/* Soft SVG Wave Divider */}
      {showWaveDivider && (
        <div className="w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-16 sm:h-24 text-accent-soft-blue"
            style={{ color: "var(--accent-soft-blue)" }}
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d="M0,0 C150,90 400,100 600,40 C800,-20 1050,80 1200,20 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      )}

      {/* Pastel Sky Blue Strip with Colorful Feature Badges */}
      {showBadges && (
        <div className="bg-accent-soft-blue pb-16 pt-2 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-around gap-6 sm:gap-8 reveal-on-scroll">
            {displayBadges.map((badge, idx) => {
              const colorInfo = badgeColorPalette[idx % badgeColorPalette.length];
              return (
                <Link
                  key={idx}
                  href={badge.href}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full ${colorInfo.bg} text-white flex items-center justify-center shadow-md p-5 badge-interactive transition-transform hover:scale-105`}>
                    <img
                      src={badge.icon}
                      alt={badge.title}
                      className="w-full h-full object-contain brightness-0 invert"
                    />
                  </div>
                  <span className={`mt-3 font-bold text-gray-700 text-sm ${colorInfo.textHover} transition-colors text-center max-w-[140px] truncate`}>
                    {badge.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
