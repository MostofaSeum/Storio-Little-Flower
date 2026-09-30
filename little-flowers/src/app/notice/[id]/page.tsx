import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { storio, StorioNotice } from '@storio/template-sdk';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';
import { getTenantContext, getTemplateLayout } from '@/lib/storio';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import ThemeIcon from '@/components/ui/ThemeIcon';

interface NoticeDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NoticeDetailPageProps) {
  const { id } = await params;
  return {
    title: `Notice #${id} — Little Flowers Kindergarten`,
    description: `Official school announcement and circular details.`,
  };
}

export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const { id } = await params;

  // 1. Resolve host and tenant context
  const { tenantHost, isStandalone } = await getTenantContext();

  // 2. Fetch layout and notice detail in parallel
  const [templateLayout, rawNotice] = await Promise.all([
    getTemplateLayout(tenantHost, isStandalone),
    storio.getNoticeDetail(id, tenantHost),
  ]);

  const { settings, customization, navigation } = templateLayout;

  // 3. Fallback to local demo notice if in Standalone mode
  const demoNotice = DEFAULT_DEMO_DATA.notices.find(
    (n) => String(n.id) === String(id) || n.slug === id
  ) || DEFAULT_DEMO_DATA.notices[0];

  const notice: StorioNotice | null = rawNotice || (isStandalone ? demoNotice : null);

  if (!notice) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-pastel-purple text-gray-800 flex flex-col selection:bg-pink-100 selection:text-pink-700">
      {/* Dynamic Theme Styles */}
      <DynamicThemeStyles customization={customization} />

      {/* Header Navigation */}
      <InteractiveHeader settings={settings} navigation={navigation} />

      {/* Main Notice Detail Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/#notices"
            className="inline-flex items-center gap-2 text-xs font-bold text-primary-color hover:text-accent-pink transition-colors bg-white px-4 py-2 rounded-full shadow-2xs border border-purple-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Announcements</span>
          </Link>
        </div>

        {/* Notice Paper Card */}
        <article className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-purple-100 relative overflow-hidden">
          {/* Top Metadata Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-5 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary-color bg-amber-50 px-3 py-1 rounded-full">
                <ThemeIcon name="calendar-badge" size={14} /> {notice.published_date || 'Recent Notice'}
              </span>
              {notice.is_urgent && (
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-rose-500 text-white px-3 py-1 rounded-full shadow-2xs animate-pulse">
                  Urgent
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-gray-400">Notice ID: #{notice.id}</span>
          </div>

          {/* Notice Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-color font-fredoka leading-tight">
            {notice.title}
          </h1>

          {/* Notice Body Content */}
          <div className="mt-8 text-sm sm:text-base text-gray-700 leading-relaxed space-y-4">
            {notice.content ? (
              notice.content.includes('<') ? (
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: notice.content }}
                />
              ) : (
                <p className="whitespace-pre-line text-gray-700 font-medium">
                  {notice.content}
                </p>
              )
            ) : (
              <p className="text-gray-500 italic">No detailed content description provided.</p>
            )}
          </div>

          {/* Attachment Download Section */}
          {notice.attachment_url && (
            <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-purple-50/60 p-5 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-2xs flex items-center justify-center">
                  <ThemeIcon name="document-paper" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900">Official Notice Document</h4>
                  <p className="text-[11px] text-gray-500">Download attached PDF circular or document</p>
                </div>
              </div>
              <a
                href={notice.attachment_url}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-color text-white rounded-full font-bold text-xs shadow-md hover:shadow-lg transition-all"
              >
                <span>Download Attachment</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </div>
          )}

          {/* Stamp / Authorization Footer */}
          <div className="mt-12 pt-6 border-t border-dashed border-gray-200 flex flex-wrap items-center justify-between text-xs text-gray-500">
            <span>Issued by Administration &bull; {settings?.site_title || 'Little Flowers Kindergarten'}</span>
            <span className="font-semibold text-gray-400">Notice Authority Verification &bull; Active</span>
          </div>
        </article>
      </main>

      {/* Footer */}
      <Footer settings={settings} />
    </div>
  );
}
