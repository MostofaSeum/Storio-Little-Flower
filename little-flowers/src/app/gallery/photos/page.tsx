import React from 'react';
import { getTenantContext, getTemplateLayout, getAlbums, getGallery } from '@/lib/storio';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';
import ScrollObserver from '@/components/ui/ScrollObserver';
import PhotoGalleryClient, { BackendAlbum, BackendPhotoItem } from '@/components/sections/PhotoGalleryClient';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';

export async function generateMetadata() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings } = await getTemplateLayout(tenantHost, isStandalone).catch(() => ({ settings: null }));
  const schoolName = settings?.site_title || 'Photos';

  return {
    title: `Photo Gallery & Albums — ${schoolName}`,
    description: 'Moments of discovery, friendship, learning, and celebration captured in pictures.',
  };
}

export default async function PhotosGalleryPage() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation, importantLinks } = await getTemplateLayout(tenantHost, isStandalone);

  // Fetch both albums and gallery items in parallel via storio.ts helpers
  const [rawAlbums, rawGallery] = await Promise.all([
    getAlbums(tenantHost).catch(() => null),
    getGallery(tenantHost).catch(() => null),
  ]);

  // Fall back to demo data in standalone mode when API returns null
  const demoPhotos = Array.isArray(rawGallery) && rawGallery.length > 0
    ? (rawGallery as unknown as BackendPhotoItem[])
    : (isStandalone ? DEFAULT_DEMO_DATA.gallery.map((g, i) => ({
        id: g.id,
        image_title: g.title,
        caption: g.caption,
        media_data: { file: g.image_url },
      })) : []);

  // Create albums with photos distributed across them
  const demoAlbums: BackendAlbum[] = isStandalone && DEFAULT_DEMO_DATA.albums.length > 0
    ? DEFAULT_DEMO_DATA.albums.map((album, albumIdx) => {
        const photosForAlbum = demoPhotos.filter((_, photoIdx) => photoIdx % 4 === albumIdx);
        return {
          id: album.id,
          title: album.title,
          name: album.title,
          description: album.description,
          cover_image_url: album.cover_image_url || photosForAlbum[0]?.media_data?.file || '',
          total_images: album.total_images || photosForAlbum.length,
        };
      })
    : [];

  const albums: BackendAlbum[] = Array.isArray(rawAlbums) && rawAlbums.length > 0
    ? (rawAlbums as unknown as BackendAlbum[])
    : demoAlbums;

  const photos: BackendPhotoItem[] = demoPhotos.map((photo, idx) => ({
    ...photo,
    album: (idx % 4) + 1, // Distribute photos across 4 albums
  }));

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
              School Memories
            </span>

            <h1 className="page-hero-title font-extrabold tracking-tight font-fredoka text-gray-900 leading-tight">
              <SplitText
                text="Photo Gallery"
                className="inline-block text-primary-color"
                tag="span"
              />
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed font-quicksand max-w-2xl mx-auto">
              Capturing vibrant campus life, joyous student interactions, and festive moments across our school albums.
            </p>
          </div>
        </section>

        {/* Albums & Photo Drilldown Client */}
        <PhotoGalleryClient albums={albums} photos={photos} />
      </main>

      <ScrollObserver />
      <Footer settings={settings} importantLinks={importantLinks} />
    </div>
  );
}
