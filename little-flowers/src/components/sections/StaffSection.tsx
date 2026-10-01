import React from 'react';
import { StorioStaffMember } from '@storio/template-sdk';
import SplitText from '@/components/ui/SplitText';
import { getStaffMemberPhoto } from '@/lib/storio';

interface StaffSectionProps {
  staffList: StorioStaffMember[];
}

export default function StaffSection({ staffList }: StaffSectionProps) {
  if (!staffList || staffList.length === 0) return null;

  return (
    <section
      id="teachers"
      className="site-section-py site-section-px site-container w-full"
    >
      <div className="text-center max-w-2xl mx-auto mb-14 reveal-on-scroll">
        <span className="text-xs font-extrabold tracking-wider uppercase text-secondary-color bg-amber-100 px-3 py-1 rounded-full">
          Warm & Caring
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-color mt-3 font-fredoka">
          <SplitText
            text="Meet Our Loving Mentors"
            tag="span"
            splitType="chars"
            delay={30}
            duration={0.7}
            ease="power3.out"
            className="inline-block"
          />
        </h2>
        <p className="text-gray-500 text-sm mt-2 font-medium">
          Certified childhood educators dedicated to giving every child warmth,
          guidance, and laughter.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {staffList.map((member, idx) => {
          const borderColors = [
            "hover:border-secondary-color",
            "hover:border-accent-pink",
            "hover:border-accent-blue",
            "hover:border-accent-green",
          ];
          const ringGradients = [
            "from-amber-300 via-amber-400 to-pink-300",
            "from-pink-300 via-rose-400 to-purple-300",
            "from-sky-300 via-blue-400 to-teal-300",
            "from-lime-300 via-emerald-400 to-amber-300",
          ];
          const tagColors = [
            "bg-amber-50 text-secondary-color",
            "bg-pink-50 text-accent-pink",
            "bg-sky-50 text-accent-blue",
            "bg-lime-50 text-accent-green",
          ];

          const staffPhoto = getStaffMemberPhoto(member);
          const designation =
            member.designation ||
            (member as { role?: string }).role ||
            "Teacher & Mentor";

          // If department is numeric ID (like 1), prefer department_name
          const rawDept = (member as { department_name?: string }).department_name || member.department;
          const departmentName =
            rawDept && isNaN(Number(rawDept))
              ? String(rawDept)
              : (member as { department_name?: string }).department_name || null;

          return (
            <div
              key={member.id}
              className={`flex flex-col items-center text-center p-7 bg-white rounded-3xl border-2 border-gray-100 ${borderColors[idx % 4]} group mentor-card reveal-on-scroll delay-${(idx % 4) * 100 + 100} relative overflow-hidden`}
            >
              {/* Mentor Avatar with animated gradient halo */}
              <div className="relative mb-5">
                <div
                  className={`w-32 h-32 rounded-full p-1 bg-gradient-to-tr ${ringGradients[idx % 4]} mentor-ring shadow-sm`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-white p-0.5">
                    <img
                      src={staffPhoto}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>
                </div>
              </div>

              {/* Mentor Info */}
              <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-primary-color transition-colors">
                {member.name}
              </h3>
              <span className="text-xs font-bold text-accent-pink mt-1">
                {designation}
              </span>

              {/* Department / Specialty Pill (Only if available text, never raw ID number) */}
              {departmentName && (
                <span
                  className={`inline-block text-[11px] font-bold px-3 py-0.5 rounded-full mt-2.5 ${tagColors[idx % 4]} transition-transform duration-300 group-hover:scale-105`}
                >
                  {departmentName}
                </span>
              )}

              {member.bio && (
                <p className="text-xs text-gray-500 mt-2.5 line-clamp-3 leading-relaxed">
                  {member.bio.replace(/;;/g, ' ')}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
