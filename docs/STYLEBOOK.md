# The Crowbar Crew — Stylebook

> "Applied Leverage" — Professional but approachable. Industrial strength meets clarity.

## Design Philosophy

The Crowbar Crew visual identity draws from the metaphor of a well-organized workshop: tools in their place, materials labeled, work surfaces clean. Every design decision optimizes for **clarity first, personality second**.

We are not a sterile corporate office. We are not a chaotic startup. We are a precision operation that happens to be run by humans who care about craft.

## Color System

### Primary: Deep Navy / Charcoal

The foundation. Derived from Tailwind's Slate scale, anchored at `#0F172A` (900). This palette carries authority without being oppressive. It reads as "serious infrastructure" — the steel beams behind the wall.

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-950` | `#020617` | Dark mode backgrounds |
| `primary-900` | `#0F172A` | Primary buttons, headings, dark surfaces |
| `primary-800` | `#1E293B` | Dark mode cards, secondary surfaces |
| `primary-700` | `#334155` | Dark mode borders, heavy text |
| `primary-600` | `#475569` | Secondary text (light mode) |
| `primary-500` | `#64748B` | Muted text, placeholders |
| `primary-400` | `#94A3B8` | Dark mode muted text |
| `primary-300` | `#CBD5E1` | Borders (light mode) |
| `primary-200` | `#E2E8F0` | Input borders, dividers |
| `primary-100` | `#F1F5F9` | Secondary backgrounds, muted fills |
| `primary-50`  | `#F8FAFC` | Page background (light mode) |

### Accent: Amber / Leverage

The crowbar. Amber (`#F59E0B`) is the color of leverage — it draws the eye, signals action, and cuts through the navy foundation like a pry bar through drywall. Used sparingly for maximum impact.

| Token | Hex | Usage |
|-------|-----|-------|
| `accent-500` | `#F59E0B` | Primary accent, CTAs, focus rings |
| `accent-400` | `#FBBF24` | Hover states, dark mode accent |
| `accent-600` | `#D97706` | Active/pressed states |
| `accent-100` | `#FEF3C7` | Accent backgrounds, badges |
| `accent-900` | `#78350F` | Accent text on light backgrounds |

**Usage rule**: Amber is for actions and emphasis only. If more than 15% of any screen is amber, you've over-leveraged.

### Semantic Colors

| Purpose | Color | Token |
|---------|-------|-------|
| Success | Green `#22C55E` | `success-500` |
| Destructive | Red `#EF4444` | `destructive-500` |
| Warning | Yellow `#EAB308` | `warning-500` |
| Info | Blue `#3B82F6` | `info-500` |

Each semantic color has a `-100` (background) and `-700` (text-on-light) variant.

## Typography

### Font Stack

| Role | Family | Why |
|------|--------|-----|
| **UI / Body** | Inter | Clean, highly legible, excellent at small sizes. The workshop label maker. |
| **Code / Data** | JetBrains Mono | Designed for code. Distinguished 0/O, 1/l/I. The precision instrument. |

### Scale (4:5 Major Third)

| Token | Size | Use Case |
|-------|------|----------|
| `text-xs` | 12px | Labels, captions, metadata |
| `text-sm` | 14px | Secondary text, table cells |
| `text-base` | 16px | Body text, descriptions |
| `text-lg` | 18px | Lead paragraphs, emphasis |
| `text-xl` | 20px | Section headings (h3) |
| `text-2xl` | 24px | Page sub-headings (h2) |
| `text-3xl` | 30px | Page headings (h1) |
| `text-4xl` | 36px | Hero/display text |

### Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Normal | 400 | Body text |
| Medium | 500 | Labels, nav items, subtle emphasis |
| Semibold | 600 | Headings, buttons |
| Bold | 700 | Hero text, strong emphasis (use sparingly) |

## Spacing

**Grid: 4px base unit.** All spacing values are multiples of 4px.

| Token | Value | Common Use |
|-------|-------|------------|
| `space-1` | 4px | Tight gaps (icon-to-text) |
| `space-2` | 8px | Inline spacing, small padding |
| `space-3` | 12px | Button padding (vertical) |
| `space-4` | 16px | Card padding, section gaps |
| `space-6` | 24px | Large card padding |
| `space-8` | 32px | Section separation |
| `space-12` | 48px | Page section breaks |
| `space-16` | 64px | Major layout divisions |

## Border Radius

Slightly rounded — workshop precision. Not pill-shaped (too playful), not sharp (too rigid).

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 4px | Badges, small chips |
| `radius-md` | 6px | **Default** — buttons, inputs, dropdowns |
| `radius-lg` | 8px | Cards, dialogs, containers |
| `radius-xl` | 12px | Large containers, hero sections |
| `radius-full` | 9999px | Avatars, circular buttons |

## Shadows

Subtle, navy-tinted shadows. No harsh black drops.

| Token | Usage |
|-------|-------|
| `shadow-sm` | Buttons (resting), inputs |
| `shadow-md` | Cards, dropdowns |
| `shadow-lg` | Modals, popovers |

## Dark Mode

Full dark mode support via `.dark` class. The navy scale inverts naturally:
- Background shifts to `primary-950` (`#020617`)
- Text shifts to `primary-50` (`#F8FAFC`)
- Cards become `primary-900`
- Borders become `primary-700`
- Accent amber remains the same — it pops even harder on dark

## Accessibility

- All text/background pairs target **WCAG AA** (4.5:1 contrast minimum)
- Focus rings use `accent-500` (amber) — highly visible on both light and dark
- Interactive elements have distinct `:hover`, `:active`, and `:focus-visible` states
- Semantic colors are never used as the sole indicator — always paired with text or icons

## Usage in shadcn/ui

```ts
// tailwind.config.ts
import { crowbarPreset } from './styles/preset'

export default {
  presets: [crowbarPreset],
  // ... rest of config
} satisfies Config
```

```css
/* app/globals.css */
@import './styles/tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

All shadcn/ui components will automatically inherit the Crowbar Crew identity through the CSS custom properties and Tailwind preset.
