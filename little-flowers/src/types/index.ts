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
  StorioSyllabus,
  StorioStudentStat as SDKStorioStudentStat,
  StorioStudentStatsResponse as SDKStorioStudentStatsResponse,
  StorioStudentGroupStat,
  StorioMpoInfo,
  StorioMpoDocument,
  StorioInformationService,
  StorioComplaintOfficer,
  StorioComplaintStep,
  StorioHotline,
} from '@storio/template-sdk';

export interface StorioStudentStat extends Omit<SDKStorioStudentStat, 'program'> {
  program?: string | null;
}

export interface StorioStudentStatsResponse extends Omit<SDKStorioStudentStatsResponse, 'classes'> {
  classes: StorioStudentStat[];
}

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
  StorioSyllabus,
  StorioStudentGroupStat,
  StorioMpoInfo,
  StorioMpoDocument,
  StorioInformationService,
  StorioComplaintOfficer,
  StorioComplaintStep,
  StorioHotline,
};

export interface StorioClassRoutineScheduleItem {
  period?: number;
  time?: string;
  start_time?: string;
  end_time?: string;
  subject?: string;
  teacher?: string;
  room?: string;
}

export interface StorioClassRoutineDaySchedule {
  day: string;
  periods?: StorioClassRoutineScheduleItem[];
  slots?: StorioClassRoutineScheduleItem[];
}

export interface StorioClassRoutine {
  id: number;
  class_name: string;
  section?: string;
  shift?: string;
  academic_year?: number;
  effective_from?: string;
  routine_file?: number;
  routine_file_url?: string;
  is_active?: boolean;
  schedule?: StorioClassRoutineDaySchedule[] | Record<string, unknown>;
  schedule_json?: {
    days?: StorioClassRoutineDaySchedule[];
  };
  created_at?: string;
  updated_at?: string;
}

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
  nav_home_color?: string;
  nav_about_color?: string;
  nav_programs_color?: string;
  nav_teachers_color?: string;
  nav_gallery_color?: string;
  nav_events_color?: string;
  nav_admission_color?: string;
  nav_notices_color?: string;
  nav_contact_color?: string;
  nav_blog_color?: string;
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
  admission_badge_text?: string;
  hero_card1_show?: boolean;
  hero_card1_title?: string;
  hero_card1_subtitle?: string;
  hero_card1_color?: string;
  hero_card1_icon?: string;
  hero_card2_show?: boolean;
  hero_card2_title?: string;
  hero_card2_subtitle?: string;
  hero_card2_color?: string;
  hero_card2_icon?: string;
  hero_card3_show?: boolean;
  hero_card3_title?: string;
  hero_card3_color?: string;
  about_experience_show?: boolean;
  about_experience_years?: string;
  about_experience_label?: string;
  about_btn_text?: string;
  about_btn_link?: string;
  about_metric3_number?: string;
  about_metric3_label?: string;
  heroTitle1?: string;
  heroTitle2?: string;
  heroDescription?: string;

  // Homepage Section Customization
  about_section_badge?: string;
  about_section_title?: string;
  about_section_description?: string;
  notice_section_badge?: string;
  notice_section_title?: string;
  notice_section_subtitle?: string;
  notice_view_all_text?: string;
  leadership_section_badge?: string;
  leadership_section_title?: string;
  leadership_section_subtitle?: string;
  programs_section_badge?: string;
  programs_section_title?: string;
  programs_section_subtitle?: string;
  teachers_section_badge?: string;
  teachers_section_title?: string;
  teachers_section_subtitle?: string;
  events_section_badge?: string;
  events_section_title?: string;
  events_section_subtitle?: string;
  events_view_all_text?: string;
  gallery_section_badge?: string;
  gallery_section_title?: string;
  gallery_section_subtitle?: string;
  gallery_view_all_text?: string;
  testimonials_section_badge?: string;
  testimonials_section_title?: string;
  testimonials_section_subtitle?: string;
  faqs_section_badge?: string;
  faqs_section_title?: string;
  faqs_section_subtitle?: string;

  // Inner Page Customization
  page_about_badge?: string;
  page_about_title?: string;
  page_about_subtitle?: string;
  page_notices_badge?: string;
  page_notices_title?: string;
  page_notices_subtitle?: string;
  page_events_badge?: string;
  page_events_title?: string;
  page_events_subtitle?: string;
  page_blog_badge?: string;
  page_blog_title?: string;
  page_blog_subtitle?: string;
  page_contact_badge?: string;
  page_contact_title?: string;
  page_contact_subtitle?: string;
  page_gallery_badge?: string;
  page_gallery_title?: string;
  page_gallery_subtitle?: string;
  page_career_badge?: string;
  page_career_title?: string;
  page_career_subtitle?: string;
  page_exam_badge?: string;
  page_exam_title?: string;
  page_exam_subtitle?: string;
  page_compliance_badge?: string;
  page_compliance_title?: string;
  page_compliance_subtitle?: string;

  // Mission & Vision Guiding Pillars Customization
  pillars_badge?: string;
  pillars_title?: string;
  pillars_subtitle?: string;
  pillar1_title?: string;
  pillar1_desc?: string;
  pillar2_title?: string;
  pillar2_desc?: string;
  pillar3_title?: string;
  pillar3_desc?: string;
  pillar4_title?: string;
  pillar4_desc?: string;

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
  additional_info?: Array<{
    label?: string;
    value?: string;
  }>;
}

export interface StorioActivityItem {
  id: number;
  title: string;
  slug?: string;
  summary?: string;
  excerpt?: string;
  content?: string;
  featured_image_data?: { file?: string };
}

export interface StorioPromotion {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  badge_text?: string;
  cta_label?: string;
  cta_url?: string;
  cta_is_external?: boolean;
  image?: string;
  image_detail?: string;
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
  photo?: number;
  photo_data?: {
    id?: number;
    file_url?: string;
    file?: string;
    alt_text?: string;
  };
}

export interface StorioJobOpening {
  id: number;
  title: string;
  slug: string;
  content?: string;
  location?: string;
  job_type?: string;
  experience?: string;
  salary_range?: string;
  deadline?: string;
  status: string;
  company_name?: string;
  vacancy?: number | string;
  description?: string;
  application_link?: string;
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
    id?: number;
    url?: string;
    file?: string;
    fileName?: string;
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
  order?: number;
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
  start_date?: string;
  end_date?: string;
  category?: 'holiday' | 'exam' | 'event' | string;
  level?: string;
  is_all_day?: boolean;
}

export interface StorioBoardNotice {
  id?: number;
  title: string;
  url: string;
  publish_date?: string;
  board?: string;
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

