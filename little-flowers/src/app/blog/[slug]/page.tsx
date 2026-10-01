import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { storio, StorioBlogPost } from '@storio/template-sdk';
import { getTenantContext, getTemplateLayout, getBlogPostImageUrl } from '@/lib/storio';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const { tenantHost, isStandalone } = await getTenantContext();
  const [{ settings }, rawPost] = await Promise.all([
    getTemplateLayout(tenantHost, isStandalone).catch(() => ({ settings: null })),
    storio.getBlogDetail(slug, tenantHost),
  ]);
  const post = rawPost || (isStandalone ? DEFAULT_DEMO_DATA.blogs?.find((b) => b.slug === slug) : null);
  const schoolName = settings?.site_title || 'Kindergarten';

  if (!post) {
    return {
      title: `Article Not Found — ${schoolName}`,
    };
  }

  return {
    title: `${post.title} — ${schoolName}`,
    description: post.summary || `Read ${post.title} on ${schoolName} blog.`,
  };
}

/**
 * ============================================================================
 * Blog Detail Page (/blog/[slug])
 * ============================================================================
 * Implements:
 *   GET /api/v2/template/blogs/${slug}/ — storio.getBlogDetail(slug, tenantHost)
 *
 * Follows Storio Rule 1:
 * - Standalone Preview (localhost without linked tenant):
 *   falls back to DEFAULT_DEMO_DATA.blogs matching slug or first item.
 * - Live Tenant Domain:
 *   strictly calls SDK. If not found in DB, returns 404 (NEVER leaks mock data).
 * ============================================================================
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // 1. Resolve host and tenant context following Storio Rule 1
  const { tenantHost, isStandalone } = await getTenantContext();

  // 2. Fetch layout, customization configs, and navigation
  const { settings, customization, navigation } = await getTemplateLayout(
    tenantHost,
    isStandalone
  );

  // 3. Fetch real article via SDK
  const rawArticle: StorioBlogPost | null = await storio.getBlogDetail(slug, tenantHost);

  // 4. Apply Storio Rule 1 fallback
  const article: StorioBlogPost | null =
    rawArticle ||
    (isStandalone
      ? DEFAULT_DEMO_DATA.blogs?.find((b) => b.slug === slug) ||
        DEFAULT_DEMO_DATA.blogs?.[0] ||
        null
      : null);

  if (!article) {
    notFound();
  }

  const imageUrl = getBlogPostImageUrl(article as Parameters<typeof getBlogPostImageUrl>[0]);

  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-pastel-purple text-gray-800 flex flex-col selection:bg-pink-100 selection:text-pink-700">
      {/* Dynamic CSS Variables injected from Storio CMS Customization Config */}
      <DynamicThemeStyles customization={customization} />

      {/* 1. Header Navigation */}
      <InteractiveHeader settings={settings} navigation={navigation} />

      {/* 2. Main Blog Article Container */}
      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Navigation Button */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary-color transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to all articles</span>
            </Link>
          </div>

          <article className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-purple-50">
            {/* Meta Category & Published Date */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {article.category_name && (
                <span className="bg-purple-100 text-primary-color text-xs font-bold px-3 py-1 rounded-full">
                  {article.category_name}
                </span>
              )}
              {formattedDate && (
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formattedDate}
                </span>
              )}
            </div>

            {/* Article Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
              {article.title}
            </h1>

            {/* Lead Summary */}
            {article.summary && (
              <p className="text-base sm:text-lg text-gray-600 italic border-l-4 border-primary-color pl-4 mb-8 leading-relaxed">
                {article.summary}
              </p>
            )}

            {/* Featured Image */}
            {imageUrl && (
              <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden mb-10 shadow-sm bg-purple-50">
                <img
                  src={imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Content / HTML Body */}
            <div
              className="prose prose-purple max-w-none text-gray-700 leading-relaxed text-base sm:text-lg space-y-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-8 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mt-6 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:list-inside [&>ul]:space-y-2 [&>ul]:my-4"
              dangerouslySetInnerHTML={{
                __html: article.content || article.summary || '<p>No additional content provided.</p>',
              }}
            />

            {/* Bottom Actions */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/admission"
                className="px-6 py-3 rounded-full bg-primary-color text-white font-semibold text-sm hover:bg-primary-hover shadow-sm transition-all"
              >
                Apply for Admission &rarr;
              </Link>
            </div>
          </article>
        </div>
      </main>

      {/* 3. Footer */}
      <Footer settings={settings} />
    </div>
  );
}
