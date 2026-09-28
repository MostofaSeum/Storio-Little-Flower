'use client';

import React, { useState } from 'react';
import { StorioFaq } from '@/data/storioExtendedTypes';
import SplitText from '@/Components/SplitText';

interface FaqSectionProps {
  faqs: StorioFaq[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const [openId, setOpenId] = useState<number | null>(faqs?.[0]?.id ?? null);

  if (!faqs || faqs.length === 0) return null;

  const toggleFaq = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const borderColors = [
    'border-pink-200 hover:border-pink-300',
    'border-amber-200 hover:border-amber-300',
    'border-sky-200 hover:border-sky-300',
    'border-lime-200 hover:border-lime-300',
    'border-purple-200 hover:border-purple-300',
  ];

  const badgeBgs = [
    'bg-accent-pink text-white',
    'bg-secondary-color text-white',
    'bg-accent-blue text-white',
    'bg-accent-green text-white',
    'bg-primary-color text-white',
  ];

  return (
    <section id="faqs" className="py-20 px-4 sm:px-8 bg-pastel-purple border-t border-purple-100/60 relative overflow-hidden">
      {/* Playful background decorative shapes */}
      <div className="absolute top-12 left-8 w-44 h-44 bg-soft-pink rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-52 h-52 bg-soft-amber rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header with SplitText from React Bits */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-extrabold tracking-wider uppercase text-secondary-color bg-amber-100 px-3.5 py-1 rounded-full shadow-xs mb-3">
            Got Questions?
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-color leading-tight font-fredoka">
            <SplitText
              text="Frequently Asked Questions"
              tag="span"
              splitType="chars"
              delay={35}
              duration={0.8}
              ease="power3.out"
              className="inline-block"
            />
          </h2>

          <p className="text-gray-500 text-sm mt-3 font-medium max-w-xl mx-auto">
            Everything parents need to know about our admissions, caring teachers, daily curriculum, and campus life.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openId === faq.id;
            const borderCls = borderColors[idx % borderColors.length];
            const badgeCls = badgeBgs[idx % badgeBgs.length];

            return (
              <div
                key={faq.id}
                className={`bg-white rounded-3xl border-2 ${borderCls} transition-all duration-300 shadow-xs overflow-hidden ${
                  isOpen ? 'shadow-md ring-2 ring-purple-100/60' : 'hover:shadow-sm'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <span
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 shadow-xs ${badgeCls}`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-extrabold text-gray-900 text-sm sm:text-base hover:text-primary-color transition-colors">
                      {faq.question}
                    </span>
                  </div>

                  <span
                    className={`w-8 h-8 rounded-full bg-pastel-purple flex items-center justify-center text-primary-color font-black text-sm shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-purple-100' : 'hover:scale-105'
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-purple-50 animate-fadeIn">
                    <p className="pl-10 sm:pl-12 font-medium text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom prompt for parents */}
        <div className="mt-10 text-center">
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Still have queries? We are here to help!{' '}
            <a
              href="#contact"
              className="font-bold text-accent-pink hover:text-accent-pink-hover underline decoration-pink-300 underline-offset-4 transition-colors"
            >
              Reach out to our campus office →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
