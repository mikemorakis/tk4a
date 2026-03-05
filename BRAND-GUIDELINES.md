# TK Orthodontics — Brand & UI/UX Guidelines

## Overview

**Brand Identity:** Premium, professional orthodontic clinic (Invisalign, ceramic/metal braces)
**Design Philosophy:** "Calm Authority" — minimal yet bold, conversion-focused
**Target Audience:** Adults seeking aesthetic dentistry in Athens + parents of children needing orthodontics
**Tone:** Authoritative, reassuring, trustworthy with modern sophistication

---

## 1. Color System

### Primary Accent

| Variable | Value | Usage |
|----------|-------|-------|
| `--c-accent` | #3ECDA5 | Buttons, hover states, accent text |
| `--c-accent-hover` | #35B894 | Accent hover state |
| `--c-accent-dark` | #2DA382 | Text links, badges |
| `--c-accent-glow` | rgba(62,205,165,0.15) | Shadow/glow effects |
| `--c-accent-subtle` | rgba(62,205,165,0.08) | Subtle background tint |

### Neutrals

| Variable | Value | Usage |
|----------|-------|-------|
| `--c-bg` | #FAFAFA | Main background |
| `--c-bg-alt` | #F0F0F0 | Alt light background |
| `--c-bg-warm` | #F4F3EF | Warm section variant |
| `--c-surface` | #FFFFFF | Cards, form inputs |
| `--c-text` | #1A1A1A | Primary text |
| `--c-text-light` | #F5F5F5 | Text on dark backgrounds |
| `--c-text-muted` | #5C5C66 | Secondary text |

### Dark

| Variable | Value | Usage |
|----------|-------|-------|
| `--c-bg-dark` | #111110 | Dark section background |
| `--c-bg-dark-alt` | #141312 | Dark alt background |
| `--c-glass` | rgba(255,255,255,0.72) | Glass navbar (light) |
| `--c-glass-dark` | rgba(17,17,16,0.88) | Glass navbar (dark) |

### Borders

| Variable | Value |
|----------|-------|
| `--c-border` | rgba(0,0,0,0.07) |
| `--c-border-light` | rgba(255,255,255,0.1) |

### Special Colors

- Star Rating: #F59E0B
- Success: #34A853

### Key Gradients

```css
/* Hero / Dark sections */
linear-gradient(160deg, #0f1418 0%, #12181d 50%, #0f1418 100%)

/* Accent glow */
radial-gradient(600px 400px at 20% 50%, rgba(62,205,165,0.04), transparent 60%)

/* Dot pattern */
radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px) /* 24px grid */

/* Invisalign banner */
linear-gradient(135deg, #0d9b7a 0%, #0a7d63 50%, #07654f 100%)
```

---

## 2. Typography

### Font Families

| Variable | Stack | Usage |
|----------|-------|-------|
| `--f-display` | 'Source Serif 4', Georgia, serif | Hero title only |
| `--f-heading` | 'IBM Plex Sans', system-ui, sans-serif | Headings, nav, labels |
| `--f-body` | 'IBM Plex Sans', system-ui, sans-serif | Body text |

### Size Scale (Fluid)

| Variable | Value |
|----------|-------|
| `--fs-display` | clamp(2rem, 3.8vw, 3.5rem) |
| `--fs-h1` | clamp(2rem, 4.5vw, 3.8rem) |
| `--fs-h2` | clamp(1.6rem, 3.2vw, 2.6rem) |
| `--fs-h3` | clamp(1.15rem, 1.8vw, 1.45rem) |
| `--fs-body` | clamp(0.95rem, 1.1vw, 1.1rem) |
| `--fs-small` | clamp(0.8rem, 0.9vw, 0.9rem) |
| `--fs-xs` | clamp(0.75rem, 0.8vw, 0.8rem) |

### Line Heights

| Variable | Value | Usage |
|----------|-------|-------|
| `--lh-tight` | 1.1 | Headings |
| `--lh-snug` | 1.3 | Subheadings |
| `--lh-body` | 1.65 | Body text |

### Weights

- 400 — Body text
- 500 — Nav, labels
- 600 — Emphasis, buttons
- 700 — Headings, titles

### Letter Spacing

- Headings: -0.02em
- Labels/badges: 0.06em to 0.12em
- Buttons: 0.02em

---

## 3. Spacing

| Variable | Value | Usage |
|----------|-------|-------|
| `--s-section` | clamp(5rem, 12vw, 9rem) | Section vertical padding |
| `--s-container` | min(calc(100% - 48px), 1200px) | Max container width |
| `--s-gap` | clamp(1rem, 2vw, 2rem) | Grid/flex gap |

### Common Values

- Card padding: 2rem
- Button padding: 0.9rem 2rem (base), 1.1rem 2.8rem (lg), 0.6rem 1.4rem (sm)
- Form input padding: 0.9rem 1.2rem
- Form input height: 50px

---

## 4. Border Radius

| Variable | Value | Usage |
|----------|-------|-------|
| `--radius` | 14px | Cards, inputs |
| `--radius-sm` | 8px | Small buttons, icons |
| `--radius-lg` | 24px | Large cards, hero photo |
| `--radius-pill` | 100px | Badges, pills |

---

## 5. Shadows

