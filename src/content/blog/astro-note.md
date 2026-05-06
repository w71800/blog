---
title: Astro 筆記
description: 這篇有一些敘述
pubDate: 2026-05-06
tags:
  - 文章
---

## Astro 運行的筆記
1. Astro SSG 出來的靜態 HTML，裡面就會有 astro-island 這個標記。上面會有時機成熟時透過 JS 要注入的一些資訊
2. 時機有 load（client 端 load 事件發生之後）、idle、visisble 
3. load 完畢之後會去請求對應元件的 JS（例如說 PostTags.tsx、astro.js 等）
4. 開始進行 hydrate，框架接管了那塊 DOM，把事件監聽器、狀態、生命週期補上