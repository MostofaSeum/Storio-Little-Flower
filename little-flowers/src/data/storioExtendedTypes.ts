/**
 * Custom Storio Extended Interfaces
 * 
 * Based on the Storio V2 API endpoints specification from docs/Storio_SDK_V2_Endpoints_and_Methods_Guide.md.
 * Used for endpoints called via storio.apiFetch<T>() when not in base SDK bundle.
 */

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
}
