/** Tailwind v4 via PostCSS (avoids @tailwindcss/vite + Vite reload hitting astro:server-app). */
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
