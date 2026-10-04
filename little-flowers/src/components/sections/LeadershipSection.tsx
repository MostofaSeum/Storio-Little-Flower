import React from 'react';
import Link from 'next/link';
import { StorioLeadershipMessage } from '@/types';
import { resolveMediaUrl } from '@/lib/media';

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
    <section className="py-12 sm:py-16 px-4 sm:px-8 bg-pastel-purple/50 border-y border-purple-100/60 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-purple-100/60 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-pink-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
        {displayMessages.map((item, index) => {
          // Layout rule:
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
          const charLimit = 320;
          const isLong = plainText.length > charLimit;
          const previewText = isLong
            ? `${plainText.slice(0, charLimit).trim()}...`
            : plainText;

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm border border-purple-100 hover:shadow-md transition-shadow"
            >
              <div
                className={`flex flex-col ${
                  isPictureOnRight ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } items-center lg:items-stretch gap-8 lg:gap-12`}
              >
                {/* Text Content Column */}
                <div className="flex-1 flex flex-col justify-between order-2 lg:order-1 text-left">
                  <div>
                    {/* Header Pill & Role */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pastel-purple text-primary-color text-xs font-bold uppercase tracking-wider mb-3 border border-purple-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-pink" />
                      <span>{item.section_title || 'Leadership Message'}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-color font-fredoka leading-tight">
                      {item.name}
                    </h2>

                    {(item.role || item.company) && (
                      <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1 mb-5">
                        {item.role}
                        {item.role && item.company && <span className="mx-2 text-gray-300">|</span>}
                        {item.company}
                      </p>
                    )}

                    {/* Message Preview */}
                    <p className="text-gray-600 font-quicksand text-sm sm:text-base leading-relaxed whitespace-pre-line">
                      {previewText}{' '}
                      {isLong && (
                        <Link
                          href={`/administration/leadership-message#message-${item.id}`}
                          className="inline-flex items-center font-bold text-accent-pink hover:text-pink-700 underline underline-offset-4 ml-1 transition-colors cursor-pointer"
                        >
                          read more
                        </Link>
                      )}
                    </p>
                  </div>

                  {/* Signature and Full Messages Link */}
                  <div className="mt-6 pt-4 border-t border-purple-100/80 flex flex-wrap items-center justify-between gap-4">
                    <Link
                      href={`/administration/leadership-message#message-${item.id}`}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-primary-color hover:text-accent-pink transition-colors group"
                    >
                      <span>View Full Message & Bio</span>
                      <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </Link>

                    {signatureUrl && (
                      <div className="flex items-center">
                        <img
                          src={signatureUrl}
                          alt={`${item.name} Signature`}
                          className="h-10 sm:h-12 max-w-[140px] object-contain opacity-90"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Picture Column */}
                <div className="w-full lg:w-[380px] shrink-0 flex flex-col items-center justify-center order-1 lg:order-2">
                  <div className="relative w-full max-w-[320px] lg:max-w-none aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden shadow-md border-4 border-white bg-pastel-purple group">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-purple-100 text-primary-color">
                        <span className="text-5xl font-extrabold font-fredoka">
                          {item.name ? item.name.charAt(0) : 'L'}
                        </span>
                        <span className="text-xs font-bold mt-2 text-gray-500">
                          {item.role || 'Leadership'}
                        </span>
                      </div>
                    )}
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
