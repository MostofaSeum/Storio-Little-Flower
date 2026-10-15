# Storio Template Customization Guide (`storio.template.json`)

Welcome! This beginner-friendly guide explains **how `storio.template.json` works** and **how you can make ANY element or component in your template editable from the Storio Admin Panel**.

No complicated backend work is needed. By following 3 simple steps, your components will connect to the Admin Dashboard and update in real-time.

---

## 🌟 The Big Picture: How Does It Work?

Think of `storio.template.json` as a **menu** that you provide to the Storio Admin Panel:

1. **You define controls** (inputs, color pickers, icon selectors, toggles) inside `storio.template.json`.
2. **The Storio Admin Dashboard automatically reads your file** and creates beautiful visual controls in the settings panel for website owners.
3. **Your website template reads the settings** using a simple hook (`useTheme()`) and displays whatever the user chose!

```
┌─────────────────────────────────┐
│ 1. storio.template.json         │ ───> Defines what can be customized
└─────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ 2. Storio Admin Panel           │ ───> User edits text, colors, toggles, icons
└─────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ 3. Your React Component         │ ───> Reads values via useTheme() and renders!
└─────────────────────────────────┘
```

---

## 🚀 The 3-Step Recipe: Make Any Component Editable

Let’s say you have a **Notice Section** or **Hero Banner** and you want the user to customize:
- The **Headline Text**
- The **Icon**
- The **Text Color**
- An **On/Off Toggle**

Here is all you need to do:

---

### Step 1: Declare Your Controls in `storio.template.json`

Open your template's `public/storio.template.json` (e.g. `zenova/public/storio.template.json`).

Under `"customization" -> "content"` (or any section name), add your fields:

```json
{
  "id": "myTemplate",
  "name": "My School Template",
  "customization": {
    "content": [
      {
        "id": "noticeSectionTitle",
        "label": "Notice Section Title",
        "type": "text",
        "default": "Latest Notices"
      },
      {
        "id": "noticeSectionIcon",
        "label": "Notice Section Icon",
        "type": "icon",
        "default": "bell"
      },
      {
        "id": "noticeSectionTextColor",
        "label": "Notice Title Color",
        "type": "color",
        "default": "#1E3A8A"
      },
      {
        "id": "showTotalStudents",
        "label": "Show Total Students Counter",
        "type": "boolean",
        "default": true
      }
    ]
  }
}
```

> 💡 **Tip:** Each field must have a unique `id`, a friendly `label`, a `type`, and a fallback `default`.

---

### Step 2: Add TypeScript Types in `lib/types/index.ts`

Open `lib/types/index.ts` in your template and add your field IDs to the `CustomConfig` interface. This gives you helpful autocompletion in VS Code!

```typescript
export interface CustomConfig {
  // Your custom fields:
  noticeSectionTitle?: string;
  noticeSectionIcon?: string;
  noticeSectionTextColor?: string;
  showTotalStudents?: boolean;
}
```

---

### Step 3: Use the Values in Your Component

In your React component (e.g. `NoticeSection.tsx` or `HeroBanner.tsx`), import `useTheme`:

```tsx
"use client";

import React from "react";
import { useTheme } from "@/components/ui/ThemeProvider";
// Or your icon helper:
import { Bell, FileText, Megaphone } from "lucide-react";

export function NoticeSection() {
  // 1. Get the live config from Storio
  const { config } = useTheme();

  // 2. Read your custom values with defaults
  const title = config?.noticeSectionTitle || "Latest Notices";
  const titleColor = config?.noticeSectionTextColor || "#1E3A8A";
  const iconName = config?.noticeSectionIcon || "bell";
  const showStudents = config?.showTotalStudents !== false;

  return (
    <div className="notice-box">
      {/* 3. Apply the custom color and title */}
      <h3 style={{ color: titleColor }}>
        {/* Render icon based on selected name */}
        {iconName === "bell" ? <Bell /> : <FileText />}
        {title}
      </h3>

      {/* 4. Use the toggle to conditionally show or hide */}
      {showStudents && (
        <div className="student-badge">
          Total Students: 1,200
        </div>
      )}
    </div>
  );
}
```

That's literally it! The moment you save and open the Admin Dashboard, your inputs will be there, and typing into them will update the live preview immediately!

---

## 🎨 Supported Field Types Cheatsheet

Here is every control type you can use inside `storio.template.json`:

### 1. Plain Text (`"type": "text"`)
Good for titles, headlines, subtitles, button labels.
```json
{
  "id": "heroTitle",
  "label": "Hero Title",
  "type": "text",
  "default": "Welcome to Our Campus"
}
```

