import React from 'react';
import { StorioGalleryItem } from '@storio/template-sdk';
import SplitText from '@/components/ui/SplitText';
import InteractiveGallery from '@/components/sections/InteractiveGallery';

interface GallerySectionProps {
  items: StorioGalleryItem[];
  siteTitle?: string;
}

export default function GallerySection({ items, siteTitle }: GallerySectionProps) {
  if (!items || items.length === 0) return null;

  const galleryHeading = siteTitle ? `Life at ${siteTitle}` : 'Life at Our School';

  return (
    <section
      id="gallery"
      className="site-section-py site-section-px site-container w-full"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-12 reveal-on-scroll">
        <div>
          <span className="text-xs font-extrabold tracking-wider uppercase text-accent-blue bg-sky-100 px-3 py-1 rounded-full">
            Happy Memories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 font-fredoka">
            <SplitText
              text={galleryHeading}
              tag="span"
              splitType="chars"
              delay={30}
              duration={0.7}
              ease="power3.out"
              className="inline-block"
            />
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Click on any moment to zoom and view details
          </p>
        </div>
        <a
          href="/gallery/photos"
          className="text-xs sm:text-sm font-bold text-primary-color hover:text-accent-pink transition-colors inline-flex items-center gap-1 group"
        >
          <span>Explore Full Gallery</span>
        </a>
      </div>

      {/* Interactive Lightbox Gallery */}
      <InteractiveGallery items={items} />
    </section>
  );
}
