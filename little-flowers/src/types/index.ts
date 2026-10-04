/**
 * Storio Template Type Definitions
 * 
 * Re-exports core types from @storio/template-sdk and defines custom extended
 * interfaces for template-specific CMS features and configurations.
 */

import {
  StorioSettingsResponse,
  StorioCustomizationResponse,
  StorioNavigationResponse,
  StorioLayoutResponse,
  StorioHeroSlide,
  StorioNotice,
  StorioBlogPost,
  StorioStaffMember,
  StorioTeamMember,
  StorioGalleryItem,
  StorioAlbum,
  StorioCustomPage,
} from '@storio/template-sdk';

// Re-export SDK interfaces
export type {
  StorioSettingsResponse,
  StorioCustomizationResponse,
  StorioNavigationResponse,
  StorioLayoutResponse,
  StorioHeroSlide,
  StorioNotice,
  StorioBlogPost,
  StorioStaffMember,
  StorioTeamMember,
  StorioGalleryItem,
  StorioAlbum,
  StorioCustomPage,
};

/**
 * Little Flowers Theme Customization Configuration
 * Synchronized with public/storio.template.json and Storio CMS dashboard
 */
export interface LittleFlowersCustomizationConfig {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textColor?: string;
  headingColor?: string;
  footerColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonHoverColor?: string;
  buttonTextHoverColor?: string;
  activeNavBgColor?: string;
  activeNavTextColor?: string;
  accentPink?: string;
  accentBlue?: string;
  topbarBgColor?: string;
  fontFamily?: string;
  borderRadius?: string;
  showTopBar?: boolean;
  showWaveDivider?: boolean;
  showWaveBadges?: boolean;
  badge1_text?: string;
  badge1_color?: string;
  badge1_icon?: string;
  badge1_link?: string;
  badge2_text?: string;
  badge2_color?: string;
  badge2_icon?: string;
  badge2_link?: string;
  badge3_text?: string;
  badge3_color?: string;
  badge3_icon?: string;
  badge3_link?: string;
  badge4_text?: string;
  badge4_color?: string;
  badge4_icon?: string;
  badge4_link?: string;
  heroTitle1?: string;
  heroTitle2?: string;
  heroDescription?: string;
  [key: string]: unknown;
}

/**
 * Dynamic Navigation Menu Item
 * Supports both flat items and nested sub-links from CMS Menu Builder
 */
export interface StorioDynamicNavItem {
  id?: string | number;
  name?: string;
  label?: string;
  href?: string;
  url?: string;
  target?: string;
  subLinks?: StorioDynamicNavItem[];
  children?: StorioDynamicNavItem[];
  isVisible?: boolean;
}

export interface StorioInstitutionProfile {
  id: number;
  institution_image_url?: string;
  eiin?: number | string;
  school_code?: string;
  school_shift?: string;
  school_type?: string;
  school_details?: string;
  total_students?: number;
  total_teachers?: number;
  total_students_label?: string;
  total_teachers_label?: string;
  mission?: string;
  vision?: string;
}

export interface StorioActivityItem {
  id: number;
  title: string;
  slug?: string;
  summary?: string;
  excerpt?: string;
  content?: string;
  featured_image_url?: string;
}

export interface StorioPromotion {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  badge_text?: string;
  cta_label?: string;
  cta_url?: string;
  image?: number | string;
  image_detail?: {
    file?: string;
    file_url?: string;
  };
}

export interface StorioTestimonial {
  id: number;
  name: string;
  role?: string;
  designation?: string;
  organization?: string;
  quote?: string;
  content?: string;
  message?: string;
  rating?: number;
  avatar_url?: string;
  photo?: number;
  photo_data?: {
    id: number;
    file_url?: string;
    file?: string;
    alt_text?: string;
  };
}

export interface StorioEvent {
  id: number;
  title: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  is_featured?: boolean;
  featured_image?: string;
  featured_image_detail?: {
    id: number;
    file: string;
    file_name?: string;
    alt_text?: string;
  };
}

export interface StorioFaq {
  id: number;
  question: string;
  answer: string;
  is_visible?: boolean;
}

export interface StorioAdmissionFormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea' | 'image' | 'file' | string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  step?: 1 | 2;
}

export interface StorioAdmissionFormConfig {
  id: number;
  is_active: boolean;
  title?: string;
  description?: string;
  academic_session?: string;
  fields: StorioAdmissionFormField[];
}

export interface StorioAdmissionOTPResponse {
  success: boolean;
  message: string;
}

export interface StorioAdmissionApplicationResponse {
  success: boolean;
  application_number: string;
  message: string;
}

export interface StorioAuthLoginRequest {
  email: string;
  password: string;
}

export interface StorioAuthLoginResponse {
  key?: string;
  token?: string;
  access?: string;
  refresh?: string;
  user?: {
    id?: number | string;
    email?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    role?: string;
    is_staff?: boolean;
  };
  non_field_errors?: string[];
  email?: string[];
  password?: string[];
  message?: string;
  detail?: string;
}

export interface StorioUserSession {
  email: string;
  name: string;
  role: 'parent' | 'staff';
  token: string;
}

export interface StorioImportantLink {
  id: number;
  title: string;
  url: string;
  order?: number;
}

export interface StorioCalendarEvent {
  id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  category?: 'holiday' | 'exam' | 'event' | string;
  level?: string;
  is_all_day?: boolean;
}

export interface StorioBoardNotice {
  title: string;
  url: string;
  publish_date?: string;
  board_name?: string;
}

export interface StorioLeadershipMessage {
  id: number;
  section_title?: string;
  name: string;
  role?: string;
  company?: string;
  message: string;
  image?: number | string;
  image_data?: {
    id?: number;
    file_url?: string;
    file?: string;
    alt_text?: string | null;
  };
  signature?: number | string;
  signature_data?: {
    id?: number;
    file_url?: string;
    file?: string;
    alt_text?: string | null;
  };
}
