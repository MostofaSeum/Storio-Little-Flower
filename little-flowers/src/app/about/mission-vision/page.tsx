import React from 'react';
import Link from 'next/link';
import { storio } from '@storio/template-sdk';
import { getTenantContext, getTemplateLayout } from '@/lib/storio';
import { resolveMediaUrl } from '@/lib/media';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';

interface InstitutionProfileData {
  id?: number;
  institution_image_url?: string;
  school_details?: string;
  mission?: string;
  vision?: string;
  total_students?: number;
  total_teachers?: number;
  total_students_label?: string;
  total_teachers_label?: string;
  key_metrics?: Array<{ icon?: string; label: string; value: string }>;
  metrics_title?: string;
  additional_info?: Array<{ label: string; value: string }>;
}

export const metadata = {
  title: 'Mission & Vision — Little Flowers',
  description: 'Our educational vision, foundational mission, and pedagogical values.',
};

export default async function MissionVisionPage() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation } = await getTemplateLayout(tenantHost, isStandalone);

  const rawProfile = await storio.apiFetch<InstitutionProfileData>(
    '/api/v2/template/institution-profile/',
    { tenantHost }
  );

  const profile = rawProfile || null;
  const heroImage = profile?.institution_image_url
    ? resolveMediaUrl(profile.institution_image_url)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-accent-pink selection:text-white">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-pastel-purple py-12 sm:py-16 border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-white text-primary-color border border-purple-200 shadow-2xs mb-4">
              <span className="w-2 h-2 rounded-full bg-secondary-color animate-pulse" />
              Educational Philosophy
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-fredoka text-gray-900 leading-tight">
              <SplitText
                text="Mission & Vision"
                className="inline-block text-primary-color"
                tag="span"
              />
            </h1>

            {profile?.school_details && (
              <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed font-quicksand max-w-2xl mx-auto">
                {profile.school_details}
              </p>
            )}
          </div>
        </section>

        {/* Mission and Vision Grid */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Mission Card */}
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-purple-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-pastel-purple text-primary-color flex items-center justify-center text-2xl mb-6 shadow-2xs">
                  🎯
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-fredoka text-primary-color mb-4">
                  Our Mission
                </h2>
                {profile?.mission ? (
                  <p className="text-gray-700 leading-relaxed font-quicksand whitespace-pre-line text-base">
                    {profile.mission}
                  </p>
                ) : (
                  <p className="text-gray-400 italic">Mission statement not provided yet.</p>
                )}
              </div>

              {/* Vision Card */}
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-amber-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-soft-amber text-secondary-color flex items-center justify-center text-2xl mb-6 shadow-2xs">
                  🌟
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-fredoka text-secondary-color mb-4">
                  Our Vision
                </h2>
                {profile?.vision ? (
                  <p className="text-gray-700 leading-relaxed font-quicksand whitespace-pre-line text-base">
                    {profile.vision}
                  </p>
                ) : (
                  <p className="text-gray-400 italic">Vision statement not provided yet.</p>
                )}
              </div>

            </div>

            {/* School Campus Photo & Highlights Banner */}
            {heroImage && (
              <div className="mt-12 rounded-3xl overflow-hidden border border-purple-100 shadow-lg relative bg-pastel-purple">
                <img
                  src={heroImage}
                  alt={settings?.site_title || 'Campus'}
                  className="w-full h-80 sm:h-96 object-cover"
                />
                {(profile?.total_students !== undefined || profile?.total_teachers !== undefined) && (
                  <div className="p-6 bg-white/95 backdrop-blur-md flex flex-wrap items-center justify-around gap-6 border-t border-purple-100">
                    {profile?.total_students !== undefined && (
                      <div className="text-center">
                        <span className="block text-2xl sm:text-3xl font-extrabold font-fredoka text-primary-color">
                          {profile.total_students}
                        </span>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                          {profile.total_students_label || 'Students Enrolled'}
                        </span>
                      </div>
                    )}
                    {profile?.total_teachers !== undefined && (
                      <div className="text-center">
                        <span className="block text-2xl sm:text-3xl font-extrabold font-fredoka text-secondary-color">
                          {profile.total_teachers}
                        </span>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                          {profile.total_teachers_label || 'Dedicated Mentors'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
