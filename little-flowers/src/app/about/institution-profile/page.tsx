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
  eiin?: number | string;
  school_code?: string;
  school_shift?: string;
  school_type?: string;
  division?: string;
  district?: string;
  upazila?: string;
  ward_no?: string;
  school_details?: string;
  mission?: string;
  vision?: string;
  additional_info?: Array<{ label: string; value: string }>;
  important_links?: Array<{ id: number; title: string; url: string; order?: number }>;
  key_metrics?: Array<{ icon?: string; label: string; value: string }>;
  metrics_title?: string;
  total_students?: number;
  total_teachers?: number;
  total_students_label?: string;
  total_teachers_label?: string;
}

export async function generateMetadata() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings } = await getTemplateLayout(tenantHost, isStandalone).catch(() => ({ settings: null }));
  const schoolName = settings?.site_title || 'Institution Profile';

  return {
    title: `Institution Profile — ${schoolName}`,
    description: 'Official institutional details, accreditation metrics, and administrative information.',
  };
}

export default async function InstitutionProfilePage() {
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
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-pink-100 selection:text-pink-700">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-pastel-purple pt-8 pb-6 sm:pt-10 sm:pb-8 border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white text-primary-color border border-purple-200 shadow-2xs mb-2.5">
                <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse" />
                {settings?.site_title || 'About Our Academy'}
              </span>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-fredoka text-gray-900 leading-tight">
                <SplitText
                  text="Institution Profile"
                  className="inline-block text-primary-color"
                  tag="span"
                  triggerOnMount={true}
                />
              </h1>

              {profile?.school_details && (
                <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed font-quicksand">
                  {profile.school_details}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Profile Content Body */}
        <section className="py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Image & Quick Stats */}
              <div className="lg:col-span-5 space-y-6">
                {heroImage && (
                  <div className="rounded-3xl overflow-hidden shadow-lg border border-purple-100 bg-pastel-purple">
                    <img
                      src={heroImage}
                      alt={settings?.site_title || 'Institution'}
                      className="w-full h-72 sm:h-80 object-cover"
                    />
                  </div>
                )}

                {/* Key Metrics / Quick Numbers */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm">
                  <h2 className="text-xl font-bold font-fredoka text-primary-color mb-5 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-accent-pink" />
                    {profile?.metrics_title || 'Key Facts'}
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    {profile?.total_students !== undefined && (
                      <div className="p-4 rounded-2xl bg-pastel-purple border border-purple-100/70 text-center">
                        <span className="block text-2xl sm:text-3xl font-extrabold font-fredoka text-primary-color">
                          {profile.total_students}
                        </span>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                          {profile.total_students_label || 'Students'}
                        </span>
                      </div>
                    )}

                    {profile?.total_teachers !== undefined && (
                      <div className="p-4 rounded-2xl bg-pastel-purple border border-purple-100/70 text-center">
                        <span className="block text-2xl sm:text-3xl font-extrabold font-fredoka text-secondary-color">
                          {profile.total_teachers}
                        </span>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                          {profile.total_teachers_label || 'Teachers'}
                        </span>
                      </div>
                    )}

                    {Array.isArray(profile?.key_metrics) &&
                      profile.key_metrics.map((km, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-pastel-purple border border-purple-100/70 text-center"
                        >
                          <span className="block text-2xl sm:text-3xl font-extrabold font-fredoka text-primary-color">
                            {km.value}
                          </span>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                            {km.label}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Important Links if available */}
                {Array.isArray(profile?.important_links) && profile.important_links.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm">
                    <h3 className="text-lg font-bold font-fredoka text-primary-color mb-4">
                      Important Links
                    </h3>
                    <ul className="space-y-2.5">
                      {profile.important_links.map((link) => (
                        <li key={link.id || link.title}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-xl bg-pastel-purple hover:bg-purple-100/70 transition-colors text-xs font-semibold text-gray-800"
                          >
                            <span>{link.title}</span>
                            <span className="text-primary-color font-bold">↗</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Column: Identification & Official Registration Table */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm">
                  <h2 className="text-2xl font-bold font-fredoka text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-accent-blue" />
                    Institutional Information
                  </h2>

                  <div className="divide-y divide-purple-100">
                    {profile?.eiin && (
                      <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-sm font-bold text-gray-500">EIIN Number</span>
                        <span className="text-sm font-extrabold text-primary-color">{profile.eiin}</span>
                      </div>
                    )}
                    {profile?.school_code && (
                      <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-sm font-bold text-gray-500">School Code</span>
                        <span className="text-sm font-extrabold text-gray-900">{profile.school_code}</span>
                      </div>
                    )}
                    {profile?.school_shift && (
                      <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-sm font-bold text-gray-500">Shift</span>
                        <span className="text-sm font-semibold text-gray-800">{profile.school_shift}</span>
                      </div>
                    )}
                    {profile?.school_type && (
                      <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-sm font-bold text-gray-500">Institution Type</span>
                        <span className="text-sm font-semibold text-gray-800">{profile.school_type}</span>
                      </div>
                    )}
                    {profile?.division && (
                      <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-sm font-bold text-gray-500">Division</span>
                        <span className="text-sm font-semibold text-gray-800">{profile.division}</span>
                      </div>
                    )}
                    {profile?.district && (
                      <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-sm font-bold text-gray-500">District</span>
                        <span className="text-sm font-semibold text-gray-800">{profile.district}</span>
                      </div>
                    )}
                    {profile?.upazila && (
                      <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-sm font-bold text-gray-500">Upazila / Thana</span>
                        <span className="text-sm font-semibold text-gray-800">{profile.upazila}</span>
                      </div>
                    )}
                    {profile?.ward_no && (
                      <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-sm font-bold text-gray-500">Ward No.</span>
                        <span className="text-sm font-semibold text-gray-800">{profile.ward_no}</span>
                      </div>
                    )}
                    {Array.isArray(profile?.additional_info) &&
                      profile.additional_info.map((info, idx) => (
                        <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="text-sm font-bold text-gray-500">{info.label}</span>
                          <span className="text-sm font-semibold text-gray-800">{info.value}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Mission & Vision Callout Cards */}
                {(profile?.mission || profile?.vision) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile?.mission && (
                      <div className="p-6 rounded-3xl bg-pastel-purple border border-purple-100">
                        <div className="w-10 h-10 rounded-2xl bg-primary-color text-white flex items-center justify-center font-bold text-lg mb-3">
                          🎯
                        </div>
                        <h3 className="text-lg font-bold font-fredoka text-primary-color mb-2">Our Mission</h3>
                        <p className="text-sm text-gray-700 leading-relaxed font-quicksand whitespace-pre-line">
                          {profile.mission}
                        </p>
                      </div>
                    )}

                    {profile?.vision && (
                      <div className="p-6 rounded-3xl bg-soft-amber border border-amber-100">
                        <div className="w-10 h-10 rounded-2xl bg-secondary-color text-white flex items-center justify-center font-bold text-lg mb-3">
                          🌟
                        </div>
                        <h3 className="text-lg font-bold font-fredoka text-secondary-color mb-2">Our Vision</h3>
                        <p className="text-sm text-gray-700 leading-relaxed font-quicksand whitespace-pre-line">
                          {profile.vision}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
