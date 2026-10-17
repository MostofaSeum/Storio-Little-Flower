# ANTIGRAVITY PROMPT
## Add Zenova-style "Click-to-Edit + Live Customization" to the Little Flowers template

> Paste this entire document into Antigravity. It is self-contained.

---

## 0. PROJECT CONTEXT

- Repository root: `D:\Brainicon Technology\storio-cms`
- Target template: `little-flower/` (Next.js 16 App Router, TypeScript, Tailwind CSS v4, React 19)
- Admin panel: `frontend-next/` — **ALREADY CORRECT. DO NOT MODIFY IT.**
- Reference implementation that already works: `zenova/` — **use it as the spec.**
- Backend: `backend/` — serves the template manifest at `/api/v2/system/template-manifest/<template_id>/`.

### What "working" means (acceptance criteria)
Inside the admin panel's **Template Customization** preview iframe, for the Little Flowers template:
1. Hovering over a customizable element shows a dashed outline + a badge like `Edit: Hero Headline`.
2. Clicking that badge makes the admin sidebar open the correct section and scroll/highlight the matching input.
3. Editing a text field (e.g. "Hero Headline") updates the preview text **live, without reload**.
4. The "Inspector: ON/OFF" toggle in the admin panel enables/disables the hover overlay.
5. Colors/images already update live — keep that working.

---

## 1. HOW ZENOVA DOES IT (READ FIRST — THIS IS THE SPEC)

### 1.1 Mounting — `zenova/app/layout.tsx`
```tsx
<ThemeProvider initialConfig={layout?.customConfig || null}>   // line ~204
  <TemplateVisualInspector />                                    // line ~205
  <Navbar/> ... <Footer/>
</ThemeProvider>
```

### 1.2 `zenova/components/ui/ThemeProvider.tsx` (reactive config engine)
- Holds `config` in React state (`useState(initialConfig)`).
- Listens for the `THEME_UPDATE` postMessage and does `setConfig({...prev, ...newConfig})`.
- Injects a `<style id="dynamic-custom-theme">` generated from the config.
- Exposes a `useTheme()` hook so components read the live config.
- Also has a V1 fallback that fetches config from URL params.

### 1.3 `zenova/components/ui/TemplateVisualInspector.tsx` (hover/click overlay)
- Only active when `window.self !== window.top` (inside the iframe).
- On `mousemove`, finds `closest('[data-customizer-field], [data-customizer-section]')` and stores `{rect, fieldId, sectionId, title}`.
- Renders a dashed outline + a **real clickable React `<button>`** badge.
- Button click posts:
  ```js
  window.parent.postMessage({ type: 'CUSTOMIZER_INSPECT_CLICK', fieldId, sectionId, title }, '*')
  ```
- Listens for `SET_INSPECTOR_MODE` and toggles the overlay.

### 1.4 `data-customizer-*` attributes in Zenova
Only 6 elements are wired (this is the pattern to follow):
- `heroHeadline` — `components/sections/HeroSection.tsx:627`
- `campusImage` — `components/sections/StartsBar.tsx:679`
- `campusSectionTitle` — `components/sections/StartsBar.tsx:695`
- `noticeSectionTitle` — `components/sections/StartsBar.tsx:880`
- `leadershipSectionTitle` — `components/sections/HomeLeadershipAndTestimonials.tsx:835`
- `headerStyle` / navigation — `components/layout/Navbar.tsx:773,1045`
- `footerColor` — `components/layout/Footer.tsx:154`

### 1.5 Text consumption in Zenova
Components read the live config via `useTheme()`, e.g.:
- `HeroSection.tsx:600` → `const customHeroHeadline = config?.heroHeadline?.trim()`
- `StartsBar.tsx:591` → `config?.campusSectionTitle`; `:838` → `config?.noticeSectionTitle`
- `HomeLeadershipAndTestimonials.tsx:845` → `config?.leadershipSectionTitle`

