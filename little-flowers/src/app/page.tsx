import {
  storio,
  StorioLayoutResponse,
  StorioHeroSlide,
  StorioNotice,
} from '@storio/template-sdk';
import { headers } from 'next/headers';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';
import HeroCarousel from '@/Components/HeroCarousel';

export default async function Home() {
  // 1. Resolve host from incoming request
  const headersList = await headers();
  const rawHost = headersList.get('x-tenant-host') || headersList.get('host') || '';
  const host = rawHost.split(':')[0];

  // 2. Check for linked tenant (via storio CLI) vs Standalone mode
  const linkedTenant = process.env.NEXT_PUBLIC_STORIO_TENANT_HOST;
  const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '::1';
  const isStandalone = isLocalHost && !linkedTenant;
  const tenantHost = linkedTenant || (isStandalone ? 'demo.storio.cloud' : host);

  // 3. Fetch data via SDK
  const [rawLayout, rawHeroSlides, rawNotices] = await Promise.all([
    storio.getLayout(tenantHost),
    storio.getHeroSlides(tenantHost),
    storio.getNotices(tenantHost),
  ]);

  // 4. Apply Rule 1: Fallback to demo data ONLY in standalone preview mode
  const layout: StorioLayoutResponse | null =
    rawLayout || (isStandalone ? { settings: DEFAULT_DEMO_DATA.settings, customization: { config: {} }, navigation: { items: [] } } : null);

  const heroSlides: StorioHeroSlide[] =
    Array.isArray(rawHeroSlides) && rawHeroSlides.length > 0
      ? rawHeroSlides
      : isStandalone
      ? DEFAULT_DEMO_DATA.heroSlides
      : [];

  const notices: StorioNotice[] =
    Array.isArray(rawNotices) && rawNotices.length > 0
      ? rawNotices
      : isStandalone
      ? DEFAULT_DEMO_DATA.notices
      : [];

  const settings = layout?.settings || DEFAULT_DEMO_DATA.settings;
  const activeSlide = heroSlides[0] || DEFAULT_DEMO_DATA.heroSlides[0];

  // Colorful menu items matching the design image
  const navLinks = [
    { label: 'Home', href: '/', colorClass: 'text-lime-600 border-b-2 border-lime-500' },
    { label: 'About', href: '/about', colorClass: 'text-pink-600 hover:text-pink-700' },
    { label: 'Facilities', href: '/facilities', colorClass: 'text-sky-500 hover:text-sky-600' },
    { label: 'Blog', href: '/blog', colorClass: 'text-lime-600 hover:text-lime-700' },
    { label: 'Admission', href: '/admission', colorClass: 'text-indigo-600 hover:text-indigo-700' },
    { label: 'Alumni', href: '/alumni', colorClass: 'text-amber-600 hover:text-amber-700' },
    { label: 'Shop', href: '/shop', colorClass: 'text-pink-500 hover:text-pink-600' },
    { label: 'Contact', href: '/contact', colorClass: 'text-purple-600 hover:text-purple-700' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col overflow-x-hidden">
      {/* 1. TOP BLACK CONTACT BAR */}
      <div className="bg-[#111111] text-gray-300 text-xs sm:text-sm py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Email & Phone */}
          <div className="flex items-center space-x-6">
            <a
              href={`mailto:${settings?.contact_email || 'info@example.com'}`}
              className="flex items-center space-x-2 hover:text-white transition-colors"
            >
              <img src="/icons/mail.png" alt="Email" className="w-4 h-4 object-contain brightness-0 invert opacity-80" />
              <span>{settings?.contact_email || 'info@example.com'}</span>
            </a>
            <a
              href={`tel:${settings?.phone_number || '+1 8 888 567.890.03'}`}
              className="flex items-center space-x-2 hover:text-white transition-colors"
            >
              <img src="/icons/telephone.png" alt="Phone" className="w-4 h-4 object-contain brightness-0 invert opacity-80" />
              <span>{settings?.phone_number || '8 888 567.890.03'}</span>
            </a>
          </div>

          {/* Right: Social Links */}
          <div className="flex items-center space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white text-gray-400 font-bold text-xs">
              f
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white text-gray-400 font-bold text-xs">
              𝕏
            </a>
            <a href="https://google.com" target="_blank" rel="noreferrer" className="hover:text-white text-gray-400 font-bold text-xs">
              G+
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white text-gray-400 font-bold text-xs">
              in
            </a>
          </div>
        </div>
      </div>

      {/* 2. NAVBAR */}
      <header className="bg-white border-b border-gray-100 py-4 px-4 sm:px-8 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo with playful school castle mark */}
          <a href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-300 via-pink-400 to-sky-400 p-1.5 flex items-center justify-center shadow-sm">
              <img src="/icons/school.png" alt="School Logo" className="w-6 h-6 object-contain brightness-0 invert" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-gray-900 font-fredoka">
                {settings?.site_title || 'Pallikoodam'}
              </span>
            </div>
          </a>

          {/* Navigation links with distinct playful colors */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`py-1 px-1 transition-all ${item.colorClass}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative pt-8 pb-16 lg:py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Floating Decorative Elements */}
        <div className="absolute top-10 right-16 w-12 h-12 bg-pink-100 rounded-full blur-xl -z-10 opacity-70"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-yellow-100 rounded-full blur-2xl -z-10 opacity-70"></div>

        {/* Interactive Hero Carousel */}
        <HeroCarousel slides={heroSlides} />
      </section>

      {/* 4. SOFT SKY BLUE WAVE BOTTOM SECTION WITH COLORFUL ROUND BADGES */}
      <div className="relative mt-auto">
        {/* Soft SVG Wave Divider */}
        <div className="w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-16 sm:h-24 text-accent-soft-blue"
            style={{ color: 'var(--accent-soft-blue)' }}
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d="M0,0 C150,90 400,100 600,40 C800,-20 1050,80 1200,20 L1200,120 L0,120 Z"></path>
          </svg>
        </div>

        {/* Pastel Sky Blue Strip with 4 Colorful Feature Badges */}
        <div className="bg-accent-soft-blue pb-16 pt-2 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-around gap-6 sm:gap-8">
            {/* 1. Yellow Circle: Early Learning (Book) */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-secondary-color text-white flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform p-5">
                <img src="/icons/book.png" alt="Creative Learning" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <span className="mt-3 font-bold text-gray-700 text-sm">Creative Learning</span>
            </div>

            {/* 2. Pink Circle: Little Teachers / Mentors (User) */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent-pink text-white flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform p-5">
                <img src="/icons/user.png" alt="Caring Mentors" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <span className="mt-3 font-bold text-gray-700 text-sm">Caring Mentors</span>
            </div>

            {/* 3. Blue Circle: Child Care / Happiness (Happiness) */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent-blue text-white flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform p-5">
                <img src="/icons/happiness.png" alt="Healthy Growth" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <span className="mt-3 font-bold text-gray-700 text-sm">Healthy Growth</span>
            </div>

            {/* 4. Green Circle: Safe Campus (Security) */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent-green text-white flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform p-5">
                <img src="/icons/security.png" alt="Safe & Nurturing" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <span className="mt-3 font-bold text-gray-700 text-sm">Safe & Nurturing</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. NOTICE BOARD SECTION (Adhering to Storio SDK Rule 1) */}
      {notices.length > 0 && (
        <section className="bg-white py-12 px-4 sm:px-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between border-b-2 border-gray-100 pb-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-primary-color">Campus Announcements</h3>
              <p className="text-sm text-gray-500">Stay updated with latest school circulars and events</p>
            </div>
            <a
              href="/notice"
              className="text-xs sm:text-sm font-bold text-accent-pink hover:underline"
            >
              View All Notices →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {notices.slice(0, 3).map((notice) => (
              <div
                key={notice.id}
                className="p-5 rounded-2xl bg-[#fafafa] border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
              >
                {notice.is_urgent && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white px-2 py-0.5 rounded-full">
                    Urgent
                  </span>
                )}
                <div>
                  <span className="text-xs font-semibold text-secondary-color">
                    {notice.published_date || 'Recent Notice'}
                  </span>
                  <h4 className="font-bold text-gray-800 text-base mt-2 line-clamp-2">
                    {notice.title}
                  </h4>
                  {notice.content && (
                    <p className="text-gray-500 text-xs mt-2 line-clamp-3">
                      {notice.content}
                    </p>
                  )}
                </div>
                <a
                  href={`/notice/${notice.id}`}
                  className="mt-4 text-xs font-bold text-primary-color hover:text-accent-pink inline-flex items-center"
                >
                  Read Circular →
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
