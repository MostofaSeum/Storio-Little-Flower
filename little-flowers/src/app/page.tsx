import {
  storio,
  StorioLayoutResponse,
  StorioHeroSlide,
  StorioNotice,
} from '@storio/template-sdk';
import { headers } from 'next/headers';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';

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
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{settings?.contact_email || 'info@example.com'}</span>
            </a>
            <a
              href={`tel:${settings?.phone_number || '+1 8 888 567.890.03'}`}
              className="flex items-center space-x-2 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-300 via-pink-400 to-sky-400 p-1 flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 3.5l4 3.6V18h-2v-4h-4v4H8v-7.9l4-3.6z" />
              </svg>
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Organic Circular Kids Image */}
          <div className="lg:col-span-6 flex justify-center relative">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[440px] md:h-[440px]">
              {/* Outer soft shadow background blob */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-pink-50 to-sky-100 rounded-[50%] filter blur-lg opacity-80 transform -rotate-6"></div>

              {/* The circular student image from preview or SDK */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-8 border-white shadow-xl">
                <img
                  src={
                    activeSlide?.image_url ||
                    'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop'
                  }
                  alt={activeSlide?.title || 'School Kids'}
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Little playful colored floating pins/dots around image */}
              <div className="absolute -top-2 left-10 w-5 h-5 bg-pink-500 rounded-full border-2 border-white shadow-md"></div>
              <div className="absolute bottom-12 -left-4 w-7 h-7 bg-amber-400 rounded-full border-2 border-white shadow-md"></div>
              <div className="absolute bottom-6 right-8 w-6 h-6 bg-sky-400 rounded-full border-2 border-white shadow-md"></div>
            </div>
          </div>

          {/* Right Column: Hero Content & Organic Blob */}
          <div className="lg:col-span-6 relative z-10 lg:pl-6">
            {/* Background Sunny Yellow Organic Blob */}
            <div className="absolute -top-12 -left-10 w-64 h-64 bg-[#fde68a] rounded-[60%_40%_70%_30%/40%_50%_60%_50%] -z-10 opacity-60 animate-float"></div>

            {/* Diagonal striped decorative bubble */}
            <div
              className="absolute -bottom-8 right-6 w-32 h-32 rounded-[50%_50%_40%_60%/60%_40%_60%_40%] opacity-40 -z-10"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, #38bdf8 0, #38bdf8 2px, transparent 0, transparent 8px)',
              }}
            ></div>

            {/* Two-Tone Title */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#6c4298] leading-tight">
                {activeSlide?.title || 'Practical teaching &'}
              </h1>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#f39c12] leading-tight">
                {activeSlide?.subtitle || 'Social Development'}
              </h2>
            </div>

            {/* Paragraph Text */}
            <p className="mt-6 text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl font-medium">
              We aim at success by creating skills necessary for kids to enrich &
              empower in studies & sports.
            </p>

            {/* Black Pill Button */}
            <div className="mt-8 flex items-center space-x-4">
              <a
                href={activeSlide?.button_url || '/about'}
                className="inline-flex items-center justify-center px-8 py-3.5 bg-black hover:bg-gray-800 text-white font-bold text-sm rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                {activeSlide?.button_text || 'Learn More'}
              </a>
            </div>

            {/* Carousel Dot Indicators (Pink active dot like in screenshot) */}
            <div className="mt-12 flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#ff4081] inline-block shadow-xs"></span>
              <span className="w-2.5 h-2.5 rounded-full border-2 border-[#ff4081] inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full border-2 border-[#ff4081] inline-block"></span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SOFT SKY BLUE WAVE BOTTOM SECTION WITH COLORFUL ROUND BADGES */}
      <div className="relative mt-auto">
        {/* Soft SVG Wave Divider */}
        <div className="w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-16 sm:h-24 text-[#e1f5fe]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d="M0,0 C150,90 400,100 600,40 C800,-20 1050,80 1200,20 L1200,120 L0,120 Z"></path>
          </svg>
        </div>

        {/* Pastel Sky Blue Strip with 4 Colorful Feature Badges */}
        <div className="bg-[#e1f5fe] pb-16 pt-2 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-around gap-6 sm:gap-8">
            {/* 1. Yellow Circle: Early Learning */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#f39c12] text-white flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="mt-3 font-bold text-gray-700 text-sm">Creative Learning</span>
            </div>

            {/* 2. Pink Circle: Little Teachers */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#e91e63] text-white flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="mt-3 font-bold text-gray-700 text-sm">Caring Mentors</span>
            </div>

            {/* 3. Blue Circle: Child Care */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#29b6f6] text-white flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="mt-3 font-bold text-gray-700 text-sm">Healthy Growth</span>
            </div>

            {/* 4. Green Circle: Safe Campus */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#8bc34a] text-white flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
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
              <h3 className="text-2xl font-bold text-[#6c4298]">Campus Announcements</h3>
              <p className="text-sm text-gray-500">Stay updated with latest school circulars and events</p>
            </div>
            <a
              href="/notice"
              className="text-xs sm:text-sm font-bold text-[#ff4081] hover:underline"
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
                  <span className="text-xs font-semibold text-[#f39c12]">
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
                  className="mt-4 text-xs font-bold text-[#6c4298] hover:text-[#ff4081] inline-flex items-center"
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
