import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTenantContext, getTemplateLayout, getJobDetail } from '@/lib/storio';
import { resolveMediaUrl } from '@/lib/media';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';
import ThemeIcon from '@/components/ui/ThemeIcon';

interface StorioJobDetail {
  id: number;
  title: string;
  slug: string;
  company_name?: string;
  location?: string;
  job_type?: string;
  vacancy?: number | string;
  deadline?: string;
  description?: string;
  application_link?: string;
  status?: string;
  attachments_data?: Array<{
    id?: number;
    file?: string;
    file_name?: string;
    title?: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

interface CareerDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CareerDetailPageProps) {
  const { slug } = await params;
  const { tenantHost } = await getTenantContext();

  const job = await storio.apiFetch<StorioJobDetail>(
    `/api/v2/template/careers/jobs/${slug}/`,
    { tenantHost }
  );

  const { isStandalone } = await getTenantContext();
  const { settings } = await getTemplateLayout(tenantHost, isStandalone).catch(() => ({ settings: null }));
  const schoolName = settings?.site_title || 'Careers';

  if (!job) {
    return {
      title: `Career Opportunity — ${schoolName}`,
    };
  }

  return {
    title: `${job.title} — Careers at ${schoolName}`,
    description: job.description?.slice(0, 160) || `Apply for ${job.title}`,
  };
}

export default async function CareerDetailPage({ params }: CareerDetailPageProps) {
  const { slug } = await params;
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation } = await getTemplateLayout(tenantHost, isStandalone);

  // Fetch single job detail from GET /api/v2/template/careers/jobs/${slug}/
  const job = await storio.apiFetch<StorioJobDetail>(
    `/api/v2/template/careers/jobs/${slug}/`,
    { tenantHost }
  );

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-pink-100 selection:text-pink-700">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Breadcrumb Navigation Bar */}
        <section className="bg-pastel-purple border-b border-purple-100 py-4">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 flex items-center gap-2 text-xs font-bold text-gray-500">
            <Link href="/" className="hover:text-primary-color transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/career" className="hover:text-primary-color transition-colors">
              Careers
            </Link>
            <span>/</span>
            <span className="text-primary-color truncate max-w-xs">{job.title}</span>
          </div>
        </section>

        {/* Job Details Card Section */}
        <article className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          
          {/* Quick Header Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {job.job_type && (
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-pastel-purple text-primary-color border border-purple-200">
                {job.job_type}
              </span>
            )}
            {job.vacancy !== undefined && (
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-soft-amber text-secondary-color border border-amber-200">
                {job.vacancy} {Number(job.vacancy) === 1 ? 'Vacancy' : 'Vacancies'}
              </span>
            )}
            {job.deadline && (
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-soft-pink text-accent-pink border border-pink-200">
                Application Deadline: {job.deadline}
              </span>
            )}
          </div>

          {/* Job Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 font-fredoka leading-tight tracking-tight mb-4">
            <SplitText
              text={job.title}
              className="inline-block text-primary-color"
              tag="span"
            />
          </h1>

          {/* Company / Department and Location */}
          {(job.company_name || job.location) && (
            <p className="text-base sm:text-lg font-semibold text-gray-600 mb-8 flex items-center gap-2">
              <ThemeIcon name="school-building" size={20} />
              <span>{job.company_name || settings?.site_title || 'School Administration'}</span>
              {job.location && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="inline-flex items-center gap-1">
                    <ThemeIcon name="location-pin" size={16} /> {job.location}
                  </span>
                </>
              )}
            </p>
          )}

          {/* Quick Overview Meta Cards */}
          <div className="bg-pastel-purple rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-2xs flex items-center justify-center shrink-0">
                <ThemeIcon name="briefcase-career" size={20} />
              </div>
              <div>
                <span className="block text-xs font-bold uppercase text-gray-400">Employment Type</span>
                <span className="block text-sm font-extrabold text-gray-900 mt-0.5">{job.job_type || 'Full-Time'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-2xs flex items-center justify-center shrink-0">
                <ThemeIcon name="people-group" size={20} />
              </div>
              <div>
                <span className="block text-xs font-bold uppercase text-gray-400">Available Openings</span>
                <span className="block text-sm font-extrabold text-gray-900 mt-0.5">
                  {job.vacancy ? `${job.vacancy} Position(s)` : 'Open'}
                </span>
              </div>
            </div>

            {job.deadline && (
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-2xs flex items-center justify-center shrink-0">
                  <ThemeIcon name="calendar-badge" size={20} />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase text-gray-400">Application Deadline</span>
                  <span className="block text-sm font-extrabold text-gray-900 mt-0.5">{job.deadline}</span>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Job Description */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold font-fredoka text-gray-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent-pink" />
              Role Description & Requirements
            </h2>

            {job.description ? (
              <div
                className="text-gray-700 leading-relaxed font-quicksand text-base prose prose-purple max-w-none [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_span]:text-inherit"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            ) : (
              <p className="text-gray-400 italic">No specific description provided for this opening.</p>
            )}

            {/* Attachments if any */}
            {Array.isArray(job.attachments_data) && job.attachments_data.length > 0 && (
              <div className="mt-8 pt-6 border-t border-purple-100">
                <h3 className="text-lg font-bold font-fredoka text-gray-900 mb-3">
                  Related Documents & Circulars
                </h3>
                <ul className="space-y-2">
                  {job.attachments_data.map((att) => {
                    const fileUrl = resolveMediaUrl(att.file);
                    return (
                      <li key={att.id || att.file_name}>
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pastel-purple hover:bg-purple-100 text-xs font-bold text-primary-color transition-colors"
                        >
                          <ThemeIcon name="document-paper" size={14} />
                          <span>{att.title || att.file_name || 'Download Attachment'}</span>
                          <span>↗</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="mt-10 pt-6 border-t border-purple-100 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/career"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pastel-purple text-primary-color font-bold text-xs hover:bg-purple-100 transition-colors"
            >
              <span>← Back to All Openings</span>
            </Link>

            {job.application_link && (
              <a
                href={job.application_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary-color hover:opacity-90 text-white font-bold text-sm shadow-md transition-opacity"
              >
                <span>Apply for this Position</span>
                <span>↗</span>
              </a>
            )}
          </div>

        </article>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
