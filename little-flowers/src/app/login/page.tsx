import React from 'react';
import { headers } from 'next/headers';
import { storio, StorioLayoutResponse } from '@storio/template-sdk';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';
import InteractiveHeader from '@/Components/InteractiveHeader';
import Footer from '@/Components/Footer';
import LoginPortalClient from '@/Components/LoginPortalClient';

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

  return (
    <div className="min-h-screen bg-pastel-purple text-gray-800 flex flex-col selection:bg-pink-100 selection:text-pink-700">
      {/* 1. Header Navigation */}
      <InteractiveHeader settings={settings} />

      {/* 2. Login Portal Main Body */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <LoginPortalClient
          tenantHost={tenantHost}
          isStandalone={isStandalone}
          siteTitle={settings?.site_title || 'Little Flowers'}
        />
      </main>

      {/* 3. Footer */}
      <Footer settings={settings} />
    </div>
  );
}
