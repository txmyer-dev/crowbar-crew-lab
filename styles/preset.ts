/**
 * The Crowbar Crew — shadcn/ui Preset
 * "Applied Leverage"
 *
 * Drop this into any Next.js + shadcn/ui v4 project:
 *   import { crowbarPreset } from './styles/preset'
 *
 * Then reference in tailwind.config.ts:
 *   presets: [crowbarPreset]
 */

import type { Config } from 'tailwindcss'

export const crowbarPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        // ─── Primary: Deep Navy / Charcoal ───
        primary: {
          DEFAULT: '#0F172A',
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        // ─── Accent: Amber / Leverage ───
        accent: {
          DEFAULT: '#F59E0B',
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // ─── Semantic ───
        success: {
          DEFAULT: '#22C55E',
          100: '#DCFCE7',
          500: '#22C55E',
          700: '#15803D',
        },
        destructive: {
          DEFAULT: '#EF4444',
          100: '#FEE2E2',
          500: '#EF4444',
          700: '#B91C1C',
        },
        warning: {
          DEFAULT: '#EAB308',
          100: '#FEF9C3',
          500: '#EAB308',
          700: '#A16207',
        },
        info: {
          DEFAULT: '#3B82F6',
          100: '#DBEAFE',
          500: '#3B82F6',
          700: '#1D4ED8',
        },
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'Cascadia Code', 'Fira Code', 'monospace'],
      },

      fontSize: {
        xs:   ['0.75rem',  { lineHeight: '1rem' }],
        sm:   ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem',     { lineHeight: '1.5rem' }],
        lg:   ['1.125rem', { lineHeight: '1.75rem' }],
        xl:   ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem',  { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },

      borderRadius: {
        sm:   '0.25rem',   // 4px — subtle
        DEFAULT: '0.375rem', // 6px — workshop precision
        md:   '0.375rem',
        lg:   '0.5rem',    // 8px — cards, dialogs
        xl:   '0.75rem',   // 12px — large containers
      },

      spacing: {
        // 4px grid system
        '0.5': '0.125rem', // 2px
        '1':   '0.25rem',  // 4px
        '1.5': '0.375rem', // 6px
        '2':   '0.5rem',   // 8px
        '3':   '0.75rem',  // 12px
        '4':   '1rem',     // 16px
        '5':   '1.25rem',  // 20px
        '6':   '1.5rem',   // 24px
        '8':   '2rem',     // 32px
        '10':  '2.5rem',   // 40px
        '12':  '3rem',     // 48px
        '16':  '4rem',     // 64px
      },

      boxShadow: {
        sm:  '0 1px 2px 0 rgb(15 23 42 / 0.05)',
        md:  '0 4px 6px -1px rgb(15 23 42 / 0.1), 0 2px 4px -2px rgb(15 23 42 / 0.1)',
        lg:  '0 10px 15px -3px rgb(15 23 42 / 0.1), 0 4px 6px -4px rgb(15 23 42 / 0.1)',
      },
    },
  },
}

export default crowbarPreset
