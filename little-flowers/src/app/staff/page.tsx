import React from 'react';
import { storio, StorioStaffMember } from '@storio/template-sdk';
import { StorioTeamMember } from '@/types';
import { getTenantContext, getTemplateLayout } from '@/lib/storio';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import StaffClientView from '@/components/sections/StaffClientView';
import ThemeIcon from '@/components/ui/ThemeIcon';

export async function generateMetadata() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings } = await getTemplateLayout(tenantHost, isStandalone).catch(() => ({ settings: null }));
  const schoolName = settings?.site_title || 'Kindergarten';

  return {
    title: `Faculty & Governing Body — ${schoolName}`,
    description: `Meet our loving educators, teachers, and leadership board at ${schoolName}.`,
  };
}

/**
 * ============================================================================
 * Staff & Governing Body Page (/staff)
 * ============================================================================
 * Implements:
 *   1. GET /api/v2/template/staff/ — storio.getStaff(tenantHost)
 *   2. GET /api/v2/template/team/  — storio.getTeam(tenantHost)
 *
 * Follows Storio Rule 1:
 * - Standalone Preview (localhost without linked tenant):
 *   falls back to DEFAULT_DEMO_DATA (staff & team) if DB is empty.
 * - Live Tenant / Gateway Domain:
 *   strictly displays DB records or clean empty state (NEVER leaks mock data).
 * ============================================================================
 */
export default async function StaffPage() {
  // 1. Resolve host and tenant context following Storio Rule 1
  const { tenantHost, isStandalone } = await getTenantContext();

  // 2. Fetch layout, customization configs, and dynamic navigation
  const { settings, customization, navigation } = await getTemplateLayout(
    tenantHost,
    isStandalone
  );

  // 3. Fetch real staff and team in parallel via SDK
  const [rawStaff, rawTeam] = await Promise.all([
    storio.getStaff(tenantHost),
    storio.getTeam(tenantHost),
  ]);

  // 4. Apply Storio Rule 1 (Tenant DB vs Standalone Mock Data Rule)
  const staffList: StorioStaffMember[] =
    Array.isArray(rawStaff) && rawStaff.length > 0
      ? rawStaff
      : isStandalone
        ? DEFAULT_DEMO_DATA.staff || []
        : [];

  const teamList: (StorioStaffMember | StorioTeamMember)[] =
    Array.isArray(rawTeam) && rawTeam.length > 0
      ? rawTeam
      : isStandalone
        ? DEFAULT_DEMO_DATA.team || []
        : [];

  return (
    <div className="min-h-screen bg-pastel-purple text-gray-800 flex flex-col selection:bg-pink-100 selection:text-pink-700">
      {/* Dynamic CSS Variables injected from Storio CMS Customization Config */}
      <DynamicThemeStyles customization={customization} />

      {/* 1. Header Navigation */}
      <InteractiveHeader settings={settings} navigation={navigation} />

      {/* 2. Main Page Content */}
      <main className="flex-1 py-8 md:py-10">
        <div className="site-container px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm border border-purple-100 text-xs font-semibold text-primary-color mb-2.5">
              <ThemeIcon name="sparkle-star" size={16} />
              <span>Our Educators &amp; Leadership</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-2.5 font-fredoka">
              Faculty &amp; Governing Body
            </h1>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Dedicated mentors, early childhood specialists, and visionary leaders cultivating a joyful space for every child to bloom.
            </p>
          </div>

          {/* Interactive Staff & Team View (Filters, Search & Cards) */}
          <StaffClientView staffList={staffList} teamList={teamList} />
        </div>
      </main>

      {/* 3. Footer */}
      <Footer settings={settings} />
    </div>
  );
}
