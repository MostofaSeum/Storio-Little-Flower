import { StorioNotice, StorioHeroSlide, StorioSettingsResponse, StorioLayoutResponse } from '@storio/template-sdk';

/**
 * DEFAULT_DEMO_DATA
 * 
 * Local fallback mock data used ONLY when running in Standalone Preview mode (e.g., localhost:3000)
 * and the SDK returns null or empty data.
 * 
 * RULE 1 REMINDER:
 * - Standalone Preview (localhost): Fallback to DEFAULT_DEMO_DATA if SDK data is empty.
 * - Live Tenant Domain (school.com): NEVER show DEFAULT_DEMO_DATA. Display empty state if DB has 0 items.
 */
export const DEFAULT_DEMO_DATA: {
  settings: StorioSettingsResponse;
  notices: StorioNotice[];
  heroSlides: StorioHeroSlide[];
  layout?: StorioLayoutResponse;
} = {
  settings: {
    site_title: "Little Flowers",
    site_tagline: "Inspiring Little Minds Every Day",
    contact_email: "info@example.com",
    phone_number: "+1 8 888 567.890.03",
    mailing_address: "74 Blossom Street, Sunshine Valley",
    social_links: [
      { platform: "facebook", url: "https://facebook.com" },
      { platform: "twitter", url: "https://twitter.com" },
      { platform: "instagram", url: "https://instagram.com" },
      { platform: "linkedin", url: "https://linkedin.com" },
    ],
  },
  notices: [
    {
      id: 1,
      title: "Playgroup & Kindergarten Admissions Open for 2026-2027",
      slug: "admissions-open-2026",
      content: "Admissions are now open for new junior learners. Schedule a campus visit today!",
      published_date: "2026-09-15",
      is_urgent: true,
    },
    {
      id: 2,
      title: "Annual Little Flowers Art & Craft Carnival",
      slug: "art-carnival-2026",
      content: "Join us this Saturday for colors, fun games, and creative exhibitions by our tiny artists.",
      published_date: "2026-09-20",
      is_urgent: false,
    },
    {
      id: 3,
      title: "Grandparents Day Celebration & Puppet Show",
      slug: "grandparents-day",
      content: "A special day welcoming grandparents for music, stories, and puppet theater.",
      published_date: "2026-09-25",
      is_urgent: false,
    },
  ],
  heroSlides: [
    {
      id: 1,
      title: "Practical teaching &",
      subtitle: "Social Development",
      image_url: "/homepage/H1.webp",
      button_text: "Learn More",
      button_url: "/about",
      order: 1,
    },
  ],
};
