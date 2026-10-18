import React from 'react';
import { StorioEvent, LittleFlowersCustomizationConfig } from '@/types';
import LiveText from '@/components/ui/LiveText';
import SplitText from '@/components/ui/SplitText';
import AccordionGallery from '@/components/sections/AccordionGallery';

interface EventsSectionProps {
  events: StorioEvent[];
  customization?: LittleFlowersCustomizationConfig | null;
}

export default function EventsSection({ events, customization }: EventsSectionProps) {
  if (!events || events.length === 0) return null;

  return (
    <section id="events" className="site-section-py site-section-px">
      <div className="site-container">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12 reveal-on-scroll">
          <div>
            <span
              className="text-xs font-extrabold tracking-wider uppercase text-secondary-color bg-amber-100 px-3.5 py-1 rounded-full shadow-xs"
              data-customizer-field="events_section_badge"
              data-customizer-title="Events Section Badge"
            >
              <LiveText field="events_section_badge" initial={customization?.events_section_badge} fallback="Campus Life & Gatherings" />
            </span>
            <h2
              className="text-3xl sm:text-4xl font-extrabold mt-3 font-fredoka"
              data-customizer-field="events_section_title"
              data-customizer-title="Events Section Title"
            >
              <SplitText
                field="events_section_title"
                initial={customization?.events_section_title}
                fallback="Upcoming Events & Celebrations"
                tag="span"
                splitType="words, chars"
                delay={30}
                duration={0.7}
                ease="power3.out"
                className="inline-block"
              />
            </h2>
            <p
              className="text-gray-500 text-sm mt-1 font-medium"
              data-customizer-field="events_section_subtitle"
              data-customizer-title="Events Section Subtitle"
            >
              <LiveText field="events_section_subtitle" initial={customization?.events_section_subtitle} fallback="Hover over any event card to view the schedule, venue, and program overview." />
            </p>
          </div>
          <a
            href="/event"
            className="text-xs sm:text-sm font-bold text-primary-color hover:text-accent-pink transition-colors inline-flex items-center gap-1 group"
            data-customizer-field="events_view_all_text"
            data-customizer-title="Events View All Button Text"
          >
            <span>
              <LiveText field="events_view_all_text" initial={customization?.events_view_all_text} fallback="Full School Calendar" />
            </span>
          </a>
        </div>

        {/* React Bits Style Accordion Gallery */}
        <div className="reveal-on-scroll delay-150">
          <AccordionGallery events={events} />
        </div>
      </div>
    </section>
  );
}
