import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { shortSlugOf } from '../lib/wiki';

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const wiki = await getCollection('wiki');

  const postDocs = posts.map((p) => ({
    kind: 'post' as const,
    url: `/posts/${p.slug}/`,
    title: p.data.title,
    description: p.data.description,
    tags: p.data.tags,
    body: p.body,
  }));

  const wikiDocs = wiki
    .filter((w) => w.data.type !== 'meta')
    .map((w) => ({
      kind: 'wiki' as const,
      url: `/wiki/${shortSlugOf(w)}/`,
      title: w.data.title,
      description: `${w.data.type} · ${w.data.status}`,
      tags: w.data.tags,
      body: w.body,
    }));

  const index = [...postDocs, ...wikiDocs];

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
