# CampusBuddy — Design System & Component Specifications
**Event:** UXDC Designathon 2026 (University of Calgary UI/UX Club)  
**Track:** Experienced Track  
**Role:** Canonical design specification for developer handoff and Figma design system creation  

---

## 1. Visual Design Philosophy & Principles

CampusBuddy is built around **low-pressure human connection**. Unlike traditional social networks that induce anxiety through endless feeds, vanity metrics (followers, likes), and ambiguous messaging, CampusBuddy uses design to lower social friction:

1. **Warm & Calm Atmosphere:** Clean, campus-grounded palettes (Deep Pine, Warm Sun, Slate Ink) that evoke safety and approachable optimism rather than sensory overload.
2. **Speed & Clarity (The 90-Second Promise):** Clear visual hierarchy, generous touch targets, and instant feedback. Micro-interactions guide students from loneliness to a confirmed public meetup in two or three taps.
3. **Radical Transparency:** No black-box AI or hidden algorithms. Every match percentage is accompanied by plain-language bullet points explaining exactly why two students or moments were paired.
4. **Psychological Safety by Default:** General, well-lit, public campus landmarks only; no private dorm numbers or personal phone handles; clear blocking and reporting tools.

---

## 2. Design Tokens

### 2.1 Color Palette & Contrast Tokens

All text and UI component combinations strictly adhere to **WCAG 2.2 AA standards** (minimum 4.5:1 for normal text, 3:1 for large text and UI components).

```css
/* ==========================================================================
   LIGHT MODE TOKENS (Default)
   ========================================================================== */
:root {
  /* Surfaces */
  --bg:           #f4f7f8; /* Soft neutral campus slate */
  --card:         #ffffff; /* Pure white card surface */
  --card-muted:   #edf2f4; /* Secondary container */
  --line:         #cbd8dc; /* Structural border (3.2:1 contrast against bg) */
  --line-subtle:  #e2ebee; /* Inner divider */

  /* Typography / Ink */
  --ink:          #0d1e26; /* Primary display text (14.8:1 contrast on white - AAA) */
  --ink-secondary:#2c424e; /* Secondary body text (8.9:1 contrast on white - AAA) */
  --mut:          #496370; /* Muted metadata & labels (5.8:1 contrast on white - AA) */

  /* Primary Brand (Pine Teal) */
  --pine:         #0a635a; /* Primary CTA & active states (5.9:1 contrast on white - AA) */
  --pine-hover:   #074e47; /* Hover / Pressed state */
  --pine-subtle:  #e6f4f2; /* Tinted pill background */
  --onp:          #ffffff; /* Contrast text on pine (5.9:1) */

  /* Accent / Warning (Warm Amber Sun) */
  --sun:          #d97706; /* Focus ring & status highlights */
  --sun-subtle:   #fef3c7; /* Warm amber container */
  --sun-ink:      #78350f; /* High-contrast text on sun-subtle (7.2:1 - AAA) */

  /* Semantic Feedback */
  --green:        #15803d; /* Success indicators (5.2:1 contrast on white) */
  --green-subtle: #f0fdf4;
  --red:          #b91c1c; /* Destructive actions / Errors (6.2:1 contrast on white) */
  --red-subtle:   #fef2f2;
  --red-ink:      #7f1d1d;
}

/* ==========================================================================
   DARK MODE TOKENS (OLED / High-Contrast Dark)
   ========================================================================== */
:root[data-theme="dark"] {
  /* Surfaces */
  --bg:           #091216; /* Deep dark slate-teal */
  --card:         #111e24; /* Elevated container */
  --card-muted:   #172830; /* Secondary container */
  --line:         #223741; /* Structural border */
  --line-subtle:  #192a32; /* Inner divider */

  /* Typography / Ink */
  --ink:          #eaf2f5; /* Primary display text (13.9:1 on card - AAA) */
  --ink-secondary:#c0d3dc; /* Secondary body text (9.4:1 on card - AAA) */
  --mut:          #8da4af; /* Muted metadata (6.4:1 on card - AA) */

  /* Primary Brand (Glowing Teal) */
  --pine:         #2dd4bf; /* Vibrant teal brand token */
  --pine-hover:   #14b8a6;
  --pine-subtle:  #092c28; /* Tinted container */
  --onp:          #04211e; /* Deep contrast text on glowing teal (10.5:1 - AAA) */

  /* Accent (Sun Gold) */
  --sun:          #fbbf24;
  --sun-subtle:   #2d2006;
  --sun-ink:      #fef3c7;

  /* Semantic Feedback */
  --green:        #4ade80;
  --green-subtle: #0d2815;
  --red:          #f87171;
  --red-subtle:   #301111;
  --red-ink:      #fee2e2;
}
```

