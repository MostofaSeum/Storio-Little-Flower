'use client';

import React, { useState } from 'react';
import {
  StorioMpoInfo,
  StorioInformationService,
  StorioComplaintOfficer,
  StorioHotline,
} from '@/types';
import { resolveMediaUrl } from '@/lib/media';

interface ComplianceClientViewProps {
  mpoInfo: StorioMpoInfo | null;
  informationService: StorioInformationService | null;
  complaintOfficer: StorioComplaintOfficer | null;
  hotlines: StorioHotline[];
}

export default function ComplianceClientView({
  mpoInfo,
  informationService,
  complaintOfficer,
  hotlines,
}: ComplianceClientViewProps) {
  // Normalize complaint steps (supports array of objects or JSON)
  const complaintSteps = Array.isArray(complaintOfficer?.complaint_process)
    ? complaintOfficer.complaint_process
    : [];

  // Normalize services offered
  const servicesList = Array.isArray(informationService?.services_offered)
    ? informationService.services_offered
    : typeof informationService?.services_offered === 'string'
      ? [informationService.services_offered]
      : [];

  // Check if MPO section has any visible content
  const hasMpoContent = Boolean(
    mpoInfo && (
      mpoInfo.mpo_code ||
      mpoInfo.mpo_status ||
      mpoInfo.mpo_order_number ||
      mpoInfo.mpo_date ||
      (typeof mpoInfo.total_mpo_teachers === 'number' || typeof mpoInfo.total_non_mpo_teachers === 'number') ||
      (mpoInfo.documents && mpoInfo.documents.length > 0)
    )
  );

  // Check if RTI section has any visible content
  const hasRtiContent = Boolean(
    informationService && (
      informationService.responsible_person ||
      informationService.designation ||
      informationService.mobile ||
      informationService.phone ||
      informationService.email ||
      informationService.address ||
      informationService.office_hours ||
      informationService.description ||
      servicesList.length > 0
    )
  );

  // Check if GRS section has any visible content
  const hasGrsContent = Boolean(
    complaintOfficer && (
      complaintOfficer.name ||
      complaintOfficer.designation ||
      complaintOfficer.mobile ||
      complaintOfficer.phone ||
      complaintOfficer.email ||
      complaintOfficer.address ||
      complaintOfficer.office_hours ||
      complaintOfficer.description ||
      complaintSteps.length > 0
    )
  );

  // Check if hotlines section has any visible content
  const hasHotlinesContent = Boolean(hotlines && hotlines.length > 0);

  // Navigation tabs matching the available sections
  type TabKey = 'all' | 'mpo' | 'rti' | 'grs' | 'hotlines';
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const tabs: { key: TabKey; label: string; icon: string; show: boolean }[] = [
    { key: 'all', label: 'All Services', icon: 'document-paper.svg', show: true },
    { key: 'mpo', label: 'MPO & Recognition', icon: 'school-building.svg', show: hasMpoContent },
    { key: 'rti', label: 'Right to Information', icon: 'info-circle.svg', show: hasRtiContent },
    { key: 'grs', label: 'Grievance Redress', icon: 'scroll-certificate.svg', show: hasGrsContent },
    { key: 'hotlines', label: 'Emergency Hotlines', icon: 'phone-call.svg', show: hasHotlinesContent },
  ];

  const visibleTabs = tabs.filter((t) => t.show);

  return (
    <div className="space-y-10">
      {/* Tab Filter Pills */}
      {visibleTabs.length > 2 && (
        <div className="flex justify-center">
          <div className="inline-flex flex-wrap items-center justify-center p-1.5 bg-pastel-purple border border-purple-100 rounded-3xl shadow-xs gap-1.5 max-w-full">
            {visibleTabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? 'bg-white shadow-md text-primary-color font-extrabold transform scale-102'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 1. MPO & Institutional Recognition Section */}
      {(activeTab === 'all' || activeTab === 'mpo') && hasMpoContent && (
        <section id="mpo" className="p-6 sm:p-10 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-50 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-9 h-9 rounded-xl bg-amber-50 text-secondary-color flex items-center justify-center">
                  <img src="/icons/school-building.svg" alt="MPO" className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-accent-green px-2.5 py-1 rounded-full border border-emerald-100">
                  {mpoInfo.is_mpo_enlisted ? 'MPO Enlisted Institution' : 'Private / Non-MPO'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-gray-900">
                Institutional Recognition & MPO Compliance
              </h2>
              {mpoInfo.subtitle && (
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                  {mpoInfo.subtitle}
                </p>
              )}
            </div>

            {mpoInfo.mpo_code && (
              <div className="p-4 rounded-2xl bg-pastel-purple border border-purple-100 flex items-center gap-3 shrink-0">
                <img src="/icons/document-paper.svg" alt="MPO Code" className="w-6 h-6" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Official MPO Code
                  </span>
                  <span className="text-base sm:text-lg font-black font-fredoka text-primary-color tracking-wider">
                    {mpoInfo.mpo_code}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {mpoInfo.description && (
            <p className="text-sm text-gray-600 font-quicksand leading-relaxed">
              {mpoInfo.description}
            </p>
          )}

          {/* Key Facts / Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mpoInfo.mpo_status && (
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Status
                </span>
                <span className="text-sm font-bold text-gray-900 mt-0.5 block">
                  {mpoInfo.mpo_status}
                </span>
              </div>
            )}

            {mpoInfo.mpo_order_number && (
              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Order Number
                </span>
                <span className="text-sm font-bold text-gray-900 mt-0.5 block">
                  {mpoInfo.mpo_order_number}
                </span>
              </div>
            )}

            {mpoInfo.mpo_date && (
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Effective Date
                </span>
                <span className="text-sm font-bold text-gray-900 mt-0.5 block">
                  {new Date(mpoInfo.mpo_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            )}

            {(typeof mpoInfo.total_mpo_teachers === 'number' || typeof mpoInfo.total_non_mpo_teachers === 'number') && (
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Faculty Faculty Distribution
                </span>
                <span className="text-sm font-bold text-gray-900 mt-0.5 block">
                  {mpoInfo.total_mpo_teachers ?? 0} MPO / {mpoInfo.total_non_mpo_teachers ?? 0} Non-MPO
                </span>
              </div>
            )}
          </div>

          {/* Official Gazette Documents */}
          {mpoInfo.documents && mpoInfo.documents.length > 0 && (
            <div className="pt-4 border-t border-purple-50 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">
                Official Government Orders & Documents:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {mpoInfo.documents.map((doc, idx) => {
                  const docUrl = doc.file_url ? resolveMediaUrl(doc.file_url) : null;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-purple-100 hover:border-primary-color transition-all shadow-2xs flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-gray-800 line-clamp-1 block">
                          {doc.title || `Compliance Document ${idx + 1}`}
                        </span>
                        {doc.issue_date && (
                          <span className="text-[10px] text-gray-400 block mt-0.5">
                            Issued: {doc.issue_date}
                          </span>
                        )}
                      </div>
                      {docUrl && (
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-full bg-button-dark hover:opacity-90 text-white font-bold text-[10px] shadow-xs shrink-0 flex items-center gap-1"
                        >
                          <svg className="w-3 h-3 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>PDF</span>
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 2. Right to Information (RTI) Service */}
      {(activeTab === 'all' || activeTab === 'rti') && hasRtiContent && (
        <section id="rti" className="p-6 sm:p-10 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-purple-50 pb-4">
            <span className="w-9 h-9 rounded-xl bg-sky-50 text-accent-blue flex items-center justify-center">
              <img src="/icons/info-circle.svg" alt="RTI" className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent-blue">
                Right to Information (RTI)
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-gray-900">
                {informationService.title || 'Designated Information Officer & Desk'}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Officer Card */}
            <div className="p-6 rounded-3xl bg-pastel-purple/60 border border-purple-100 flex flex-col items-center text-center space-y-4">
              {informationService.photo_url && (
                <img
                  src={resolveMediaUrl(informationService.photo_url)}
                  alt={informationService.responsible_person || 'Information Officer'}
                  className="w-28 h-28 rounded-2xl object-cover shadow-sm border-2 border-white"
                />
              )}
              <div>
                {informationService.responsible_person && (
                  <h3 className="text-lg font-bold font-fredoka text-gray-900">
                    {informationService.responsible_person}
                  </h3>
                )}
                {informationService.designation && (
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {informationService.designation}
                  </p>
                )}
              </div>

              {/* Direct Contacts */}
              <div className="w-full space-y-2 pt-3 border-t border-purple-100 text-xs">
                {informationService.mobile && (
                  <a
                    href={`tel:${informationService.mobile}`}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-white hover:bg-sky-50 text-gray-700 hover:text-accent-blue font-bold transition-colors shadow-2xs"
                  >
                    <img src="/icons/phone-call.svg" alt="Mobile" className="w-4 h-4" />
                    <span>{informationService.mobile}</span>
                  </a>
                )}
                {informationService.phone && (
                  <a
                    href={`tel:${informationService.phone}`}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-white hover:bg-sky-50 text-gray-700 hover:text-accent-blue font-bold transition-colors shadow-2xs"
                  >
                    <img src="/icons/phone-call.svg" alt="Phone" className="w-4 h-4" />
                    <span>{informationService.phone}</span>
                  </a>
                )}
                {informationService.email && (
                  <a
                    href={`mailto:${informationService.email}`}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-white hover:bg-sky-50 text-gray-700 hover:text-accent-blue font-bold transition-colors shadow-2xs truncate"
                  >
                    <img src="/icons/mail-envelope.svg" alt="Email" className="w-4 h-4" />
                    <span className="truncate">{informationService.email}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Information Desk Details & Scope */}
            <div className="md:col-span-2 space-y-5">
              {informationService.description && (
                <p className="text-sm text-gray-600 font-quicksand leading-relaxed">
                  {informationService.description}
                </p>
              )}

              {/* Location & Office Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {informationService.address && (
                  <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-2xs">
                    <span className="font-bold text-gray-400 uppercase text-[10px] block">
                      Office Location
                    </span>
                    <span className="font-medium text-gray-800 mt-1 block">
                      <img src="/icons/location-pin.svg" alt="Location" className="w-4 h-4 inline-block" /> {informationService.address}
                    </span>
                  </div>
                )}
                {informationService.office_hours && (
                  <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-2xs">
                    <span className="font-bold text-gray-400 uppercase text-[10px] block">
                      Office Hours
                    </span>
                    <span className="font-medium text-gray-800 mt-1 block">
                      <img src="/icons/clock-time.svg" alt="Hours" className="w-4 h-4 inline-block" /> {informationService.office_hours}
                    </span>
                  </div>
                )}
              </div>

              {/* Services Offered */}
              {servicesList.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                    Public Services & Information Disclosures:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {servicesList.map((svc, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-pastel-purple/50 border border-purple-50 text-xs font-semibold text-gray-800"
                      >
                        <img src="/icons/success-check.svg" alt="Check" className="w-4 h-4 inline-block" />
                        <span>{svc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 3. Grievance Redress System (GRS) Section */}
      {(activeTab === 'all' || activeTab === 'grs') && hasGrsContent && (
        <section id="grs" className="p-6 sm:p-10 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-purple-50 pb-4">
            <span className="w-9 h-9 rounded-xl bg-pink-50 text-accent-pink flex items-center justify-center">
              <img src="/icons/scroll-certificate.svg" alt="GRS" className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent-pink">
                Grievance Redress System (GRS)
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-gray-900">
                Designated Grievance & Complaint Officer
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Officer Card */}
            <div className="p-6 rounded-3xl bg-pastel-purple/60 border border-purple-100 flex flex-col items-center text-center space-y-4">
              {complaintOfficer.photo_url && (
                <img
                  src={resolveMediaUrl(complaintOfficer.photo_url)}
                  alt={complaintOfficer.name || 'Grievance Officer'}
                  className="w-28 h-28 rounded-2xl object-cover shadow-sm border-2 border-white"
                />
              )}
              <div>
                {complaintOfficer.name && (
                  <h3 className="text-lg font-bold font-fredoka text-gray-900">
                    {complaintOfficer.name}
                  </h3>
                )}
                {complaintOfficer.designation && (
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {complaintOfficer.designation}
                  </p>
                )}
              </div>

              {/* Direct Contacts */}
              <div className="w-full space-y-2 pt-3 border-t border-purple-100 text-xs">
                {complaintOfficer.mobile && (
                  <a
                    href={`tel:${complaintOfficer.mobile}`}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-white hover:bg-pink-50 text-gray-700 hover:text-accent-pink font-bold transition-colors shadow-2xs"
                  >
                    <img src="/icons/phone-call.svg" alt="Mobile" className="w-4 h-4" />
                    <span>{complaintOfficer.mobile}</span>
                  </a>
                )}
                {complaintOfficer.phone && (
                  <a
                    href={`tel:${complaintOfficer.phone}`}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-white hover:bg-pink-50 text-gray-700 hover:text-accent-pink font-bold transition-colors shadow-2xs"
                  >
                    <img src="/icons/phone-call.svg" alt="Phone" className="w-4 h-4" />
                    <span>{complaintOfficer.phone}</span>
                  </a>
                )}
                {complaintOfficer.email && (
                  <a
                    href={`mailto:${complaintOfficer.email}`}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-white hover:bg-pink-50 text-gray-700 hover:text-accent-pink font-bold transition-colors shadow-2xs truncate"
                  >
                    <img src="/icons/mail-envelope.svg" alt="Email" className="w-4 h-4" />
                    <span className="truncate">{complaintOfficer.email}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Redress Details & Steps */}
            <div className="md:col-span-2 space-y-5">
              {complaintOfficer.description && (
                <p className="text-sm text-gray-600 font-quicksand leading-relaxed">
                  {complaintOfficer.description}
                </p>
              )}

              {/* Address / Office Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {complaintOfficer.address && (
                  <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-2xs">
                    <span className="font-bold text-gray-400 uppercase text-[10px] block">
                      Office Room
                    </span>
                    <span className="font-medium text-gray-800 mt-1 block">
                      <img src="/icons/location-pin.svg" alt="Address" className="w-4 h-4 inline-block" /> {complaintOfficer.address}
                    </span>
                  </div>
                )}
                {complaintOfficer.office_hours && (
                  <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-2xs">
                    <span className="font-bold text-gray-400 uppercase text-[10px] block">
                      Office Hours
                    </span>
                    <span className="font-medium text-gray-800 mt-1 block">
                      <img src="/icons/clock-time.svg" alt="Hours" className="w-4 h-4 inline-block" /> {complaintOfficer.office_hours}
                    </span>
                  </div>
                )}
              </div>

              {/* Process Steps */}
              {complaintSteps.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                    Grievance Escalation & Resolution Steps:
                  </span>
                  <div className="space-y-2.5">
                    {complaintSteps.map((step, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3.5 rounded-2xl bg-white border border-purple-100/90 shadow-2xs flex items-start gap-3"
                      >
                        <span className="w-7 h-7 rounded-full bg-secondary-color text-white flex items-center justify-center font-bold text-xs shrink-0 font-fredoka">
                          {step.step_number || sIdx + 1}
                        </span>
                        <div>
                          {step.title && (
                            <h4 className="text-xs sm:text-sm font-bold text-gray-900 font-fredoka">
                              {step.title}
                            </h4>
                          )}
                          {step.description && (
                            <p className="text-xs text-gray-500 font-quicksand mt-0.5 leading-relaxed">
                              {step.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 4. Public Hotlines Section */}
      {(activeTab === 'all' || activeTab === 'hotlines') && hasHotlinesContent && (
        <section id="hotlines" className="p-6 sm:p-10 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-purple-50 pb-4">
            <span className="w-9 h-9 rounded-xl bg-lime-50 text-accent-green flex items-center justify-center">
              <img src="/icons/phone-call.svg" alt="Hotlines" className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent-green">
                Public Safety & Helplines
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-fredoka text-gray-900">
                National Emergency & Citizen Hotlines
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {hotlines
              .filter((h) => h.is_active !== false)
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-white border border-purple-100 hover:border-pink-300 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      {item.category && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-pastel-purple text-primary-color">
                          {item.category}
                        </span>
                      )}
                      {item.is_emergency && (
                        <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                          Emergency
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold font-fredoka text-gray-900 group-hover:text-primary-color transition-colors">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-xs text-gray-500 font-quicksand mt-1.5 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-purple-50 flex items-center justify-between">
                    <span className="text-xl sm:text-2xl font-black font-fredoka text-gray-900 tracking-wider">
                      {item.number}
                    </span>
                    <a
                      href={`tel:${item.number}`}
                      className="px-4 py-2 rounded-full bg-button-dark hover:opacity-90 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all inline-flex items-center gap-1.5"
                    >
                      <img src="/icons/phone-call.svg" alt="Call" className="w-3.5 h-3.5" />
                      <span>Call Now</span>
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