### 2. Multi-Line Text (`"type": "textarea"`)
Good for long paragraphs, biographies, mission statements.
```json
{
  "id": "aboutDescription",
  "label": "About Institution Details",
  "type": "textarea",
  "default": "Established in 1995, our institution offers world-class education..."
}
```

### 3. Color & Gradient Picker (`"type": "color"`)
Renders an interactive color picker supporting both **Solid Hex Colors** and **CSS Linear Gradients**, with document color swatches.
```json
{
  "id": "headerBackgroundColor",
  "label": "Header Background Color",
  "type": "color",
  "default": "#0EA5E9",
  "description": "Background color or gradient for the top navigation bar."
}
```

### 4. Switch / Toggle (`"type": "boolean"`)
Renders an on/off toggle switch.
```json
{
  "id": "showAdmissionBanner",
  "label": "Show Admission Open Banner",
  "type": "boolean",
  "default": true,
  "description": "Show or hide the admission call-to-action banner on the homepage."
}
```

### 5. Dropdown Select (`"type": "select"`)
Renders a dropdown menu with predefined choices.
```json
{
  "id": "headingWeight",
  "label": "Heading Weight",
  "type": "select",
  "default": "700",
  "options": [
    { "label": "Semi-Bold (600)", "value": "600" },
    { "label": "Bold (700)", "value": "700" },
    { "label": "Extra Bold (800)", "value": "800" }
  ],
  "description": "Visual weight and thickness of title headings."
}
```

### 6. Range / Slider (`"type": "range"` or `"type": "slider"`)
Renders a visual slider for numeric values like font sizes, spacing, scale ratios, or border radii.
```json
{
  "id": "baseFontSize",
  "label": "Base Font Size",
  "type": "range",
  "min": 14,
  "max": 20,
  "step": 1,
  "default": 16,
  "unit": "px",
  "description": "Base font size scale in pixels for paragraph body text."
}
```

### 7. Google & Custom Font Selector (`"type": "font-picker"` or `"type": "font"`)
Renders a searchable font picker with real-time typography preview and font categories (`Sans-Serif`, `Serif`, `Display`, `Bengali`).
```json
{
  "id": "headingFont",
  "label": "Heading Font",
  "type": "font-picker",
  "default": "Outfit",
  "description": "Primary typeface applied to all section headings and page titles."
}
```

> 💡 **Bengali Fonts**: You can also use `bengaliFont` or specify `"categoryFilter": "Bengali"` to filter fonts specially curated for Bengali typography (e.g. *Hind Siliguri*, *Noto Serif Bengali*, *Anek Bangla*).

### 8. Visual Icon Picker (`"type": "icon"`)
Renders a visual button that opens a searchable icon modal with 90+ modern Lucide icons (e.g. `bell`, `gear`, `calendar`, `file_lines`, `trophy`, `users`, `book_open`).
```json
{
  "id": "noticeSectionIcon",
  "label": "Notice Card Icon",
  "type": "icon",
  "default": "file_lines",
  "description": "Icon displayed in the header badge of the notice board."
}
```

### 9. Media / Image Library Selector (`"type": "image"` or `"type": "media"`)
Renders an image preview with a direct Storio Media Library selector and direct image URL fallback.
```json
{
  "id": "campusHeroBanner",
  "label": "Campus Banner Image",
  "type": "image",
  "default": "https://placehold.co/1200x600/png",
  "description": "Hero banner image displayed at the top of the landing page."
}
```

### 10. Number Input (`"type": "number"`)
Renders a numerical input field with optional minimum and maximum bounds.
```json
{
  "id": "maxNoticesToShow",
  "label": "Maximum Notices to Display",
  "type": "number",
  "min": 1,
  "max": 10,
  "default": 4,
  "description": "Maximum number of recent notices visible on the landing page."
}
```

---

## ℹ️ Helpful Field Descriptions & Floating Tooltips

Whenever you add `"description": "..."` to any field in `storio.template.json`, the Storio Admin Panel automatically attaches an **(i)** info icon next to the field label.

- **Clean UI**: Long descriptions stay hidden by default to keep the sidebar compact and clean.
- **Hover Popover**: Hovering over the **(i)** icon reveals a centered glassmorphism popover card displaying your custom instructions.
- **Auto-Formatting**: Descriptions wrap and center automatically without breaking or overflowing the sidebar.

```json
{
  "id": "cardAspectRatio",
  "label": "Campus Card Aspect Ratio",
  "type": "select",
  "default": "16:9",
  "options": ["16:9", "4:3", "1:1"],
  "description": "Aspect ratio and layout sizing for the campus infrastructure gallery photos."
}
```

