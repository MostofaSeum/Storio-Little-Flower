import {
  storio,
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
  StorioEvent,
  StorioFaq,
  StorioLeadershipMessage,
} from "@/types";
import { DEFAULT_DEMO_DATA } from "@/data/defaultDemoData";
import { getTenantContext, getTemplateLayout } from "@/lib/storio";

// Layout & Theme Components
import TopBar from "@/components/layout/TopBar";
import InteractiveHeader from "@/components/layout/InteractiveHeader";
import Footer from "@/components/layout/Footer";
import DynamicThemeStyles from "@/components/layout/DynamicThemeStyles";
import ScrollObserver from "@/components/ui/ScrollObserver";
import FloatingEnrollButton from "@/components/ui/FloatingEnrollButton";

// Modular Section Components
import HeroCarousel from "@/components/sections/HeroCarousel";
import WaveBadgesSection from "@/components/sections/WaveBadgesSection";
import NoticeSection from "@/components/sections/NoticeSection";
import AboutSection from "@/components/sections/AboutSection";
import LeadershipFlexCarousel from "@/components/sections/LeadershipFlexCarousel";
import ActivitiesSection from "@/components/sections/ActivitiesSection";
import StaffSection from "@/components/sections/StaffSection";
import PromoCtaSection from "@/components/sections/PromoCtaSection";
import GallerySection from "@/components/sections/GallerySection";
import EventsSection from "@/components/sections/EventsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FaqSection from "@/components/sections/FaqSection";

export default async function Home() {
  // 1. Resolve host and tenant context following Storio Rule 1
  const { tenantHost, isStandalone } = await getTenantContext();

  // 2. Fetch layout, customization, dynamic navigation, and important links
  const { settings, customization, navigation, importantLinks } = await getTemplateLayout(
    tenantHost,
    isStandalone
  );

  // 3. Fetch data via SDK for landing page sections in parallel
  const [
    rawHeroSlides,
    rawNotices,
    rawProfile,
    rawActivities,
    rawStaff,
    rawGallery,
    rawPromotions,
    rawTestimonials,
    rawEvents,
    rawFaqs,
    rawLeadershipMessages,
  ] = await Promise.all([
    storio.getHeroSlides(tenantHost),
    storio.getNotices(tenantHost),
    storio.apiFetch<StorioInstitutionProfile>(
      "/api/v2/template/institution-profile/",
      { tenantHost }
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
    storio.apiFetch<StorioEvent[]>("/api/events/", { tenantHost }),
    storio.apiFetch<StorioFaq[]>("/api/v2/template/faqs/", { tenantHost }),
    storio.apiFetch<StorioLeadershipMessage[]>("/api/v2/template/leadership-messages/", {
      tenantHost,
    }).catch(() => null),
  ]);

  // 4. Apply Rule 1: Fallback to demo data ONLY in standalone preview mode
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

  const rawEventsList: StorioEvent[] = Array.isArray(rawEvents)
    ? rawEvents
    : Array.isArray((rawEvents as unknown as { results?: StorioEvent[] })?.results)
      ? ((rawEvents as unknown as { results: StorioEvent[] }).results)
      : [];

  const events: StorioEvent[] =
    rawEventsList.length > 0
      ? rawEventsList
      : isStandalone
        ? DEFAULT_DEMO_DATA.events
        : [];

  const faqs: StorioFaq[] =
    Array.isArray(rawFaqs) && rawFaqs.length > 0
      ? (rawFaqs as unknown as StorioFaq[])
      : isStandalone
        ? DEFAULT_DEMO_DATA.faqs
        : [];

  const leadershipMessages: StorioLeadershipMessage[] =
    Array.isArray(rawLeadershipMessages) && rawLeadershipMessages.length > 0
      ? rawLeadershipMessages
      : isStandalone
        ? DEFAULT_DEMO_DATA.leadershipMessages
        : [];

  const activePromo = promotions[0] || (isStandalone ? DEFAULT_DEMO_DATA.promotions[0] : null);
  const showTopBar = customization.showTopBar !== false;

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col overflow-x-hidden selection:bg-pink-100 selection:text-pink-700">
      {/* Dynamic CSS Variables injected from Storio CMS Customization Config */}
      <DynamicThemeStyles customization={customization} />

      <ScrollObserver />

      {/* 1. TOP CONTACT BAR */}
      {showTopBar && (
        <TopBar
          contactEmail={settings?.contact_email}
          phoneNumber={settings?.phone_number}
        />
      )}

      {/* 2. MODERN INTERACTIVE NAVBAR WITH CMS DYNAMIC LINKS */}
      <InteractiveHeader settings={settings} navigation={navigation} />

      {/* 3. HERO SECTION WITH PLAYFUL INTERACTIVE CAROUSEL */}
      <section className="relative pt-1 sm:pt-2 pb-8 lg:pt-2 lg:pb-12 px-4 sm:px-8 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="absolute top-4 right-16 w-16 h-16 bg-pink-100 rounded-full blur-xl -z-10 opacity-70 animate-float"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-yellow-100 rounded-full blur-2xl -z-10 opacity-70 animate-float-reverse"></div>
        <HeroCarousel slides={heroSlides} />
      </section>

      {/* 4. SOFT SKY BLUE WAVE BOTTOM SECTION WITH BADGES */}
      <WaveBadgesSection showWaveDivider={customization.showWaveDivider !== false} />

      {/* 5. NOTICE BOARD & ANNOUNCEMENTS */}
      <NoticeSection notices={notices} />

      {/* 6. ABOUT US & INSTITUTION PROFILE */}
      <AboutSection profile={profile} />

      {/* 7. LEADERSHIP MESSAGES - REACT BITS FLEX CAROUSEL */}
      {leadershipMessages.length > 0 && (
        <LeadershipFlexCarousel messages={leadershipMessages} />
      )}

      {/* 8. LEARNING PROGRAMS & ACTIVITIES */}
      <ActivitiesSection activities={activities} />

      {/* 9. TEACHERS & MENTORS */}
      <StaffSection staffList={staffList} />

      {/* 9. ADMISSIONS CALL-TO-ACTION PROMOTION */}
      <PromoCtaSection promo={activePromo} />

      {/* 10. PHOTO GALLERY MOMENTS */}
      <GallerySection items={galleryItems} />

      {/* 11. UPCOMING SCHOOL EVENTS */}
      <EventsSection events={events} />

      {/* 12. PARENT TESTIMONIALS */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 13. FREQUENTLY ASKED QUESTIONS */}
      <FaqSection faqs={faqs} />

      {/* 14. PLAYFUL COLORFUL FOOTER */}
      <Footer settings={settings} importantLinks={importantLinks} />

      {/* 15. FLOATING QUICK ENROLLMENT ACTION */}
      <FloatingEnrollButton />
    </div>
  );
}
