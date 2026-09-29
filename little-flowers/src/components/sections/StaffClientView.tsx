'use client';

import React, { useState } from 'react';
import { StorioStaffMember } from '@storio/template-sdk';
import { getStaffMemberPhoto } from '@/lib/media';

interface StaffClientViewProps {
  staffList: StorioStaffMember[];
  teamList: StorioStaffMember[];
}

export default function StaffClientView({ staffList, teamList }: StaffClientViewProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'teachers' | 'leadership'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Normalize and combine members with category tags
  const teachers = staffList.map((s) => ({
    ...s,
    group: 'teachers' as const,
    displayName: s.name || (s as { fullname?: string }).fullname || 'Faculty Member',
    displayRole: s.designation || (s as { role?: string }).role || 'Teacher / Mentor',
    displayDept: s.department || (s as { department_name?: string }).department_name || (s as { section_name?: string }).section_name || 'Academic',
    displayBio: s.bio || (s as { experience?: string }).experience || '',
    displayEmail: s.email || '',
    displayPhone: s.phone_number || (s as { phone?: string }).phone || '',
  }));

  const leadership = teamList.map((t) => ({
    ...t,
    group: 'leadership' as const,
    displayName: t.name || (t as { fullname?: string }).fullname || 'Board Member',
    displayRole: t.designation || (t as { role?: string }).role || 'Executive Member',
    displayDept: t.department || (t as { department_name?: string }).department_name || (t as { section_name?: string }).section_name || 'Governing Body',
    displayBio: t.bio || (t as { experience?: string }).experience || '',
    displayEmail: t.email || '',
    displayPhone: t.phone_number || (t as { phone?: string }).phone || '',
  }));

  const allMembers = [...teachers, ...leadership];

  const filteredMembers = allMembers.filter((member) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'teachers' && member.group === 'teachers') ||
      (activeTab === 'leadership' && member.group === 'leadership');

    if (!matchesTab) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return (
      member.displayName.toLowerCase().includes(q) ||
      member.displayRole.toLowerCase().includes(q) ||
      member.displayDept.toLowerCase().includes(q) ||
      member.displayBio.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-purple-50 shadow-sm">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-primary-color text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Members ({allMembers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('teachers')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'teachers'
                ? 'bg-primary-color text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mentors &amp; Faculty ({teachers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('leadership')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'leadership'
                ? 'bg-primary-color text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Governing Board ({leadership.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, role, or subject..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-primary-color focus:bg-white transition"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2"
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
                        className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
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
            👥
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
