import React from 'react';
import Link from 'next/link';
import { StorioLeadershipMessage } from '@/types';
import { resolveMediaUrl } from '@/lib/media';
import SplitText from '@/components/ui/SplitText';

interface LeadershipSectionProps {
  messages: StorioLeadershipMessage[];
}

function cleanHtmlToPlainText(raw?: string): string {
  if (!raw) return '';
  if (!raw.includes('<')) return raw.trim();
  return raw
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .trim();
}

export default function LeadershipSection({ messages }: LeadershipSectionProps) {
  // Only take up to 2 messages as requested
  const displayMessages = Array.isArray(messages) ? messages.slice(0, 2) : [];

  if (displayMessages.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-8 relative overflow-hidden">
      {/* Decorative ambient blurred blobs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-pink-100/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Section Header with Animated Title */}
        <div className="text-center max-w-2xl mx-auto mb-2 reveal-on-scroll">
          <span
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase text-primary-color border border-purple-200/80 shadow-2xs mb-3"
            style={{ backgroundColor: 'var(--bg-surface, #ffffff)' }}
          >
            <span className="w-2 h-2 rounded-full bg-accent-pink" />
            Leadership Desk
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-fredoka leading-tight">
            <SplitText
              text="Words from Our Leadership"
              tag="span"
              threshold={0.15}
            />
          </h2>

          <p className="mt-2 text-sm sm:text-base text-gray-600 font-quicksand font-medium">
            Guiding principles and vision from the leaders shaping our students&apos; future.
          </p>
        </div>
        {displayMessages.map((item, index) => {
          // Layout alternating rule:
          // index 0: Picture on Right, Message on Left
          // index 1: Picture on Left, Message on Right
          const isPictureOnRight = index % 2 === 0;

          const photoUrl =
            item.image_data?.file_url || item.image_data?.file
              ? resolveMediaUrl(item.image_data?.file_url || item.image_data?.file)
              : null;

          const signatureUrl =
            item.signature_data?.file_url || item.signature_data?.file
              ? resolveMediaUrl(item.signature_data?.file_url || item.signature_data?.file)
              : null;

          const plainText = cleanHtmlToPlainText(item.message);
          const charLimit = 360;
          const isLong = plainText.length > charLimit;
          const previewText = isLong
            ? `${plainText.slice(0, charLimit).trim()}...`
            : plainText;

          return (
            <div
              key={item.id}
              className={`reveal-pop ${
                index === 1 ? 'delay-150' : ''
              } relative rounded-[2.5rem] p-6 sm:p-10 lg:p-14 border border-purple-100/80 shadow-[0_12px_40px_color-mix(in_srgb,var(--primary)_6%,transparent)] hover:shadow-[0_20px_50px_color-mix(in_srgb,var(--primary)_10%,transparent)] transition-all duration-300 overflow-hidden`}
              style={{ backgroundColor: 'var(--bg-surface, #ffffff)' }}
            >
              {/* Subtle map / tech decorative background grid overlay */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none -z-0"
                style={{
                  backgroundImage:
                    'radial-gradient(var(--primary) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              <div
                className={`relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center`}
              >
                {/* Text Content Column */}
                <div
                  className={`lg:col-span-6 flex flex-col justify-center text-left ${
                    isPictureOnRight ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  {/* Role / Leadership Pill */}
                  {(item.role || item.company) && (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-primary-color border border-purple-200 shadow-2xs text-xs font-bold uppercase tracking-wider mb-5 self-start">
                      <span className="w-2 h-2 rounded-full bg-accent-pink shrink-0" />
                      <span>{item.role || item.company}</span>
                      {item.role && item.company && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-600 font-semibold lowercase first-letter:uppercase">
                            {item.company}
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Big Bold Headline */}
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-fredoka leading-[1.12] tracking-tight mb-4">
                    <span>{item.name}</span>
                  </h2>

                  {/* Role subtitle tag */}
                  {item.role && (
                    <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-primary-color mb-5">
                      <span>{item.role}</span>
                      {item.company && (
                        <>
                          <span className="text-gray-300">|</span>
                          <span className="text-gray-600 font-medium">{item.company}</span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Body message with stylish ellipsis and read more */}
                  <div className="text-gray-600 font-quicksand text-base sm:text-lg leading-relaxed mb-8 font-medium">
                    <p className="whitespace-pre-line">
                      {previewText}{' '}
                      {isLong && (
                        <Link
                          href={`/administration/leadership-message#message-${item.id}`}
                          className="inline-flex items-center font-extrabold text-accent-pink hover:text-pink-700 underline underline-offset-4 transition-colors cursor-pointer ml-1"
                        >
                          read more
                        </Link>
                      )}
                    </p>
                  </div>

                  {/* Action Buttons & Signature Row (mirroring the reference screenshot) */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-5 pt-2">
                    {/* Primary Button */}
                    <Link
                      href={`/administration/leadership-message#message-${item.id}`}
                      className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-button-dark text-white font-bold text-sm shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                      <span>Read Full Message</span>
                      <span>→</span>
                    </Link>

                    {/* Secondary Button */}
                    <Link
                      href="/administration/leadership-message"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-gray-800 hover:text-primary-color font-bold text-sm border-2 border-gray-200 hover:border-primary-color shadow-2xs transition-all"
                    >
                      <span>All Leaders</span>
                      <span>→</span>
                    </Link>

                    {/* Official Signature if provided */}
                    {signatureUrl && (
                      <div className="ml-auto flex items-center pl-4 py-1">
                        <img
                          src={signatureUrl}
                          alt={`${item.name} Signature`}
                          className="h-10 sm:h-12 max-w-[140px] object-contain opacity-85 hover:opacity-100 transition-opacity"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Picture Showcase Column */}
                <div
                  className={`lg:col-span-6 flex justify-center ${
                    isPictureOnRight ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="relative w-full max-w-lg lg:max-w-none">
                    {/* Background colorful glow */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-100 rounded-[2.5rem] blur-xl opacity-60 group-hover:opacity-100 transition duration-700 -z-10" />

                    {/* The Main Image Container */}
                    <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[5/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-50 group">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={item.name}
                          className="w-full h-full object-cover object-top group-hover:scale-104 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-purple-100 text-primary-color p-8 text-center">
                          <span className="text-7xl font-extrabold font-fredoka mb-2">
                            {item.name ? item.name.charAt(0) : 'L'}
                          </span>
                          <span className="text-base font-bold text-primary-color">
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-500 font-semibold mt-1">
                            {item.role || 'Leadership'}
                          </span>
                        </div>
                      )}

                      {/* Floating Badge on the image (mirroring the screenshot's floating pill / badge aesthetic) */}
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-purple-100 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-gray-800 truncate max-w-[200px]">
                          {item.role || 'Institutional Leader'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* View All Leadership Messages button if more exist */}
        {messages.length > 2 && (
          <div className="text-center pt-2">
            <Link
              href="/administration/leadership-message"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-primary-color border border-purple-200 font-bold text-sm shadow-xs hover:shadow-md hover:bg-pastel-purple transition-all"
            >
              <span>View All Leadership Messages ({messages.length})</span>
              <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
