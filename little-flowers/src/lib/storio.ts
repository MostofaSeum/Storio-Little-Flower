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
}

/**
 * Resolves layout, settings, customization configs, and navigation menu
 * from the Storio CMS API with safe standalone fallback.
 */
export async function getTemplateLayout(tenantHost: string, isStandalone: boolean): Promise<ResolvedTemplateLayout> {
  const rawLayout = await storio.getLayout(tenantHost);

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

  return { layout, settings, customization, navigation };
}

/**
 * Resolves full image URL for a blog post.
 * Handles:
 * 1. SDK field: post.featured_image_url
 * 2. Backend API payload field: post.featured_image_data?.file
 * 3. Relative backend media paths (e.g. /media/uploads/image.webp)
 */
export function getBlogPostImageUrl(post: {
  featured_image_url?: string;
  featured_image_data?: { file?: string };
}): string | null {
  const rawPath = post.featured_image_url || post.featured_image_data?.file;
  if (!rawPath) return null;

  if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
    return rawPath;
  }

  // If it starts with /media/, resolve against CMS backend URL
  if (rawPath.startsWith('/media/')) {
    const backendUrl =
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'https://api.storio.cloud';
    return `${backendUrl.replace(/\/$/, '')}${rawPath}`;
  }

  return rawPath;
}
