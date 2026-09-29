import React from 'react';

export default function FloatingEnrollButton() {
  return (
    <aside
      aria-label="Quick Enrollment Action"
      className="fixed bottom-6 right-6 z-40"
    >
      <a
        href="/admission"
        className="flex items-center space-x-2.5 bg-gradient-to-r from-accent-pink to-rose-500 hover:from-rose-500 hover:to-accent-pink text-white font-extrabold text-xs sm:text-sm py-3 px-5 rounded-full shadow-2xl hover:shadow-pink-400/50 transform hover:scale-108 transition-all duration-300 ring-4 ring-white"
      >
        <span className="text-base animate-bounce">🎒</span>
        <span>Enroll Your Child</span>
        <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
      </a>
    </aside>
  );
}
