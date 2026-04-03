# Limbo

Personal blog built with [Astro](https://astro.build/), deployed to GitHub Pages at [aleixripoll.github.io/limbo](https://aleixripoll.github.io/limbo/).

## Stack

- **Astro** 5 (content collections, MDX, View Transitions)
- **Tailwind CSS** 3 and Sass for styles
- **React** for interactive pieces (search, Disqus, icons)
- **Fuse.js** for client-side search

## Requirements

- Node.js LTS (matches Astro’s [supported versions](https://docs.astro.build/en/install-and-setup/#prerequisites))

## Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `npm install`  | Install dependencies                 |
| `npm run dev`  | Local dev server with hot reload     |
| `npm run build`| Typecheck (`astro check`) + production build to `dist/` |
| `npm run sync` | Regenerate Astro content types       |
| `npm run format` | Format with Prettier               |

## Configuration

| File | Purpose |
| ---- | ------- |
| [`src/config/config.json`](src/config/config.json) | Site URL, `base_path` (e.g. `/limbo/` for GitHub Pages), title, logo, metadata |
| [`src/config/theme.json`](src/config/theme.json) | Colors and typography tokens (wired into Tailwind) |
| [`src/config/menu.json`](src/config/menu.json) | Header and footer navigation |
| [`src/config/social.json`](src/config/social.json) | Social links for the footer |

`astro.config.mjs` reads `base_url` and `base_path` from `config.json` for `site` and `base`. Change those when moving hosts or switching between root and subdirectory deploys.

## Content

Collections are defined in [`src/content/config.ts`](src/content/config.ts).

- **Posts** — `src/content/posts/<year>/<slug>/index.md` (or `.mdx`). Frontmatter includes `title`, `date`, `categories`, `tags`, `authors`, optional `image`, `draft`, etc.
- **Authors** — `src/content/authors/<slug>/index.md`
- **Static pages** — `src/content/pages/` (e.g. contact, 404)
- **About** — `src/content/about/`

Markdown uses **remark-toc** with heading `Taula de continguts` (see `astro.config.mjs`). Default locale for i18n is Catalan (`ca`), with `es` and `en` also listed in config.

## Deployment

- **GitHub Pages**: `base_path` in `config.json` must match the repository path (e.g. `/limbo/`).
- **Netlify**: [`netlify.toml`](netlify.toml) publishes `dist/`. If you use npm and `package-lock.json`, set the build command to `npm run build` in the Netlify UI (or align `netlify.toml`) so it matches your package manager.

## License

MIT (see [`package.json`](package.json) `license` field).
