'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ThemeIcon from '../ui/ThemeIcon';
import DriftWall from '../ui/DriftWall';
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

  // Prepare items for DriftWall
  const driftItems = useMemo(() => {
    return items.map((item) => ({
      image: resolveImageUrl(item),
      title: item.title || item.caption || 'Campus Moment',
      originalItem: item,
    }));
  }, [items]);

  return (
    <>
      <div className="relative w-full h-[540px] sm:h-[620px] rounded-3xl overflow-hidden border border-purple-100/70 shadow-sm bg-linear-to-b from-purple-50/50 via-white to-pink-50/30">
        <DriftWall
          items={driftItems}
          columns={5}
          tileWidth={230}
          tileHeight={160}
          gap={20}
          radius={20}
          tilt={14}
          turn={-12}
          roll={0}
          perspective={1100}
          depth={100}
          speed={36}
          direction="up"
          variance={0.4}
          parallax={0.5}
          pauseOnHover={true}
          lift={56}
          fade={0.65}
          dim={0.7}
          grayscale={false}
          overlayColor="#4a154b"
          onTileClick={(tile) => {
            const raw = (tile as unknown as { originalItem?: StorioGalleryItem })?.originalItem;
            if (raw) {
              setSelectedItem(raw);
            }
          }}
        />

        {/* Ambient Floating Help Hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-20">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-primary-color shadow-md border border-purple-100">
            <span className="w-2 h-2 rounded-full bg-accent-pink animate-ping" />
            Hover to explore &bull; Click any photo to zoom
          </span>
        </div>
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
