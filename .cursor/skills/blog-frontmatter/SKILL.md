---
name: blog-frontmatter
description: >-
  Generates or validates Astro Content Collection frontmatter for this repo’s
  `blog` collection (`src/content/blog/*.md`). Use when creating or editing
  blog markdown, adding YAML frontmatter, fixing `astro:content` schema errors,
  or when the user mentions blog metadata, pubDate, tags, or draft posts.
---

# Blog 文章 frontmatter（Astro `blog` schema）

## 權威來源

以 `src/content/config.ts` 的 `defineCollection` / `z.object` 為準。若 skill 與程式碼不一致，**以程式碼為準**。

## Schema 欄位（必填／選填）

| 欄位 | Zod | 說明 |
|------|-----|------|
| `title` | `z.string()` | 必填。會出現在列表與 `BlogPostLayout` 的 `<h1>`。 |
| `description` | `z.string()` | 必填。摘要；用於 SEO / 列表。 |
| `pubDate` | `z.coerce.date()` | 必填。YAML 用 `YYYY-MM-DD` 即可。 |
| `updatedDate` | `z.coerce.date().optional()` | 選填。有改版再填。 |
| `draft` | `z.boolean().default(false)` | 選填；預設 `false`。`true` 時不會出現在 `getCollection` 已過濾的列表。 |
| `tags` | `z.array(z.string()).default([])` | 選填；預設 `[]`。建議至少一個，與站內既有文章一致時常用 `文章`，再加主題標籤。 |

## 輸出格式

在檔案**最開頭**插入或更新 YAML，緊接著一個空行，再接 Markdown 正文：

```yaml
---
title: <字串>
description: <字串>
pubDate: YYYY-MM-DD
updatedDate: YYYY-MM-DD
draft: false
tags:
  - 文章
  - <其他標籤>
---
```

- 未使用的選填欄位可整行省略（例如沒更新就不寫 `updatedDate`）。
- `tags` 使用 YAML 陣列語法；不要用單一逗號字串。

## 與版面重複標題

`BlogPostLayout.astro` 已用 `post.data.title` 渲染頁面主標題 `<h1>`。

- 若正文第一行是與 `title` 相同的 `# ...`，會出現**兩個主標題**。
- 建議：刪除或改寫該行，正文從 `##` 或小節 `#`（與 title 不同）開始。

## 產出流程

1. 讀取 `src/content/config.ts` 確認 `blog` schema 未變。
2. 依文章主題填 `title`、`description`（1～2 句為宜）、`pubDate`（使用者未給則用對話中的「今日」或合理日期）。
3. `tags`：對齊站內習慣；技術文可加上框架／主題標籤。
4. 檢查正文是否與 layout 的 `<h1>` 重複。
5. 可執行 `npx astro check` 驗證 content collection 無型別／schema 錯誤。

## 範例

```yaml
---
title: Vue Slot 與 Scoped Slot 筆記
description: 從預設插槽、具名插槽到作用域插槽，整理 Vue 中 slot 的資料流與常見用法。
pubDate: 2026-05-14
tags:
  - 文章
  - Vue
  - 前端
---
```
