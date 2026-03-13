<!--
# Agent: gemini-w
# Issue: #1
# Date: 2026-03-13
-->

# The Crowbar Crew Brand Stylebook

**Version:** 1.0.0  
**Aesthetic:** "Industrial strength meets clarity."  
**Concept:** A well-organized workshop.

---

## 1. Color Palette

Professional industrial feel with high contrast and clear affordances.

| Token      | Hex Value | Purpose                |
|------------|-----------|------------------------|
| Primary    | `#262626` | Charcoal/Steel         |
| Secondary  | `#D4D4D4` | Light Grey/Aluminum    |
| Accent     | `#F59E0B` | Amber/Caution Orange   |
| Destructive| `#DC2626` | Industrial Red         |
| Muted      | `#737373` | Slate                  |
| Background | `#FAFAFA` | Off-white/Clean Concrete|

---

## 2. Typography

Direct, technical, and highly legible.

### Font Families
- **Primary:** `Inter` or `Geist` (Sans-serif)
- **Technical/Mono:** `JetBrains Mono` or `Roboto Mono`

### Type Scale
| Element      | Size (rem/px) | Weight      | Purpose             |
|--------------|---------------|-------------|---------------------|
| H1           | `2.25rem / 36px` | Bold (700)  | Hero headlines      |
| H2           | `1.875rem / 30px`| SemiBold (600)| Section headings    |
| H3           | `1.5rem / 24px`  | SemiBold (600)| Sub-sections        |
| Body         | `1rem / 16px`    | Regular (400) | Main text           |
| Small/Caption| `0.875rem / 14px`| Medium (500) | Secondary info/Data |

---

## 3. Design Tokens (CSS)

```css
:root {
  --primary: #262626;
  --secondary: #D4D4D4;
  --accent: #F59E0B;
  --destructive: #DC2626;
  --muted: #737373;
  --background: #FAFAFA;
  --radius: 0.375rem;
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

---

## 4. shadcn/ui v4 Preset

**Conventions:**
- **Border Radius:** `0.375rem` (Slightly rounded, "machined" look).
- **Spacing:** 4px grid system.
- **Component Style:** Direct, ownership-oriented, heavy borders on cards, clear focus states.
