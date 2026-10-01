import React from 'react';
import ThemeIcon from '../ui/ThemeIcon';

interface TopBarProps {
  contactEmail?: string;
  phoneNumber?: string;
}

export default function TopBar({ contactEmail = 'info@example.com', phoneNumber = '+1 8 888 567.890.03' }: TopBarProps) {
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

        {/* Right: Quick School Badge & Socials */}
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
            <ThemeIcon name="sprout-admissions" size={14} />
            <span>Admissions Open 2026-27</span>
          </span>
          <div className="flex items-center space-x-3 text-gray-400">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent-pink transition-colors font-bold text-xs"
            >
              f
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-400 transition-colors font-bold text-xs"
            >
              𝕏
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-400 transition-colors font-bold text-xs"
            >
              IG
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-400 transition-colors font-bold text-xs"
            >
              in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
