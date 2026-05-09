import theme from './src/config/theme.json';

let font_base = Number(theme.fonts.font_size.base.replace("px", ""));
let font_scale = Number(theme.fonts.font_size.scale);
let h6 = font_base / font_base;
let h5 = h6 * font_scale;
let h4 = h5 * font_scale;
let h3 = h4 * font_scale;
let h2 = h3 * font_scale;
let h1 = h2 * font_scale;
/** Slightly smaller display headings site-wide (prose + .h1–.h6 + utilities). */
const headingScale = 0.9;
let fontPrimary, fontPrimaryType, fontSecondary, fontSecondaryType;
if (theme.fonts.font_family.primary?.trim()) {
  fontPrimary = theme.fonts.font_family.primary
    .replace(/\+/g, " ")
    .replace(/:[ital,]*[ital@]*[wght@]*[0-9,;]+/gi, "");
  fontPrimaryType = theme.fonts.font_family.primary_type;
}
if (theme.fonts.font_family.secondary) {
  fontSecondary = theme.fonts.font_family.secondary
    .replace(/\+/g, " ")
    .replace(/:[ital,]*[ital@]*[wght@]*[0-9,;]+/gi, "");
  fontSecondaryType = theme.fonts.font_family.secondary_type;
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,css}"],
  corePlugins: {
    preflight: false,
    // Site uses `.layout-container` in site.css (max 1144px); disable the framework utility.
    container: false,
  },
  darkMode: 'selector',
  theme: {
    screens: {
      sm: "540px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    // Do not set `container` here — Tailwind v4 emits a `.container` utility with
    // breakpoint max-widths (up to 1536px) that would clash with layout wrappers.
    extend: {
      colors: {
        text: theme.colors.default.text_color.default,
        light: theme.colors.default.text_color.light,
        /** Primary ink on *light* backgrounds (body copy, headings in light theme). Not “dark mode”. */
        dark: theme.colors.default.text_color.dark,
        /** Main article/body text when `html` is in dark theme (`dark:prose-invert`, surfaces). */
        "on-dark": theme.colors.default.text_color.on_dark,
        primary: "rgb(var(--color-primary-rgb) / <alpha-value>)",
        secondary: theme.colors.default.theme_color.secondary,
        body: theme.colors.default.theme_color.body,
        border: theme.colors.default.theme_color.border,
        "theme-light": theme.colors.default.theme_color.theme_light,
        "theme-dark": theme.colors.default.theme_color.theme_dark,
      },
      fontSize: {
        base: font_base + "px",
        h1: h1 * headingScale + "rem",
        "h1-sm": h1 * 0.8 * headingScale + "rem",
        h2: h2 * headingScale + "rem",
        "h2-sm": h2 * 0.8 * headingScale + "rem",
        h3: h3 * headingScale + "rem",
        "h3-sm": h3 * 0.8 * headingScale + "rem",
        h4: h4 * headingScale + "rem",
        "h4-sm": h4 * 0.8 * headingScale + "rem",
        h5: h5 * headingScale + "rem",
        "h5-sm": h5 * 0.8 * headingScale + "rem",
        h6: h6 * headingScale + "rem",
      },
      fontFamily: {
        primary: fontPrimary
          ? [fontPrimary, fontPrimaryType || "sans-serif"]
          : [
              "system-ui",
              "-apple-system",
              "BlinkMacSystemFont",
              "Segoe UI",
              "sans-serif",
            ],
        secondary: fontSecondary
          ? [fontSecondary, fontSecondaryType || "sans-serif"]
          : [
              "system-ui",
              "-apple-system",
              "BlinkMacSystemFont",
              "Segoe UI",
              "sans-serif",
            ],
        "source-serif": [
          '"Source Serif 4"',
          "Georgia",
          '"Times New Roman"',
          "serif",
        ],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            // Light theme: driven by `text_color.dark` in theme.json → `colors.dark`.
            "--tw-prose-body": theme("colors.dark"),
            "--tw-prose-headings": theme("colors.dark"),
            "--tw-prose-bold": theme("colors.dark"),
            "--tw-prose-lead": theme("colors.dark"),
            "--tw-prose-counters": theme("colors.gray.600"),
            "--tw-prose-bullets": theme("colors.gray.400"),
            "--tw-prose-quotes": theme("colors.gray.700"),
            "--tw-prose-code": theme("colors.dark"),
            "blockquote p:first-of-type::before": {
              content: '""',
            },
            "blockquote p:last-of-type::after": {
              content: '""',
            },
          },
        },
        invert: {
          css: {
            // Dark theme: `.content` uses `dark:prose-invert` — use `text_color.on_dark` from theme.json.
            "--tw-prose-body": theme("colors.on-dark"),
            "--tw-prose-headings": theme("colors.on-dark"),
            "--tw-prose-bold": theme("colors.on-dark"),
            "--tw-prose-lead": theme("colors.on-dark"),
            "--tw-prose-code": theme("colors.on-dark"),
            "--tw-prose-quotes": theme("colors.gray.300"),
            "--tw-prose-quote-borders": theme("colors.gray.600"),
            "--tw-prose-counters": theme("colors.gray.400"),
            "--tw-prose-bullets": theme("colors.gray.500"),
            "--tw-prose-captions": theme("colors.gray.400"),
            "--tw-prose-kbd": theme("colors.gray.100"),
            "--tw-prose-pre-bg": theme("colors.gray.900"),
            "--tw-prose-th-borders": theme("colors.gray.600"),
            "--tw-prose-td-borders": theme("colors.gray.700"),
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwind-bootstrap-grid")({
      // Plugin expects snake_case; camelCase was ignored → container rules were still generated.
      generate_container: false,
      gridGutters: {
        1: "0.5rem",
        2: "0.75rem",
        3: "1.25rem",
        4: "2rem",
        5: "3.5rem",
      },
    }),
  ],
};
