import React from 'react';
import {
  getTenantContext,
  getTemplateLayout,
  getMpoInfo,
  getInformationService,
  getComplaintOfficer,
  getHotlines,
} from '@/lib/storio';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';
import {
  StorioMpoInfo,
  StorioInformationService,
  StorioComplaintOfficer,
  StorioHotline,
} from '@/types';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';
import ComplianceClientView from '@/components/sections/ComplianceClientView';

export async function generateMetadata() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings } = await getTemplateLayout(tenantHost, isStandalone).catch(() => ({ settings: null }));
  const schoolName = settings?.site_title || 'Little Flowers';

  return {
    title: `Citizen Charter & Institutional Compliance — ${schoolName}`,
    description: `Official government MPO recognition, Right to Information (RTI) desk, Grievance Redress System (GRS), and public emergency hotlines for ${schoolName}.`,
  };
}

export default async function CompliancePage() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation, importantLinks } = await getTemplateLayout(tenantHost, isStandalone);

  // Parallel fetch compliance datasets from API
  const [rawMpo, rawRti, rawGrs, rawHotlines] = await Promise.all([
    getMpoInfo(tenantHost).catch(() => null),
    getInformationService(tenantHost).catch(() => null),
    getComplaintOfficer(tenantHost).catch(() => null),
    getHotlines(tenantHost).catch(() => null),
  ]);

  // Apply Storio Rule 1: Real DB in live tenant, DEFAULT_DEMO_DATA in standalone preview
  const mpoInfo: StorioMpoInfo | null =
    rawMpo || (isStandalone ? DEFAULT_DEMO_DATA.mpoInfo : null);

  const informationService: StorioInformationService | null =
    rawRti || (isStandalone ? DEFAULT_DEMO_DATA.informationService : null);

  const complaintOfficer: StorioComplaintOfficer | null =
    rawGrs || (isStandalone ? DEFAULT_DEMO_DATA.complaintOfficer : null);

  const hotlines: StorioHotline[] =
    Array.isArray(rawHotlines) && rawHotlines.length > 0
      ? rawHotlines
      : isStandalone
        ? DEFAULT_DEMO_DATA.hotlines
        : [];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-pink-100 selection:text-pink-700">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Banner Hero */}
        <section className="relative overflow-hidden bg-pastel-purple pt-10 pb-8 sm:pt-14 sm:pb-10 border-b border-purple-100">
          <div className="site-container px-4 sm:px-8 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-white text-primary-color border border-purple-200 shadow-2xs mb-3">
              <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse" />
              Institutional Transparency
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-fredoka text-gray-900 leading-tight">
              <SplitText
                text="Citizen Charter & Institutional Compliance"
                className="inline-block text-primary-color"
                tag="span"
                triggerOnMount={true}
              />
            </h1>

            <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed font-quicksand max-w-2xl mx-auto">
              Government board recognition, Right to Information (RTI) service desk, Grievance Redress System, and public safety helplines.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="pt-6 sm:pt-8 pb-16 sm:pb-20 site-section-px site-container w-full">
          <ComplianceClientView
            mpoInfo={mpoInfo}
            informationService={informationService}
            complaintOfficer={complaintOfficer}
            hotlines={hotlines}
          />
        </section>
      </main>

      <Footer settings={settings} importantLinks={importantLinks} />
    </div>
  );
}
