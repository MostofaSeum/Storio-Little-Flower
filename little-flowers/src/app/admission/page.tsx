import React from 'react';
import { storio } from '@storio/template-sdk';
import { StorioAdmissionFormConfig } from '@/types';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';
import { getTenantContext, getTemplateLayout, getAdmissionFormConfig } from '@/lib/storio';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import AdmissionPortalClient from '@/components/portals/AdmissionPortalClient';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';

export async function generateMetadata() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings } = await getTemplateLayout(tenantHost, isStandalone).catch(() => ({ settings: null }));
  const schoolName = settings?.site_title || 'Kindergarten';

  return {
    title: `Online Admission Portal — ${schoolName}`,
    description: `Apply online for admissions at ${schoolName}.`,
  };
}

export default async function AdmissionPage() {
  // 1. Resolve host and tenant context
  const { tenantHost, isStandalone } = await getTenantContext();

  // 2. Fetch layout, customization, and navigation
  const { settings, customization, navigation } = await getTemplateLayout(
    tenantHost,
    isStandalone
  );

  // 3. Fetch admission form config
  const rawFormConfig = await getAdmissionFormConfig(tenantHost).catch(() => null);

  // 4. Apply Rule 1 fallback
  const formConfig: StorioAdmissionFormConfig =
    rawFormConfig && rawFormConfig.is_active
      ? rawFormConfig
      : isStandalone
        ? DEFAULT_DEMO_DATA.admissionFormConfig
        : {
            id: 0,
            is_active: false,
            title: 'Admissions Currently Closed',
            fields: [],
          };

  return (
    <div className="min-h-screen bg-pastel-purple text-gray-800 flex flex-col selection:bg-pink-100 selection:text-pink-700">
      {/* Dynamic CSS Variables injected from Storio CMS Customization Config */}
      <DynamicThemeStyles customization={customization} />

      {/* 1. Header */}
      <InteractiveHeader settings={settings} navigation={navigation} />

      {/* 2. Main Admission Portal Area */}
      <main className="flex-1">
        {formConfig.is_active ? (
          <AdmissionPortalClient
            formConfig={formConfig}
            tenantHost={tenantHost}
            isStandalone={isStandalone}
            siteTitle={settings?.site_title}
          />
        ) : (
          <div className="max-w-2xl mx-auto px-4 py-20 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-amber-100 text-secondary-color flex items-center justify-center text-2xl font-bold">
              ℹ️
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-fredoka">
              Admissions Closed
            </h1>
            <p className="text-gray-500 text-sm mt-2 font-medium">
              Online admissions for this session are currently not accepting new applications.
              Please reach out to our administration office for further assistance.
            </p>
            <div className="mt-6">
              <a
                href="/"
                className="px-6 py-3 bg-primary-color text-white font-bold text-xs rounded-full shadow-md hover:shadow-lg transition-all inline-block"
              >
                Return to Homepage
              </a>
            </div>
          </div>
        )}
      </main>

      {/* 3. Reusable Kindergarten Footer */}
      <Footer settings={settings} />
    </div>
  );
}
