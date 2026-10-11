declare const process: { env: Record<string, string | undefined> };

export interface StorioFetchOptions extends RequestInit {
  tenantHost?: string;
  backendBaseUrl?: string;
  next?: { revalidate?: number | false; tags?: string[] };
}

// Exported TypeScript Response Interfaces for V2 Template APIs
export interface StorioSocialLink {
  platform: string;
  url: string;
}

export interface StorioSettingsResponse {
  site_title?: string;
  site_tagline?: string;
  logo_url?: string;
  favicon_url?: string;
  contact_email?: string;
  phone_number?: string;
  mobile_number?: string;
  social_links?: StorioSocialLink[];
  mailing_address?: string;
  google_analytics_id?: string;
  google_tag_manager_id?: string;
  hcaptcha_site_key?: string;
}

export interface StorioCustomizationResponse {
  config: Record<string, string | number | boolean | unknown>;
}

export interface StorioNavigationItem {
  id?: string | number;
  label: string;
  url: string;
  target?: string;
  children?: StorioNavigationItem[];
}

export interface StorioNavigationResponse {
  items: StorioNavigationItem[];
}

export interface AcademicRecognition {
  id?: number;
  level?: string;
  recognition_type?: string;
  valid_until?: string;
  order_number?: string;
}

export interface RecognitionDocument {
  id?: number;
  title?: string;
  file_url?: string;
  issue_date?: string;
}

export interface StorioInstitutionProfile {
  id: number;
  institution_image_url?: string;
  eiin?: number | string;
  school_code?: string;
  school_shift?: string;
  school_type?: string;
  division?: string;
  district?: string;
  upazila?: string;
  ward_no?: string;
  school_details?: string;
  additional_info?: Array<{ label?: string; value?: string }>;
  important_links?: Array<{ label?: string; url?: string }>;
  key_metrics?: unknown[];
  metrics_title?: string;
  total_students?: number;
  total_teachers?: number;
  total_students_label?: string;
  total_teachers_label?: string;
  mission?: string;
  vision?: string;
  education_board?: string;
  recognition_levels?: string[];
  academic_recognition?: AcademicRecognition[];
  recognition_documents?: RecognitionDocument[];
  created_at?: string;
  updated_at?: string;
}

export interface StorioLayoutResponse {
  settings: StorioSettingsResponse;
  customization: StorioCustomizationResponse;
  navigation: StorioNavigationResponse;
}

export interface StorioHeroSlide {
  id: number;
  title?: string;
  subtitle?: string;
  image_url?: string;
  button_text?: string;
  button_url?: string;
  order?: number;
}

export interface StorioNotice {
  id: number;
  title: string;
  slug?: string;
  content?: string;
  published_date?: string;
  is_urgent?: boolean;
  attachment_url?: string;
}

export interface StorioBlogPost {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  featured_image_url?: string;
  category_name?: string;
  published_at?: string;
}

export interface StorioStaffMember {
  id: number;
  name: string;
  designation?: string;
  department?: string;
  photo_url?: string;
  email?: string;
  phone_number?: string;
  bio?: string;
  is_mpo?: boolean;
}

export interface StorioTeamMember {
  id: number;
  fullname: string;
  designation: string;
  role?: string;
  experience?: string;
  section?: number;
  section_name?: string;
  phone?: string;
  address?: string;
  tenure_start?: string;
  tenure_end?: string;
  image?: number;
  image_data?: {
    id?: number;
    file_url?: string;
    alt_text?: string;
    caption?: string;
  } | null;
  image_shape?: string;
  image_shape_display?: string;
  is_visible?: boolean;
  order?: number;
  create_date?: string;
  update_date?: string;
}

export interface StorioGalleryItem {
  id: number;
  title?: string;
  image_url: string;
  caption?: string;
}

export interface StorioAlbum {
  id: number;
  title: string;
  cover_image_url?: string;
  images?: StorioGalleryItem[];
}

export interface StorioActivityItem {
  id: number;
  title: string;
  slug?: string;
  summary?: string;
  excerpt?: string;
  content?: string;
  featured_image_url?: string;
  image?: string;
  published_at?: string;
  date?: string;
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
  };
  categories?: number[];
  categories_detail?: Array<{
    id?: number;
    name?: string;
    slug?: string;
    events_count?: number;
  }>;
  created_at?: string;
  updated_at?: string;
}

export interface StorioCustomPage {
  id: number;
  title: string;
  slug: string;
  content: string | Record<string, unknown>[];
  meta_title?: string;
  meta_description?: string;
  featured_image?: string;
}

