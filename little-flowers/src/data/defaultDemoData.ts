import {
  StorioNotice,
  StorioHeroSlide,
  StorioSettingsResponse,
  StorioLayoutResponse,
  StorioStaffMember,
  StorioGalleryItem,
} from '@storio/template-sdk';
import {
  StorioInstitutionProfile,
  StorioActivityItem,
  StorioPromotion,
} from '@/data/storioExtendedTypes';

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
  institutionProfile: StorioInstitutionProfile;
  activities: StorioActivityItem[];
  staff: StorioStaffMember[];
  gallery: StorioGalleryItem[];
  promotions: StorioPromotion[];
  testimonials: Array<{ id: number; name: string; role: string; quote: string; rating: number; avatar_url?: string }>;
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
    {
      id: 4,
      title: "Autumn Term Health Checkup & Pediatric Screening",
      slug: "health-checkup-autumn",
      content: "Visiting pediatric specialists will conduct annual dental, vision, and growth screenings for all learners.",
      published_date: "2026-09-28",
      is_urgent: true,
    },
    {
      id: 5,
      title: "Little Farmers Gardening Day & Seed Planting",
      slug: "gardening-day-2026",
      content: "Children will explore nature, plant flower saplings, and learn about caring for our green earth.",
      published_date: "2026-10-02",
      is_urgent: false,
    },
    {
      id: 6,
      title: "Parent-Teacher Developmental Progress Meeting",
      slug: "ptm-development-progress",
      content: "One-on-one personalized meetings with class mentors to review cognitive and social milestones.",
      published_date: "2026-10-08",
      is_urgent: false,
    },
  ],
  heroSlides: [
    {
      id: 1,
      title: "Practical teaching &",
      subtitle: "Social Development",
      image_url: "/homepage/H1.jpg",
      button_text: "Learn More",
      button_url: "/about",
      order: 1,
    },
  ],
  institutionProfile: {
    id: 1,
    eiin: 135892,
    school_code: "LFK-2026",
    school_type: "Kindergarten & Primary School",
    school_shift: "Morning (8:00 AM - 1:00 PM)",
    mission: "To create a happy, creative, and safe environment where children grow with curiosity and confidence.",
    vision: "Nurturing curious little learners to become empathetic, joyful, and lifelong thinkers.",
    total_students: 450,
    total_teachers: 35,
    total_students_label: "Happy Children",
    total_teachers_label: "Caring Mentors",
    school_details: "Little Flowers Kindergarten provides experiential early childhood education centered on play, sensory exploration, creativity, and foundational social skills.",
    institution_image_url: "/homepage/About Our Academy/Trial 1.jpg",
  },
  activities: [
    {
      id: 1,
      title: "Playgroup & Toddlers",
      slug: "playgroup",
      summary: "Sensory play, music, and motor skill building in a joyful atmosphere.",
      excerpt: "Age 2 - 3 Years",
      featured_image_url: "/homepage/Early Exploration/Trial 1.jpg",
    },
    {
      id: 2,
      title: "Nursery Exploration",
      slug: "nursery",
      summary: "Early phonics, numbers, interactive storytelling, and creative art workshops.",
      excerpt: "Age 3 - 4 Years",
      featured_image_url: "/homepage/Early Exploration/Trial 2.webp",
    },
    {
      id: 3,
      title: "Junior & Senior KG",
      slug: "kindergarten",
      summary: "Foundational reading, basic math concepts, scientific curiosity, and teamwork.",
      excerpt: "Age 4 - 6 Years",
      featured_image_url: "/homepage/Early Exploration/Trial 1.jpg",
    },
    {
      id: 4,
      title: "Creative Arts & Music Club",
      slug: "creative-club",
      summary: "Painting, ceramic pottery, rhythm instruments, and theatrical puppet play.",
      excerpt: "All Junior Grades",
      featured_image_url: "/homepage/Early Exploration/Trial 2.webp",
    },
  ],
  staff: [
    {
      id: 1,
      name: "Mrs. Sarah Jenkins",
      designation: "Headmistress & Early Child Specialist",
      department: "Administration",
      photo_url: "/homepage/Teachers/Teacher.jpg",
      bio: "14+ years of passion in child cognitive development and joyful learning.",
    },
    {
      id: 2,
      name: "Ms. Emily Watson",
      designation: "Playgroup & Sensory Lead",
      department: "Early Childhood",
      photo_url: "/homepage/Teachers/Teacher.jpg",
      bio: "Certified Montessori guide loving puppet theatre and expressive speech.",
    },
    {
      id: 3,
      name: "Mr. David Miller",
      designation: "Physical Education & Games Coach",
      department: "Sports & Wellness",
      photo_url: "/homepage/Teachers/Teacher.jpg",
      bio: "Focusing on motor coordination, balance, and cooperative games for kids.",
    },
    {
      id: 4,
      name: "Ms. Sophia Chen",
      designation: "Art, Craft & Clay Mentor",
      department: "Creative Arts",
      photo_url: "/homepage/Teachers/Teacher.jpg",
      bio: "Nurturing imaginative thinking through vibrant watercolor and sculpture.",
    },
  ],
  gallery: [
    {
      id: 1,
      title: "Outdoor Splash & Play Day",
      image_url: "/homepage/Happy Memories/Trial 1.jpg",
      caption: "Joyful outdoor water fun on sunny Friday.",
    },
    {
      id: 2,
      title: "Storytelling Circle",
      image_url: "/homepage/Happy Memories/Trial 2.webp",
      caption: "Morning circle time discovering fairy tales.",
    },
    {
      id: 3,
      title: "Little Scientists Lab",
      image_url: "/homepage/Happy Memories/Trial 1.jpg",
      caption: "Exploring plants and magnifying glasses.",
    },
    {
      id: 4,
      title: "Annual Colors Exhibition",
      image_url: "/homepage/Happy Memories/Trial 2.webp",
      caption: "Colorful finger-painting masterpieces.",
    },
    {
      id: 5,
      title: "Mini Sports Day Champions",
      image_url: "/homepage/Happy Memories/Trial 1.jpg",
      caption: "Fun obstacle race and medal ceremony.",
    },
    {
      id: 6,
      title: "Music & Rhythm Session",
      image_url: "/homepage/Happy Memories/Trial 2.webp",
      caption: "Singing nursery rhymes with xylophones.",
    },
  ],
  promotions: [
    {
      id: 1,
      title: "Early Bird Admissions 2026-2027 Open!",
      subtitle: "Limited seats for Playgroup, Nursery & Kindergarten",
      description: "Give your child the gift of joyful, exploratory education with caring teachers and modern facilities.",
      badge_text: "Admissions Open",
      cta_label: "Apply for Admission",
      cta_url: "/admission",
    },
  ],
  testimonials: [
    {
      id: 1,
      name: "Jessica Vance",
      role: "Mother of Leo (Playgroup)",
      quote: "Little Flowers has been a second home for Leo! He used to be shy, but within two months he started singing songs and making friends with so much joy.",
      rating: 5,
    },
    {
      id: 2,
      name: "Marcus Holloway",
      role: "Father of Mia (Nursery)",
      quote: "The teachers are remarkably attentive and patient. The daily sensory activities and outdoor plays make learning exciting for young kids.",
      rating: 5,
    },
    {
      id: 3,
      name: "Amina Rahman",
      role: "Mother of Aaryan (Senior KG)",
      quote: "Outstanding early childhood environment! The safety standards, loving atmosphere, and creative curriculum exceeded our highest expectations.",
      rating: 5,
    },
  ],
};
