import React from 'react';
import Link from 'next/link';
import { storio } from '@storio/template-sdk';
import { getTenantContext, getTemplateLayout } from '@/lib/storio';
import { resolveMediaUrl } from '@/lib/media';
import InteractiveHeader from '@/components/layout/InteractiveHeader';
import Footer from '@/components/layout/Footer';
import DynamicThemeStyles from '@/components/layout/DynamicThemeStyles';
import SplitText from '@/components/ui/SplitText';

interface LeadershipMessageItem {
  id: number;
  section_title?: string;
  name: string;
  role?: string;
  company?: string;
  message: string;
  image?: number | string;
  image_data?: {
    id?: number;
    file_url?: string;
    file?: string;
    alt_text?: string | null;
  };
  signature?: number | string;
  signature_data?: {
    id?: number;
    file_url?: string;
    file?: string;
    alt_text?: string | null;
  };
}

export const metadata = {
  title: 'Leadership Messages — Little Flowers',
  description: 'Messages and guidance from school administration and leaders.',
};

export default async function LeadershipMessagePage() {
  const { tenantHost, isStandalone } = await getTenantContext();
  const { settings, customization, navigation } = await getTemplateLayout(tenantHost, isStandalone);

  const rawMessages = await storio.apiFetch<LeadershipMessageItem[]>(
    '/api/v2/template/leadership-messages/',
    { tenantHost }
  );

  const messages: LeadershipMessageItem[] = Array.isArray(rawMessages) ? rawMessages : [];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-accent-pink selection:text-white">
      <DynamicThemeStyles customization={customization} />
      <InteractiveHeader settings={settings} navigation={navigation} />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="relative overflow-hidden bg-pastel-purple py-12 sm:py-16 border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-white text-primary-color border border-purple-200 shadow-2xs mb-4">
              <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse" />
              Administrative Governance
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-fredoka text-gray-900 leading-tight">
              <SplitText
                text="Leadership Messages"
                className="inline-block text-primary-color"
                tag="span"
              />
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed font-quicksand max-w-2xl mx-auto">
              Guiding thoughts, principles, and heartfelt greetings from our institutional administrators.
            </p>
          </div>
        </section>

        {/* Messages List */}
        <section className="py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-8">
            {messages.length === 0 ? (
              <div className="text-center py-16 px-4 bg-pastel-purple rounded-3xl border border-purple-100">
                <span className="text-4xl block mb-3">📜</span>
                <h3 className="text-xl font-bold font-fredoka text-gray-800 mb-2">No Leadership Messages Found</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Administrative messages will be published here as they are shared by the governing board.
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {messages.map((item) => {
                  const photoUrl =
                    item.image_data?.file_url || item.image_data?.file
                      ? resolveMediaUrl(item.image_data?.file_url || item.image_data?.file)
                      : null;

                  const signatureUrl =
                    item.signature_data?.file_url || item.signature_data?.file
                      ? resolveMediaUrl(item.signature_data?.file_url || item.signature_data?.file)
                      : null;

                  return (
                    <article
                      key={item.id}
                      className="bg-white rounded-3xl p-6 sm:p-10 border border-purple-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                      {item.section_title && (
                        <div className="mb-6 pb-4 border-b border-purple-100">
                          <span className="text-xs font-bold uppercase tracking-wider text-accent-pink">
                            {item.section_title}
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                        {/* Leader Photo & Profile */}
                        <div className="md:col-span-4 flex flex-col items-center text-center p-4 rounded-2xl bg-pastel-purple border border-purple-100/60">
                          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-md border-4 border-white mb-4 bg-white">
                            {photoUrl ? (
                              <img
                                src={photoUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-purple-100 text-primary-color font-bold text-3xl font-fredoka">
                                {item.name.charAt(0)}
                              </div>
                            )}
                          </div>

                          <h2 className="text-xl font-bold font-fredoka text-gray-900 leading-snug">
                            {item.name}
                          </h2>

                          {item.role && (
                            <p className="text-sm font-semibold text-primary-color mt-1">
                              {item.role}
                            </p>
                          )}

                          {item.company && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.company}
                            </p>
                          )}
                        </div>

                        {/* Leader Message Body */}
                        <div className="md:col-span-8 flex flex-col justify-between h-full">
                          <div className="relative">
                            <span className="text-5xl font-serif text-purple-200 absolute -top-5 -left-3 select-none pointer-events-none">
                              “
                            </span>
                            <div className="text-gray-700 leading-relaxed font-quicksand whitespace-pre-line text-base relative z-10 pl-4">
                              {item.message}
                            </div>
                          </div>

                          {signatureUrl && (
                            <div className="mt-8 pt-4 border-t border-purple-100 flex items-center justify-end">
                              <img
                                src={signatureUrl}
                                alt={`${item.name} signature`}
                                className="h-14 sm:h-16 object-contain"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
