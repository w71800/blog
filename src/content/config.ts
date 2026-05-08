import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    derivedFrom: z.array(z.string()).default([]),
  }),
});

const wiki = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    aliases: z.array(z.string()).default([]),
    type: z.enum(['entity', 'concept', 'topic', 'source', 'meta']),
    status: z
      .enum(['seedling', 'budding', 'evergreen'])
      .default('seedling'),
    sources: z.array(z.string()).default([]),
    links: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    createdDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
  }),
});

const raw = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    sourceType: z.enum([
      'article',
      'paper',
      'talk',
      'podcast',
      'book',
      'thread',
      'other',
    ]),
    sourceUrl: z.string().url().optional(),
    author: z.string().optional(),
    publishedDate: z.coerce.date().optional(),
    ingestedDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { posts, wiki, raw };