export interface StorioAdmissionField {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  order?: number;
  options?: string[];
  logic?: Record<string, unknown>;
  default?: unknown;
}

export interface StorioAdmissionFormConfig {
  id?: number;
  fields?: StorioAdmissionField[];
  is_active?: boolean;
  updated_at?: string;
}

export interface StorioAdmissionOTPResponse {
  success: boolean;
  message?: string;
}

export interface StorioAdmissionApplicationResponse {
  application_number?: string;
  success?: boolean;
  message?: string;
  error?: string;
}

export interface StorioContactFormResponse {
  success: boolean;
  message?: string;
}

export interface StorioImportantLink {
  id: number;
  title: string;
  url: string;
  order?: number;
}

export interface StorioBoardNotice {
  id?: number;
  title?: string;
  publish_date?: string;
  url?: string;
  board?: string;
}

export interface StorioPromotion {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  badge_text?: string;
  image?: string;
  image_detail?: string;
  cta_label?: string;
  cta_url?: string;
  cta_is_external?: boolean;
}

export interface StorioFaq {
  id: number;
  question: string;
  answer: string;
  is_visible?: boolean;
}

export interface StorioVideoItem {
  id: number;
  title: string;
  description?: string;
  reel_type?: string;
  platform?: string;
  url?: string;
  thumbnail_url?: string;
  views_count?: number;
  likes_count?: number;
  is_featured?: boolean;
}

export interface StorioCalendarEvent {
  id: number;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  category?: string;
  level?: string;
  is_all_day?: boolean;
}

export interface StorioExamResult {
  id: number;
  exam_name?: string;
  class_name?: string;
  year?: number | string;
  total_examinees?: number;
  passed?: number;
  failed?: number;
  pass_rate?: string | number;
  exam_type?: string;
  file_url?: string;
}

export interface StorioClassRoutineScheduleItem {
  period?: number;
  subject?: string;
  teacher?: string;
  room?: string;
  start_time?: string;
  end_time?: string;
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
  created_at?: string;
  updated_at?: string;
}

export interface StorioSyllabus {
  id: number;
  title: string;
  class_name: string;
  exam_type?: string;
  academic_year?: number;
  file?: number;
  file_url?: string;
  file_size?: string;
  description?: string;
  uploaded_at?: string;
  is_active?: boolean;
}

export interface StorioStudentGroupStat {
  group_name: string;
  sections?: string[];
  total_male?: number;
  total_female?: number;
  total_students?: number;
}

