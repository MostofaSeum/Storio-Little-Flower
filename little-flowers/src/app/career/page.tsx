import React from 'react';
import Link from 'next/link';
import { storio } from '@storio/template-sdk';
import { getTenantContext, getTemplateLayout } from '@/lib/storio';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';

interface StorioJobOpening {
  id: number;
  title: string;
  slug?: string;
  company_name?: string;
  location?: string;
  job_type?: string;
  vacancy?: number | string;
  deadline?: string;
  description?: string;
  application_link?: string;
  status?: string;
}

export const metadata = {
  title: 'Careers & Opportunities — Little Flowers',
  description: 'Join our dedicated team of educators, caregivers, and administrative professionals.',
};

export default async function CareersPage() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation } = await getTemplateLayout(tenantHost, isStandalone);

  const rawJobs = await storio.apiFetch<StorioJobOpening[]>(
    '/api/v2/template/careers/jobs/',
    { tenantHost }
  );

  const jobs: StorioJobOpening[] = Array.isArray(rawJobs) ? rawJobs : [];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-pink-100 selection:text-pink-700">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-pastel-purple py-12 sm:py-16 border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-white text-primary-color border border-purple-200 shadow-2xs mb-4">
              <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              Join Our Family
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-fredoka text-gray-900 leading-tight">
              <SplitText
                text="Career Opportunities"
                className="inline-block text-primary-color"
                tag="span"
              />
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed font-quicksand max-w-2xl mx-auto">
              Work with passion and purpose in a joyful, supportive environment dedicated to child growth.
            </p>
          </div>
        </section>

        {/* Jobs List */}
        <section className="py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-8">
            {jobs.length === 0 ? (
              <div className="text-center py-16 px-4 bg-pastel-purple rounded-3xl border border-purple-100">
                <span className="text-4xl block mb-3">💼</span>
                <h3 className="text-xl font-bold font-fredoka text-gray-800 mb-2">No Openings at This Time</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  We are not actively hiring right now, but we always welcome resumes from passionate educators.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {jobs.map((job) => (
                  <article
                    key={job.id}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {job.job_type && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-pastel-purple text-primary-color border border-purple-200">
                            {job.job_type}
                          </span>
                        )}
                        {job.vacancy !== undefined && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-soft-amber text-secondary-color border border-amber-200">
                            {job.vacancy} {Number(job.vacancy) === 1 ? 'Vacancy' : 'Vacancies'}
                          </span>
                        )}
                        {job.deadline && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-soft-pink text-accent-pink border border-pink-200">
                            Deadline: {job.deadline}
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold font-fredoka text-gray-900">
                        {job.title}
                      </h2>

                      {job.company_name && (
                        <p className="text-sm font-semibold text-gray-600">
                          {job.company_name} {job.location ? `• ${job.location}` : ''}
                        </p>
                      )}

                      {job.description && (
                        <p className="text-sm text-gray-600 font-quicksand line-clamp-3">
                          {job.description}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 flex flex-wrap items-center gap-3">
                      <Link
                        href={`/career/${job.slug || job.id}`}
                        className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-purple-200 hover:bg-pastel-purple text-primary-color font-bold text-xs shadow-2xs transition-all"
                      >
                        View Details →
                      </Link>

                      {job.application_link && (
                        <a
                          href={job.application_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-primary-color hover:opacity-90 text-white font-bold text-xs shadow-md transition-all"
                        >
                          Apply Now ↗
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
