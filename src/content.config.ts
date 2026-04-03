import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const postsCollection = defineCollection({
  loader: glob({ pattern: "**/index.{md,mdx}", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      meta_title: z.string().optional(),
      description: z.string().optional(),
      date: z.coerce.date().optional(),
      image: image().optional(),
      image_attribution: z
        .object({
          author: z.string(),
          site: z.string().default("Pexels"),
          url: z.string(),
        })
        .optional(),
      authors: z.array(z.string()).default(["admin"]),
      categories: z.array(z.string()).default(["untagged"]),
      tags: z.array(z.string()).default(["untagged"]),
      draft: z.boolean().optional(),
    }),
});

const authorsCollection = defineCollection({
  loader: glob({ pattern: "**/index.{md,mdx}", base: "./src/content/authors" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      meta_title: z.string().optional(),
      image: image().optional(),
      description: z.string().optional(),
      social: z
        .object({
          facebook: z.string().optional(),
          twitter: z.string().optional(),
          instagram: z.string().optional(),
        })
        .optional(),
      draft: z.boolean().optional(),
    }),
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    layout: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

const aboutCollection = defineCollection({
  loader: glob({ pattern: "**/index.{md,mdx}", base: "./src/content/about" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().optional(),
    what_i_do: z
      .object({
        title: z.string(),
        items: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
          }),
        ),
      })
      .optional(),
  }),
});

export const collections = {
  posts: postsCollection,
  pages: pagesCollection,
  authors: authorsCollection,
  about: aboutCollection,
};
