import React from 'react';
import { storio, StorioStaffMember } from '@storio/template-sdk';
import { StorioTeamMember } from '@/types';
import { getTenantContext, getTemplateLayout } from '@/lib/storio';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import StaffClientView from '@/components/sections/StaffClientView';
import SplitText from '@/components/ui/SplitText';

export async function generateMetadata() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings } = await getTemplateLayout(tenantHost, isStandalone).catch(() => ({ settings: null }));
  const schoolName = settings?.site_title || 'Administration';

  return {
    title: `Committee Members & Governing Body — ${schoolName}`,
    description: 'Our governing committee, trustees, and management board members.',
  };
}

export default async function CommitteeMembersPage() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation } = await getTemplateLayout(tenantHost, isStandalone);

  const [rawStaff, rawTeam] = await Promise.all([
    storio.getStaff(tenantHost),
    storio.getTeam(tenantHost),
  ]);

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
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-pink-100 selection:text-pink-700">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-pastel-purple pt-8 pb-6 sm:pt-10 sm:pb-8 border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white text-primary-color border border-purple-200 shadow-2xs mb-2.5">
              <span className="w-2 h-2 rounded-full bg-secondary-color animate-pulse" />
              Administrative Governance
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-fredoka text-gray-900 leading-tight">
              <SplitText
                text="Committee Members"
                className="inline-block text-primary-color"
                tag="span"
                triggerOnMount={true}
              />
            </h1>

            <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed font-quicksand max-w-2xl mx-auto">
              Our governing body, trustees, and advisors steering the academy towards excellence.
            </p>
          </div>
        </section>

        {/* Directory Body */}
        <section className="py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <StaffClientView
              staffList={staffList}
              teamList={teamList}
              initialTab="leadership"
            />
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
