import React from 'react';
import { headers } from 'next/headers';
import { storio, StorioLayoutResponse } from '@storio/template-sdk';
import { LittleFlowersCustomizationConfig, StorioDynamicNavItem } from '@/data/storioExtendedTypes';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';
import InteractiveHeader from '@/Components/InteractiveHeader';
import Footer from '@/Components/Footer';
import LoginPortalClient from '@/Components/LoginPortalClient';
import DynamicThemeStyles from '@/Components/DynamicThemeStyles';

export const metadata = {
  title: 'Portal Login — Little Flowers Kindergarten',
  description: 'Secure Parent & Staff Gateway for Little Flowers Kindergarten.',
};

export default async function LoginPage() {
  // 1. Resolve host from incoming request
  const headersList = await headers();
  const rawHost = headersList.get('x-tenant-host') || headersList.get('host') || '';
  const host = rawHost.split(':')[0];

  // 2. Check for linked tenant vs Standalone mode (Rule 1)
  const linkedTenant = process.env.NEXT_PUBLIC_STORIO_TENANT_HOST;
  const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '::1';
  const isStandalone = isLocalHost && !linkedTenant;
  const tenantHost = linkedTenant || (isStandalone ? 'demo.storio.cloud' : host);

  // 3. Fetch layout settings
  const rawLayout = await storio.getLayout(tenantHost);

  // 4. Apply Rule 1 fallback
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

  // Customization preferences from CMS Admin Dashboard (with local fallback)
  const customization: LittleFlowersCustomizationConfig = {
    ...DEFAULT_DEMO_DATA.customization,
    ...(layout?.customization?.config as LittleFlowersCustomizationConfig || {}),
  };

  // Dynamic Navigation menu items from Storio CMS
  const cmsNavLinks =
    (layout?.customization?.config?.navbarLinks as StorioDynamicNavItem[] | undefined) ||
    layout?.navigation?.items;

  const navigation: StorioDynamicNavItem[] =
    Array.isArray(cmsNavLinks) && cmsNavLinks.length > 0
      ? cmsNavLinks
      : isStandalone
        ? DEFAULT_DEMO_DATA.navigation
        : [];

  return (
    <div className="min-h-screen bg-pastel-purple text-gray-800 flex flex-col selection:bg-pink-100 selection:text-pink-700">
      {/* Dynamic CSS Variables injected from Storio CMS Customization Config */}
      <DynamicThemeStyles customization={customization} />

      {/* 1. Header Navigation */}
      <InteractiveHeader settings={settings} navigation={navigation} />

      {/* 2. Login Portal Main Body */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <LoginPortalClient
          tenantHost={tenantHost}
          isStandalone={isStandalone}
          siteTitle={settings?.site_title || 'Little Flowers'}
          logoUrl={settings?.logo_url}
        />
      </main>

      {/* 3. Footer */}
      <Footer settings={settings} />
    </div>
  );
}
