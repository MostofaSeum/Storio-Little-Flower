import {
  storio,
  StorioLayoutResponse,
  StorioHeroSlide,
  StorioNotice,
  StorioStaffMember,
  StorioGalleryItem,
} from "@storio/template-sdk";
import {
  StorioInstitutionProfile,
  StorioActivityItem,
  StorioPromotion,
  StorioTestimonial,
} from "@/data/storioExtendedTypes";
import { headers } from "next/headers";
import { DEFAULT_DEMO_DATA } from "@/data/defaultDemoData";
import HeroCarousel from "@/Components/HeroCarousel";
import ScrollObserver from "@/Components/ScrollObserver";
import InteractiveHeader from "@/Components/InteractiveHeader";
import AnimatedCounter from "@/Components/AnimatedCounter";
import InteractiveGallery from "@/Components/InteractiveGallery";
import TestimonialSlider from "@/Components/TestimonialSlider";
import TypewriterText from "@/Components/TypewriterText";

export default async function Home() {
  // 1. Resolve host from incoming request
  const headersList = await headers();
  const rawHost =
    headersList.get("x-tenant-host") || headersList.get("host") || "";
  const host = rawHost.split(":")[0];

  // 2. Check for linked tenant (via storio CLI) vs Standalone mode
  const linkedTenant = process.env.NEXT_PUBLIC_STORIO_TENANT_HOST;
  const isLocalHost =
    host === "localhost" || host === "127.0.0.1" || host === "::1";
  const isStandalone = isLocalHost && !linkedTenant;
  const tenantHost =
    linkedTenant || (isStandalone ? "demo.storio.cloud" : host);

  // 3. Fetch data via SDK for all landing page sections
  const [
    rawLayout,
    rawHeroSlides,
    rawNotices,
    rawProfile,
    rawActivities,
    rawStaff,
    rawGallery,
    rawPromotions,
    rawTestimonials,
  ] = await Promise.all([
    storio.getLayout(tenantHost),
    storio.getHeroSlides(tenantHost),
    storio.getNotices(tenantHost),
    storio.apiFetch<StorioInstitutionProfile>(
      "/api/v2/template/institution-profile/",
      { tenantHost },
    ),
    storio.apiFetch<StorioActivityItem[]>("/api/v2/template/activities/", {
      tenantHost,
    }),
    storio.getStaff(tenantHost),
    storio.getGallery(tenantHost),
    storio.apiFetch<StorioPromotion[]>("/api/v2/template/promotions/", {
      tenantHost,
    }),
    storio.apiFetch<StorioTestimonial[]>("/api/v2/template/testimonials/", {
      tenantHost,
    }),
  ]);

  // 4. Apply Rule 1: Fallback to demo data ONLY in standalone preview mode
  const layout: StorioLayoutResponse | null =
    rawLayout ||
    (isStandalone
      ? {
          settings: DEFAULT_DEMO_DATA.settings,
          customization: { config: {} },
          navigation: { items: [] },
        }
      : null);

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

  const profile: StorioInstitutionProfile | null =
    rawProfile || (isStandalone ? DEFAULT_DEMO_DATA.institutionProfile : null);

  const activities: StorioActivityItem[] =
    Array.isArray(rawActivities) && rawActivities.length > 0
      ? rawActivities
      : isStandalone
        ? DEFAULT_DEMO_DATA.activities
        : [];

  const staffList: StorioStaffMember[] =
    Array.isArray(rawStaff) && rawStaff.length > 0
      ? rawStaff
      : isStandalone
        ? DEFAULT_DEMO_DATA.staff
        : [];

  const galleryItems: StorioGalleryItem[] =
    Array.isArray(rawGallery) && rawGallery.length > 0
      ? rawGallery
      : isStandalone
        ? DEFAULT_DEMO_DATA.gallery
        : [];

  const promotions: StorioPromotion[] =
    Array.isArray(rawPromotions) && rawPromotions.length > 0
      ? rawPromotions
      : isStandalone
        ? DEFAULT_DEMO_DATA.promotions
        : [];

  const testimonials: StorioTestimonial[] =
    Array.isArray(rawTestimonials) && rawTestimonials.length > 0
      ? rawTestimonials
      : isStandalone
        ? DEFAULT_DEMO_DATA.testimonials
        : [];

  const settings = layout?.settings || DEFAULT_DEMO_DATA.settings;
  const activePromo = promotions[0] || DEFAULT_DEMO_DATA.promotions[0];

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col overflow-x-hidden selection:bg-pink-100 selection:text-pink-700">
      <ScrollObserver />

      {/* 1. TOP BLACK CONTACT BAR */}
      <div className="bg-topbar text-gray-300 text-xs sm:text-sm py-2 px-4 sm:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Email & Phone */}
          <div className="flex items-center space-x-6">
            <a
              href={`mailto:${settings?.contact_email || "info@example.com"}`}
              className="flex items-center space-x-2 hover:text-accent-pink transition-colors group"
            >
              <img
                src="/icons/mail.png"
                alt="Email"
                className="w-4 h-4 object-contain brightness-0 invert opacity-80 group-hover:opacity-100"
              />
              <span>{settings?.contact_email || "info@example.com"}</span>
            </a>
            <a
              href={`tel:${settings?.phone_number || "+1 8 888 567.890.03"}`}
              className="flex items-center space-x-2 hover:text-secondary-color transition-colors group"
            >
              <img
                src="/icons/telephone.png"
                alt="Phone"
                className="w-4 h-4 object-contain brightness-0 invert opacity-80 group-hover:opacity-100"
              />
              <span>{settings?.phone_number || "8 888 567.890.03"}</span>
            </a>
          </div>

          {/* Right: Quick School Badge & Socials */}
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline-block text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              🌱 Admissions Open 2026-27
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

      {/* 2. MODERN INTERACTIVE NAVBAR */}
      <InteractiveHeader settings={settings} />

      {/* 3. HERO SECTION WITH PLAYFUL INTERACTIVE CAROUSEL */}
      <section className="relative pt-1 sm:pt-2 pb-8 lg:pt-2 lg:pb-12 px-4 sm:px-8 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Floating Decorative Elements */}
        <div className="absolute top-4 right-16 w-16 h-16 bg-pink-100 rounded-full blur-xl -z-10 opacity-70 animate-float"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-yellow-100 rounded-full blur-2xl -z-10 opacity-70 animate-float-reverse"></div>

        <HeroCarousel slides={heroSlides} />
      </section>

      {/* 4. SOFT SKY BLUE WAVE BOTTOM SECTION WITH COLORFUL ROUND BADGES */}
      <div className="relative mt-auto">
        {/* Soft SVG Wave Divider */}
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

        {/* Pastel Sky Blue Strip with 4 Colorful Feature Badges */}
        <div className="bg-accent-soft-blue pb-16 pt-2 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-around gap-6 sm:gap-8 reveal-on-scroll">
            {/* 1. Yellow Circle: Early Learning (Book) */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-secondary-color text-white flex items-center justify-center shadow-md p-5 badge-interactive">
                <img
                  src="/icons/book.png"
                  alt="Creative Learning"
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
              <span className="mt-3 font-bold text-gray-700 text-sm group-hover:text-secondary-color transition-colors">
                Creative Learning
              </span>
            </div>

            {/* 2. Pink Circle: Little Teachers / Mentors (User) */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent-pink text-white flex items-center justify-center shadow-md p-5 badge-interactive">
                <img
                  src="/icons/user.png"
                  alt="Caring Mentors"
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
              <span className="mt-3 font-bold text-gray-700 text-sm group-hover:text-accent-pink transition-colors">
                Caring Mentors
              </span>
            </div>

            {/* 3. Blue Circle: Child Care / Happiness (Happiness) */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent-blue text-white flex items-center justify-center shadow-md p-5 badge-interactive">
                <img
                  src="/icons/happiness.png"
                  alt="Healthy Growth"
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
              <span className="mt-3 font-bold text-gray-700 text-sm group-hover:text-accent-blue transition-colors">
                Healthy Growth
              </span>
            </div>

            {/* 4. Green Circle: Safe Campus (Security) */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent-green text-white flex items-center justify-center shadow-md p-5 badge-interactive">
                <img
                  src="/icons/security.png"
                  alt="Safe & Nurturing"
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
              <span className="mt-3 font-bold text-gray-700 text-sm group-hover:text-accent-green transition-colors">
                Safe & Nurturing
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. NOTICE BOARD & ANNOUNCEMENTS (Moved directly after circle badges, loading 6 circulars) */}
      {notices.length > 0 && (
        <section
          id="notices"
          className="bg-pastel-purple py-16 px-4 sm:px-8 border-b border-purple-50"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-end justify-between border-b-2 border-purple-100 pb-4 mb-8 gap-4 reveal-on-scroll">
              <div>
                <span className="text-xs font-extrabold tracking-wider uppercase text-accent-pink bg-pink-100 px-3 py-1 rounded-full">
                  Important Circulars
                </span>
                <h3 className="text-3xl font-extrabold text-primary-color mt-2">
                  Campus Announcements
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  Stay updated with latest school circulars, events, and
                  schedules
                </p>
              </div>
              <a
                href="/notice"
                className="text-xs sm:text-sm font-bold text-accent-pink hover:text-accent-pink-hover transition-colors"
              >
                View All Notices →
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notices.slice(0, 6).map((notice, idx) => (
                <div
                  key={notice.id}
                  className={`p-6 rounded-3xl bg-white border border-purple-100 hover:border-pink-300 relative overflow-hidden flex flex-col justify-between group card-interactive cursor-pointer reveal-on-scroll delay-${(idx % 3) * 100 + 100}`}
                >
                  {notice.is_urgent && (
                    <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white px-2.5 py-0.5 rounded-full shadow-xs animate-pulse">
                      Urgent
                    </span>
                  )}
                  <div>
                    <span className="text-xs font-bold text-secondary-color bg-amber-50 px-2.5 py-0.5 rounded-full">
                      {notice.published_date || "Recent Notice"}
                    </span>
                    <h4 className="font-extrabold text-gray-800 text-base mt-3 line-clamp-2 group-hover:text-primary-color transition-colors">
                      {notice.title}
                    </h4>
                    {notice.content && (
                      <p className="text-gray-500 text-xs mt-2 line-clamp-3 leading-relaxed">
                        {notice.content}
                      </p>
                    )}
                  </div>
                  <a
                    href={`/notice/${notice.id}`}
                    className="mt-5 text-xs font-bold text-primary-color group-hover:text-accent-pink inline-flex items-center transform group-hover:translate-x-1 transition-transform"
                  >
                    Read Circular →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. ABOUT US & INSTITUTION PROFILE (storio.getInstitutionProfile) */}
      {profile && (
        <section
          id="about"
          className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full relative"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Playful Image Showcase */}
            <div className="lg:col-span-5 relative reveal-on-scroll">
              <div className="relative mx-auto max-w-[420px] rounded-3xl overflow-hidden border-8 border-white shadow-xl transform -rotate-1 hover:rotate-0 hover:scale-102 transition-all duration-500">
                <img
                  src={profile.institution_image_url || "/homepage/About Our Academy/Trial 1.jpg"}
                  alt="Kindergarten Learners"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 bg-blob-yellow p-4 rounded-2xl shadow-md border-2 border-white transform rotate-3 animate-float">
                <span className="text-2xl font-extrabold text-primary-color">
                  10+ Years
                </span>
                <p className="text-xs font-bold text-gray-700">
                  Of Joyful Learning
                </p>
              </div>
            </div>

            {/* Right: Mission, Details, and Key Metrics */}
            <div className="lg:col-span-7 space-y-6 reveal-on-scroll delay-150">
              <div className="inline-block bg-accent-soft-blue text-primary-color font-bold text-xs uppercase px-3.5 py-1 rounded-full">
                About Our Academy
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-color leading-tight">
                A Loving Second Home for{" "}
                <span className="text-secondary-color">Your Little Ones</span>
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                {profile.school_details ||
                  "Little Flowers Kindergarten provides experiential early childhood education centered on play, sensory exploration, creativity, and foundational social skills."}
              </p>

              {/* Stats Highlights with Animated Counter */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-soft-amber border border-amber-200 card-interactive">
                  <div className="text-3xl font-extrabold text-secondary-color flex items-center">
                    <AnimatedCounter
                      end={profile.total_students || 450}
                      suffix="+"
                    />
                  </div>
                  <div className="text-xs font-bold text-gray-600 mt-1">
                    {profile.total_students_label || "Happy Children"}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-soft-pink border border-pink-200 card-interactive">
                  <div className="text-3xl font-extrabold text-accent-pink flex items-center">
                    <AnimatedCounter
                      end={profile.total_teachers || 35}
                      suffix="+"
                    />
                  </div>
                  <div className="text-xs font-bold text-gray-600 mt-1">
                    {profile.total_teachers_label || "Caring Mentors"}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-accent-soft-blue border border-sky-200 col-span-2 sm:col-span-1 card-interactive">
                  <div className="text-3xl font-extrabold text-primary-color flex items-center">
                    <AnimatedCounter end={100} suffix="%" />
                  </div>
                  <div className="text-xs font-bold text-gray-600 mt-1">
                    Safe Campus & Care
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-4">
                <a
                  href="/admission"
                  className="px-6 py-3 bg-secondary-color hover:opacity-90 text-white font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Schedule a Campus Visit
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. LEARNING PROGRAMS & ACTIVITIES (storio.getActivities) */}
      {activities.length > 0 && (
        <section
          id="programs"
          className="py-20 px-4 sm:px-8 bg-pastel-purple border-y border-purple-50"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14 reveal-on-scroll">
              <span className="text-xs font-extrabold tracking-wider uppercase text-accent-pink bg-pink-100 px-3 py-1 rounded-full">
                Early Exploration
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-color mt-3">
                Our Learning Programs
              </h2>
              <p className="text-gray-500 text-sm mt-2 font-medium">
                Tailored age-appropriate programs designed to kindle imagination
                and social confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activities.slice(0, 4).map((activity, idx) => {
                const borderColors = [
                  "border-secondary-color",
                  "border-accent-pink",
                  "border-accent-blue",
                  "border-accent-green",
                ];
                const badgeColors = [
                  "bg-secondary-color text-white",
                  "bg-accent-pink text-white",
                  "bg-accent-blue text-white",
                  "bg-accent-green text-white",
                ];
                const courseGlowClasses = [
                  "course-card-amber",
                  "course-card-pink",
                  "course-card-sky",
                  "course-card-lime",
                ];
                const directionClass =
                  idx < 2 ? "reveal-from-left" : "reveal-from-right";
                // Distinct staggered delays: outer cards come slightly earlier, inner cards follow
                const delayClass =
                  idx === 0
                    ? "delay-100"
                    : idx === 1
                      ? "delay-250"
                      : idx === 2
                        ? "delay-250"
                        : "delay-100";

                return (
                  <div
                    key={activity.id}
                    className={`bg-white rounded-3xl p-6 border-2 ${borderColors[idx % 4]} ${courseGlowClasses[idx % 4]} flex flex-col justify-between group card-interactive cursor-pointer ${directionClass} ${delayClass}`}
                  >
                    <div>
                      {activity.featured_image_url && (
                        <div className="w-full h-44 rounded-2xl overflow-hidden mb-5">
                          <img
                            src={activity.featured_image_url}
                            alt={activity.title}
                            className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                          />
                        </div>
                      )}
                      {activity.excerpt && (
                        <span
                          className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2 ${badgeColors[idx % 4]}`}
                        >
                          {activity.excerpt}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-color transition-colors">
                        {activity.title}
                      </h3>
                      <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                        {activity.summary || activity.content}
                      </p>
                    </div>

                    <a
                      href={`/activity/${activity.slug || activity.id}`}
                      className="mt-6 text-xs font-bold text-primary-color group-hover:text-accent-pink inline-flex items-center transform group-hover:translate-x-1 transition-transform"
                    >
                      Program Details →
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 8. TEACHERS & MENTORS (storio.getStaff) */}
      {staffList.length > 0 && (
        <section
          id="teachers"
          className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full"
        >
          <div className="text-center max-w-2xl mx-auto mb-14 reveal-on-scroll">
            <span className="text-xs font-extrabold tracking-wider uppercase text-secondary-color bg-amber-100 px-3 py-1 rounded-full">
              Warm & Caring
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-color mt-3">
              Meet Our Loving Mentors
            </h2>
            <p className="text-gray-500 text-sm mt-2 font-medium">
              Certified childhood educators dedicated to giving every child
              warmth, guidance, and laughter.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {staffList.slice(0, 4).map((member, idx) => {
              const borderColors = [
                "hover:border-secondary-color",
                "hover:border-accent-pink",
                "hover:border-accent-blue",
                "hover:border-accent-green",
              ];
              const ringGradients = [
                "from-amber-300 via-amber-400 to-pink-300",
                "from-pink-300 via-rose-400 to-purple-300",
                "from-sky-300 via-blue-400 to-teal-300",
                "from-lime-300 via-emerald-400 to-amber-300",
              ];
              const tagColors = [
                "bg-amber-50 text-secondary-color",
                "bg-pink-50 text-accent-pink",
                "bg-sky-50 text-accent-blue",
                "bg-lime-50 text-accent-green",
              ];

              return (
                <div
                  key={member.id}
                  className={`flex flex-col items-center text-center p-7 bg-white rounded-3xl border-2 border-gray-100 ${borderColors[idx % 4]} group mentor-card cursor-pointer reveal-on-scroll delay-${(idx % 4) * 100 + 100} relative overflow-hidden`}
                >
                  {/* Mentor Avatar with animated gradient halo */}
                  <div className="relative mb-5">
                    <div
                      className={`w-32 h-32 rounded-full p-1 bg-gradient-to-tr ${ringGradients[idx % 4]} mentor-ring shadow-sm`}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden bg-white p-0.5">
                        <img
                          src={member.photo_url || "/icons/user.png"}
                          alt={member.name}
                          className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500 ease-out"
                        />
                      </div>
                    </div>

                    {/* Cute floating sparkle dot */}
                    <div className="absolute bottom-1 right-2 w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center text-[10px] transform group-hover:scale-110 group-hover:rotate-12 transition-all">
                      ✨
                    </div>
                  </div>

                  {/* Mentor Info */}
                  <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-primary-color transition-colors">
                    {member.name}
                  </h3>
                  <span className="text-xs font-bold text-accent-pink mt-1">
                    {member.designation}
                  </span>

                  {/* Department / Specialty Pill */}
                  <span
                    className={`inline-block text-[11px] font-bold px-3 py-0.5 rounded-full mt-2.5 ${tagColors[idx % 4]} transition-transform duration-300 group-hover:scale-105`}
                  >
                    {member.department || "Early Childhood Specialist"}
                  </span>

                  {member.bio && (
                    <p className="text-xs text-gray-500 mt-2.5 line-clamp-2 leading-relaxed">
                      {member.bio}
                    </p>
                  )}

                  {/* Gentle interactive hover prompt */}
                  <div className="mt-4 pt-3 border-t border-gray-50 w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[11px] font-bold text-primary-color inline-flex items-center gap-1">
                      <span>View Profile</span>
                      <span className="transform group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 9. ADMISSIONS CALL-TO-ACTION PROMOTION (storio.getPromotions) */}
      {activePromo && (
        <section className="px-4 sm:px-8 py-10 max-w-7xl mx-auto w-full">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-300 via-amber-200 to-pink-200 p-8 sm:p-14 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 reveal-on-scroll">
            <div className="max-w-2xl space-y-3 text-center md:text-left">
              {activePromo.badge_text && (
                <span className="inline-block bg-white text-secondary-color font-bold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs animate-pulse">
                  {activePromo.badge_text}
                </span>
              )}
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-color leading-tight min-h-[3rem] sm:min-h-[3.5rem] font-fredoka">
                <TypewriterText
                  text={activePromo.title || "Early Bird Admissions 2026-2027 Open!"}
                  speed={65}
                  delay={150}
                  cursorColor="var(--accent-pink)"
                />
              </h2>
              <p className="text-gray-700 text-sm sm:text-base font-medium">
                {activePromo.subtitle || activePromo.description}
              </p>
            </div>

            <div className="shrink-0">
              <a
                href={activePromo.cta_url || "/admission"}
                className="px-8 py-4 bg-button-dark hover:opacity-90 text-white font-bold text-sm sm:text-base rounded-full shadow-xl transition-all transform hover:-translate-y-1 hover:scale-105 inline-block"
              >
                {activePromo.cta_label || "Apply for Admission"}
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 10. PHOTO GALLERY MOMENTS (storio.getGallery) */}
      {galleryItems.length > 0 && (
        <section
          id="gallery"
          className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full"
        >
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12 reveal-on-scroll">
            <div>
              <span className="text-xs font-extrabold tracking-wider uppercase text-accent-blue bg-sky-100 px-3 py-1 rounded-full">
                Happy Memories
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-color mt-3">
                Life at Little Flowers
              </h2>
              <p className="text-gray-500 text-sm mt-1 font-medium">
                Click on any moment to zoom and view details
              </p>
            </div>
            <a
              href="/gallery"
              className="text-xs sm:text-sm font-bold text-primary-color hover:text-accent-pink transition-colors inline-flex items-center gap-1 group"
            >
              <span>Explore Full Gallery</span>
              <span className="transform group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>
          </div>

          {/* Interactive Lightbox Gallery */}
          <InteractiveGallery items={galleryItems} />
        </section>
      )}

      {/* 11. PARENT TESTIMONIALS */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-20 px-4 sm:px-8 bg-gradient-to-b from-accent-soft-blue/70 to-pink-50/40 border-t border-sky-100 relative overflow-hidden">
          {/* Subtle floating background decorations */}
          <div className="absolute top-10 left-10 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-amber-200 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-14 reveal-on-scroll">
              <span className="text-xs font-extrabold tracking-wider uppercase text-accent-pink bg-pink-100 px-3.5 py-1 rounded-full shadow-xs">
                Parent Voices
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-color mt-3">
                Loved by Families
              </h2>
              <p className="text-gray-600 text-sm mt-2 font-medium">
                Hear what parents say about their child’s joyful journey with
                Little Flowers.
              </p>
            </div>

            {/* Interactive Testimonial Slider */}
            <TestimonialSlider testimonials={testimonials} />
          </div>
        </section>
      )}

      {/* 11. PLAYFUL COLORFUL FOOTER */}
      <footer
        id="contact"
        className="bg-topbar text-gray-300 pt-16 pb-8 px-4 sm:px-8 mt-auto border-t-4 border-accent-pink"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          {/* Col 1: Branding & Mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-300 via-pink-400 to-sky-400 p-1.5 flex items-center justify-center">
                <img
                  src="/icons/school.png"
                  alt="School Logo"
                  className="w-6 h-6 object-contain brightness-0 invert"
                />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-fredoka">
                {settings?.site_title || "Little Flowers"}
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              {settings?.site_tagline ||
                "Inspiring Little Minds Every Day through creative exploration and caring guidance."}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">
              Quick Exploration
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <a
                  href="#about"
                  className="hover:text-accent-pink transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#programs"
                  className="hover:text-secondary-color transition-colors"
                >
                  Learning Programs
                </a>
              </li>
              <li>
                <a
                  href="#teachers"
                  className="hover:text-accent-blue transition-colors"
                >
                  Our Teachers
                </a>
              </li>
              <li>
                <a
                  href="#gallery"
                  className="hover:text-accent-green transition-colors"
                >
                  Photo Gallery
                </a>
              </li>
              <li>
                <a
                  href="/admission"
                  className="hover:text-accent-pink transition-colors"
                >
                  Admission Form
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: School Hours */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">
              School Timing
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Playgroup: 8:30 AM - 11:30 AM
              <br />
              Nursery & KG: 8:00 AM - 12:30 PM
              <br />
              Office Hours: Mon - Fri (8:00 AM - 3:00 PM)
              <br />
              Weekend: Closed (Family Time!)
            </p>
          </div>

          {/* Col 4: Campus Contact Info */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">
              Contact Us
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              {settings?.mailing_address ||
                "74 Blossom Street, Sunshine Valley"}
              <br />
              Phone: {settings?.phone_number || "+1 8 888 567.890.03"}
              <br />
              Email: {settings?.contact_email || "info@example.com"}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>
            © {new Date().getFullYear()}{" "}
            {settings?.site_title || "Little Flowers"}. Built for Storio CMS.
          </p>
          <div className="flex space-x-6 text-gray-400">
            <a href="/privacy" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Modern Action Button (Bottom Right) */}
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
    </div>
  );
}