### 1.6 Admin panel side (DO NOT CHANGE)
`frontend-next/app/dashboard/settings/template-customization/page.tsx`
- iframe `src={`/?preview=true&template=${baseTemplate}&_reset=${iframeKey}...`}` (lines ~806/843/875)
- sets cookie `storio-embed=1` (line ~280)
- posts `THEME_UPDATE` + `SET_INSPECTOR_MODE` (lines ~286-295)
- **only** listens for `CUSTOMIZER_INSPECT_CLICK` (line ~307) — there is NO listener for `INSPECT_FIELD`
- renders each field wrapper as `id={`field-wrapper-${field.id}`}` (line ~1323) and highlights it (lines ~1324-1328)

---

## 2. CURRENT STATE OF LITTLE FLOWERS (why it fails)

| # | Problem | Location |
|---|---------|----------|
| 1 | Inspector badge has `pointer-events: none` → not clickable | `src/components/layout/TemplateVisualInspector.tsx:82` |
| 2 | Click handler uses `closest('[data-customizer-field]')`, but the badge is not inside a field element → returns `null` | same file `:132-134` |
| 3 | Posts `INSPECT_FIELD` — admin only listens for `CUSTOMIZER_INSPECT_CLICK` | same file `:143-148` |
| 4 | No `SET_INSPECTOR_MODE` handling → ON/OFF toggle does nothing | same file |
| 5 | **Text is rendered from the server `customization` prop** — no reactive layer, so `THEME_UPDATE` never changes text | `src/app/page.tsx:198-268` and every section/page |
| 6 | `DynamicThemeStyles` is a server component that only injects CSS once | `src/components/layout/DynamicThemeStyles.tsx` |

**Already correct (do not break):**
- `data-customizer-field` attributes already exist on ~100 elements across sections and pages.
- The manifest `little-flower/public/storio.template.json` already defines all those fields.
- The inspector already applies CSS variables live on `THEME_UPDATE` (keep this).
- The admin panel is already correct.

---

## 3. ARCHITECTURE DECISION FOR LITTLE FLOWERS

Little Flowers has many **server components** (all `app/*/page.tsx`, plus several sections) that use `headers()` and cannot be converted to client components. Therefore we use a **module-level live-config store + a `<LiveText>` client component** instead of a React context provider.

This approach:
- Works in both server and client components (server components can render client children).
- Requires NO `'use client'` conversions.
- Requires NO changes to the admin panel.
- Requires NO changes to the manifest.

---

## 4. REQUIRED CHANGES (do these in order)

### CHANGE 1 — Create the live-config store
**New file:** `little-flower/src/lib/liveConfig.ts`

```ts
'use client';

import type { LittleFlowersCustomizationConfig } from '@/types';

type Listener = () => void;

let config: LittleFlowersCustomizationConfig = {};
const listeners = new Set<Listener>();

export function getLiveConfig(): LittleFlowersCustomizationConfig {
  return config;
}

// Server snapshot MUST be empty so per-request state never leaks between tenants.
export function getServerLiveConfig(): LittleFlowersCustomizationConfig {
  return {};
}

export function setLiveConfig(next: Partial<LittleFlowersCustomizationConfig>): void {
  config = { ...config, ...next };
  listeners.forEach((l) => l());
}

export function subscribeLiveConfig(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
```

### CHANGE 2 — Create the `<LiveText>` component
**New file:** `little-flower/src/components/ui/LiveText.tsx`

```tsx
'use client';

import { useSyncExternalStore } from 'react';
import {
  getLiveConfig,
  getServerLiveConfig,
  subscribeLiveConfig,
} from '@/lib/liveConfig';
import type { LittleFlowersCustomizationConfig } from '@/types';

type Field = keyof LittleFlowersCustomizationConfig & string;

interface LiveTextProps {
  field: Field;
  initial?: string | null;
  fallback?: string;
}

/**
 * Renders a configurable text field.
 * - Server render: uses `initial` (from the server-fetched customization prop).
 * - Client: uses the live config from `THEME_UPDATE` if present, else `initial`.
 */
export default function LiveText({ field, initial, fallback = '' }: LiveTextProps) {
  const live = useSyncExternalStore(
    subscribeLiveConfig,
    getLiveConfig,
    getServerLiveConfig
  ) as Record<string, unknown>;

  const liveValue = live?.[field];
  const value =
    typeof liveValue === 'string' && liveValue.trim() !== ''
      ? liveValue
      : initial ?? fallback;

  return <>{value}</>;
}
```

