/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // shadcn/ui Semantic Tokens
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          foreground: 'var(--primary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        ring: 'var(--ring)',
        input: 'var(--input)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },

        // Background
        'bg-default': 'var(--color-bg-default)',
        'bg-app': 'var(--color-bg-app)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-card-static': 'var(--color-bg-card-static)',
        border: 'var(--color-border)',

        // Text
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-placeholder': 'var(--color-text-placeholder)',

        // Action
        'action-primary': 'var(--color-action-primary)',
        'action-primary-hover': 'var(--color-action-primary-hover)',
        'action-delete': 'var(--color-action-delete)',

        // Button - Neutral
        'btn-neutral': 'var(--color-btn-neutral)',
        'btn-neutral-hover': 'var(--color-btn-neutral-hover)',

        // Button - Brand
        'btn-brand': 'var(--color-btn-brand)',
        'btn-brand-hover': 'var(--color-btn-brand-hover)',

        // Tenant Primary (동적)
        'tenant-primary': 'var(--color-tenant-primary)',
        'tenant-primary-hover': 'var(--color-tenant-primary-hover)',

        // Status
        'status-success': 'var(--color-status-success)',
        'status-success-bg': 'var(--color-status-success-bg)',
        'status-warning': 'var(--color-status-warning)',
        'status-warning-bg': 'var(--color-status-warning-bg)',
        'status-error': 'var(--color-status-error)',
        'status-error-bg': 'var(--color-status-error-bg)',
        'status-disabled': 'var(--color-status-disabled)',
        'status-disabled-bg': 'var(--color-status-disabled-bg)',

        // Badge (태그/카테고리용)
        'badge-red': 'var(--color-badge-red)',
        'badge-red-bg': 'var(--color-badge-red-bg)',
        'badge-orange': 'var(--color-badge-orange)',
        'badge-orange-bg': 'var(--color-badge-orange-bg)',
        'badge-yellow': 'var(--color-badge-yellow)',
        'badge-yellow-bg': 'var(--color-badge-yellow-bg)',
        'badge-green': 'var(--color-badge-green)',
        'badge-green-bg': 'var(--color-badge-green-bg)',
        'badge-blue': 'var(--color-badge-blue)',
        'badge-blue-bg': 'var(--color-badge-blue-bg)',
        'badge-indigo': 'var(--color-badge-indigo)',
        'badge-indigo-bg': 'var(--color-badge-indigo-bg)',
        'badge-purple': 'var(--color-badge-purple)',
        'badge-purple-bg': 'var(--color-badge-purple-bg)',
        'badge-gray': 'var(--color-badge-gray)',
        'badge-gray-bg': 'var(--color-badge-gray-bg)',

        // Sidebar - Dark Mode
        'sidebar-dark': {
          bg: 'var(--sidebar-dark-bg)',
          border: 'var(--sidebar-dark-border)',
          'text-primary': 'var(--sidebar-dark-text-primary)',
          'text-secondary': 'var(--sidebar-dark-text-secondary)',
          hover: 'var(--sidebar-dark-hover)',
          'active-bg': 'var(--sidebar-dark-active-bg)',
          'active-text': 'var(--sidebar-dark-active-text)',
        },

        // Sidebar - Light Mode
        'sidebar-light': {
          bg: 'var(--sidebar-light-bg)',
          border: 'var(--sidebar-light-border)',
          'text-primary': 'var(--sidebar-light-text-primary)',
          'text-secondary': 'var(--sidebar-light-text-secondary)',
          hover: 'var(--sidebar-light-hover)',
          'active-bg': 'var(--sidebar-light-active-bg)',
          'active-text': 'var(--sidebar-light-active-text)',
        },

        // TU Theme Colors
        'tu-bg-light': 'var(--tu-bg-light)',
        'tu-bg-dark': 'var(--tu-bg-dark)',

        // Switch/Toggle
        'switch-background': 'var(--switch-background)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      fontWeight: {
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
      },
    },
  },
  plugins: [],
};
