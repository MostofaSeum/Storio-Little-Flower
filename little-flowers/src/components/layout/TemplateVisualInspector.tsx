'use client';

import { useEffect } from 'react';

/**
 * TemplateVisualInspector
 * 
 * Implements Storio Template Customization Guide specifications:
 * 1. Visual Click-to-Edit Inspector:
 *    - In the Storio Admin customizer iframe, shows visual outline & badge on hover
 *    - Clicking an element with `data-customizer-field` posts an 'INSPECT_FIELD' message to parent
 * 2. Real-Time Live Preview Sync:
 *    - Listens for `THEME_UPDATE` message from the Storio Admin Panel
 *    - Immediately applies updated CSS variables and dispatches custom events without full reload
 */
export default function TemplateVisualInspector() {
  useEffect(() => {
    // Only activate if running inside an iframe (Storio Admin preview mode)
    const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
    if (!isInIframe) return;

    // --- 1. Real-time Live Preview Listener ---
    const handleMessage = (event: MessageEvent) => {
      // Security check: Ignore messages from unrecognized sources if needed
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'THEME_UPDATE' && data.config) {
        const config = data.config as Record<string, unknown>;

        // Dynamically update CSS variables on document root
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
          const radius = String(config.borderRadius).endsWith('px') ? String(config.borderRadius) : `${config.borderRadius}px`;
          root.style.setProperty('--button-border-radius', radius);
        }

        // Dispatch a custom event so client components can reactively update their state if desired
        window.dispatchEvent(new CustomEvent('storio:theme-update', { detail: config }));
      }
    };

    window.addEventListener('message', handleMessage);

    // --- 2. Visual Click-to-Edit Inspector Overlay ---
    let hoverOutline: HTMLDivElement | null = document.createElement('div');
    hoverOutline.id = 'storio-customizer-outline';
    hoverOutline.style.position = 'fixed';
    hoverOutline.style.pointerEvents = 'none';
    hoverOutline.style.border = '2px dashed #0284c7';
    hoverOutline.style.borderRadius = '8px';
    hoverOutline.style.backgroundColor = 'rgba(2, 132, 199, 0.08)';
    hoverOutline.style.zIndex = '999999';
    hoverOutline.style.display = 'none';
    hoverOutline.style.transition = 'all 0.12s ease';

    const badge = document.createElement('div');
    badge.id = 'storio-customizer-badge';
    badge.style.position = 'absolute';
    badge.style.top = '-26px';
    badge.style.left = '0';
    badge.style.backgroundColor = '#0284c7';
    badge.style.color = '#ffffff';
    badge.style.fontSize = '11px';
    badge.style.fontWeight = '700';
    badge.style.padding = '2px 8px';
    badge.style.borderRadius = '4px';
    badge.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
    badge.style.whiteSpace = 'nowrap';
    hoverOutline.appendChild(badge);

    document.body.appendChild(hoverOutline);

    let activeTarget: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-customizer-field]') as HTMLElement | null;
      if (!target) {
        if (hoverOutline) hoverOutline.style.display = 'none';
        activeTarget = null;
        return;
      }

      activeTarget = target;
      const rect = target.getBoundingClientRect();
      const fieldId = target.getAttribute('data-customizer-field');
      const title = target.getAttribute('data-customizer-title') || fieldId || 'Edit Setting';

      if (hoverOutline) {
        hoverOutline.style.display = 'block';
        hoverOutline.style.top = `${rect.top}px`;
        hoverOutline.style.left = `${rect.left}px`;
        hoverOutline.style.width = `${rect.width}px`;
        hoverOutline.style.height = `${rect.height}px`;
        badge.textContent = `✎ Edit: ${title}`;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('[data-customizer-field]') as HTMLElement | null;
      if (!target) return;

      const fieldId = target.getAttribute('data-customizer-field');
      const section = target.getAttribute('data-customizer-section');
      if (fieldId) {
        e.preventDefault();
        e.stopPropagation();

        // Send inspection event to Storio Admin Panel
        window.parent.postMessage(
          {
            type: 'INSPECT_FIELD',
            fieldId,
            section: section || 'content',
          },
          '*'
        );
      }
    };

    const handleScroll = () => {
      if (activeTarget && hoverOutline && hoverOutline.style.display !== 'none') {
        const rect = activeTarget.getBoundingClientRect();
        hoverOutline.style.top = `${rect.top}px`;
        hoverOutline.style.left = `${rect.left}px`;
        hoverOutline.style.width = `${rect.width}px`;
        hoverOutline.style.height = `${rect.height}px`;
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick, true);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('scroll', handleScroll);
      if (hoverOutline && hoverOutline.parentNode) {
        hoverOutline.parentNode.removeChild(hoverOutline);
      }
    };
  }, []);

  return null;
}
