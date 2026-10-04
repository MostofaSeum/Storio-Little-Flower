'use client';

import { useEffect } from 'react';

/**
 * ScrollObserver Component
 * 
 * Lightweight client component that watches elements with `.reveal-on-scroll`
 * using IntersectionObserver and toggles `.is-revealed` when scrolled into view.
 * Works seamlessly with Next.js Server Components without needing heavy animation libraries.
 */
export default function ScrollObserver() {
  useEffect(() => {
    const elements = document.querySelectorAll(
      '.reveal-on-scroll, .reveal-from-left, .reveal-from-right, .reveal-pop'
    );
    if (!elements || elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  return null;
}
