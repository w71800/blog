---
title: 第一篇文章，來說說 Astro
description: 說明一下 Astro 的基本概念
pubDate: 2026-05-06
tags:
  - 文章
---

## 為什麼要用 Astro？
1. 有聽朋友介紹過，想玩玩看，了解不同技術的一些細節
2. 可以直接用 markdown 撰寫文章，十分輕量

## Astro 是什麼？
Astro 是一個以「內容型網站」為核心的框架，常見場景像是技術部落格、文件站、品牌官網。

它和一般 SPA 最大的差異是：Astro 預設會先產出靜態 HTML，只有需要互動的區塊才在瀏覽器啟用 JS。

對部落格來說，這個設計很實用：
- 首屏內容出得快
- 預設送到瀏覽器的 JS 較少
- SEO 友善
- 很棒的是，仍然可以局部使用 React/Vue 元件做互動！（Astro 的 **「島嶼架構」**） 

## Astro 的特色
### 1. 島嶼架構：只讓需要互動的元件上 JS
在 Astro 裡，頁面大部分內容是靜態 HTML。像按鈕、搜尋、篩選這類互動區塊，才透過 `client:*` 指令啟用。

常見時機：
- `client:load`：頁面 `load` 後啟用
- `client:idle`：瀏覽器空閒時啟用
- `client:visible`：元件進入可視範圍時啟用

### 2. 可以混用主流框架，但不必整頁 SPA 化
Astro 可以搭配 React/Vue/Svelte。  
重點不是「不用框架」，而是「需要時才使用框架」。

### 3. Hydrate 的角色：不是重畫 HTML，而是接管既有 DOM
很多人第一次接觸 Astro 會被 hydrate 這個詞卡住。

簡單說：
1. 伺服器先把 HTML 回傳給瀏覽器（畫面先出來）
2. 到了 `client:*` 指定時機，才下載該互動元件的 JS
3. 框架開始 hydrate：把事件、狀態、生命週期接上去

hydrate 不是「把 HTML 生出來」，而是「接管已存在的 HTML」。

## 實際流程：以 `client:load` 為例
假設頁面有一段元件：

```tsx
<PostTags tags={post.data.tags} client:load />
```

瀏覽器端的流程大致如下：
1. 先拿到 SSR/SSG 產生好的 HTML（你已經看得到 tags）
2. `astro-island` 會記住這塊元件需要的資訊（元件 URL、renderer URL、props）
3. 等到 `window.load` 觸發後，才下載對應 JS（例如 `PostTags` chunk、Astro runtime、React renderer）
4. 呼叫框架的 hydrate 邏輯接管那塊 DOM

如果這個元件本身沒有互動邏輯，其實可以先不 hydrate，讓頁面更輕量。

## 小結
如果你是 Vue/React 使用者，可以把 Astro 想成：

「先把內容頁做好、送出純 HTML；只有必要的小區塊才交給框架互動。」

這就是 Astro 在內容型網站上常被選擇的原因：簡單、快、而且可控。
