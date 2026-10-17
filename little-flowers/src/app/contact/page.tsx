import React from 'react';
import { getTenantContext, getTemplateLayout } from '@/lib/storio';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import LiveText from '@/components/ui/LiveText';
import ContactFormClient from '@/components/sections/ContactFormClient';

export async function generateMetadata() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings } = await getTemplateLayout(tenantHost, isStandalone).catch(() => ({ settings: null }));
  const schoolName = settings?.site_title || 'Contact Us';

  return {
    title: `Contact Us — ${schoolName}`,
    description: `Reach out to ${schoolName} campus administration for admissions, inquiries, tuition fees, and campus tour requests.`,
  };
}

export default async function ContactPage() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation, importantLinks } = await getTemplateLayout(tenantHost, isStandalone);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-pink-100 selection:text-pink-700">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-pastel-purple pt-8 pb-6 sm:pt-10 sm:pb-8 border-b border-purple-100">
          <div className="site-container px-4 sm:px-8 relative z-10 text-center">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white text-primary-color border border-purple-200 shadow-2xs mb-2.5"
              data-customizer-field="page_contact_badge"
              data-customizer-title="Contact Page Badge"
            >
              <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse" />
              <LiveText field="page_contact_badge" initial={customization?.page_contact_badge} fallback="Direct Communication" />
            </span>

            <h1
              className="text-3xl sm:text-5xl font-extrabold tracking-tight font-fredoka text-primary-color leading-tight"
              data-customizer-field="page_contact_title"
              data-customizer-title="Contact Page Title"
            >
              <LiveText field="page_contact_title" initial={customization?.page_contact_title} fallback="Contact Our Campus" />
            </h1>

            <p
              className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed font-quicksand max-w-2xl mx-auto"
              data-customizer-field="page_contact_subtitle"
              data-customizer-title="Contact Page Subtitle"
            >
              <LiveText field="page_contact_subtitle" initial={customization?.page_contact_subtitle} fallback="We welcome parents, educators, and visitors to connect with our administrative office, schedule campus tours, or ask any questions." />
            </p>
          </div>
        </section>

        {/* Contact Form & Details Section */}
        <ContactFormClient settings={settings} tenantHost={tenantHost} />
      </main>

      <Footer settings={settings} importantLinks={importantLinks} />
    </div>
  );
}
