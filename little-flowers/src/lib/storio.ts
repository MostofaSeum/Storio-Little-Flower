import { headers } from 'next/headers';
import { storio, StorioLayoutResponse } from '@storio/template-sdk';
import {
  LittleFlowersCustomizationConfig,
  StorioDynamicNavItem,
  StorioInstitutionProfile,
  StorioActivityItem,
  StorioEvent,
  StorioTestimonial,
  StorioLeadershipMessage,
  StorioPromotion,
  StorioImportantLink,
  StorioFaq,
  StorioCalendarEvent,
} from '@/types';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';

export interface TenantContext {
  host: string;
  tenantHost: string;
  isStandalone: boolean;
  linkedTenant?: string;
}

/**
 * Resolves the tenant context (host, linkedTenant, isStandalone, tenantHost)
 * following Storio Rule 1.
 */
export async function getTenantContext(): Promise<TenantContext> {
  const headersList = await headers();
  const rawHost = headersList.get('x-tenant-host') || headersList.get('host') || '';
  const host = rawHost.split(':')[0]; // Remove port if present

  const linkedTenant = process.env.NEXT_PUBLIC_STORIO_TENANT_HOST;
  const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '::1';
  const isStandalone = isLocalHost && !linkedTenant;
  const tenantHost = linkedTenant || (isStandalone ? 'demo.storio.cloud' : host);

  return { host, tenantHost, isStandalone, linkedTenant };
}

export interface ResolvedTemplateLayout {
  layout: StorioLayoutResponse | null;
  settings: typeof DEFAULT_DEMO_DATA.settings;
  customization: LittleFlowersCustomizationConfig;
  navigation: StorioDynamicNavItem[];
  importantLinks: { id: number; title: string; url: string; order?: number }[];
}

/**
 * Resolves layout, settings, customization configs, navigation menu, and important links
 * from the Storio CMS API with safe standalone fallback.
 */
export async function getTemplateLayout(tenantHost: string, isStandalone: boolean): Promise<ResolvedTemplateLayout> {
  const [rawLayout, rawImportantLinks] = await Promise.all([
    storio.getLayout(tenantHost).catch(() => null),
    storio.apiFetch<{ id: number; title: string; url: string; order?: number }[]>('/api/v2/template/important-links/', { tenantHost }).catch(() => null),
  ]);

  const layout: StorioLayoutResponse | null =
    rawLayout ||
    (isStandalone
      ? {
          settings: DEFAULT_DEMO_DATA.settings,
          customization: { config: {} },
          navigation: { items: [] },
        }
      : null);

  const settings = layout?.settings || DEFAULT_DEMO_DATA.settings;

  const customization: LittleFlowersCustomizationConfig = {
    ...DEFAULT_DEMO_DATA.customization,
    ...((layout?.customization?.config as LittleFlowersCustomizationConfig) || {}),
  };

  const cmsNavLinks =
    (layout?.customization?.config?.navbarLinks as StorioDynamicNavItem[] | undefined) ||
    layout?.navigation?.items;

  const navigation: StorioDynamicNavItem[] =
    Array.isArray(cmsNavLinks) && cmsNavLinks.length > 0
      ? cmsNavLinks
      : isStandalone
        ? DEFAULT_DEMO_DATA.navigation
        : [];

  const importantLinks = Array.isArray(rawImportantLinks)
    ? rawImportantLinks.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  return { layout, settings, customization, navigation, importantLinks };
}

export * from './media';

// --- Storio Admission & Contact API Helpers ---

export async function getAdmissionFormConfig(tenantHost: string) {
  return storio.apiFetch<any>('/api/v2/template/admission/form-config/current/', { tenantHost });
}

export async function sendAdmissionOTP(email: string, tenantHost: string) {
  return storio.apiFetch<any>('/api/v2/template/admission/send-otp/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    tenantHost,
  });
}

export async function verifyAdmissionOTP(email: string, otpCode: string, tenantHost: string) {
  return storio.apiFetch<any>('/api/v2/template/admission/verify-otp/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp_code: otpCode }),
    tenantHost,
  });
}

export async function submitAdmissionApplication(formData: Record<string, any>, otpCode: string, tenantHost: string) {
  return storio.apiFetch<any>('/api/v2/template/admission/applications/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ form_data: formData, otp_code: otpCode }),
    tenantHost,
  });
}

