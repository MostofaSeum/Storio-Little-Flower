import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { storio } from '@storio/template-sdk';
import { getTenantContext, getTemplateLayout } from '@/lib/storio';
import { resolveMediaUrl } from '@/lib/media';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';

interface StorioActivityDetail {
  id: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  author?: string;
  status?: string;
  status_display?: string;
  view_count?: number;
  is_featured?: boolean;
  featured_image_data?: {
    id?: number;
    file?: string;
    file_name?: string;
    file_type?: string;
    alt_text?: string | null;
  };
  gallery_images?: Array<{
    id: number;
    order?: number;
    caption?: string;
    image_details?: {
      id?: number;
      file?: string;
      file_name?: string;
      alt_text?: string | null;
    };
  }>;
  categories_data?: Array<{
    id: number;
    name: string;
    slug: string;
    description?: string;
  }>;
}

interface ActivityDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ActivityDetailPageProps) {
  const { slug } = await params;
  const { tenantHost, isStandalone } = await getTenantContext();
  const [{ settings }, activity] = await Promise.all([
    getTemplateLayout(tenantHost, isStandalone).catch(() => ({ settings: null })),
    storio.apiFetch<StorioActivityDetail>(`/api/v2/template/activities/${slug}/`, { tenantHost }).catch(() => null),
  ]);

  const schoolName = settings?.site_title || 'Learning Programs';

  if (!activity) {
    return {
      title: `Program Details — ${schoolName}`,
    };
  }

  return {
    title: `${activity.title} — Learning Programs`,
    description: activity.excerpt || activity.content?.slice(0, 160) || 'School curriculum & activity detail',
  };
}

export default async function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  const { slug } = await params;
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation } = await getTemplateLayout(tenantHost, isStandalone);

  // Fetch single activity details via /api/v2/template/activities/${slug}/
  const activity = await storio.apiFetch<StorioActivityDetail>(
    `/api/v2/template/activities/${slug}/`,
    { tenantHost }
  );

  if (!activity) {
    notFound();
  }

  const heroImage = activity.featured_image_data?.file
    ? resolveMediaUrl(activity.featured_image_data.file)
    : null;

  const categories = activity.categories_data || [];
  const galleryImages = activity.gallery_images || [];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-pink-100 selection:text-pink-700">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Breadcrumb Bar */}
        <section className="bg-pastel-purple border-b border-purple-100 py-4">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 flex items-center gap-2 text-xs font-bold text-gray-500">
            <Link href="/" className="hover:text-primary-color transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/#programs" className="hover:text-primary-color transition-colors">
              Learning Programs
            </Link>
            <span>/</span>
            <span className="text-primary-color truncate max-w-xs">{activity.title}</span>
          </div>
        </section>

        {/* Activity Details Container */}
        <article className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          {/* Categories and Status Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {categories.map((cat) => (
              <span
                key={cat.id}
                className="px-3 py-1 rounded-full text-xs font-bold bg-pastel-purple text-primary-color border border-purple-200"
              >
                {cat.name}
              </span>
            ))}
            {activity.is_featured && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary-color text-white uppercase tracking-wider">
                Featured Program
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 font-fredoka leading-tight tracking-tight mb-6">
            <SplitText
              text={activity.title}
              className="inline-block text-primary-color"
              tag="span"
            />
          </h1>

          {/* Author / Overview Meta */}
          {activity.author && (
            <p className="text-xs font-bold text-gray-400 mb-6">
              Program Director / Author: <span className="text-gray-700">{activity.author}</span>
            </p>
          )}

          {/* Featured Image */}
          {heroImage && (
            <div className="rounded-3xl overflow-hidden shadow-lg border border-purple-100 mb-10 bg-purple-50">
              <img
                src={heroImage}
                alt={activity.title}
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* Content & Excerpt */}
          <div className="prose max-w-none font-quicksand text-gray-700 leading-relaxed text-base sm:text-lg space-y-6">
            {activity.excerpt && (
              <p className="text-lg sm:text-xl font-semibold text-secondary-color border-l-4 border-secondary-color pl-4 italic">
                {activity.excerpt}
              </p>
            )}

            {activity.content ? (
              <div className="whitespace-pre-line leading-relaxed">
                {activity.content}
              </div>
            ) : (
              <p className="text-gray-400 italic">No description available for this program.</p>
            )}
          </div>

          {/* Gallery Images Associated With Activity */}
          {galleryImages.length > 0 && (
            <div className="mt-12 pt-8 border-t border-purple-100">
              <h2 className="text-2xl font-bold font-fredoka text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-accent-pink" />
                Activity Photo Gallery
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {galleryImages.map((img) => {
                  const rawPath = img.image_details?.file;
                  const imgUrl = resolveMediaUrl(rawPath);
                  if (!imgUrl) return null;

                  return (
                    <div
                      key={img.id}
                      className="group rounded-3xl overflow-hidden bg-white border border-purple-100 shadow-sm hover:shadow-lg transition-all"
                    >
                      <div className="aspect-4/3 overflow-hidden bg-purple-50">
                        <img
                          src={imgUrl}
                          alt={img.caption || activity.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      {img.caption && (
                        <p className="p-3 text-xs font-semibold text-gray-700 font-quicksand">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="mt-12 pt-6 border-t border-purple-100 flex items-center justify-end">
            <Link
              href="/admission"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-color text-white font-bold text-xs hover:opacity-90 transition-opacity shadow-md"
            >
              <span>Enroll in This Program</span>
              <span>↗</span>
            </Link>
          </div>

        </article>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