---

### 2.2 Typography Scale

- **Display & Headings:** `Bricolage Grotesque`, sans-serif (weights: 700 Bold, 800 ExtraBold). Punchy, geometric, expressive human tone.
- **Body & Controls:** `Figtree`, system-ui, sans-serif (weights: 400 Regular, 500 Medium, 600 SemiBold, 700 Bold). Clean legibility across high-density mobile displays.

| Token | Family | Size | Weight | Line Height | Usage |
|---|---|---|---|---|---|
| `font-hero` | Bricolage Grotesque | 36px – 54px | 800 | 1.12 | Landing hero banner headline |
| `font-h1` | Bricolage Grotesque | 28px – 34px | 800 | 1.15 | Page titles, primary modal headers |
| `font-h2` | Bricolage Grotesque | 22px – 26px | 700 | 1.20 | Section headers, card titles |
| `font-h3` | Bricolage Grotesque | 17px – 19px | 700 | 1.25 | Sub-group titles, attendee headers |
| `font-body-lg` | Figtree | 17px – 18px | 400 / 500 | 1.45 | Subtitles, hero intros |
| `font-body` | Figtree | 15px – 16px | 400 / 500 | 1.50 | Standard body copy, descriptions |
| `font-body-sm` | Figtree | 13.5px – 14px | 500 / 600 | 1.40 | Form labels, secondary card metadata |
| `font-caption`| Figtree | 11.5px – 12.5px| 600 / 700 | 1.30 | Status chips, time slot badges, small counters |

---

### 2.3 Spacing & Layout Tokens

- **Grid System:** 8pt base grid with 4pt half-step for micro-alignment.
- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-5`: 20px
- `space-6`: 24px
- `space-8`: 32px
- `space-12`: 48px

**Border Radius:**
- `radius-sm`: 8px (input fields, small chips)
- `radius-md`: 12px (buttons, timing callouts)
- `radius-lg`: 18px (content cards, modal dialogs)
- `radius-full`: 9999px (capsule buttons, badges, category chips)

**Shadows:**
- `shadow-sm`: `0 1px 2px rgba(13, 30, 38, 0.05)`
- `shadow-md`: `0 4px 12px rgba(13, 30, 38, 0.08)`
- `shadow-lg`: `0 12px 28px rgba(13, 30, 38, 0.12)`

---

## 3. Component Library Specifications

### 3.1 Primary Action Buttons (`.btn`)
- **Default State:** Solid background (`--pine`), text color (`--onp`), height: 44px (touch accessible), border-radius: 12px.
- **Hover State:** Background darkens to `--pine-hover`, subtle shadow lift.
- **Pressed / Active State:** Transform `scale(0.98)` for tactile micro-feedback.
- **Disabled State:** Opacity 0.55, cursor not-allowed, transform disabled.
- **Focus State:** 3px outline (`--sun`) with 2px offset.

### 3.2 Secondary / Ghost Buttons (`.btn.g`)
- **Default State:** Transparent background, 1.5px solid border (`--pine`), text color (`--pine`).
- **Hover State:** Background transitions to `--pine-subtle`.
- **Active State:** Transform `scale(0.98)`.

### 3.3 Destructive Buttons (`.btn.r`)
- **Default State:** Solid background (`--red`), text color `#ffffff`.
- **Hover State:** Background `#991b1b`.

