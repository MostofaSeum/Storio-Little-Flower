import { getTenantContext, getTemplateLayout, getInstitutionProfile } from '@/lib/storio';
import { resolveMediaUrl } from '@/lib/media';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';

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

export async function generateMetadata() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings } = await getTemplateLayout(tenantHost, isStandalone).catch(() => ({ settings: null }));
  const schoolName = settings?.site_title || 'Mission & Vision';

  return {
    title: `Mission & Vision — ${schoolName}`,
    description: 'Our educational vision, foundational mission, and pedagogical values.',
  };
}

export default async function MissionVisionPage() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation } = await getTemplateLayout(tenantHost, isStandalone);

  const rawProfile = (await getInstitutionProfile(tenantHost).catch(() => null)) as InstitutionProfileData | null;

  // Fall back to demo data in standalone mode when API returns null
  const profile: InstitutionProfileData | null = rawProfile || (isStandalone ? DEFAULT_DEMO_DATA.institutionProfile as unknown as InstitutionProfileData : null);
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
          <div className="site-container px-4 sm:px-8 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white text-primary-color border border-purple-200 shadow-2xs mb-2.5">
              <span className="w-2 h-2 rounded-full bg-secondary-color animate-pulse" />
              Educational Philosophy
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-fredoka text-gray-900 leading-tight">
              <SplitText
                text="Mission & Vision"
                className="inline-block text-primary-color"
                tag="span"
                triggerOnMount={true}
              />
            </h1>

            {profile?.school_details && (
              <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed font-quicksand max-w-2xl mx-auto">
                {profile.school_details}
              </p>
            )}
          </div>
        </section>

        {/* Mission and Vision Grid */}
        <section className="py-6 sm:py-8">
          <div className="site-container px-4 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Mission Card */}
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-purple-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-pastel-purple text-primary-color flex items-center justify-center mb-6 shadow-2xs">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
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
                <div className="w-14 h-14 rounded-2xl bg-soft-amber text-secondary-color flex items-center justify-center mb-6 shadow-2xs">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
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

            {/* Creative Educational Values & Highlights Showcase */}
            <div className="mt-12 rounded-3xl overflow-hidden border border-purple-100 shadow-xl relative bg-linear-to-br from-purple-50/80 via-white to-amber-50/70 p-6 sm:p-10">
              {/* Subtle decorative playful blobs */}
              <div className="absolute -top-16 -right-16 w-52 h-52 bg-pink-100/60 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-sky-100/60 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-primary-color bg-purple-100/70 px-3.5 py-1 rounded-full inline-block mb-3">
                    Our Guiding Pillars
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-gray-900">
                    Nurturing Hearts & Awakening Minds
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base font-quicksand mt-2">
                    Every day at {settings?.site_title || 'Little Flowers'} is guided by empathy, playful discovery, and joyful learning milestones.
                  </p>
                </div>

                {/* 4 Creative Philosophy Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                  <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-purple-100/80 shadow-2xs hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-primary-color flex items-center justify-center mb-3 shadow-2xs">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C21.998 6.136 17.514 2 12 2z" />
                      </svg>
                    </div>
                    <h4 className="font-extrabold font-fredoka text-gray-900 text-lg mb-1">Joyful Play</h4>
                    <p className="text-xs sm:text-sm text-gray-600 font-quicksand leading-relaxed">
                      Learning sparked through tactile crafts, creative expression, and open-ended curiosity.
                    </p>
                  </div>

                  <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-amber-100/80 shadow-2xs hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-secondary-color flex items-center justify-center mb-3 shadow-2xs">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 10v12" />
                        <path d="M12 22s-3-2-5-5-2-6-2-6 3.5.5 5 2c1.5-1.5 5-2 5-2s0 3-2 6-5 5-5 5z" />
                        <path d="M7 10c-3-2-4-5-4-5s3 0 5 2" />
                      </svg>
                    </div>
                    <h4 className="font-extrabold font-fredoka text-gray-900 text-lg mb-1">Growth Mindset</h4>
                    <p className="text-xs sm:text-sm text-gray-600 font-quicksand leading-relaxed">
                      Celebrating effort and small discoveries that blossom into lifelong confidence.
                    </p>
                  </div>

                  <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-pink-100/80 shadow-2xs hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-pink-100 text-accent-pink flex items-center justify-center mb-3 shadow-2xs">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </div>
                    <h4 className="font-extrabold font-fredoka text-gray-900 text-lg mb-1">Warm Care</h4>
                    <p className="text-xs sm:text-sm text-gray-600 font-quicksand leading-relaxed">
                      A safe, welcoming second home where each child feels valued, heard, and protected.
                    </p>
                  </div>

                  <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-sky-100/80 shadow-2xs hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-sky-100 text-accent-blue flex items-center justify-center mb-3 shadow-2xs">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <h4 className="font-extrabold font-fredoka text-gray-900 text-lg mb-1">Empathy & Unity</h4>
                    <p className="text-xs sm:text-sm text-gray-600 font-quicksand leading-relaxed">
                      Encouraging sharing, mutual respect, and collaborative friendships from day one.
                    </p>
                  </div>
                </div>

                {/* Key Metrics / Community Stats Strip */}
                {(profile?.total_students !== undefined || profile?.total_teachers !== undefined) && (
                  <div className="rounded-2xl bg-white/95 backdrop-blur-md p-6 flex flex-wrap items-center justify-around gap-6 border border-purple-100/80 shadow-sm">
                    {profile?.total_students !== undefined && (
                      <div className="text-center flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-full bg-purple-50 text-primary-color flex items-center justify-center">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <span className="block text-2xl sm:text-3xl font-extrabold font-fredoka text-primary-color leading-none">
                            {profile.total_students}+
                          </span>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            {profile.total_students_label || 'Happy Children'}
                          </span>
                        </div>
                      </div>
                    )}
                    {profile?.total_teachers !== undefined && (
                      <div className="text-center flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-full bg-amber-50 text-secondary-color flex items-center justify-center">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <span className="block text-2xl sm:text-3xl font-extrabold font-fredoka text-secondary-color leading-none">
                            {profile.total_teachers}+
                          </span>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            {profile.total_teachers_label || 'Dedicated Mentors'}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="text-center flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-full bg-pink-50 text-accent-pink flex items-center justify-center">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <span className="block text-2xl sm:text-3xl font-extrabold font-fredoka text-accent-pink leading-none">
                          100%
                        </span>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Joyful Milestones
                        </span>
                      </div>
                    </div>
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
