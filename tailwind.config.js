/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        selected: 'var(--bg-selected)',
        hover: 'var(--bg-hover)',
        accent: 'var(--accent)',
        border: 'var(--border)',
        text: {
            primary: 'var(--text-primary)',
            secondary: 'var(--text-secondary)',
            muted: 'var(--text-muted)',
            inverse: 'var(--text-inverse)',
        }
      },
      boxShadow: {
        custom: 'var(--shadow)',
        lg: 'var(--shadow-lg)',
      }
    },
  },
  plugins: [],
}
