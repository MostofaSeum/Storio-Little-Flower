import React from 'react';
import { StorioGalleryItem } from '@storio/template-sdk';
import { LittleFlowersCustomizationConfig } from '@/types';
import SplitText from '@/components/ui/SplitText';
import InteractiveGallery from '@/components/sections/InteractiveGallery';

interface GallerySectionProps {
  items: StorioGalleryItem[];
  siteTitle?: string;
  customization?: LittleFlowersCustomizationConfig | null;
}

export default function GallerySection({ items, siteTitle, customization }: GallerySectionProps) {
  if (!items || items.length === 0) return null;

  const defaultHeading = siteTitle ? `Life at ${siteTitle}` : 'Life at Our School';
  const badgeText = customization?.gallery_section_badge || "Happy Memories";
  const titleText = customization?.gallery_section_title || defaultHeading;
  const subtitleText = customization?.gallery_section_subtitle || "Click on any moment to zoom and view details";
  const viewAllText = customization?.gallery_view_all_text || "Explore Full Gallery";

  return (
    <section
      id="gallery"
      className="site-section-py site-section-px site-container w-full"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-12 reveal-on-scroll">
        <div>
          <span
            className="text-xs font-extrabold tracking-wider uppercase text-accent-blue bg-sky-100 px-3 py-1 rounded-full"
            data-customizer-field="gallery_section_badge"
            data-customizer-title="Gallery Section Badge"
          >
            {badgeText}
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold mt-3 font-fredoka"
            data-customizer-field="gallery_section_title"
            data-customizer-title="Gallery Section Title"
          >
            <SplitText
              text={titleText}
              tag="span"
              splitType="chars"
              delay={30}
              duration={0.7}
              ease="power3.out"
              className="inline-block"
            />
          </h2>
          <p
            className="text-gray-500 text-sm mt-1 font-medium"
            data-customizer-field="gallery_section_subtitle"
            data-customizer-title="Gallery Section Subtitle"
          >
            {subtitleText}
          </p>
        </div>
        <a
          href="/gallery/photos"
          className="text-xs sm:text-sm font-bold text-primary-color hover:text-accent-pink transition-colors inline-flex items-center gap-1 group"
          data-customizer-field="gallery_view_all_text"
          data-customizer-title="Gallery View All Button Text"
        >
          <span>{viewAllText}</span>
        </a>
      </div>

      {/* Interactive Lightbox Gallery */}
      <InteractiveGallery items={items} />
    </section>
  );
}
