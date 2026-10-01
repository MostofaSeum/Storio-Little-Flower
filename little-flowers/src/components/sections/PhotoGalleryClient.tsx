'use client';

import React, { useState, useMemo } from 'react';
import { resolveMediaUrl } from '@/lib/media';

export interface BackendAlbum {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent?: number | null;
  total_images?: number;
  cover_image_url?: string;
}

export interface BackendPhotoItem {
  id: number;
  media?: number | string;
  image_title?: string;
  caption?: string;
  alt_text?: string;
  album?: number | null;
  album_name?: string | null;
  media_data?: {
    file?: string;
    file_name?: string;
    alt_text?: string | null;
  };
}

interface PhotoGalleryClientProps {
  albums: BackendAlbum[];
  photos: BackendPhotoItem[];
}

export default function PhotoGalleryClient({ albums, photos }: PhotoGalleryClientProps) {
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | 'all' | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<BackendPhotoItem | null>(null);

  // Map each album to its cover image (from album.cover_image_url or first photo inside that album)
  const albumsWithDetails = useMemo(() => {
    return albums.map((album) => {
      const albumPhotos = photos.filter((p) => p.album === album.id);
      let coverUrl = album.cover_image_url ? resolveMediaUrl(album.cover_image_url) : '';

      if (!coverUrl && albumPhotos.length > 0) {
        const firstPhoto = albumPhotos[0];
        const rawFile = firstPhoto.media_data?.file || (typeof firstPhoto.media === 'string' ? firstPhoto.media : '');
        coverUrl = resolveMediaUrl(rawFile);
      }

      return {
        ...album,
        computedCover: coverUrl,
        computedCount: album.total_images ?? albumPhotos.length,
      };
    });
  }, [albums, photos]);

  // Selected album object
  const currentAlbum = useMemo(() => {
    if (selectedAlbumId === 'all' || selectedAlbumId === null) return null;
    return albumsWithDetails.find((a) => a.id === selectedAlbumId) || null;
  }, [selectedAlbumId, albumsWithDetails]);

  // Photos to display based on selection
  const displayedPhotos = useMemo(() => {
    if (selectedAlbumId === null) return [];
    if (selectedAlbumId === 'all') return photos;
    return photos.filter((p) => p.album === selectedAlbumId);
  }, [selectedAlbumId, photos]);

  const getPhotoUrl = (item: BackendPhotoItem) => {
    const rawFile = item.media_data?.file || (typeof item.media === 'string' ? item.media : '');
    return resolveMediaUrl(rawFile);
  };

  /**
   * Smart caption cleaner:
   * 1. Detects raw file extensions (.webp, .jpg, .png, etc.) and ignores them.
   * 2. Cleans raw hash suffixes if any.
   * 3. Returns null if there is no real title/caption so cards remain clean.
   */
  const formatDisplayTitle = (rawTitle?: string | null): string | null => {
    if (!rawTitle) return null;
    const trimmed = rawTitle.trim();
    // If it looks like a filename, don't show it as a caption
    if (/\.(webp|jpg|jpeg|png|gif|svg|avif)$/i.test(trimmed)) {
      return null;
    }
    // Filter out common automated upload names like "images_2", "img8_NaWptjY"
    if (/^(image|images|img|photo|dsc)[\-_0-9a-zA-Z]*$/i.test(trimmed)) {
      return null;
    }
    return trimmed;
  };

  return (
    <div className="site-container px-4 sm:px-8 py-6 sm:py-8">
      {/* VIEW 1: ALBUM CARDS GRID (When no album is selected) */}
      {selectedAlbumId === null ? (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-gray-900">
                Explore Photo Albums
              </h2>
              <p className="text-sm text-gray-500 font-quicksand mt-1">
                Select an album to browse all memorable captures.
              </p>
            </div>

            {/* Quick button to view all photos directly */}
            {photos.length > 0 && (
              <button
                onClick={() => setSelectedAlbumId('all')}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-primary-color hover:bg-primary-color hover:text-white transition-all duration-300 border border-purple-200 shadow-2xs cursor-pointer self-start sm:self-auto"
              >
                <span>View All Photos ({photos.length})</span>
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}
          </div>

          {albumsWithDetails.length === 0 ? (
            <div className="text-center py-16 px-4 bg-pastel-purple rounded-3xl border border-purple-100">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-purple-100/70 text-primary-color flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold font-fredoka text-gray-800 mb-2">No Albums Found</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                No dedicated albums have been created yet. You can still browse all uploaded photos.
              </p>
              {photos.length > 0 && (
                <button
                  onClick={() => setSelectedAlbumId('all')}
                  className="px-6 py-2.5 rounded-full text-sm font-bold bg-primary-color text-white hover:bg-opacity-90 transition-all cursor-pointer"
                >
                  View All Photos ({photos.length})
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {albumsWithDetails.map((album, idx) => (
                <div
                  key={album.id}
                  onClick={() => setSelectedAlbumId(album.id)}
                  className="group bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col transform hover:-translate-y-1.5 reveal-on-scroll"
                  style={{
                    borderRadius: 'var(--site-card-radius, 1.5rem)',
                    transitionDelay: `${(idx % 3) * 120}ms`,
                  }}
                >
                  {/* Cover Image Container */}
                  <div className="relative aspect-16/10 bg-purple-50 overflow-hidden">
                    {album.computedCover ? (
                      <img
                        src={album.computedCover}
                        alt={album.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-purple-300 bg-linear-to-br from-purple-50 to-pink-50">
                        <svg className="w-10 h-10 mb-2 text-purple-300" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-semibold text-purple-400">Empty Album</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-linear-to-t from-gray-950/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Badge: Photo count */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-primary-color" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{album.computedCount} {album.computedCount === 1 ? 'photo' : 'photos'}</span>
                      </span>
                    </div>

                    {/* Album Title overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold font-fredoka leading-snug drop-shadow-sm group-hover:text-pink-200 transition-colors">
                        {album.name}
                      </h3>
                    </div>
                  </div>

                  {/* Album Details Footer */}
                  <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                    <p className="text-sm text-gray-600 line-clamp-2 font-quicksand">
                      {album.description || 'Browse high resolution memories and highlights captured inside this album.'}
                    </p>

                    <div className="mt-4 pt-3 border-t border-purple-50 flex items-center justify-between">
                      <span className="text-xs font-bold text-primary-color group-hover:underline flex items-center gap-1">
                        <span>Open Album</span>
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                      <span className="text-xs text-gray-400 font-medium">Click to view</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* VIEW 2: ALBUM PHOTOS DRILL-DOWN (When user clicks an album) */
        <div>
          {/* Navigation header with back button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-purple-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedAlbumId(null)}
                className="w-10 h-10 rounded-full bg-purple-50 text-primary-color hover:bg-primary-color hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xs shrink-0"
                title="Back to Albums"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedAlbumId(null)}
                    className="text-xs uppercase tracking-wider font-bold text-gray-400 hover:text-primary-color cursor-pointer transition-colors"
                  >
                    Albums
                  </button>
                  <span className="text-xs text-gray-400">/</span>
                  <span className="text-xs uppercase tracking-wider font-bold text-primary-color">
                    {selectedAlbumId === 'all' ? 'All Photos' : currentAlbum?.name}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-gray-900 mt-0.5">
                  {selectedAlbumId === 'all' ? 'All Photos' : currentAlbum?.name}
                </h2>
              </div>
            </div>

            {/* Quick album switcher tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              <button
                onClick={() => setSelectedAlbumId('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedAlbumId === 'all'
                    ? 'bg-primary-color text-white shadow-2xs'
                    : 'bg-purple-50 text-gray-700 hover:bg-purple-100'
                }`}
              >
                All ({photos.length})
              </button>
              {albumsWithDetails.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAlbumId(a.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedAlbumId === a.id
                      ? 'bg-primary-color text-white shadow-2xs'
                      : 'bg-purple-50 text-gray-700 hover:bg-purple-100'
                  }`}
                >
                  {a.name} ({a.computedCount})
                </button>
              ))}
            </div>
          </div>

          {currentAlbum?.description && (
            <p className="text-gray-600 font-quicksand mb-8 max-w-3xl -mt-2">
              {currentAlbum.description}
            </p>
          )}

          {/* Photos Grid */}
          {displayedPhotos.length === 0 ? (
            <div className="text-center py-16 px-4 bg-pastel-purple rounded-3xl border border-purple-100">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-purple-100/70 text-primary-color flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold font-fredoka text-gray-800 mb-2">No Photos in this Album</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                Photos added to this album will appear right here.
              </p>
              <button
                onClick={() => setSelectedAlbumId(null)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-primary-color text-white hover:bg-opacity-90 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Albums</span>
              </button>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {displayedPhotos.map((item, idx) => {
                const imgUrl = getPhotoUrl(item);
                const rawTitle = item.caption || item.image_title || item.alt_text;
                const cleanTitle = formatDisplayTitle(rawTitle);
                const staggerDelay = (idx % 4) * 100;

                return (
                  <div
                    key={item.id}
                    onClick={() => setLightboxPhoto(item)}
                    className="break-inside-avoid group rounded-3xl overflow-hidden bg-white border border-purple-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col cursor-pointer transform hover:-translate-y-1.5 reveal-on-scroll"
                    style={{
                      borderRadius: 'var(--site-card-radius, 1.5rem)',
                      transitionDelay: `${staggerDelay}ms`,
                    }}
                  >
                    <div className="relative overflow-hidden bg-purple-50">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={cleanTitle || 'Campus Moment'}
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out block"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full aspect-4/3 flex items-center justify-center text-purple-300">
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}

                      {/* Hover Overlay with soft zoom indicator */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                        <div className="self-end">
                          <span className="w-9 h-9 rounded-full bg-white/90 text-gray-900 flex items-center justify-center shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </span>
                        </div>
                        {cleanTitle && (
                          <p className="text-white text-xs font-bold line-clamp-2 drop-shadow-sm transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                            {cleanTitle}
                          </p>
                        )}
                      </div>

                      {item.album_name && selectedAlbumId === 'all' && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-primary-color shadow-2xs">
                          {item.album_name}
                        </span>
                      )}
                    </div>

                    {/* Card bottom text (only rendered when there is a real, non-filename caption) */}
                    {cleanTitle && (
                      <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                        <h4 className="font-bold text-sm text-gray-900 line-clamp-2">
                          {cleanTitle}
                        </h4>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <button
            onClick={() => setLightboxPhoto(null)}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/20 text-white hover:bg-white/40 flex items-center justify-center cursor-pointer transition-colors z-60"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl max-h-[90vh] flex flex-col items-center justify-center relative"
          >
            <img
              src={getPhotoUrl(lightboxPhoto)}
              alt={lightboxPhoto.caption || lightboxPhoto.image_title || 'Photo Preview'}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            {formatDisplayTitle(lightboxPhoto.caption || lightboxPhoto.image_title) && (
              <div className="mt-4 text-center px-4">
                <p className="text-white text-base sm:text-lg font-bold font-fredoka">
                  {formatDisplayTitle(lightboxPhoto.caption || lightboxPhoto.image_title)}
                </p>
                {lightboxPhoto.album_name && (
                  <span className="inline-block mt-1 text-xs text-pink-300 font-semibold uppercase tracking-wider">
                    {lightboxPhoto.album_name}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