### CHANGE 3 — Rewrite the inspector
**File:** `little-flower/src/components/layout/TemplateVisualInspector.tsx`

Replace the entire file with the Zenova-style React implementation below. It must:
- keep the existing CSS-variable live update from `THEME_UPDATE`,
- ALSO call `setLiveConfig(config)`,
- render a clickable React badge,
- post `CUSTOMIZER_INSPECT_CLICK`,
- handle `SET_INSPECTOR_MODE`.

```tsx
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
  const [enabled, setEnabled] = useState(true);
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
```

> Note: `lucide-react` is NOT a dependency of `little-flower` and must not be added. The badge uses an inline SVG pencil icon instead.

### CHANGE 4 — Replace text expressions with `<LiveText>`

For **every** element that has `data-customizer-field="<field>"`, make sure the text it displays comes from `<LiveText>`.

**Rule:** if the element currently renders `{customization?.X}` / `{customization.X}` / `{customization?.['X']}`, replace that expression with:
```tsx
<LiveText field="X" initial={customization?.X} fallback="<the existing default>" />
```
Add this import at the top of the file:
```tsx
import LiveText from '@/components/ui/LiveText';
```
(`LiveText` is a client component, so it may be used inside both server and client components.)

**Files to edit (find each `data-customizer-field="..."` and wrap its displayed text):**

Homepage sections — `little-flower/src/components/sections/`:
- `HeroCarousel.tsx` → `heroHeadline`, `heroDescription`, `admission_badge_text`, `hero_card1_title`, `hero_btn2_text`, `buttonColor`
- `NoticeSection.tsx` → `notice_section_badge`, `notice_section_title`, `notice_section_subtitle`, `notice_view_all_text`
- `AboutSection.tsx` → `about_section_badge`, `about_section_title`, `about_section_description`
- `LeadershipSection.tsx` → `leadership_section_badge`, `leadership_section_title`, `leadership_section_subtitle`
- `ActivitiesSection.tsx` → `programs_section_badge`, `programs_section_title`, `programs_section_subtitle`
- `StaffSection.tsx` → `teachers_section_badge`, `teachers_section_title`, `teachers_section_subtitle`
- `EventsSection.tsx` → `events_section_badge`, `events_section_title`, `events_section_subtitle`, `events_view_all_text`
- `GallerySection.tsx` → `gallery_section_badge`, `gallery_section_title`, `gallery_section_subtitle`, `gallery_view_all_text`
- `TestimonialsSection.tsx` → `testimonials_section_badge`, `testimonials_section_title`, `testimonials_section_subtitle`
- `FaqSection.tsx` → `faqs_section_badge`, `faqs_section_title`, `faqs_section_subtitle`
- `WaveBadgesSection.tsx` → `badge1_text` … `badge4_text` (dynamic: `badge${idx + 1}_text`)
- `PromoCtaSection.tsx` → any `data-customizer-field` it renders

Homepage layout — `little-flower/src/components/layout/`:
- `TopBar.tsx` → `admission_badge_text`
- `InteractiveHeader.tsx` → `header_login_text`
- `Footer.tsx` → `footer_quick_links_title`

Sub-pages — `little-flower/src/app/*/page.tsx` (each is a server component — do NOT add `'use client'`):
- `about/page.tsx` → `page_about_badge`, `page_about_title`
- `notice/page.tsx` → `page_notices_badge`, `page_notices_title`, `page_notices_subtitle`
- `blog/page.tsx` → `page_blog_badge`, `page_blog_title`, `page_blog_subtitle`
- `contact/page.tsx` → `page_contact_badge`, `page_contact_title`, `page_contact_subtitle`
- `exam/page.tsx` → `page_exam_badge`, `page_exam_title`, `page_exam_subtitle`
- `career/page.tsx` → `page_career_badge`, `page_career_title`, `page_career_subtitle`
- `event/page.tsx` → `page_events_badge`, `page_events_title`, `page_events_subtitle`
- `compliance/page.tsx` → `page_compliance_badge`, `page_compliance_title`, `page_compliance_subtitle`

