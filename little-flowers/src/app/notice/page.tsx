import { storio, StorioNotice } from '@storio/template-sdk';
import { getTenantContext, getTemplateLayout, getBoardNotices } from '@/lib/storio';
import { StorioBoardNotice } from '@/types';
import { resolveMediaUrl } from '@/lib/media';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';
import ThemeIcon from '@/components/ui/ThemeIcon';

export async function generateMetadata() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings } = await getTemplateLayout(tenantHost, isStandalone).catch(() => ({ settings: null }));
  const schoolName = settings?.site_title || 'Notices';

  return {
    title: `Notice Board — ${schoolName}`,
    description: 'Official academic notices, parent circulars, holidays, and announcements.',
  };
}

export default async function NoticePage() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation } = await getTemplateLayout(tenantHost, isStandalone);

  const [rawNotices, rawBoardNotices] = await Promise.all([
    storio.getNotices(tenantHost).catch(() => null),
    getBoardNotices(tenantHost).catch(() => null),
  ]);

  const notices: StorioNotice[] =
    Array.isArray(rawNotices) && rawNotices.length > 0
      ? rawNotices
      : isStandalone
        ? DEFAULT_DEMO_DATA.notices || []
        : [];

  const boardNotices: StorioBoardNotice[] =
    Array.isArray(rawBoardNotices) && rawBoardNotices.length > 0
      ? rawBoardNotices
      : isStandalone
        ? DEFAULT_DEMO_DATA.boardNotices || []
        : [];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-pink-100 selection:text-pink-700">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-pastel-purple pt-8 pb-6 sm:pt-10 sm:pb-8 border-b border-purple-100">
          <div className="site-container px-4 sm:px-8 relative z-10 text-center">
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
                <ThemeIcon name="megaphone-notice" size={48} className="mx-auto mb-3" />
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
                          <ThemeIcon name="document-paper" size={14} />
                        </a>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Board Notices Section */}
        {boardNotices.length > 0 && (
          <section className="py-6 sm:py-8 bg-pastel-purple/40 border-t border-purple-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white text-secondary-color border border-amber-200 shadow-2xs mb-2">
                    Official Board Notifications
                  </span>
                  <h2 className="text-2xl font-bold font-fredoka text-gray-900">
                    Education Board Circulars
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {boardNotices.map((bn, idx) => (
                  <a
                    key={idx}
                    href={bn.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-5 rounded-2xl bg-white border border-purple-100 hover:border-pink-300 hover:shadow-md transition-all flex items-start justify-between gap-4 group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {bn.board_name && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-primary-color px-2 py-0.5 rounded-full">
                            {bn.board_name} Board
                          </span>
                        )}
                        {bn.publish_date && (
                          <span className="text-xs text-gray-500 font-medium">
                            {bn.publish_date}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary-color transition-colors leading-snug">
                        {bn.title}
                      </h3>
                    </div>
                    <span className="text-primary-color text-sm shrink-0 mt-1 font-bold group-hover:translate-x-0.5 transition-transform">
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer settings={settings} />
    </div>
  );
}
