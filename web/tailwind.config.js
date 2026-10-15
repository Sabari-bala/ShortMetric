/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F766E',
          dark: '#115E59',
          hover: '#0D6862',
          light: '#E6F6F2',
          soft: '#D1EDE8',
        },
        accent: {
          DEFAULT: '#14B8A6',
          light: '#CCFBF1',
        },
        bg: '#F7F8F6',
        surface: {
          DEFAULT: '#FFFFFF',
          hover: '#F3F6F4',
          muted: '#F1F4F2',
        },
        ink: {
          primary: '#1B2528',
          secondary: '#59676A',
          muted: '#7C888A',
          disabled: '#A8B2B4',
        },
        border: {
          DEFAULT: '#E3E8E5',
          strong: '#CFD7D4',
        },
        success: { DEFAULT: '#15803D', light: '#F0FDF4' },
        danger:  { DEFAULT: '#DC2626', light: '#FEF2F2' },
        warning: { DEFAULT: '#D97706', light: '#FFFBEB' },
        info:    { DEFAULT: '#2563EB', light: '#EFF6FF' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        xs: '0 1px 2px rgba(27, 37, 40, 0.04)',
        sm: '0 1px 3px rgba(27, 37, 40, 0.06)',
        md: '0 4px 12px rgba(27, 37, 40, 0.06)',
        lg: '0 12px 28px rgba(27, 37, 40, 0.08)',
      },
      borderRadius: {
        sm: '5px',
        DEFAULT: '7px',
        md: '8px',
        lg: '10px',
        xl: '14px',
      },
    },
  },
  plugins: [],
}
