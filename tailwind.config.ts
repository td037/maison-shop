import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Be Vietnam Pro', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#ab2e00',
          container: '#cf4519',
          on: '#ffffff',
        },
        secondary: {
          fixed: '#1a1a2e',
        },
        surface: {
          DEFAULT: '#fbf9f8',
          low: '#f5f3f3',
          mid: '#efeded',
          high: '#e8e6e6',
          lowest: '#ffffff',
        },
        'on-surface': {
          DEFAULT: '#1b1c1c',
          muted: '#6b6b6b',
          subtle: '#9a9a9a',
        },
        outline: {
          variant: '#e2bfb5',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
      },
      letterSpacing: {
        tighter: '-0.02em',
        display: '-0.03em',
        wide: '0.05em',
        wider: '0.1em',
      },
      borderRadius: {
        btn: '0.375rem',
      },
      backdropBlur: {
        nav: '20px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(27,28,28,0.06)',
        float: '0 16px 32px rgba(27,28,28,0.04)',
        primary: '0 8px 24px rgba(171,46,0,0.3)',
      },
    },
  },
  plugins: [],
}
export default config
