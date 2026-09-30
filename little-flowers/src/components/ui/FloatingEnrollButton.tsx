import ThemeIcon from './ThemeIcon';

export default function FloatingEnrollButton() {
  return (
    <aside
      aria-label="Quick Enrollment Action"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40"
    >
      <a
        href="/admission"
        className="flex items-center space-x-2 sm:space-x-2.5 bg-gradient-to-r from-accent-pink to-rose-500 hover:from-rose-500 hover:to-accent-pink text-white font-extrabold text-xs sm:text-sm py-2.5 px-4 sm:py-3 sm:px-5 rounded-full shadow-2xl hover:shadow-pink-400/50 transform hover:scale-105 active:scale-95 transition-all duration-300 ring-2 sm:ring-4 ring-white"
      >
        <ThemeIcon name="school-bag" size={20} className="animate-bounce" />
        <span className="hidden xs:inline">Enroll Your Child</span>
        <span className="xs:hidden">Enroll</span>
        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-ping"></span>
      </a>
    </aside>
  );
}
