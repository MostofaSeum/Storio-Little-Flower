import React from 'react';
import { storio, StorioNotice } from '@storio/template-sdk';
import { getTenantContext, getTemplateLayout } from '@/lib/storio';
import { resolveMediaUrl } from '@/lib/media';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';

export const metadata = {
  title: 'Notice Board — Little Flowers',
  description: 'Official academic notices, parent circulars, holidays, and announcements.',
};

export default async function NoticePage() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation } = await getTemplateLayout(tenantHost, isStandalone);

  const rawNotices = await storio.getNotices(tenantHost);

  const notices: StorioNotice[] =
    Array.isArray(rawNotices) && rawNotices.length > 0
      ? rawNotices
      : isStandalone
        ? DEFAULT_DEMO_DATA.notices || []
        : [];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-pink-100 selection:text-pink-700">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-pastel-purple pt-8 pb-6 sm:pt-10 sm:pb-8 border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white text-primary-color border border-purple-200 shadow-2xs mb-2.5">
              <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse" />
              Circulars & Updates
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-fredoka text-gray-900 leading-tight">
              <SplitText
                text="Notice Board"
                className="inline-block text-primary-color"
                tag="span"
                triggerOnMount={true}
              />
            </h1>

            <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed font-quicksand max-w-2xl mx-auto">
              Stay up-to-date with official academic circulars, schedules, and important school notices.
            </p>
          </div>
        </section>

        {/* Notices Grid */}
        <section className="py-6 sm:py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            {notices.length === 0 ? (
              <div className="text-center py-16 px-4 bg-pastel-purple rounded-3xl border border-purple-100">
                <span className="text-4xl block mb-3">📢</span>
                <h3 className="text-xl font-bold font-fredoka text-gray-800 mb-2">No Active Notices</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  There are no circulars published right now. Please check back later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notices.map((notice) => (
                  <article
                    key={notice.id}
                    className="p-6 rounded-3xl bg-white border border-purple-100 hover:border-pink-300 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
                  >
                    {notice.is_urgent && (
                      <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white px-2.5 py-0.5 rounded-full shadow-xs animate-pulse">
                        Urgent
                      </span>
                    )}

                    <div>
                      <span className="inline-block text-xs font-bold text-secondary-color bg-amber-50 px-2.5 py-1 rounded-full mb-3">
                        {notice.published_date || 'Recent Notice'}
                      </span>

                      <h2 className="text-lg font-bold text-gray-900 font-fredoka mb-2 leading-snug">
                        {notice.title}
                      </h2>

                      {notice.content && (
                        <p className="text-sm text-gray-600 font-quicksand line-clamp-4 whitespace-pre-line">
                          {notice.content}
                        </p>
                      )}
                    </div>

                    {notice.attachment_url && (
                      <div className="mt-5 pt-4 border-t border-purple-50 flex items-center justify-between">
                        <a
                          href={resolveMediaUrl(notice.attachment_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-color hover:underline"
                        >
                          <span>Attachment PDF</span>
                          <span>📄</span>
                        </a>
                      </div>
                    )}
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
