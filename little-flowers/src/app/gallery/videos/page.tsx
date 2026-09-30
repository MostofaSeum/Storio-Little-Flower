import React from 'react';
import Link from 'next/link';
import { storio } from '@storio/template-sdk';
import { getTenantContext, getTemplateLayout } from '@/lib/storio';
import { resolveMediaUrl } from '@/lib/media';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';

interface StorioReelItem {
  id: number;
  title: string;
  description?: string;
  reel_type?: string;
  platform?: string;
  url?: string;
  thumbnail_url?: string;
  views_count?: number;
  likes_count?: number;
  is_featured?: boolean;
}

export const metadata = {
  title: 'Video Gallery — Little Flowers',
  description: 'Watch video highlights, performances, and fun campus activities.',
};

export default async function VideosGalleryPage() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation } = await getTemplateLayout(tenantHost, isStandalone);

  const rawReels = await storio.apiFetch<StorioReelItem[]>(
    '/api/v2/template/reels/',
    { tenantHost }
  );

  const videos: StorioReelItem[] = Array.isArray(rawReels) ? rawReels : [];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-pink-100 selection:text-pink-700">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-pastel-purple py-12 sm:py-16 border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-white text-primary-color border border-purple-200 shadow-2xs mb-4">
              <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse" />
              Video Highlights
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-fredoka text-gray-900 leading-tight">
              <SplitText
                text="Video Gallery"
                className="inline-block text-primary-color"
                tag="span"
              />
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed font-quicksand max-w-2xl mx-auto">
              Engaging reels, student performances, and recorded highlights from our vibrant community.
            </p>
          </div>
        </section>

        {/* Video Grid */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            {videos.length === 0 ? (
              <div className="text-center py-16 px-4 bg-pastel-purple rounded-3xl border border-purple-100">
                <span className="text-4xl block mb-3">🎬</span>
                <h3 className="text-xl font-bold font-fredoka text-gray-800 mb-2">No Videos Found</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Videos and reels will be displayed here as soon as they are added in the media library.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map((vid) => {
                  const thumb = vid.thumbnail_url ? resolveMediaUrl(vid.thumbnail_url) : null;
                  const isDirectVideo = vid.url && (vid.url.endsWith('.mp4') || vid.url.endsWith('.webm'));
                  const isYouTube = vid.platform === 'youtube' || (vid.url && vid.url.includes('youtube.com'));

                  return (
                    <div
                      key={vid.id}
                      className="bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                    >
                      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                        {isDirectVideo && vid.url ? (
                          <video
                            controls
                            poster={thumb || undefined}
                            className="w-full h-full object-cover"
                            preload="metadata"
                          >
                            <source src={resolveMediaUrl(vid.url)} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : isYouTube && vid.url ? (
                          <iframe
                            src={vid.url.replace('watch?v=', 'embed/')}
                            title={vid.title}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : thumb ? (
                          <a
                            href={vid.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-full relative group block"
                          >
                            <img
                              src={thumb}
                              alt={vid.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-white/90 text-primary-color flex items-center justify-center text-xl shadow-md">
                                ▶
                              </div>
                            </div>
                          </a>
                        ) : (
                          <div className="text-white text-3xl">🎥</div>
                        )}
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold font-fredoka text-gray-900 mb-2">
                            {vid.title}
                          </h3>
                          {vid.description && (
                            <p className="text-sm text-gray-600 line-clamp-3 font-quicksand">
                              {vid.description}
                            </p>
                          )}
                        </div>

                        {vid.url && (
                          <div className="mt-4 pt-3 border-t border-purple-50 flex items-center justify-end">
                            <a
                              href={resolveMediaUrl(vid.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-color hover:underline"
                            >
                              <span>Watch Video</span>
                              <span>↗</span>
                            </a>
                          </div>
                        )}
                      </div>
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
