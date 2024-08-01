import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import config from "./src/config/config.json";
import { remarkModifiedTime } from "./src/lib/utils/remarkModifiedTime.mjs";
import remarkToc from "remark-toc";

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url,
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: "ignore",
  i18n: {
    defaultLocale: "ca",
    locales: ["ca", "es", "en"],
  },
  integrations: [
    react(),
    sitemap(),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [remarkModifiedTime, [remarkToc, { heading: "Tabla de contenidos", maxDepth: 4 }]],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
});
