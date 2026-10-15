/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
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
        secondary: {
          DEFAULT: '#14B8A6',
          light: '#E6FFFA',
        },
        bg: {
          DEFAULT: '#F7F9FA',
          soft: '#FAFBFC',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          hover: '#F3F6F7',
          muted: '#F7F9FA',
        },
        ink: {
          primary: '#17232D',
          secondary: '#52616B',
          muted: '#74818A',
          disabled: '#A5AEB6',
        },
        border: {
          DEFAULT: '#E1E8EB',
          strong: '#CFD9DD',
        },
        success: {
          DEFAULT: '#15803D',
          light: '#ECFDF3',
        },
        danger: {
          DEFAULT: '#DC2626',
          light: '#FEF2F2',
        },
        warning: {
          DEFAULT: '#D97706',
          light: '#FFF7E6',
        },
        info: {
          DEFAULT: '#2563EB',
          light: '#EFF6FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 2px rgba(23, 35, 45, 0.04)',
        md: '0 4px 12px rgba(23, 35, 45, 0.06)',
        lg: '0 12px 30px rgba(23, 35, 45, 0.08)',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '18px',
      },
    },
  },
  plugins: [],
}
