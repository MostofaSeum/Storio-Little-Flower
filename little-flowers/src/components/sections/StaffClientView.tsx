'use client';

import React, { useState } from 'react';
import { StorioStaffMember, StorioTeamMember } from '@/types';
import { getStaffMemberPhoto } from '@/lib/media';

interface StaffClientViewProps {
  staffList: StorioStaffMember[];
  teamList: (StorioStaffMember | StorioTeamMember)[];
  initialTab?: 'all' | 'teachers' | 'leadership';
}

export default function StaffClientView({
  staffList,
  teamList,
  initialTab = 'all',
}: StaffClientViewProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'teachers' | 'leadership'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  // Normalize and combine members with category tags
  const teachers = staffList.map((s) => {
    const raw = s as unknown as Record<string, unknown>;
    const name = String(s.name || raw.fullname || raw.title || 'Faculty Member');
    const role = String(s.designation || raw.role || raw.position || '');
    const dept = String(raw.department_name || (isNaN(Number(s.department)) ? s.department : '') || raw.section_name || '');
    const bio = String(s.bio || raw.experience || '');
    const email = String(s.email || '');
    const phone = String(s.phone_number || raw.phone || '');

    return {
      ...s,
      group: 'teachers' as const,
      displayName: name,
      displayRole: role,
      displayDept: dept,
      displayBio: bio,
      displayEmail: email,
      displayPhone: phone,
      searchIndex: `${name} ${role} ${dept} ${bio} ${email} ${phone}`.toLowerCase(),
    };
  });

  const leadership = teamList.map((t) => {
    const raw = t as unknown as Record<string, unknown>;
    const name = String(raw.fullname || raw.name || raw.title || 'Board Member');
    const role = String(raw.designation || raw.role || raw.position || '');
    const dept = String(raw.section_name || raw.department_name || (isNaN(Number(raw.department)) ? raw.department : '') || 'Governing Body');
    const bio = String(raw.experience || raw.bio || '');
    const email = String(raw.email || '');
    const phone = String(raw.phone || raw.phone_number || '');

    return {
      ...t,
      group: 'leadership' as const,
      displayName: name,
      displayRole: role,
      displayDept: dept,
      displayBio: bio,
      displayEmail: email,
      displayPhone: phone,
      searchIndex: `${name} ${role} ${dept} ${bio} ${email} ${phone}`.toLowerCase(),
    };
  });

  const allMembers = [...teachers, ...leadership];

  const filteredMembers = allMembers.filter((member) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'teachers' && member.group === 'teachers') ||
      (activeTab === 'leadership' && member.group === 'leadership');

    if (!matchesTab) return false;

    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return true;

    // Fast multi-keyword matching: every keyword entered must match somewhere in the search index
    const keywords = trimmed.split(/\s+/).filter(Boolean);
    return keywords.every((kw) => member.searchIndex.includes(kw));
  });

  return (
    <div className="space-y-8">
      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-purple-50 shadow-sm">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 bg-gray-50 rounded-2xl w-full sm:w-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'all'
                ? 'bg-primary-color text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({allMembers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('teachers')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'teachers'
                ? 'bg-primary-color text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Faculty ({teachers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('leadership')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'leadership'
                ? 'bg-primary-color text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Governing Board ({leadership.length})
          </button>
        </div>

        {/* Search Input with Clear Button */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, role, or subject..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-primary-color focus:bg-white transition text-gray-900"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5 text-xs rounded-full"
            >
              <img src="/icons/close-cross.svg" alt="Close" className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Members */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member, idx) => {
            const photoUrl = getStaffMemberPhoto(member);
            const isLeadership = member.group === 'leadership';

            const borderColors = [
              'hover:border-secondary-color',
              'hover:border-accent-pink',
              'hover:border-accent-blue',
              'hover:border-accent-green',
            ];

            const ringGradients = [
              'from-amber-300 via-amber-400 to-pink-300',
              'from-pink-300 via-rose-400 to-purple-300',
              'from-sky-300 via-blue-400 to-teal-300',
              'from-lime-300 via-emerald-400 to-amber-300',
            ];

            return (
              <div
                key={`${member.group}-${member.id}-${idx}`}
                className={`bg-white rounded-3xl p-6 border-2 border-gray-100 ${
                  borderColors[idx % 4]
                } shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group transform hover:-translate-y-1`}
              >
                {/* Avatar with Halo Ring */}
                <div className="relative mb-5">
                  <div
                    className={`w-32 h-32 rounded-full p-1 bg-gradient-to-tr ${
                      isLeadership
                        ? 'from-purple-400 via-indigo-500 to-pink-400'
                        : ringGradients[idx % 4]
                    } shadow-sm`}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden bg-white p-0.5">
                      <img
                        src={photoUrl}
                        alt={member.displayName}
                        className="w-full h-full object-cover object-top rounded-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Group Badge */}
                  <span
                    className={`absolute bottom-0 right-1 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border ${
                      isLeadership
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {isLeadership ? 'Board' : 'Faculty'}
                  </span>
                </div>

                {/* Name & Designation */}
                <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-primary-color transition-colors line-clamp-1">
                  {member.displayName}
                </h3>
                <p className="text-xs font-bold text-accent-pink mt-1 line-clamp-1">
                  {member.displayRole}
                </p>

                {/* Department */}
                {member.displayDept && (
                  <span className="mt-2 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {member.displayDept}
                  </span>
                )}

                {/* Bio */}
                {member.displayBio && (
                  <p className="mt-3 text-xs text-gray-500 line-clamp-3 leading-relaxed">
                    {member.displayBio.replace(/;;/g, ' ')}
                  </p>
                )}

                {/* Contact info if present */}
                {(member.displayEmail || member.displayPhone) && (
                  <div className="mt-auto pt-4 w-full border-t border-gray-100 flex items-center justify-center gap-3 text-gray-400 text-xs">
                    {member.displayEmail && (
                      <a
                        href={`mailto:${member.displayEmail}`}
                        title={member.displayEmail}
                        className="hover:text-primary-color transition-colors p-1.5 rounded-full hover:bg-purple-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </a>
                    )}
                    {member.displayPhone && (
                      <a
                        href={`tel:${member.displayPhone}`}
                        title={member.displayPhone}
                        className="hover:text-secondary-color transition-colors p-1.5 rounded-full hover:bg-amber-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="max-w-md mx-auto text-center py-16 px-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-50 text-primary-color flex items-center justify-center text-3xl">
            <img src="/icons/user-group.svg" alt="Team" className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Profiles Found</h3>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? `No members found matching "${searchQuery}". Try a different keyword.`
              : 'Directory profiles will appear once configured in the CMS.'}
          </p>
        </div>
      )}
    </div>
  );
}
