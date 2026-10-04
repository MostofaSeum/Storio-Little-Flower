import React from 'react';
import { LittleFlowersCustomizationConfig } from '@/types';

interface WaveBadgesSectionProps {
  customization?: LittleFlowersCustomizationConfig | null;
  showWaveDivider?: boolean;
}

export default function WaveBadgesSection({
  customization,
  showWaveDivider = true,
}: WaveBadgesSectionProps) {
  // Check if badges should be visible (default: true)
  const showBadges = customization?.showWaveBadges !== false;

  // Dynamic labels with joyful defaults
  const badge1 = (customization?.badge1_text as string) || (customization?.['badge1Text'] as string) || 'Creative Learning';
  const badge2 = (customization?.badge2_text as string) || (customization?.['badge2Text'] as string) || 'Caring Mentors';
  const badge3 = (customization?.badge3_text as string) || (customization?.['badge3Text'] as string) || 'Healthy Growth';
  const badge4 = (customization?.badge4_text as string) || (customization?.['badge4Text'] as string) || 'Safe & Nurturing';

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

      {/* Pastel Sky Blue Strip with 4 Colorful Feature Badges */}
      {showBadges && (
        <div className="bg-accent-soft-blue pb-16 pt-2 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-around gap-6 sm:gap-8 reveal-on-scroll">
            {/* 1. Yellow Circle: Early Learning (Book) */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-secondary-color text-white flex items-center justify-center shadow-md p-5 badge-interactive">
                <img
                  src="/icons/book.png"
                  alt={badge1}
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
              <span className="mt-3 font-bold text-gray-700 text-sm group-hover:text-secondary-color transition-colors">
                {badge1}
              </span>
            </div>

            {/* 2. Pink Circle: Little Teachers / Mentors (User) */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent-pink text-white flex items-center justify-center shadow-md p-5 badge-interactive">
                <img
                  src="/icons/user.png"
                  alt={badge2}
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
              <span className="mt-3 font-bold text-gray-700 text-sm group-hover:text-accent-pink transition-colors">
                {badge2}
              </span>
            </div>

            {/* 3. Blue Circle: Child Care / Happiness (Happiness) */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent-blue text-white flex items-center justify-center shadow-md p-5 badge-interactive">
                <img
                  src="/icons/happiness.png"
                  alt={badge3}
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
              <span className="mt-3 font-bold text-gray-700 text-sm group-hover:text-accent-blue transition-colors">
                {badge3}
              </span>
            </div>

            {/* 4. Green Circle: Safe Campus (Security) */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent-green text-white flex items-center justify-center shadow-md p-5 badge-interactive">
                <img
                  src="/icons/security.png"
                  alt={badge4}
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
              <span className="mt-3 font-bold text-gray-700 text-sm group-hover:text-accent-green transition-colors">
                {badge4}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
