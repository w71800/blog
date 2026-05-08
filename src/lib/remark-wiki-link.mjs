/**
 * remark plugin：把 [[slug]] 與 [[slug|label]] 轉成 wiki 內部連結
 *
 * 對應 AGENTS.md §4.1：
 *   - [[slug]]        → <a href="/wiki/slug/" class="wiki-link" data-wikilink="slug">slug</a>
 *   - [[slug|label]]  → <a href="/wiki/slug/" class="wiki-link" data-wikilink="slug">label</a>
 *
 * 在 build 時 plugin 拿不到完整的 collection 列表，因此不會在這裡判定
 * 「目標頁是否存在」。缺頁的偵測由 routes 端 + lint 操作處理；視覺上會在
 * 目標頁不存在時，由 page 端額外加上 .wiki-link--missing class。
 */

const WIKI_LINK_RE = /\[\[([^\[\]\|\n]+?)(?:\|([^\[\]\n]+?))?\]\]/g;

function buildLinkNode(slug, label) {
  const trimmedSlug = slug.trim();
  const display = (label ?? trimmedSlug).trim();
  return {
    type: 'link',
    url: `/wiki/${encodeURIComponent(trimmedSlug)}/`,
    title: null,
    data: {
      hProperties: {
        className: ['wiki-link'],
        'data-wikilink': trimmedSlug,
      },
    },
    children: [{ type: 'text', value: display }],
  };
}

function transformText(value) {
  WIKI_LINK_RE.lastIndex = 0;
  if (!WIKI_LINK_RE.test(value)) return null;
  WIKI_LINK_RE.lastIndex = 0;

  const out = [];
  let lastIndex = 0;
  let match;

  while ((match = WIKI_LINK_RE.exec(value)) !== null) {
    const [full, slug, label] = match;
    if (match.index > lastIndex) {
      out.push({ type: 'text', value: value.slice(lastIndex, match.index) });
    }
    out.push(buildLinkNode(slug, label));
    lastIndex = match.index + full.length;
  }

  if (lastIndex < value.length) {
    out.push({ type: 'text', value: value.slice(lastIndex) });
  }

  return out;
}

function walk(node) {
  if (!node || typeof node !== 'object') return;

  // code / inlineCode 不展開 wiki-link
  if (node.type === 'code' || node.type === 'inlineCode') return;

  if (Array.isArray(node.children)) {
    const next = [];
    for (const child of node.children) {
      if (child && child.type === 'text' && typeof child.value === 'string') {
        const replaced = transformText(child.value);
        if (replaced) {
          next.push(...replaced);
          continue;
        }
      }
      next.push(child);
      walk(child);
    }
    node.children = next;
  }
}

export default function remarkWikiLink() {
  return (tree) => {
    walk(tree);
  };
}
