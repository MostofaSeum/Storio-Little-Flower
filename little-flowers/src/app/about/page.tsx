import React from 'react';
import Link from 'next/link';
import { StorioStaffMember } from '@storio/template-sdk';
import { StorioTeamMember } from '@/types';
import { getTenantContext, getTemplateLayout, getInstitutionProfile, getStaff, getTeam } from '@/lib/storio';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';
import { getStaffMemberPhoto } from '@/lib/media';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';

export async function generateMetadata() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings } = await getTemplateLayout(tenantHost, isStandalone).catch(() => ({ settings: null }));
  const schoolName = settings?.site_title || 'Kindergarten';

  return {
    title: `About Us — ${schoolName}`,
    description: 'Learn about our educational philosophy, mission, loving mentors, and governing leadership.',
  };
}

/**
 * ============================================================================
 * About Page (/about)
 * ============================================================================
 * Connects:
 *   1. GET /api/v2/template/institution-profile/ — institution mission & vision
 *   2. GET /api/v2/template/staff/               — storio.getStaff(tenantHost)
 *   3. GET /api/v2/template/team/                — storio.getTeam(tenantHost)
 *
 * Follows Storio Rule 1:
 * - Standalone Preview: Fallback to DEFAULT_DEMO_DATA if DB returns empty.
 * - Live Domain: Displays actual database items or clean empty state.
 * ============================================================================
 */
