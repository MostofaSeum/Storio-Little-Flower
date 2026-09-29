import React from 'react';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { storio, StorioLayoutResponse, StorioNotice } from '@storio/template-sdk';
import { LittleFlowersCustomizationConfig, StorioDynamicNavItem } from '@/data/storioExtendedTypes';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';
import InteractiveHeader from '@/Components/InteractiveHeader';
import Footer from '@/Components/Footer';
import DynamicThemeStyles from '@/Components/DynamicThemeStyles';

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

  // 1. Resolve host from incoming request
  const headersList = await headers();
  const rawHost = headersList.get('x-tenant-host') || headersList.get('host') || '';
  const host = rawHost.split(':')[0];

  // 2. Check for linked tenant vs Standalone mode (Rule 1)
  const linkedTenant = process.env.NEXT_PUBLIC_STORIO_TENANT_HOST;
  const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '::1';
  const isStandalone = isLocalHost && !linkedTenant;
  const tenantHost = linkedTenant || (isStandalone ? 'demo.storio.cloud' : host);

  // 3. Fetch layout settings & notice detail via storio.getNoticeDetail(id)
  const [rawLayout, rawNotice] = await Promise.all([
    storio.getLayout(tenantHost),
    storio.getNoticeDetail(id, tenantHost),
  ]);

  // 4. Apply Rule 1 fallback
  const layout: StorioLayoutResponse | null =
    rawLayout ||
    (isStandalone
      ? {
          settings: DEFAULT_DEMO_DATA.settings,
          customization: { config: {} },
          navigation: { items: [] },
        }
      : null);

  const settings = layout?.settings || DEFAULT_DEMO_DATA.settings;

  // Customization preferences
  const customization: LittleFlowersCustomizationConfig = {
    ...DEFAULT_DEMO_DATA.customization,
    ...(layout?.customization?.config as LittleFlowersCustomizationConfig || {}),
  };

  // Dynamic Navigation menu items from Storio CMS
  const cmsNavLinks =
    (layout?.customization?.config?.navbarLinks as StorioDynamicNavItem[] | undefined) ||
    layout?.navigation?.items;

  const navigation: StorioDynamicNavItem[] =
    Array.isArray(cmsNavLinks) && cmsNavLinks.length > 0
      ? cmsNavLinks
      : isStandalone
        ? DEFAULT_DEMO_DATA.navigation
        : [];

  // Fallback to local demo notice if in Standalone mode
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
              <span className="text-xs font-bold text-secondary-color bg-amber-50 px-3 py-1 rounded-full">
                📅 {notice.published_date || 'Recent Notice'}
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
                <div className="w-10 h-10 rounded-xl bg-purple-200/80 flex items-center justify-center text-primary-color">
                  📄
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
