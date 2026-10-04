import React from 'react';
import ThemeIcon from '../ui/ThemeIcon';

interface TopBarProps {
  contactEmail?: string;
  phoneNumber?: string;
  admissionBadgeText?: string;
  importantLinks?: { id: number; title: string; url: string; order?: number }[];
}

function getLinkBadge(title: string, url: string): { label: string; iconClass: string } {
  const lower = `${title} ${url}`.toLowerCase();
  if (lower.includes('facebook') || lower.includes('fb.com')) {
    return { label: 'f', iconClass: 'hover:text-accent-pink' };
  }
  if (lower.includes('twitter') || lower.includes('x.com')) {
    return { label: '𝕏', iconClass: 'hover:text-sky-400' };
  }
  if (lower.includes('instagram')) {
    return { label: 'IG', iconClass: 'hover:text-pink-400' };
  }
  if (lower.includes('youtube')) {
    return { label: 'YT', iconClass: 'hover:text-red-400' };
  }
  if (lower.includes('linkedin')) {
    return { label: 'in', iconClass: 'hover:text-indigo-400' };
  }
  // Default: Return the first 2 letters or short title
  const shortTitle = title.length > 10 ? `${title.slice(0, 8)}..` : title;
  return { label: shortTitle, iconClass: 'hover:text-white' };
}

export default function TopBar({
  contactEmail = 'info@example.com',
  phoneNumber = '+1 8 888 567.890.03',
  admissionBadgeText,
  importantLinks = [],
}: TopBarProps) {
  const hasLinks = Array.isArray(importantLinks) && importantLinks.length > 0;

  return (
    <div className="bg-topbar text-gray-300 text-xs sm:text-sm py-2 px-4 sm:px-8 border-b border-gray-800">
      <div className="site-container flex flex-wrap items-center justify-between gap-2">
        {/* Left: Email & Phone */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:space-x-6">
          <a
            href={`mailto:${contactEmail}`}
            className="flex items-center space-x-1.5 sm:space-x-2 hover:text-accent-pink transition-colors group"
          >
            <img
              src="/icons/mail.png"
              alt="Email"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain brightness-0 invert opacity-80 group-hover:opacity-100"
            />
            <span className="truncate max-w-[170px] sm:max-w-none">{contactEmail}</span>
          </a>
          <a
            href={`tel:${phoneNumber}`}
            className="flex items-center space-x-1.5 sm:space-x-2 hover:text-secondary-color transition-colors group"
          >
            <img
              src="/icons/telephone.png"
              alt="Phone"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain brightness-0 invert opacity-80 group-hover:opacity-100"
            />
            <span>{phoneNumber}</span>
          </a>
        </div>

        {/* Right: Quick School Badge & Dynamic Important / Social Links */}
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
            <ThemeIcon name="sprout-admissions" size={14} />
            <span>{admissionBadgeText || 'Admissions Open 2026-27'}</span>
          </span>

          {hasLinks && (
            <div className="flex items-center space-x-3 text-gray-400">
              {importantLinks.slice(0, 5).map((item) => {
                const badge = getLinkBadge(item.title, item.url);
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    title={item.title}
                    className={`${badge.iconClass} transition-colors font-bold text-xs`}
                  >
                    {badge.label}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