export default async function AboutPage() {
  // 1. Resolve tenant context following Storio Rule 1
  const { tenantHost, isStandalone } = await getTenantContext();

  // 2. Fetch layout, customization configs, and dynamic navigation
  const { settings, customization, navigation } = await getTemplateLayout(
    tenantHost,
    isStandalone
  );

  // 3. Fetch Institution Profile, Staff, and Team in parallel via storio.ts helpers
  const [rawProfile, rawStaff, rawTeam] = await Promise.all([
    getInstitutionProfile(tenantHost).catch(() => null),
    getStaff(tenantHost).catch(() => null),
    getTeam(tenantHost).catch(() => null),
  ]);

  // 4. Apply Storio Rule 1 Fallbacks
  const profile = rawProfile || (isStandalone ? DEFAULT_DEMO_DATA.institutionProfile : null);

  const staffList: StorioStaffMember[] =
    Array.isArray(rawStaff) && rawStaff.length > 0
      ? rawStaff
      : isStandalone
        ? DEFAULT_DEMO_DATA.staff || []
        : [];

  const teamList: (StorioStaffMember | StorioTeamMember)[] =
    Array.isArray(rawTeam) && rawTeam.length > 0
      ? rawTeam
      : isStandalone
        ? DEFAULT_DEMO_DATA.team || []
        : [];

  return (
    <div className="min-h-screen bg-pastel-purple text-gray-800 flex flex-col selection:bg-pink-100 selection:text-pink-700">
      {/* Dynamic Theme Styles */}
      <DynamicThemeStyles customization={customization} />

      {/* Header Navigation */}
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1 py-12 md:py-16">
        <div className="site-container px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
          
          {/* 1. Hero & Mission Section */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Playful Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-[420px] rounded-3xl overflow-hidden border-8 border-white shadow-xl transform -rotate-1 hover:rotate-0 transition-all duration-500">
                <img
                  src={profile?.institution_image_url || "/homepage/About Our Academy/Trial 1.jpg"}
                  alt={settings?.site_title || "School Academy"}
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-2 bg-yellow-300 p-4 rounded-2xl shadow-md border-2 border-white transform rotate-3">
                <span className="text-2xl font-black text-primary-color">
                  10+ Years
                </span>
                <p className="text-xs font-bold text-gray-800">
                  Of Joyful Learning
                </p>
              </div>
            </div>

            {/* Right: Mission, Details, Philosophy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block bg-purple-100 text-primary-color font-bold text-xs uppercase px-3.5 py-1 rounded-full">
                Our Story &amp; Philosophy
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight font-fredoka">
                <SplitText
                  text="Nurturing Wonder, Creativity & Empathy"
                  tag="span"
                  splitType="words, chars"
                  delay={30}
                  duration={0.7}
                  ease="power3.out"
                  className="inline-block"
                />
              </h1>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                {profile?.school_details ||
                  "Our school provides experiential early childhood education centered on play, sensory exploration, creativity, and foundational social skills."}
              </p>

              {/* Mission & Vision Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-5 bg-white rounded-2xl border border-purple-50 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 text-accent-pink flex items-center justify-center text-xl font-bold mb-3">
                    🎯
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-base mb-1.5">Our Mission</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {profile?.mission || "To create a happy, creative, and safe environment where children grow with curiosity and confidence."}
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-purple-50 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-secondary-color flex items-center justify-center text-xl font-bold mb-3">
                    🌱
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-base mb-1.5">Our Vision</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {profile?.vision || "Nurturing curious little learners to become empathetic, joyful, and lifelong thinkers."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Governing Body & Leadership Section (storio.getTeam()) */}
          {teamList.length > 0 && (
            <section className="bg-white rounded-3xl p-8 sm:p-12 border border-purple-50 shadow-sm">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-extrabold tracking-wider uppercase text-purple-700 bg-purple-100 px-3.5 py-1 rounded-full">
                  Institutional Leadership
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mt-3 font-fredoka">
                  <SplitText
                    text="Governing Body & Advisory Board"
                    tag="span"
                    splitType="words, chars"
                    delay={35}
                    duration={0.7}
                    ease="power3.out"
                    className="inline-block"
                  />
                </h2>
                <p className="text-gray-500 text-sm mt-2 font-medium">
                  Guiding our vision, educational excellence, and strategic foundation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamList.map((member, idx) => {
                  const raw = member as unknown as Record<string, unknown>;
                  const name = String(raw.fullname || raw.name || 'Board Member');
                  const role = String(raw.designation || raw.role || 'Executive Member');
                  const section = String(raw.section_name || 'Governing Body');
                  const bio = String(raw.experience || raw.bio || '');
                  const photo = getStaffMemberPhoto(member);

                  return (
                    <div
                      key={`team-${member.id}-${idx}`}
                      className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-purple-200 transition-all flex flex-col items-center text-center group"
                    >
                      <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-purple-400 via-indigo-500 to-pink-400 mb-4 shadow-sm">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white">
                          <img
                            src={photo}
                            alt={name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </div>
                      <h3 className="font-extrabold text-base text-gray-900">{name}</h3>
                      <p className="text-xs font-bold text-primary-color mt-0.5">{role}</p>
                      <span className="mt-2 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white text-gray-600 border border-gray-100">
                        {section}
                      </span>
                      {bio && (
                        <p className="mt-3 text-xs text-gray-500 line-clamp-3 leading-relaxed">
                          {bio.replace(/;;/g, ' ')}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 3. Teaching Faculty & Mentors Section (storio.getStaff()) */}
          {staffList.length > 0 && (
            <section className="space-y-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-purple-100 pb-4">
                <div>
                  <span className="text-xs font-extrabold tracking-wider uppercase text-secondary-color bg-amber-100 px-3 py-1 rounded-full">
                    Loving &amp; Certified
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2 font-fredoka">
                    <SplitText
                      text="Our Dedicated Mentors"
                      tag="span"
                      splitType="words, chars"
                      delay={35}
                      duration={0.7}
                      ease="power3.out"
                      className="inline-block"
                    />
                  </h2>
                </div>
                <Link
                  href="/staff"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-color text-white text-xs sm:text-sm font-bold hover:bg-primary-hover transition shadow-sm"
                >
                  <span>View Full Directory</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {staffList.slice(0, 4).map((member, idx) => {
                  const raw = member as unknown as Record<string, unknown>;
                  const name = String(member.name || raw.fullname || 'Mentor');
                  const role = String(member.designation || raw.role || 'Teacher');
                  const dept = (raw.department_name && isNaN(Number(raw.department_name)))
                    ? String(raw.department_name)
                    : null;
                  const photo = getStaffMemberPhoto(member);

                  return (
                    <div
                      key={`staff-${member.id}-${idx}`}
                      className="bg-white rounded-3xl p-6 border-2 border-gray-100 hover:border-purple-300 transition-all flex flex-col items-center text-center shadow-sm group transform hover:-translate-y-1"
                    >
                      <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-amber-300 via-pink-400 to-purple-400 mb-4 shadow-sm">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white">
                          <img
                            src={photo}
                            alt={name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </div>
                      <h3 className="font-extrabold text-base text-gray-900 group-hover:text-primary-color transition-colors">
                        {name}
                      </h3>
                      <p className="text-xs font-bold text-accent-pink mt-1">{role}</p>
                      {dept && (
                        <span className="mt-2 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700">
                          {dept}
                        </span>
                      )}
                      {member.bio && (
                        <p className="mt-3 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {member.bio.replace(/;;/g, ' ')}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 4. Bottom CTA Section */}
          <section className="bg-gradient-to-r from-purple-700 via-primary-color to-indigo-800 rounded-3xl p-8 sm:p-12 text-white text-center shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 className="text-2xl sm:text-4xl font-black">
                Ready to Join Our Loving Family?
              </h2>
              <p className="text-purple-100 text-sm sm:text-base">
                Discover a joyful learning environment where your child thrives with care, wonder, and confidence.
              </p>
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/admission"
                  className="px-6 py-3 rounded-full bg-white text-primary-color font-bold text-sm hover:bg-yellow-300 transition shadow"
                >
                  Apply for Admission &rarr;
                </Link>
                <Link
                  href="/staff"
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition border border-white/20"
                >
                  Meet All Faculty &rarr;
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <Footer settings={settings} />
    </div>
  );
}
