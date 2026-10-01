import React from 'react';
import { getTenantContext, getTemplateLayout } from '@/lib/storio';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import LoginPortalClient from '@/components/portals/LoginPortalClient';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';

export async function generateMetadata() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings } = await getTemplateLayout(tenantHost, isStandalone).catch(() => ({ settings: null }));
  const schoolName = settings?.site_title || 'Portal Login';

  return {
    title: `Portal Login — ${schoolName}`,
    description: `Secure Parent & Staff Gateway for ${schoolName}.`,
  };
}

export default async function LoginPage() {
  // 1. Resolve tenant context
  const { tenantHost, isStandalone } = await getTenantContext();

  // 2. Fetch layout, customization, and navigation
  const { settings, customization, navigation } = await getTemplateLayout(
    tenantHost,
    isStandalone
  );

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
