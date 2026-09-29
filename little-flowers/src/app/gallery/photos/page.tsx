import React from 'react';
import Link from 'next/link';
import { storio, StorioGalleryItem } from '@storio/template-sdk';
import { getTenantContext, getTemplateLayout } from '@/lib/storio';
import { resolveMediaUrl } from '@/lib/media';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';

interface ExtendedGalleryItem extends StorioGalleryItem {
  media?: number | string;
  image_title?: string;
  caption?: string;
  alt_text?: string;
  album_name?: string;
  media_data?: {
    file?: string;
    file_name?: string;
    alt_text?: string | null;
  };
}

export const metadata = {
  title: 'Photo Gallery — Little Flowers',
  description: 'Moments of discovery, friendship, learning, and celebration captured in pictures.',
};

export default async function PhotosGalleryPage() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation } = await getTemplateLayout(tenantHost, isStandalone);

  const rawGallery = await storio.apiFetch<ExtendedGalleryItem[]>(
    '/api/v2/template/gallery/',
    { tenantHost }
  );

  const photos: ExtendedGalleryItem[] = Array.isArray(rawGallery) ? rawGallery : [];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-accent-pink selection:text-white">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-pastel-purple py-12 sm:py-16 border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-white text-primary-color border border-purple-200 shadow-2xs mb-4">
              <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse" />
              School Memories
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-fredoka text-gray-900 leading-tight">
              <SplitText
                text="Photo Gallery"
                className="inline-block text-primary-color"
                tag="span"
              />
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed font-quicksand max-w-2xl mx-auto">
              Capturing vibrant campus life, joyous student interactions, and festive moments.
            </p>
          </div>
        </section>

        {/* Photos Grid */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            {photos.length === 0 ? (
              <div className="text-center py-16 px-4 bg-pastel-purple rounded-3xl border border-purple-100">
                <span className="text-4xl block mb-3">📸</span>
                <h3 className="text-xl font-bold font-fredoka text-gray-800 mb-2">No Photos Found</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Photos will appear here as soon as they are added in the gallery manager.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {photos.map((item) => {
                  const rawFile = item.media_data?.file || (typeof item.media === 'string' ? item.media : '');
                  const imgUrl = resolveMediaUrl(rawFile);
                  const title = item.caption || item.image_title || item.alt_text || 'Photo';

                  return (
                    <div
                      key={item.id}
                      className="group rounded-3xl overflow-hidden bg-white border border-purple-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      <div className="relative aspect-4/3 overflow-hidden bg-purple-50">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={item.alt_text || title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-purple-300 text-3xl">
                            📷
                          </div>
                        )}
                        {item.album_name && (
                          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-primary-color shadow-2xs">
                            {item.album_name}
                          </span>
                        )}
                      </div>

                      {(item.caption || item.image_title) && (
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <h3 className="font-bold text-sm text-gray-900 line-clamp-2">
                            {item.caption || item.image_title}
                          </h3>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