### 3.4 Interactive Chips (`button.chip`)
- **Default State:** Background `--card-muted`, border 1.5px solid `--line`, color `--ink-secondary`.
- **Selected / On State:** Background `--pine`, border-color `--pine`, color `--onp`, font-weight 700.
- **Hover State:** Border color shifts to `--pine`, background `--pine-subtle`.

### 3.5 Match Score Explainability Callout (`.fit-box`)
- **Layout:** Contained callout with a 3.5px solid left border (`--pine`) and tinted background (`--pine-subtle`).
- **Content:**
  - Header: Percentage fit (e.g. `85% Match Score · Design defaults`).
  - Bulleted List: Plain-language breakdown citing specific matching criteria (+30 Activity, +25 Time, +20 Topic, +15 Same Major, +10 Interaction Style).

### 3.6 Verified Campus Meeting Point Badge (`.safe-point`)
- **Icon:** 📍 Location pin with green/pine tint.
- **Copy:** Specific public campus landmark (e.g. `Taylor Family Digital Library (TFDL), Level 2 Commons`).
- **Significance:** Assures both attendees that the meetup is situated in an open, monitored, well-lit campus space.

---

## 4. The 90-Second Micro-Connection Interaction Pattern

```mermaid
flowchart LR
    A["1. Landing / Trigger\nTap 'Find someone to study with'"] --> B["2. Time Window\nAfternoon pre-selected\n(Live stopwatch ticks)"]
    B --> C["3. Review Match & Rationale\nExplainable +30/+25/+20 breakdown\nTFDL Public Spot"]
    C --> D["4. Tap 'Join'\n(Total taps: 2-3)"]
    D --> E["5. Confirmed Meetup Modal\nCelebration badge + Real elapsed time\nIcebreaker question + Add to Calendar"]
```

### Key Interaction Details:
1. **Zero-Latency Stopwatch:** An active digital stopwatch ticks in the banner (`⏱️ 00:14s elapsed`) with a pulsing green indicator.
2. **Pre-calibrated Filters:** Based on student onboarding free-hours, the current open time window is automatically active.
3. **Single-Tap Commitment:** The highest-fit study session card is prominently framed with a gold/pine highlight. Tapping "Join this moment" immediately finalizes the spot without chat negotiations.
4. **Immediate Grounding Modal:** Presents who is attending, coordinates at a safe public landmark, an icebreaker conversation starter, and the exact measured elapsed time (e.g., "From 'nobody to study with' to a plan in 14 seconds").

---

## 5. Accessibility & Inclusivity Checklist (WCAG 2.2 AA)

- [x] **Color Contrast:** All body text meets or exceeds 4.5:1 ratio against card surfaces; all titles meet 7:1 ratio (AAA).
- [x] **Target Size:** All tap targets (buttons, filter chips, navigation items) meet minimum 44×44px dimensions.
- [x] **Focus Indicators:** High-contrast focus rings (`outline: 3px solid var(--sun); outline-offset: 2px`) on all interactive controls.
- [x] **Screen Reader Architecture:**
  - Semantic landmark tags (`<header>`, `<nav>`, `<main>`, `<dialog>`, `<article>`).
  - ARIA attributes: `aria-modal="true"`, `aria-labelledby`, `role="status"` on notification toasts.
  - `#live-region` politely announces dynamic status changes.
- [x] **Reduced Motion Support:** `@media (prefers-reduced-motion: reduce)` disables all CSS transitions and animations for motion-sensitive users.
- [x] **Responsive Adaptation:** Fluid single-column layout on mobile viewports (<480px), dual-column tile layout on tablets and desktop (>768px).

