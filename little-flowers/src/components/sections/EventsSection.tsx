import React from 'react';
import { StorioEvent } from '@/types';
import SplitText from '@/components/ui/SplitText';
import AccordionGallery from '@/components/sections/AccordionGallery';

interface EventsSectionProps {
  events: StorioEvent[];
}

export default function EventsSection({ events }: EventsSectionProps) {
  if (!events || events.length === 0) return null;

  return (
    <section id="events" className="py-20 px-4 sm:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12 reveal-on-scroll">
          <div>
            <span className="text-xs font-extrabold tracking-wider uppercase text-secondary-color bg-amber-100 px-3.5 py-1 rounded-full shadow-xs">
              Campus Life & Gatherings
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-color mt-3 font-fredoka">
              <SplitText
                text="Upcoming Events & Celebrations"
                tag="span"
                splitType="words, chars"
                delay={30}
                duration={0.7}
                ease="power3.out"
                className="inline-block"
              />
            </h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              Hover over any event card to view the schedule, venue, and program overview.
            </p>
          </div>
          <a
            href="/events"
            className="text-xs sm:text-sm font-bold text-primary-color hover:text-accent-pink transition-colors inline-flex items-center gap-1 group"
          >
            <span>Full School Calendar</span>
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
