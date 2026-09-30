import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { storio, StorioBlogPost } from '@storio/template-sdk';
import { getTenantContext, getTemplateLayout, getBlogPostImageUrl } from '@/lib/storio';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';

export const metadata = {
  title: 'Blog & Educational Stories — Little Flowers Kindergarten',
  description: 'Read the latest articles, updates, and educational stories from Little Flowers Kindergarten.',
};

/**
 * ============================================================================
 * Blog Listing Page (/blog)
 * ============================================================================
 * Implements:
 *   GET /api/v2/template/blogs/ — storio.getBlogs(tenantHost)
 *
 * Follows Storio Rule 1:
 * - Standalone Preview (localhost without linked tenant):
 *   falls back to DEFAULT_DEMO_DATA.blogs if DB is empty.
 * - Live Tenant / Gateway Domain:
 *   displays DB items or a clean empty state (NEVER mock data).
 * ============================================================================
 */
export default async function BlogPage() {
  // 1. Resolve host and tenant context following Storio Rule 1
  const { tenantHost, isStandalone } = await getTenantContext();

  // 2. Fetch layout, customization configs, and navigation
  const { settings, customization, navigation } = await getTemplateLayout(
    tenantHost,
    isStandalone
  );

  // 3. Fetch real tenant blogs via SDK
  const rawBlogs: StorioBlogPost[] | null = await storio.getBlogs(tenantHost);

  // 4. Apply Storio Rule 1 (Tenant DB vs Standalone Mock Data Rule)
  const blogs: StorioBlogPost[] =
    Array.isArray(rawBlogs) && rawBlogs.length > 0
      ? rawBlogs
      : isStandalone
        ? DEFAULT_DEMO_DATA.blogs || []
        : [];

  return (
    <div className="min-h-screen bg-pastel-purple text-gray-800 flex flex-col selection:bg-pink-100 selection:text-pink-700">
      {/* Dynamic CSS Variables injected from Storio CMS Customization Config */}
      <DynamicThemeStyles customization={customization} />

      {/* 1. Header Navigation */}
      <InteractiveHeader settings={settings} navigation={navigation} />

      {/* 2. Main Blog Page Content */}
      <main className="flex-1 py-8 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb & Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm border border-purple-100 text-xs font-semibold text-primary-color mb-3">
              <span>🌸</span>
              <span>Our Stories & Insights</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-primary-color tracking-tight mb-3 font-fredoka">
              <SplitText
                text="Stories, News & Updates"
                tag="span"
                splitType="chars"
                delay={35}
                duration={0.8}
                ease="power3.out"
                textAlign="center"
                className="inline-block text-primary-color"
              />
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Explore insightful guides on early childhood development, exciting campus milestones, and classroom activities.
            </p>
          </div>

          {/* Blog Articles Grid or Clean Empty State */}
          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post) => {
                const imageUrl = getBlogPostImageUrl(post as Parameters<typeof getBlogPostImageUrl>[0]);
                const formattedDate = post.published_at
                  ? new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : null;

                return (
                  <article
                    key={post.id}
                    className="bg-white rounded-3xl overflow-hidden border border-purple-50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group transform hover:-translate-y-1"
                  >
                    {/* Featured Image */}
                    {imageUrl ? (
                      <div className="relative w-full h-52 bg-purple-50 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {post.category_name && (
                          <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-primary-color text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                            {post.category_name}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-44 bg-gradient-to-br from-purple-100 via-pink-50 to-amber-50 flex items-center justify-center text-4xl">
                        🎨
                      </div>
                    )}

                    {/* Content Body */}
                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                      <div>
                        {formattedDate && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{formattedDate}</span>
                          </div>
                        )}

                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary-color transition-colors line-clamp-2 mb-3">
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h2>

                        {post.summary && (
                          <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                            {post.summary}
                          </p>
                        )}
                      </div>

                      {/* Read More Link */}
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-bold text-primary-color hover:text-primary-hover group-hover:gap-3 transition-all"
                        >
                          <span>Read Full Story</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center py-16 px-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-50 text-primary-color flex items-center justify-center text-3xl">
                📖
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Articles Published Yet</h3>
              <p className="text-sm text-gray-500 mb-6">
                Our team is currently preparing inspiring stories and updates. Check back soon!
              </p>
              <Link
                href="/"
                className="inline-block px-5 py-2.5 rounded-full bg-primary-color text-white text-sm font-semibold hover:bg-primary-hover transition"
              >
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* 3. Footer */}
      <Footer settings={settings} />
    </div>
  );
}
