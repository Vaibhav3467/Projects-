import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0f172a',
        accent: '#2563eb',
        soft: '#f8fafc',
      },
      boxShadow: {
        card: '0 8px 24px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
