import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import remarkWikiLink from './src/lib/remark-wiki-link.mjs';

const site = process.env.PUBLIC_SITE_URL || 'https://example.com';

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [react(), tailwind()],
  prefetch: {
    prefetchAll: true,
  },
  markdown: {
    remarkPlugins: [remarkWikiLink],
  },
});
