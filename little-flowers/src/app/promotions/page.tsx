import React from 'react';
import { StorioPromotion } from '@/types';
import { getTenantContext, getTemplateLayout, getPromotions } from '@/lib/storio';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';
import TypewriterText from '@/components/ui/TypewriterText';
import Link from 'next/link';

export async function generateMetadata() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings } = await getTemplateLayout(tenantHost, isStandalone).catch(() => ({ settings: null }));
  const schoolName = settings?.site_title || 'Little Flowers';

  return {
    title: `Special Offers & Promotions — ${schoolName}`,
    description: `Discover ongoing admissions, scholarships, discounts, and active campaigns at ${schoolName}.`,
  };
}

export default async function PromotionsPage() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation, importantLinks } = await getTemplateLayout(
    tenantHost,
    isStandalone
  );

  const rawPromotions = await getPromotions(tenantHost).catch(() => null);

  const promotions: StorioPromotion[] =
    Array.isArray(rawPromotions) && rawPromotions.length > 0
      ? rawPromotions
      : isStandalone
        ? DEFAULT_DEMO_DATA.promotions
        : [];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-pink-100 selection:text-pink-700">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-pastel-purple pt-10 pb-8 sm:pt-14 sm:pb-12 border-b border-purple-100">
          <div className="site-container px-4 sm:px-8 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-white text-primary-color border border-purple-200 shadow-2xs mb-3">
              <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse" />
              Special Announcements
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-fredoka text-gray-900 leading-tight">
              <SplitText
                text="Active School Promotions"
                className="inline-block text-primary-color"
                tag="span"
                triggerOnMount={true}
              />
            </h1>

            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed font-quicksand max-w-2xl mx-auto">
              Explore our current fee waivers, admission opportunities, sibling discounts, and early bird scholarship programs.
            </p>
          </div>
        </section>

        {/* Promotions Listing Grid */}
        <section className="site-section-py site-section-px site-container w-full">
          {promotions.length === 0 ? (
            <div className="text-center py-20 px-4 bg-pastel-purple rounded-3xl border border-purple-100 max-w-xl mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-amber-100 text-secondary-color flex items-center justify-center text-2xl font-bold">
                <img src="/icons/info-circle.svg" alt="Info" className="w-6 h-6 inline-block" />
              </div>
              <h2 className="text-2xl font-bold font-fredoka text-gray-800 mb-2">No Active Promotions</h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                There are currently no active promotional campaigns running. Please check back later or contact our office for details.
              </p>
              <Link
                href="/"
                className="px-6 py-3 bg-button-dark hover:opacity-90 text-white font-bold text-xs rounded-full shadow-md transition-all inline-block"
              >
                Back to Homepage
              </Link>
            </div>
          ) : (
            <div className="space-y-8 max-w-5xl mx-auto">
              {promotions.map((promo, idx) => {
                const rawImage =
                  promo.image_detail?.file ||
                  promo.image_detail?.file_url ||
                  (typeof promo.image === 'string' ? promo.image : undefined);

                const bgImageUrl = rawImage
                  ? rawImage.startsWith('http')
                    ? rawImage
                    : `https://api.storio.cloud${rawImage}`
                  : null;

                // Alternate rotation gradient direction: even index left-to-right, odd index right-to-left (90 deg rotation)
                const isRotated = idx % 2 === 1;
                const gradientClass = isRotated
                  ? 'bg-gradient-to-r from-pink-200 via-amber-200 to-amber-300'
                  : 'bg-gradient-to-r from-amber-300 via-amber-200 to-pink-200';
                const overlayGradientClass = isRotated
                  ? 'bg-gradient-to-r from-pink-200/40 via-amber-200/30 to-amber-300/40'
                  : 'bg-gradient-to-r from-amber-300/40 via-amber-200/30 to-pink-200/40';

                return (
                  <div
                    key={promo.id || idx}
                    className={`relative rounded-3xl overflow-hidden ${gradientClass} p-8 sm:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 border border-amber-200/40 transition-transform duration-300 hover:shadow-xl`}
                  >
                    {/* Subtle Transparent Background Image */}
                    {bgImageUrl && (
                      <>
                        <div
                          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-20 mix-blend-overlay transition-opacity duration-700"
                          style={{ backgroundImage: `url(${bgImageUrl})` }}
                        />
                        <div className={`absolute inset-0 ${overlayGradientClass} pointer-events-none`} />
                      </>
                    )}

                    <div className="relative z-10 max-w-2xl space-y-3 text-center md:text-left">
                      {promo.badge_text && (
                        <span className="inline-block bg-white text-secondary-color font-bold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs animate-pulse">
                          {promo.badge_text}
                        </span>
                      )}
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight font-fredoka text-gray-900">
                        {promo.title}
                      </h2>
                      {promo.subtitle && (
                        <p className="text-gray-800 text-sm sm:text-base font-semibold">
                          {promo.subtitle}
                        </p>
                      )}
                      {promo.description && (
                        <p className="text-gray-700 text-xs sm:text-sm font-medium leading-relaxed">
                          {promo.description}
                        </p>
                      )}
                    </div>

                    <div className="relative z-10 shrink-0">
                      <a
                        href={promo.cta_url || '/admission'}
                        className="px-8 py-4 bg-button-dark hover:opacity-90 text-white font-bold text-sm sm:text-base rounded-full shadow-xl transition-all transform hover:-translate-y-1 hover:scale-105 inline-block"
                      >
                        {promo.cta_label || 'Learn More'}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer settings={settings} importantLinks={importantLinks} />
    </div>
  );
}
