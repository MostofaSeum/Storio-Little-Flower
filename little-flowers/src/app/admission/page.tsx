import React from 'react';
import { headers } from 'next/headers';
import { storio, StorioLayoutResponse } from '@storio/template-sdk';
import { StorioAdmissionFormConfig } from '@/data/storioExtendedTypes';
import { DEFAULT_DEMO_DATA } from '@/data/defaultDemoData';
import InteractiveHeader from '@/Components/InteractiveHeader';
import Footer from '@/Components/Footer';
import AdmissionPortalClient from '@/Components/AdmissionPortalClient';

export const metadata = {
  title: 'Online Admission Portal — Little Flowers Kindergarten',
  description: 'Apply online for Playgroup, Nursery, and Kindergarten admissions at Little Flowers.',
};

export default async function AdmissionPage() {
  // 1. Resolve host from incoming request
  const headersList = await headers();
  const rawHost =
    headersList.get('x-tenant-host') || headersList.get('host') || '';
  const host = rawHost.split(':')[0];

  // 2. Check for linked tenant vs Standalone mode
  const linkedTenant = process.env.NEXT_PUBLIC_STORIO_TENANT_HOST;
  const isLocalHost =
    host === 'localhost' || host === '127.0.0.1' || host === '::1';
  const isStandalone = isLocalHost && !linkedTenant;
  const tenantHost =
    linkedTenant || (isStandalone ? 'demo.storio.cloud' : host);

  // 3. Fetch layout settings & admission form config in parallel
  const [rawLayout, rawFormConfig] = await Promise.all([
    storio.getLayout(tenantHost),
    storio.apiFetch<StorioAdmissionFormConfig>(
      '/api/v2/template/admission/form-config/current/',
      { tenantHost }
    ),
  ]);

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

  const settings = layout?.settings || DEFAULT_DEMO_DATA.settings;

  return (
    <div className="min-h-screen bg-pastel-purple text-gray-800 flex flex-col selection:bg-pink-100 selection:text-pink-700">
      {/* 1. PillNav Header */}
      <InteractiveHeader settings={settings} />

      {/* 2. Main Admission Portal Area */}
      <main className="flex-1">
        {formConfig.is_active ? (
          <AdmissionPortalClient
            formConfig={formConfig}
            tenantHost={tenantHost}
            isStandalone={isStandalone}
          />
        ) : (
          <div className="max-w-2xl mx-auto px-4 py-20 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-amber-100 text-secondary-color flex items-center justify-center text-2xl font-bold">
              ℹ️
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-color font-fredoka">
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
