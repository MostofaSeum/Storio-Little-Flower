import React from 'react';
import { notFound } from 'next/navigation';
import { getTenantContext, getTemplateLayout, getPageBySlug } from '@/lib/storio';
import { resolveMediaUrl } from '@/lib/media';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';

interface CustomPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CustomPageProps) {
  const { slug } = await params;
  const { tenantHost, isStandalone } = await getTenantContext();
  const [{ settings }, page] = await Promise.all([
    getTemplateLayout(tenantHost, isStandalone).catch(() => ({ settings: null })),
    getPageBySlug(slug, tenantHost).catch(() => null),
  ]);

  const schoolName = settings?.site_title || 'Kindergarten & School';

  if (!page) {
    return {
      title: `Page Not Found — ${schoolName}`,
    };
  }

  return {
    title: `${page.meta_title || page.title} — ${schoolName}`,
    description: page.meta_description || `Read ${page.title} at ${schoolName}.`,
  };
}

export default async function CustomDynamicPage({ params }: CustomPageProps) {
  const { slug } = await params;
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation, importantLinks } = await getTemplateLayout(
    tenantHost,
    isStandalone
  );

  const page = await getPageBySlug(slug, tenantHost).catch(() => null);

  if (!page) {
    notFound();
  }

  const featuredImg = page.featured_image ? resolveMediaUrl(page.featured_image) : null;

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-pink-100 selection:text-pink-700">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-pastel-purple pt-8 pb-6 sm:pt-10 sm:pb-8 border-b border-purple-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 relative z-10 text-center">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-fredoka text-gray-900 leading-tight">
              <SplitText
                text={page.title}
                className="inline-block text-primary-color"
                tag="span"
                triggerOnMount={true}
              />
            </h1>
          </div>
        </section>

        {/* Page Content Body */}
        <article className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          {featuredImg && (
            <div className="mb-8 rounded-3xl overflow-hidden shadow-md border border-purple-100 max-h-[460px]">
              <img
                src={featuredImg}
                alt={page.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {typeof page.content === 'string' ? (
            <div
              className="prose prose-purple max-w-none font-quicksand text-gray-700 text-base sm:text-lg leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          ) : (
            <div className="font-quicksand text-gray-700 text-base leading-relaxed">
              <pre className="p-4 bg-purple-50 rounded-2xl overflow-auto text-xs">
                {JSON.stringify(page.content, null, 2)}
              </pre>
            </div>
          )}
        </article>
      </main>

      <Footer settings={settings} importantLinks={importantLinks} />
    </div>
  );
}
