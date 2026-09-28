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

export interface StorioTestimonial {
  id: number;
  name: string;
  role?: string;
  designation?: string;
  quote?: string;
  content?: string;
  rating?: number;
  avatar_url?: string;
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
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea';
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
