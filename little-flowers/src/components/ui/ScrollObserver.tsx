'use client';

import { useEffect } from 'react';

/**
 * ScrollObserver Component
 * 
 * Lightweight client component that watches elements with .reveal-on-scroll
 * using IntersectionObserver and toggles .is-revealed when scrolled into view.
 * 
 * Optimized for:
 * - Admin Customizer Preview (iframes / scaled viewports)
 * - Dynamic DOM rendering & hydration
 * - Fail-safe visibility so content never gets stuck at opacity 0
 */
export default function ScrollObserver() {
  useEffect(() => {
    const selector = '.reveal-on-scroll, .reveal-from-left, .reveal-from-right, .reveal-pop';

    const revealAll = (elements: NodeListOf<Element> | Element[]) => {
      elements.forEach((el) => el.classList.add('is-revealed'));
    };

    const isInIframe =
      typeof window !== 'undefined' &&
      (window.self !== window.top || window.location.search.includes('preview=true'));

    const elements = document.querySelectorAll(selector);

    // In admin preview iframe or customizer, immediately reveal elements so inspector and preview work cleanly
    if (isInIframe) {
      revealAll(elements);
    }

    if (!elements || elements.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      revealAll(elements);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '100px 0px 50px 0px',
      }
    );

    elements.forEach((el) => {
      // Check if element is already in viewport
      const rect = el.getBoundingClientRect();
      if (rect.top < (window.innerHeight || document.documentElement.clientHeight) + 100) {
        el.classList.add('is-revealed');
      } else {
        observer.observe(el);
      }
    });

    // Safety fallback: reveal any remaining elements after 800ms so nothing stays transparent
    const timer = setTimeout(() => {
      const pendingElements = document.querySelectorAll(selector);
      pendingElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < (window.innerHeight || document.documentElement.clientHeight) + 200) {
          el.classList.add('is-revealed');
        }
      });
    }, 800);

    // Watch for dynamically rendered content (e.g. live updates or client hydrations)
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              if (node.matches(selector)) {
                if (isInIframe) {
                  node.classList.add('is-revealed');
                } else {
                  observer.observe(node);
                }
              }
              const childMatches = node.querySelectorAll(selector);
              if (isInIframe) {
                revealAll(childMatches);
              } else {
                childMatches.forEach((child) => observer.observe(child));
              }
            }
          });
        }
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
