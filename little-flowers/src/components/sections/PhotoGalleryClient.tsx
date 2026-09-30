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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-primary-color hover:bg-primary-color hover:text-white transition-all duration-300 border border-purple-200 shadow-2xs cursor-pointer self-start sm:self-auto"
              >
                <span>View All Photos ({photos.length})</span>
                <span>→</span>
              </button>
            )}
          </div>

          {albumsWithDetails.length === 0 ? (
            <div className="text-center py-16 px-4 bg-pastel-purple rounded-3xl border border-purple-100">
              <span className="text-4xl block mb-3">📁</span>
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
              {albumsWithDetails.map((album) => (
                <div
                  key={album.id}
                  onClick={() => setSelectedAlbumId(album.id)}
                  className="group bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col transform hover:-translate-y-1"
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
                        <span className="text-4xl mb-1">🖼️</span>
                        <span className="text-xs font-semibold text-purple-400">Empty Album</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-linear-to-t from-gray-950/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Badge: Photo count */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1.5">
                        <span>📷</span>
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
                        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
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
                className="w-10 h-10 rounded-full bg-purple-50 text-primary-color hover:bg-primary-color hover:text-white flex items-center justify-center text-lg font-bold transition-all duration-200 cursor-pointer shadow-2xs shrink-0"
                title="Back to Albums"
              >
                ←
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
              <span className="text-4xl block mb-3">📷</span>
              <h3 className="text-xl font-bold font-fredoka text-gray-800 mb-2">No Photos in this Album</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                Photos added to this album will appear right here.
              </p>
              <button
                onClick={() => setSelectedAlbumId(null)}
                className="px-6 py-2.5 rounded-full text-sm font-bold bg-primary-color text-white hover:bg-opacity-90 transition-all cursor-pointer"
              >
                ← Back to Albums
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedPhotos.map((item) => {
                const imgUrl = getPhotoUrl(item);
                const title = item.caption || item.image_title || item.alt_text || 'Photo';

                return (
                  <div
                    key={item.id}
                    onClick={() => setLightboxPhoto(item)}
                    className="group rounded-3xl overflow-hidden bg-white border border-purple-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-purple-50">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={item.alt_text || title}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-purple-300 text-3xl">
                          📷
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="w-10 h-10 rounded-full bg-white/90 text-gray-900 flex items-center justify-center text-base shadow-md font-bold">
                          🔍
                        </span>
                      </div>

                      {item.album_name && selectedAlbumId === 'all' && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-primary-color shadow-2xs">
                          {item.album_name}
                        </span>
                      )}
                    </div>

                    {(item.caption || item.image_title) && (
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <h4 className="font-bold text-sm text-gray-900 line-clamp-2">
                          {item.caption || item.image_title}
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
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/20 text-white hover:bg-white/40 flex items-center justify-center text-2xl font-bold cursor-pointer transition-colors z-60"
            aria-label="Close"
          >
            ✕
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
            {(lightboxPhoto.caption || lightboxPhoto.image_title) && (
              <div className="mt-4 text-center px-4">
                <p className="text-white text-base sm:text-lg font-bold font-fredoka">
                  {lightboxPhoto.caption || lightboxPhoto.image_title}
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
