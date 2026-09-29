import { getTenantContext, getTemplateLayout } from '@/lib/storio';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import DemoNoticeSection from '@/components/sections/DemoNoticeSection';

/**
 * ============================================================================
 * Notice Page (/notice)
 * ============================================================================
 * Loads `DemoNoticeSection`, an asynchronous Server Component that fetches data
 * using the `@storio/template-sdk`.
 * ============================================================================
 */
export default async function NoticePage() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { customization } = await getTemplateLayout(tenantHost, isStandalone);

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
