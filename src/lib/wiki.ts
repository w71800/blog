import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type WikiEntry = CollectionEntry<'wiki'>;

const WIKI_LINK_RE = /\[\[([^\[\]\|\n]+?)(?:\|[^\[\]\n]+?)?\]\]/g;

/**
 * 計算 wiki 條目的「短 slug」——也就是 URL 與 [[wiki-link]] 使用的識別字串。
 *
 * 一份檔在 collection 中的 id 是 "<subdir>/<filename>.md"（例如
 * "concept/llm-wiki-pattern.md"），但本 repo 的慣例是扁平 URL，因此這裡只取
 * 檔名（不含副檔名）。AGENTS.md §2.2 規定檔名必須在整個 wiki/ 下唯一。
 */
export function shortSlugOf(entry: WikiEntry): string {
  const id = entry.id;
  const lastSlash = id.lastIndexOf('/');
  const base = lastSlash >= 0 ? id.slice(lastSlash + 1) : id;
  return base.replace(/\.(md|mdx)$/i, '');
}

/**
 * 解析 body 中所有 [[slug]] 與 [[slug|label]]，回傳唯一 slug 集合。
 */
export function extractWikiLinks(body: string): string[] {
  const seen = new Set<string>();
  WIKI_LINK_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = WIKI_LINK_RE.exec(body)) !== null) {
    seen.add(m[1].trim());
  }
  return Array.from(seen);
}

/**
 * 把 wiki 條目按 short slug 整理成 Map，方便路由查表與 backlinks 比對。
 */
export async function getWikiSlugMap(): Promise<Map<string, WikiEntry>> {
  const entries = await getCollection('wiki');
  const map = new Map<string, WikiEntry>();
  for (const e of entries) {
    const s = shortSlugOf(e);
    if (map.has(s)) {
      console.warn(`[wiki] short slug 衝突：${s}（檔案 ${e.id}）`);
    }
    map.set(s, e);
  }
  return map;
}

export type Backlink = {
  slug: string;
  title: string;
};

/**
 * 找出指向 targetSlug 的所有 wiki 條目（透過 [[targetSlug]] 或 alias）。
 */
export async function getBacklinks(targetSlug: string): Promise<Backlink[]> {
  const entries = await getCollection('wiki');
  const target = entries.find((e) => shortSlugOf(e) === targetSlug);
  const aliases = new Set<string>([targetSlug, ...(target?.data.aliases ?? [])]);

  const result: Backlink[] = [];
  for (const e of entries) {
    if (shortSlugOf(e) === targetSlug) continue;
    const links = extractWikiLinks(e.body);
    if (links.some((l) => aliases.has(l))) {
      result.push({ slug: shortSlugOf(e), title: e.data.title });
    }
  }
  result.sort((a, b) => a.title.localeCompare(b.title, 'zh-Hant'));
  return result;
}

/**
 * 找出 wiki entry 中出現、但對應目標頁尚未建立的 [[broken-link]]。
 */
export async function getBrokenLinks(
  entry: WikiEntry,
  slugMap?: Map<string, WikiEntry>,
): Promise<string[]> {
  const map = slugMap ?? (await getWikiSlugMap());
  const aliasIndex = new Set<string>();
  for (const e of map.values()) {
    aliasIndex.add(shortSlugOf(e));
    for (const a of e.data.aliases) aliasIndex.add(a);
  }
  const links = extractWikiLinks(entry.body);
  return links.filter((l) => !aliasIndex.has(l));
}
