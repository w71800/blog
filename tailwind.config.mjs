import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-headings': 'white', // 所有標題顏色
            '--tw-prose-body': '#CCCCCC',
            h2: {
              color: 'var(--tw-prose-headings)',
              fontWeight: '700',
              marginTop: '2em',
              marginBottom: '0.8em',
            },
            strong: {
              color: 'white',
            },
            code: {
              color: 'white',
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
