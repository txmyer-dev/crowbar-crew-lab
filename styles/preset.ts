/**
 * Agent: gemini-w
 * Issue: #1
 * Date: 2026-03-13
 */

import type { Config } from 'tailwindcss'

export const crowbarPreset: Config = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#262626',
          foreground: '#FAFAFA',
        },
        secondary: {
          DEFAULT: '#D4D4D4',
          foreground: '#262626',
        },
        accent: {
          DEFAULT: '#F59E0B',
          foreground: '#262626',
        },
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FAFAFA',
        },
        muted: {
          DEFAULT: '#737373',
          foreground: '#FAFAFA',
        },
        background: '#FAFAFA',
        foreground: '#262626',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        h1: ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['1.875rem', { lineHeight: '1.2', fontWeight: '600' }],
        h3: ['1.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        body: ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
    },
  },
}