export async function submitContactMessage(formData: Record<string, any>, tenantHost?: string) {
  return storio.apiFetch<any>('/api/v2/template/contact/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
    tenantHost,
  });
}

export async function getBoardNotices(tenantHost: string) {
  return storio.apiFetch<any[]>('/api/v2/template/board-notices/', { tenantHost });
}

export async function getPageBySlug(slug: string, tenantHost: string) {
  return storio.getPageBySlug(slug, tenantHost);
}

// --- Direct Storio SDK Method Wrappers & Named Helpers ---

export async function getSettings(tenantHost: string) {
  return storio.getSettings(tenantHost);
}

export async function getCustomization(tenantHost: string) {
  return storio.getCustomization(tenantHost);
}

export async function getNavigation(tenantHost: string) {
  return storio.getNavigation(tenantHost);
}

export async function getLayout(tenantHost: string) {
  return storio.getLayout(tenantHost);
}

export async function getInstitutionProfile(tenantHost: string) {
  return storio.apiFetch<StorioInstitutionProfile>('/api/v2/template/institution-profile/', { tenantHost });
}

export async function getHeroSlides(tenantHost: string) {
  return storio.getHeroSlides(tenantHost);
}

export async function getNotices(tenantHost: string) {
  return storio.getNotices(tenantHost);
}

export async function getNoticeDetail(id: number | string, tenantHost: string) {
  return storio.getNoticeDetail(id, tenantHost);
}

export async function getBlogs(tenantHost: string) {
  return storio.getBlogs(tenantHost);
}

export async function getBlogDetail(slug: string, tenantHost: string) {
  return storio.getBlogDetail(slug, tenantHost);
}

export async function getStaff(tenantHost: string) {
  return storio.getStaff(tenantHost);
}

export async function getTeam(tenantHost: string) {
  return storio.getTeam(tenantHost);
}

export async function getGallery(tenantHost: string) {
  return storio.getGallery(tenantHost);
}

export async function getAlbums(tenantHost: string) {
  return storio.getAlbums(tenantHost);
}

export async function getActivities(tenantHost: string) {
  return storio.apiFetch<StorioActivityItem[]>('/api/v2/template/activities/', { tenantHost });
}

export async function getActivityDetail(slug: string, tenantHost: string) {
  return storio.apiFetch<StorioActivityItem>(`/api/v2/template/activities/${slug}/`, { tenantHost });
}

export async function getEvents(tenantHost: string) {
  return storio.apiFetch<StorioEvent[]>('/api/events/', { tenantHost });
}

export async function getEventDetail(slugOrId: string | number, tenantHost: string) {
  return storio.apiFetch<StorioEvent>(`/api/events/${slugOrId}/`, { tenantHost });
}

export async function getTestimonials(tenantHost: string) {
  return storio.apiFetch<StorioTestimonial[]>('/api/v2/template/testimonials/', { tenantHost });
}

export async function getLeadershipMessages(tenantHost: string) {
  return storio.apiFetch<StorioLeadershipMessage[]>('/api/v2/template/leadership-messages/', { tenantHost });
}

export async function getPromotions(tenantHost: string) {
  return storio.apiFetch<StorioPromotion[]>('/api/v2/template/promotions/', { tenantHost });
}

export async function getImportantLinks(tenantHost: string) {
  return storio.apiFetch<StorioImportantLink[]>('/api/v2/template/important-links/', { tenantHost });
}

export async function getFaqs(tenantHost: string) {
  return storio.apiFetch<StorioFaq[]>('/api/v2/template/faqs/', { tenantHost });
}

export async function getVideos(tenantHost: string) {
  return storio.apiFetch<any[]>('/api/v2/template/reels/', { tenantHost });
}

export async function getCalendarEvents(tenantHost: string) {
  return storio.apiFetch<StorioCalendarEvent[]>('/api/v2/template/calendar/', { tenantHost });
}

export async function getExamResults(tenantHost: string) {
  return storio.apiFetch<any[]>('/api/v2/template/exam-results/', { tenantHost });
}

export async function getCareers(tenantHost: string) {
  return storio.apiFetch<any[]>('/api/v2/template/careers/jobs/', { tenantHost });
}

export async function getJobDetail(slug: string, tenantHost: string) {
  return storio.apiFetch<any>(`/api/v2/template/careers/jobs/${slug}/`, { tenantHost });
}


