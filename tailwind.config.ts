import type { Config } from 'tailwindcss';

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: '#FFFFFF',
        primary: '#111111',
        accent: '#0055FF',
        text: '#333333',
      },
      fontFamily: {
        'sans': ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'mono': ['Source Code Pro', 'Monaco', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;