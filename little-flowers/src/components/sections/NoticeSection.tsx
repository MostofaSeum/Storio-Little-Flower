import React from 'react';
import { StorioNotice } from '@storio/template-sdk';
import SplitText from '@/components/ui/SplitText';

interface NoticeSectionProps {
  notices: StorioNotice[];
}

export default function NoticeSection({ notices }: NoticeSectionProps) {
  if (!notices || notices.length === 0) return null;

  return (
    <section
      id="notices"
      className="bg-pastel-purple py-16 px-4 sm:px-8 border-b border-purple-50"
    >
      <div className="site-container">
        <div className="flex flex-wrap items-end justify-between border-b-2 border-purple-100 pb-4 mb-8 gap-4 reveal-on-scroll">
          <div>
            <span className="text-xs font-extrabold tracking-wider uppercase text-accent-pink bg-pink-100 px-3 py-1 rounded-full">
              Important Circulars
            </span>
            <h3 className="text-3xl font-extrabold text-primary-color mt-2 font-fredoka">
              <SplitText
                text="Campus Announcements"
                tag="span"
                splitType="chars"
                delay={30}
                duration={0.7}
                ease="power3.out"
                textAlign="left"
                className="inline-block"
              />
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              Stay updated with latest school circulars, events, and schedules
            </p>
          </div>
          <a
            href="/notice"
            className="text-xs sm:text-sm font-bold text-accent-pink hover:text-accent-pink-hover transition-colors"
          >
            View All Notices
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices.slice(0, 6).map((notice, idx) => (
            <div
              key={notice.id}
              className={`p-6 rounded-3xl bg-white border border-purple-100 hover:border-pink-300 relative overflow-hidden flex flex-col justify-between group card-interactive cursor-pointer reveal-on-scroll delay-${(idx % 3) * 100 + 100}`}
            >
              {notice.is_urgent && (
                <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white px-2.5 py-0.5 rounded-full shadow-xs animate-pulse">
                  Urgent
                </span>
              )}
              <div>
                <span className="text-xs font-bold text-secondary-color bg-amber-50 px-2.5 py-0.5 rounded-full">
                  {notice.published_date || "Recent Notice"}
                </span>
                <h4 className="font-extrabold text-gray-800 text-base mt-3 line-clamp-2 group-hover:text-primary-color transition-colors">
                  {notice.title}
                </h4>
                {notice.content && (
                  <p className="text-gray-500 text-xs mt-2 line-clamp-3 leading-relaxed">
                    {notice.content}
                  </p>
                )}
              </div>
              <a
                href={`/notice/${notice.id}`}
                className="mt-5 text-xs font-bold text-primary-color group-hover:text-accent-pink inline-flex items-center transform group-hover:translate-x-1 transition-transform"
              >
                Read Circular &rarr;
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