| Variable | Value | Usage |
|----------|-------|-------|
| `--shadow-sm` | 0 2px 8px rgba(0,0,0,0.04) | Subtle |
| `--shadow` | 0 4px 24px rgba(0,0,0,0.06) | Default card |
| `--shadow-lg` | 0 16px 56px rgba(0,0,0,0.1) | Elevated |
| `--shadow-accent` | 0 8px 32px var(--c-accent-glow) | Accent glow |

---

## 6. Motion

### Timing Functions

| Variable | Value | Usage |
|----------|-------|-------|
| `--ease` | cubic-bezier(0.4, 0, 0.2, 1) | Standard |
| `--ease-out` | cubic-bezier(0, 0, 0.2, 1) | Exit |
| `--ease-spring` | cubic-bezier(0.34, 1.56, 0.64, 1) | Bouncy |

### Durations

| Variable | Value | Usage |
|----------|-------|-------|
| `--t-fast` | 0.2s | Hover, icons |
| `--t-base` | 0.35s | Standard |
| `--t-slow` | 0.6s | Page transitions |
| `--t-reveal` | 0.8s | Scroll reveals |

### Keyframe Animations

- **pulse** — Scale 1 > 1.5 > 1, opacity 1 > 0.5 > 1 (urgency dots)
- **float** — TranslateY 0 > -10px > 0
- **spin-slow** — Rotate 0 > 360deg
- **bubble-glow** — Opacity 0 > 1 > 0 (2.5s, phone CTA)

### Scroll Reveal

- `.reveal` — opacity 0, translateY(30px) > visible
- `.reveal--left` / `.reveal--right` — translateX(+-30px)
- `.reveal--scale` — scale(0.95)
- `.stagger > *` — delay: calc(var(--i) * 0.1s)

### Page Transitions

- Enter: opacity 0, translateY(12px) > visible (0.6s)
- Exit: opacity 0, translateY(-12px) (0.3s)

---

## 7. Responsive Breakpoints

| Breakpoint | Triggers |
|-----------|----------|
| <= 480px | Compact cards, single columns |
| <= 768px | 2-col grids collapse, footer stacks |
| <= 1024px | Hamburger nav, hero single column |
| 1200px | Container max-width |

---

## 8. Component Patterns

### Buttons

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| `--primary` | #3ECDA5 | #06221A | none |
| `--secondary` | transparent | --c-text | 1.5px --c-border |
| `--dark` | #111110 | --c-text-light | none |
| `--outline` | transparent | --c-text | 1.5px --c-border |
| `--outline-light` | transparent | --c-text-light | 1.5px --c-border-light |
| `--light` | white | #0d9b7a | none |

All buttons: border-radius 12px, font-weight 600, letter-spacing 0.02em.
Hover: translateY(-2px) or opacity 0.92 + glow.
Arrow icon: translateX(4px) on hover.

### Cards

**Service card:** 24px radius, 2rem padding, 3px accent bar top (scaleX 0>1 on hover), translateY(-4px) on hover.
**Review card:** 320px min, scroll-snap, 4-line text clamp, star rating #F59E0B.
**Pricing card:** Featured variant uses dark bg + accent border + glow.
**Why card:** Dark bg rgba(255,255,255,0.04), accent border on hover.

### Navigation

- Fixed, glass morphism on scroll (blur 20px, saturate 1.8)
- Active link: green dot indicator (6px, scale 0>1, spring easing)
- Mobile: slide-in from right, min(320px, 85vw), hamburger with X animation

### Section Headers

- Label: uppercase, xs size, 0.12em spacing, accent color, 24px line before
- Title: h2 size, max-width 640px
- Subtitle: body size, muted color, max-width 560px

### Forms

- 50px height inputs, 14px radius, accent border + glow on focus
- Green checkmark on valid
- Grid: 2-column on desktop, 1-column on mobile

### FAQ Accordion

- Click to open, close siblings
- Icon: 28px circle, rotates 45deg, fills accent on open
- Content: max-height animation

### Before/After Slider

- 16/10 aspect, 24px radius, ew-resize cursor
- 44px accent handle with left/right arrow SVG
- Keyboard: Arrow keys +-2%, constrained 5-95%

### Reviews Carousel

- Auto-scroll 4s, pause on touch, resume after 8s
- Mask: fade edges, dot navigation
- Drag to scroll, snap alignment

---

## 9. Decorative Elements

- **Wire pattern:** SVG tile (240x260), opacity 0.07-0.10, applied via pseudo-elements
- **Grain overlay:** Fixed, z-10000, opacity 0.028, fractal noise SVG
- **Orbs:** Blurred accent circles (blur 100-140px, opacity 0.06-0.18)
- **Dot grid:** 24px radial pattern on dark sections

---

## 10. Interactive Effects

- **Magnetic button** (`[data-magnetic]`): translate toward cursor, strength 0.3
- **Card tilt** (`[data-tilt]`): perspective(600px) rotateX/Y based on cursor
- **Parallax** (`[data-parallax]`): translateY on scroll, speed 0.1

---

## 11. Performance

- Fonts: preload with font-display swap, unicode-range subsets
- Images: AVIF > WebP > JPG fallback, srcset + sizes, lazy loading
- CSS: critical inline + deferred main stylesheet
- JS: vanilla, no deps, defer, IntersectionObserver, rAF
- Reduced motion: all animations skipped, final state shown

---

## 12. Accessibility

- Language: el (Greek)
- ARIA: navigation roles, slider aria-value*, labels
- Keyboard: slider arrow keys, focus indicators
- Reduced motion: respected via prefers-reduced-motion
- Form: associated labels, required attributes, validation feedback
