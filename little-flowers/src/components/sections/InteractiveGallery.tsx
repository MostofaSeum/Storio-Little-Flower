'use client';

import React, { useState, useEffect } from 'react';
import ThemeIcon from '../ui/ThemeIcon';
import { StorioGalleryItem } from '@storio/template-sdk';

interface InteractiveGalleryProps {
  items: StorioGalleryItem[];
}

export default function InteractiveGallery({ items }: InteractiveGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<StorioGalleryItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'activities' | 'campus'>('all');

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null);
    };
    if (selectedItem) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedItem]);

  const displayedItems = items.slice(0, 6);

  const resolveImageUrl = (item: StorioGalleryItem): string => {
    if (item.image_url) return item.image_url;
    const mediaFile = (item as unknown as { media_data?: { file?: string } })?.media_data?.file;
    if (mediaFile) {
      return mediaFile.startsWith('http') ? mediaFile : `https://api.storio.cloud${mediaFile}`;
    }
    return '/homepage/gal1.png';
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {displayedItems.map((item, idx) => {
          const imgUrl = resolveImageUrl(item);
          return (
            <div
              key={item.id || idx}
              onClick={() => setSelectedItem(item)}
              className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 aspect-4/3 reveal-on-scroll delay-${(idx % 3) * 100 + 100} border-2 border-transparent hover:border-pink-300 transform hover:-translate-y-1.5`}
            >
              {/* Image */}
              <img
                src={imgUrl}
                alt={item.title || item.caption || 'Campus Moment'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />

            {/* Gradient Overlay & Hover Floating Action */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-5">
              <div className="self-end">
                <span className="w-9 h-9 rounded-full bg-white/90 text-primary-color backdrop-blur-md flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </span>
              </div>
              <div>
                <span className="text-white text-xs sm:text-sm font-bold block transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 drop-shadow">
                  {item.title || item.caption || 'Campus Exploration'}
                </span>
                <span className="text-[11px] text-pink-200 font-medium">Click to view full photo</span>
              </div>
            </div>

            {/* Soft corner sparkle badge */}
            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-primary-color shadow-sm backdrop-blur-sm">
                <ThemeIcon name="flower-blossom" size={12} /> Moments
              </span>
            </div>
          </div>
        );
      })}
    </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col transform transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all hover:scale-105"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative max-h-[75vh] bg-gray-950 flex items-center justify-center overflow-hidden">
              <img
                src={resolveImageUrl(selectedItem)}
                alt={selectedItem.title || 'Campus Moment'}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 bg-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-primary-color">
                  {selectedItem.title || 'Campus Experience'}
                </h3>
                {selectedItem.caption && (
                  <p className="text-xs text-gray-500 mt-1">{selectedItem.caption}</p>
                )}
              </div>
              <span className="text-xs font-bold text-accent-pink bg-pink-50 px-3 py-1.5 rounded-full">
                Photo Gallery
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
