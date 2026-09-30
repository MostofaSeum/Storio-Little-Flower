import { headers } from 'next/headers';
import { storio, StorioLayoutResponse } from '@storio/template-sdk';
import { LittleFlowersCustomizationConfig, StorioDynamicNavItem } from '@/types';
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