---

## 🔍 Click-to-Edit Visual Inspection (`data-customizer-field`)

Storio includes a bi-directional **Visual Inspector** in the live preview iframe. When an administrator hovers over an element in the preview, a blue outline with an **"Edit: [Title]"** button appears. Clicking it automatically scrolls the sidebar to that control, expands its section, and flashes an animated highlight border!

### How to Enable Hover & Edit in Your Components:

Just add the `data-customizer-field` attribute to any HTML element or component wrapper matching your `storio.template.json` field `id`:

```tsx
<h2 
  data-customizer-field="noticeSectionTitle"
  data-customizer-title="Notice Section Title"
  style={{ color: titleColor }}
>
  {title}
</h2>
```

### Complete Attributes List:
| Attribute | Purpose | Example |
| :--- | :--- | :--- |
| `data-customizer-field` | Connects directly to the input field `id` in `storio.template.json` | `data-customizer-field="heroHeadline"` |
| `data-customizer-section` | (Optional) Jumps to an entire section group (e.g. `colors`, `navigation`) | `data-customizer-section="colors"` |
| `data-customizer-title` | (Optional) Custom label shown on the hover badge | `data-customizer-title="Edit Hero Title"` |

### Example Component with Full Visual Inspector Support:
```tsx
export function CampusNoticeBanner() {
  const { config } = useTheme();

  return (
    <div 
      className="notice-wrapper"
      data-customizer-field="noticeSectionTextColor"
      data-customizer-title="Notice Card Styling"
    >
      {/* Clicking this in preview immediately focuses the 'noticeSectionTitle' input */}
      <h3 
        data-customizer-field="noticeSectionTitle"
        data-customizer-title="Notice Section Title"
      >
        {config?.noticeSectionTitle || "Important Notice"}
      </h3>
    </div>
  );
}
```

> 💡 Make sure your template layout mounts `<TemplateVisualInspector />` inside its root layout or `ThemeProvider.tsx`. It runs invisibly in normal browsing and only activates when loaded inside the Storio Admin customizer iframe.

---

## 🛡️ Recommended Best Practices

### 1. Always provide a fallback in your code
Never assume `config?.field` will always have a value. Use default values:
```tsx
const headline = config?.heroHeadline || "Default Headline";
```

### 2. How to handle multi-language translations (Bangla & English)
If your template supports multiple languages, use `renderDynamicTranslatedText`:
```tsx
import { useActiveLanguage, renderDynamicTranslatedText } from "@/lib/utils/translation";

const activeLang = useActiveLanguage();
const title = config?.noticeSectionTitle 
  ? renderDynamicTranslatedText(config.noticeSectionTitle, activeLang) 
  : "Default Title";
```

### 3. Handling Icons in Components
For icons, create a small helper that maps icon names to Lucide icons:
```tsx
import { Bell, FileText, Megaphone, Settings, Users, Star, Sparkles } from "lucide-react";

const iconMap: Record<string, React.ComponentType<any>> = {
  bell: Bell,
  file_lines: FileText,
  megaphone: Megaphone,
  gear: Settings,
  users: Users,
  star: Star,
};

export function renderIcon(iconName?: string) {
  if (!iconName) return <Sparkles size={20} />;
  const Component = iconMap[iconName.toLowerCase()] || Sparkles;
  return <Component size={20} />;
}
```

---

## 🔄 How to Sync Your Template Manifest with Docker (Backend)

Whenever you add new fields to `storio.template.json` on your computer, sync them with the local backend Docker container so the admin panel recognizes the new fields immediately:

```bash
# 1. Copy the updated file into the Docker container:
docker cp "zenova/public/storio.template.json" storio_cms_web_dev_container:/app/zenova/public/storio.template.json

# 2. Run the template sync command:
docker exec -w /app/backend/core storio_cms_web_dev_container python manage.py sync_local_templates
```

Now reload your Storio Admin Panel (**Dashboard > Settings > Template Customization**), and your brand new controls will appear instantly!

---

## ❓ Frequently Asked Questions

**Q: Do I need to create database tables or API endpoints?**  
**A:** No! Storio automatically saves all customization values in a JSON configuration field linked to the active school or tenant.

**Q: Does live preview work while typing?**  
**A:** Yes! The Storio Admin Panel communicates with the template live preview using `postMessage` (`THEME_UPDATE`). When a user types or selects a color/icon, the preview re-renders instantly without reloading the page.

**Q: What if the user clicks "Draft" instead of "Publish"?**  
**A:** "Draft" lets users test and experiment with changes in the preview pane. Once they click "Publish", the customization becomes active on the public website.
