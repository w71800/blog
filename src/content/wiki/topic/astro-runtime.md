---
title: Astro Runtime 與 Hydration 機制
aliases:
  - astro-island
  - astro hydrate
type: topic
status: seedling
sources: []
links:
  - islands-architecture
  - hydration
tags:
  - astro
  - 前端
createdDate: 2026-05-06
updatedDate: 2026-05-08
---

> [!note] 本頁前身是個人筆記 `astro-note.md`，已搬入 wiki，內容仍待補完。

## Astro 運行的筆記

1. Astro SSG 出來的靜態 HTML，裡面就會有 `astro-island` 這個標記。上面會有時機成熟時透過 JS 要注入的一些資訊。
2. 觸發時機有 `load`（client 端 load 事件發生之後）、`idle`、`visible`。
3. load 完畢之後會去請求對應元件的 JS（例如說 `PostTags.tsx`、`astro.js` 等）。
4. 開始進行 hydrate，框架接管了那塊 DOM，把事件監聽器、狀態、生命週期補上。

## 相關概念

- [[islands-architecture|Astro 的島嶼架構]]：頁面大部分是靜態 HTML，只有互動區塊上 JS。
- [[hydration|Hydrate 機制]]：把既有 DOM 接管，而不是重畫。