**Special cases to handle carefully:**
- `HeroCarousel.tsx` — the hero title is composed from slide data + config. Keep the slide-based fallback, but when `heroHeadline` is set, prefer the live value. Example:
  ```tsx
  const liveHeadline = config?.heroHeadline?.trim();
  const slideTitle = liveHeadline || activeSlide?.title?.trim() || '...default...';
  ```
  where `const config = useStorioConfigLive();` (see CHANGE 5) OR render `<LiveText field="heroHeadline" initial={...} fallback={...} />`.
- `WaveBadgesSection.tsx` — dynamic field name: `badge${idx + 1}_text`. Pass the computed field name to `<LiveText field={`badge${idx + 1}_text` as any} ... />`.

### CHANGE 5 — Optional: a hook for composed values
If a component needs to *compose* text (not just render a single field), add a tiny hook in `src/lib/liveConfig.ts`:
```ts
'use client';
import { useSyncExternalStore } from 'react';
import { getLiveConfig, getServerLiveConfig, subscribeLiveConfig } from '@/lib/liveConfig';
import type { LittleFlowersCustomizationConfig } from '@/types';

export function useStorioConfigLive(): LittleFlowersCustomizationConfig {
  return useSyncExternalStore(subscribeLiveConfig, getLiveConfig, getServerLiveConfig);
}
```
Then in a component:
```tsx
'use client'; // only if the component is not already a client component
import { useStorioConfigLive } from '@/lib/liveConfig';
const live = useStorioConfigLive();
const headline = live.heroHeadline?.trim() || propsCustomization?.heroHeadline?.trim() || 'Default';
```
> Do NOT use this hook inside a server component. For server components, use `<LiveText>` (CHANGE 4).

---

## 5. CONSTRAINTS — DO NOT DO THESE

1. **Do NOT modify `frontend-next/`** (the admin panel). It is already correct.
2. **Do NOT modify `zenova/`**.
3. **Do NOT change the manifest** `little-flower/public/storio.template.json` — all fields already exist.
4. **Do NOT add `'use client'` to any `app/*/page.tsx`** — they use `headers()` via `getTenantContext()` and are server-only.
5. **Do NOT post `INSPECT_FIELD`** — the admin only understands `CUSTOMIZER_INSPECT_CLICK`.
6. **Do NOT set the outline/badge to `pointer-events: none`** — the badge must be clickable.
7. **Do NOT remove the existing CSS-variable logic** from the inspector — colors must keep updating live.
8. **Do NOT use `innerHTML` / `dangerouslySetInnerHTML`** for the live text (security + hydration).
9. **Do NOT change the field `id`s** in `data-customizer-field` — they must match the manifest.
10. **Do NOT create a React context provider that requires a `'use client'` layout** — the page components are server components.
11. Keep the existing `getTenantContext()` / `DEFAULT_DEMO_DATA` behavior unchanged.
12. Preserve all existing styling, animations, and section order.

---

## 6. VERIFICATION CHECKLIST

Run `little-flower` with the admin preview open:

1. **Hover** over the hero headline in the preview → a dashed outline + `Edit: Hero Headline` badge appears.
2. **Click** the badge → the admin sidebar opens the **Content** section and scrolls/highlights the **Hero Headline** input.
3. **Type** a new headline → the preview text updates **immediately, without reload**.
4. **Toggle** "Inspector: ON/OFF" → the overlay appears/disappears.
5. **Hover** over a section title (e.g. "Upcoming Events & Celebrations") → badge appears; clicking opens that field.
6. **Change a color** (e.g. Primary Color) → the preview updates live (existing behavior preserved).
7. **Navigate** to `/about`, `/notice`, `/blog`, `/contact`, `/exam`, `/career`, `/event`, `/compliance` → the page hero badge/text behaves the same.
8. **No hydration errors** in the browser console.
9. **No TypeScript errors** (`npm run build` or `tsc --noEmit`).
10. **No change** in normal (non-iframe) browsing — the inspector must stay invisible.

---

## 7. ROLLBACK

All changes are additive except:
- `src/components/layout/TemplateVisualInspector.tsx` (replaced — keep a backup to restore).
- Text expressions replaced with `<LiveText>` (revert the expression).

Everything else (new files `src/lib/liveConfig.ts`, `src/components/ui/LiveText.tsx`) can simply be deleted.
