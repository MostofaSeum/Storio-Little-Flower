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
  showWaveDivider = true,
}: WaveBadgesSectionProps) {
  // Check if badges should be visible (default: true)
  const showBadges = customization?.showWaveBadges !== false;

  // Badges driven by Storio Admin customization (with joyful fallback defaults)
  const badges = [
    {
      title: (customization?.badge1_text as string) || 'Creative Learning',
      color: (customization?.badge1_color as string) || '#ff9800',
      icon: (customization?.badge1_icon as string) || '/icons/book.png',
      href: (customization?.badge1_link as string) || '/activity',
    },
    {
      title: (customization?.badge2_text as string) || 'Caring Mentors',
      color: (customization?.badge2_color as string) || '#ff4081',
      icon: (customization?.badge2_icon as string) || '/icons/user.png',
      href: (customization?.badge2_link as string) || '/staff',
    },
    {
      title: (customization?.badge3_text as string) || 'Healthy Growth',
      color: (customization?.badge3_color as string) || '#29b6f6',
      icon: (customization?.badge3_icon as string) || '/icons/happiness.png',
      href: (customization?.badge3_link as string) || '/about',
    },
    {
      title: (customization?.badge4_text as string) || 'Safe & Nurturing',
      color: (customization?.badge4_color as string) || '#8bc34a',
      icon: (customization?.badge4_icon as string) || '/icons/security.png',
      href: (customization?.badge4_link as string) || '/admission',
    },
  ];

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

      {/* Pastel Sky Blue Strip with Customizable Feature Badges */}
      {showBadges && (
        <div className="bg-accent-soft-blue pb-16 pt-2 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-around gap-6 sm:gap-8 reveal-on-scroll">
            {badges.map((badge, idx) => (
              <Link
                key={idx}
                href={badge.href}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full text-white flex items-center justify-center shadow-md p-5 badge-interactive transition-transform hover:scale-105"
                  style={{ backgroundColor: badge.color }}
                >
                  <img
                    src={badge.icon}
                    alt={badge.title}
                    className="w-full h-full object-contain brightness-0 invert"
                  />
                </div>
                <span
                  className="mt-3 font-bold text-gray-700 text-sm transition-colors text-center max-w-[140px] truncate"
                  style={{ color: 'var(--text-color, #374151)' }}
                >
                  {badge.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
