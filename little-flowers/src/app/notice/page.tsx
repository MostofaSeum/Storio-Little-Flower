import { headers } from 'next/headers';
import { storio, StorioLayoutResponse } from '@storio/template-sdk';
import { LittleFlowersCustomizationConfig } from '@/data/storioExtendedTypes';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';
import DynamicThemeStyles from '@/Components/DynamicThemeStyles';
import DemoNoticeSection from '@/Components/DemoNoticeSection';

/**
 * ============================================================================
 * Notice Page (/notice)
 * ============================================================================
 * Loads `DemoNoticeSection`, an asynchronous Server Component that fetches data
 * using the `@storio/template-sdk`.
 * ============================================================================
 */
export default async function NoticePage() {
  const headersList = await headers();
  const rawHost = headersList.get('x-tenant-host') || headersList.get('host') || '';
  const host = rawHost.split(':')[0];

  const linkedTenant = process.env.NEXT_PUBLIC_STORIO_TENANT_HOST;
  const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '::1';
  const isStandalone = isLocalHost && !linkedTenant;
  const tenantHost = linkedTenant || (isStandalone ? 'demo.storio.cloud' : host);

  const rawLayout: StorioLayoutResponse | null = await storio.getLayout(tenantHost);

  const customization: LittleFlowersCustomizationConfig = {
    ...DEFAULT_DEMO_DATA.customization,
    ...(rawLayout?.customization?.config as LittleFlowersCustomizationConfig || {}),
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 p-8 max-w-4xl mx-auto font-sans">
      <DynamicThemeStyles customization={customization} />
      <h1 className="text-2xl font-bold mb-4">Notice Board</h1>

      {/* Developer Guidance Box */}
      <div className="p-4 bg-white border border-gray-200 rounded-md text-sm text-gray-700 mb-6">
        <p className="font-semibold mb-1">Developer Note:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Running on <strong>localhost</strong> (Standalone Mode) &rarr; Falls back to DEFAULT_DEMO_DATA if DB is empty.</li>
          <li>Running on <strong>Live Tenant Domain</strong> &rarr; Shows DB items or clean empty state (NEVER leaks mock data).</li>
        </ul>
      </div>

      {/* Async Server Component fetching notice data */}
      <DemoNoticeSection />
    </main>
  );
}
