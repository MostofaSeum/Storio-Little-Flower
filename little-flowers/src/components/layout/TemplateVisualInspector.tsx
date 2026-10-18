'use client';

import React, { useEffect, useState, useRef } from 'react';
import { setLiveConfig } from '@/lib/liveConfig';

// Inline pencil icon — do NOT add lucide-react as a dependency (it is not used by this template).
const PencilIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);

interface ActiveTarget {
  rect: DOMRect;
  title: string;
  fieldId?: string;
  sectionId?: string;
}

export default function TemplateVisualInspector() {
  const [enabled, setEnabled] = useState(false);
  const [activeTarget, setActiveTarget] = useState<ActiveTarget | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const isInsideIframe =
    typeof window !== 'undefined' && window.self !== window.top;

  // Toggle from the admin panel
  useEffect(() => {
    if (!isInsideIframe) return;
    const onMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SET_INSPECTOR_MODE') {
        setEnabled(Boolean(event.data.enabled));
        if (!event.data.enabled) setActiveTarget(null);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [isInsideIframe]);

  // Live CSS variables + live text store (existing behavior + new store update)
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'THEME_UPDATE' && data.config) {
        const config = data.config as Record<string, unknown>;
        const root = document.documentElement;
        if (config.primaryColor) root.style.setProperty('--primary', String(config.primaryColor));
        if (config.primary_color) root.style.setProperty('--primary', String(config.primary_color));
        if (config.secondaryColor) root.style.setProperty('--secondary', String(config.secondaryColor));
        if (config.accentPink || config.accentColor) {
          const pink = String(config.accentPink || config.accentColor);
          root.style.setProperty('--accent-pink', pink);
          root.style.setProperty('--accent-pink-hover', pink);
        }
        if (config.accentBlue) {
          const blue = String(config.accentBlue);
          root.style.setProperty('--accent-blue', blue);
          root.style.setProperty('--accent-soft-blue', `color-mix(in srgb, ${blue} 14%, white)`);
        }
        if (config.backgroundColor) {
          const bg = String(config.backgroundColor);
          root.style.setProperty('--bg-main', bg);
          root.style.setProperty('--bg-pastel-purple', bg);
        }
        if (config.surfaceColor) root.style.setProperty('--bg-surface', String(config.surfaceColor));
        if (config.footerColor) root.style.setProperty('--footer-bg', String(config.footerColor));
        if (config.topbarBgColor) root.style.setProperty('--topbar-bg', String(config.topbarBgColor));
        if (config.buttonColor) root.style.setProperty('--button-bg', String(config.buttonColor));
        if (config.buttonTextColor) root.style.setProperty('--button-text', String(config.buttonTextColor));
        if (config.buttonHoverColor) root.style.setProperty('--button-hover', String(config.buttonHoverColor));
        if (config.buttonTextHoverColor) root.style.setProperty('--button-text-hover', String(config.buttonTextHoverColor));
        if (config.activeNavBgColor) root.style.setProperty('--active-nav-bg', String(config.activeNavBgColor));
        if (config.activeNavTextColor) root.style.setProperty('--active-nav-text', String(config.activeNavTextColor));
        if (config.textColor) {
          const text = String(config.textColor);
          root.style.setProperty('--text-dark', text);
          root.style.setProperty('--text-muted', text);
        }
        if (config.headingColor) root.style.setProperty('--heading-color', String(config.headingColor));
        if (config.borderRadius) {
          const radius = String(config.borderRadius).endsWith('px')
            ? String(config.borderRadius)
            : `${config.borderRadius}px`;
          root.style.setProperty('--button-border-radius', radius);
        }

        // Keep custom event dispatched for compatibility
        window.dispatchEvent(new CustomEvent('storio:theme-update', { detail: config }));

        // NEW: feed the live text store
        setLiveConfig(config as any);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Hover detection
  useEffect(() => {
    if (!isInsideIframe || !enabled) {
      setActiveTarget(null);
      return;
    }
    const handleMouseMove = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        '[data-customizer-field], [data-customizer-section]'
      ) as HTMLElement | null;

      if (!target) {
        if (overlayRef.current?.contains(e.target as Node)) return;
        setActiveTarget(null);
        return;
      }

      const rect = target.getBoundingClientRect();
      const fieldId = target.getAttribute('data-customizer-field') || undefined;
      const sectionId = target.getAttribute('data-customizer-section') || undefined;
      const title =
        target.getAttribute('data-customizer-title') ||
        (fieldId ? `Edit: ${fieldId}` : sectionId ? `Edit ${sectionId}` : 'Edit Component');

      setActiveTarget({ rect, title, fieldId, sectionId });
    };

    const handleScrollOrResize = () => setActiveTarget(null);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isInsideIframe, enabled]);

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!activeTarget) return;

    window.parent.postMessage(
      {
        type: 'CUSTOMIZER_INSPECT_CLICK', // MUST be this exact string
        fieldId: activeTarget.fieldId,
        sectionId: activeTarget.sectionId, // property name MUST be sectionId
        title: activeTarget.title,         // include title
      },
      '*'
    );
  };

  if (!isInsideIframe || !enabled || !activeTarget) return null;

  const { rect, title } = activeTarget;
  if (rect.width <= 0 || rect.height <= 0) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed pointer-events-none z-[9999999] transition-all duration-75 ease-out"
      style={{
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      }}
    >
      <div className="absolute inset-0 border-2 border-dashed border-sky-500 rounded-lg pointer-events-none bg-sky-500/5 shadow-[0_0_15px_rgba(14,165,233,0.3)] animate-in fade-in duration-100" />
      <div
        className="absolute -top-3.5 right-4 pointer-events-auto"
        style={{ transform: rect.top < 40 ? 'translateY(38px)' : 'none' }}
      >
        <button
          type="button"
          onClick={handleEditClick}
          className="flex items-center gap-1.5 px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-full shadow-lg shadow-sky-600/40 border border-white/90 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
          title={`Click to edit ${title} in dashboard`}
        >
          <PencilIcon />
          <span>{title}</span>
        </button>
      </div>
    </div>
  );
}