export interface StorioStudentStat {
  id: number;
  academic_year: number;
  year?: number;
  class_name: string;
  class_name_en?: string;
  groups?: StorioStudentGroupStat[];
  total_male?: number;
  total_female?: number;
  total_students?: number;
  shift?: string;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface StorioStudentStatsResponse {
  academic_year: number;
  grand_total_male: number;
  grand_total_female: number;
  grand_total: number;
  total_sections: number;
  classes: StorioStudentStat[];
}

export interface StorioMpoDocument {
  title?: string;
  file_url?: string;
  issue_date?: string;
}

export interface StorioMpoInfo {
  id: number;
  is_mpo_enlisted: boolean;
  mpo_status?: string;
  mpo_code?: string;
  mpo_date?: string;
  mpo_order_number?: string;
  subtitle?: string;
  description?: string;
  total_mpo_teachers?: number;
  total_non_mpo_teachers?: number;
  documents?: StorioMpoDocument[];
  created_at?: string;
  updated_at?: string;
}

export interface StorioInformationService {
  id: number;
  title?: string;
  address?: string;
  responsible_person?: string;
  designation?: string;
  mobile?: string;
  phone?: string;
  email?: string;
  photo?: number;
  photo_url?: string;
  office_hours?: string;
  description?: string;
  services_offered?: string[] | string;
  created_at?: string;
  updated_at?: string;
}

export interface StorioComplaintStep {
  step_number?: number;
  title?: string;
  description?: string;
}

export interface StorioComplaintOfficer {
  id: number;
  name?: string;
  designation?: string;
  address?: string;
  mobile?: string;
  phone?: string;
  email?: string;
  photo?: number;
  photo_url?: string;
  description?: string;
  complaint_process?: StorioComplaintStep[] | string;
  office_hours?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StorioHotline {
  id: number;
  title: string;
  number: string;
  description?: string;
  category?: string;
  is_emergency?: boolean;
  order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Storio SDK Core Client Class
export class StorioSDK {
  private backendBaseUrl: string;

  constructor(
    backendBaseUrl: string = process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'http://127.0.0.1:8000'
  ) {
    this.backendBaseUrl = backendBaseUrl;
  }

  // Universal fetch wrapper that automatically appends tenant headers

  public async apiFetch<T>(endpoint: string, options: StorioFetchOptions = {}): Promise<T | null> {
    const { tenantHost, backendBaseUrl, ...fetchOptions } = options;
    const base = backendBaseUrl || this.backendBaseUrl;

    // Ensure we don't double slash
    const url = `${base.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

    const headers = new Headers(fetchOptions.headers);
    headers.set('Content-Type', 'application/json');

    if (tenantHost) {
      headers.set('x-tenant-host', tenantHost);
      if (typeof window === 'undefined') {
        headers.set('Host', tenantHost);
      }
    }

    try {
      const res = await fetch(url, { ...fetchOptions, headers });
      if (!res.ok) {
        console.warn(`[Storio SDK] Error fetching ${endpoint}: HTTP ${res.status}`);
        return null as unknown as T;
      }
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return (await res.json()) as T;
      }
      console.warn(`[Storio SDK] Expected JSON but received non-JSON response from ${endpoint}`);
      return null as unknown as T;
    } catch (err) {
      console.warn(`[Storio SDK] Network error fetching ${endpoint}:`, err);
      return null as unknown as T;
    }
  }

  private parseOptions(tenantHostOrOptions?: string | StorioFetchOptions): StorioFetchOptions {
    if (typeof tenantHostOrOptions === 'string') {
      return { tenantHost: tenantHostOrOptions, next: { revalidate: 60 } };
    }
    return { next: { revalidate: 60 }, ...tenantHostOrOptions };
  }

  // V2 Core Template APIs (Strongly Typed)
  public async getSettings(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioSettingsResponse | null> {
    return this.apiFetch<StorioSettingsResponse>('/api/v2/template/settings/', this.parseOptions(tenantHostOrOptions));
  }

  public async getCustomization(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioCustomizationResponse | null> {
    return this.apiFetch<StorioCustomizationResponse>('/api/v2/template/customization/', this.parseOptions(tenantHostOrOptions));
  }

  public async getNavigation(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioNavigationResponse | null> {
    return this.apiFetch<StorioNavigationResponse>('/api/v2/template/navigation/', this.parseOptions(tenantHostOrOptions));
  }

  public async getLayout(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioLayoutResponse | null> {
    return this.apiFetch<StorioLayoutResponse>('/api/v2/template/layout/', this.parseOptions(tenantHostOrOptions));
  }

  public async getInstitutionProfile(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioInstitutionProfile | null> {
    return this.apiFetch<StorioInstitutionProfile>('/api/v2/template/institution-profile/', this.parseOptions(tenantHostOrOptions));
  }

  // V2 Content Template APIs (Strongly Typed)
  public async getHeroSlides(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioHeroSlide[] | null> {
    return this.apiFetch<StorioHeroSlide[]>('/api/v2/template/hero-slides/', this.parseOptions(tenantHostOrOptions));
  }

  public async getNotices(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioNotice[] | null> {
    return this.apiFetch<StorioNotice[]>('/api/v2/template/notices/', this.parseOptions(tenantHostOrOptions));
  }

  public async getNoticeDetail(
    id: number | string,
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioNotice | null> {
    return this.apiFetch<StorioNotice>(`/api/v2/template/notices/${id}/`, this.parseOptions(tenantHostOrOptions));
  }

  public async getBlogs(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioBlogPost[] | null> {
    return this.apiFetch<StorioBlogPost[]>('/api/v2/template/blogs/', this.parseOptions(tenantHostOrOptions));
  }

  public async getBlogDetail(
    slug: string,
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioBlogPost | null> {
    return this.apiFetch<StorioBlogPost>(`/api/v2/template/blogs/${slug}/`, this.parseOptions(tenantHostOrOptions));
  }

  public async getStaff(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioStaffMember[] | null> {
    return this.apiFetch<StorioStaffMember[]>('/api/v2/template/staff/', this.parseOptions(tenantHostOrOptions));
  }

  public async getTeam(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioTeamMember[] | null> {
    return this.apiFetch<StorioTeamMember[]>('/api/v2/template/team/', this.parseOptions(tenantHostOrOptions));
  }

  public async getGallery(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioGalleryItem[] | null> {
    return this.apiFetch<StorioGalleryItem[]>('/api/v2/template/gallery/', this.parseOptions(tenantHostOrOptions));
  }

  public async getAlbums(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioAlbum[] | null> {
    return this.apiFetch<StorioAlbum[]>('/api/v2/template/albums/', this.parseOptions(tenantHostOrOptions));
  }

  public async getActivities(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioActivityItem[] | null> {
    return this.apiFetch<StorioActivityItem[]>('/api/v2/template/activities/', this.parseOptions(tenantHostOrOptions));
  }

  public async getActivityDetail(
    slug: string,
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioActivityItem | null> {
    return this.apiFetch<StorioActivityItem>(`/api/v2/template/activities/${slug}/`, this.parseOptions(tenantHostOrOptions));
  }

  public async getTestimonials(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<Record<string, unknown>[] | null> {
    return this.apiFetch<Record<string, unknown>[]>('/api/v2/template/testimonials/', this.parseOptions(tenantHostOrOptions));
  }

  public async getLeadershipMessages(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<Record<string, unknown>[] | null> {
    return this.apiFetch<Record<string, unknown>[]>('/api/v2/template/leadership-messages/', this.parseOptions(tenantHostOrOptions));
  }

  public async getPromotions(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioPromotion[] | null> {
    return this.apiFetch<StorioPromotion[]>('/api/v2/template/promotions/', this.parseOptions(tenantHostOrOptions));
  }

  public async getCareers(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<Record<string, unknown>[] | null> {
    return this.apiFetch<Record<string, unknown>[]>('/api/v2/template/careers/jobs/', this.parseOptions(tenantHostOrOptions));
  }

  public async getJobDetail(
    slug: string,
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<Record<string, unknown> | null> {
    return this.apiFetch<Record<string, unknown>>(`/api/v2/template/careers/jobs/${slug}/`, this.parseOptions(tenantHostOrOptions));
  }

  public async getPageBySlug(
    slug: string,
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioCustomPage | null> {
    return this.apiFetch<StorioCustomPage>(`/api/v2/template/pages/by-slug/${slug}/`, this.parseOptions(tenantHostOrOptions));
  }

  public async getAdmissionFormConfig(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioAdmissionFormConfig | null> {
    return this.apiFetch<StorioAdmissionFormConfig>('/api/v2/template/admission/form-config/current/', this.parseOptions(tenantHostOrOptions));
  }

  public async sendAdmissionOTP(
    email: string,
    phoneOrTenantHost?: string | StorioFetchOptions,
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioAdmissionOTPResponse | null> {
    let phone: string | undefined;
    let tenantHost: string | StorioFetchOptions | undefined;

    if (typeof phoneOrTenantHost === 'string' && (phoneOrTenantHost.startsWith('+') || /^\d+$/.test(phoneOrTenantHost.replace(/[\s-]/g, '')))) {
      phone = phoneOrTenantHost;
      tenantHost = tenantHostOrOptions;
    } else {
      tenantHost = phoneOrTenantHost;
    }

    // Auto-detect phone from browser environment if not explicitly passed by 3rd-party template
    if (!phone && typeof document !== 'undefined') {
      try {
        const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('input'));
        const phoneInput = inputs.find((el) => {
          const identifier = `${el.type || ''} ${el.name || ''} ${el.id || ''} ${el.placeholder || ''}`.toLowerCase();
          return /phone|mobile|guardian|tel|contact/.test(identifier) && el.value && el.value.trim().length >= 8;
        });
        if (phoneInput && phoneInput.value) {
          phone = phoneInput.value.trim();
        }
      } catch (_) {}
    }

    if (!phone && typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('admission_form_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          const raw = parsed.phone || parsed.guardian_phone || parsed.mobile ||
            (parsed.values && (parsed.values.phone || parsed.values.guardian_phone || parsed.values.mobile)) ||
            (parsed.countryCode && parsed.phoneDigits ? `${parsed.countryCode}${parsed.phoneDigits}` : undefined);
          if (typeof raw === 'string' && raw.trim().length >= 8) {
            phone = raw.trim();
          }
        }
      } catch (_) {}
    }

    return this.apiFetch<StorioAdmissionOTPResponse>('/api/v2/template/admission/send-otp/', {
      ...this.parseOptions(tenantHost),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, ...(phone ? { phone } : {}) }),
    });
  }

  public async verifyAdmissionOTP(
    email: string,
    otpCode: string,
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioAdmissionOTPResponse | null> {
    return this.apiFetch<StorioAdmissionOTPResponse>('/api/v2/template/admission/verify-otp/', {
      ...this.parseOptions(tenantHostOrOptions),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp_code: otpCode }),
    });
  }

  public async submitAdmissionApplication(
    formData: Record<string, unknown>,
    otpCode: string,
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioAdmissionApplicationResponse | null> {
    return this.apiFetch<StorioAdmissionApplicationResponse>('/api/v2/template/admission/applications/', {
      ...this.parseOptions(tenantHostOrOptions),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ form_data: formData, otp_code: otpCode }),
    });
  }

  public async submitContactMessage(
    formData: Record<string, unknown>,
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioContactFormResponse | null> {
    return this.apiFetch<StorioContactFormResponse>('/api/v2/template/contact/', {
      ...this.parseOptions(tenantHostOrOptions),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
  }

  public async getImportantLinks(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioImportantLink[] | null> {
    return this.apiFetch<StorioImportantLink[]>('/api/v2/template/important-links/', this.parseOptions(tenantHostOrOptions));
  }

  public async getBoardNotices(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioBoardNotice[] | null> {
    return this.apiFetch<StorioBoardNotice[]>('/api/v2/template/board-notices/', this.parseOptions(tenantHostOrOptions));
  }

  public async getFaqs(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioFaq[] | null> {
    return this.apiFetch<StorioFaq[]>('/api/v2/template/faqs/', this.parseOptions(tenantHostOrOptions));
  }

  public async getVideos(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioVideoItem[] | null> {
    return this.apiFetch<StorioVideoItem[]>('/api/v2/template/reels/', this.parseOptions(tenantHostOrOptions));
  }

  public async getCalendarEvents(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioCalendarEvent[] | null> {
    return this.apiFetch<StorioCalendarEvent[]>('/api/v2/template/calendar/', this.parseOptions(tenantHostOrOptions));
  }

  public async getEvents(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioEvent[] | null> {
    return this.apiFetch<StorioEvent[]>('/api/events/', this.parseOptions(tenantHostOrOptions));
  }

  public async getEventDetail(
    slugOrId: string | number,
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioEvent | null> {
    return this.apiFetch<StorioEvent>(`/api/events/${slugOrId}/`, this.parseOptions(tenantHostOrOptions));
  }

  public async getExamResults(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioExamResult[] | null> {
    const opts = this.parseOptions(tenantHostOrOptions);
    const res = await this.apiFetch<Record<string, unknown> | StorioExamResult[]>('/api/v2/template/exam-results/', opts);
    if (res) {
      const data = Array.isArray(res) ? res : ((res as { results?: StorioExamResult[] }).results && Array.isArray((res as { results?: StorioExamResult[] }).results)) ? (res as { results: StorioExamResult[] }).results : null;
      if (data && data.length > 0) return data;
    }
    const legacy = await this.apiFetch<Record<string, unknown> | StorioExamResult[]>('/api/management/exam-results/', opts);
    if (legacy) {
      const data = Array.isArray(legacy) ? legacy : ((legacy as { results?: StorioExamResult[] }).results && Array.isArray((legacy as { results?: StorioExamResult[] }).results)) ? (legacy as { results: StorioExamResult[] }).results : null;
      if (data) return data;
    }
    return Array.isArray(res) ? res : ((res as { results?: StorioExamResult[] })?.results || null);
  }

  // V2 Academics Template APIs
  public async getClassRoutines(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioClassRoutine[] | null> {
    return this.apiFetch<StorioClassRoutine[]>('/api/v2/template/academic/class-routines/', this.parseOptions(tenantHostOrOptions));
  }

  public async getSyllabuses(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioSyllabus[] | null> {
    return this.apiFetch<StorioSyllabus[]>('/api/v2/template/academic/syllabuses/', this.parseOptions(tenantHostOrOptions));
  }

  public async getStudentStats(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioStudentStatsResponse | null> {
    return this.apiFetch<StorioStudentStatsResponse>('/api/v2/template/student-stats/', this.parseOptions(tenantHostOrOptions));
  }

  // V2 Compliance Template APIs
  public async getMpoInfo(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioMpoInfo | null> {
    return this.apiFetch<StorioMpoInfo>('/api/v2/template/mpo-info/', this.parseOptions(tenantHostOrOptions));
  }

  public async getInformationService(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioInformationService | null> {
    return this.apiFetch<StorioInformationService>('/api/v2/template/information-service/', this.parseOptions(tenantHostOrOptions));
  }

  public async getComplaintOfficer(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioComplaintOfficer | null> {
    return this.apiFetch<StorioComplaintOfficer>('/api/v2/template/complaint-officer/', this.parseOptions(tenantHostOrOptions));
  }

  public async getHotlines(
    tenantHostOrOptions?: string | StorioFetchOptions
  ): Promise<StorioHotline[] | null> {
    return this.apiFetch<StorioHotline[]>('/api/v2/template/hotlines/', this.parseOptions(tenantHostOrOptions));
  }
}

// Export a default singleton instance for ease of use
export const storio = new StorioSDK();
