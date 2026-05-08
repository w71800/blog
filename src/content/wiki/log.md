---
title: Wiki 操作日誌
type: meta
status: evergreen
tags:
  - meta
createdDate: 2026-05-08
updatedDate: 2026-05-08
---

> Append-only 日誌。每筆條目以 `## [YYYY-MM-DD] <op> | <subject>` 格式起始，
> 不重排、不刪除。修正錯誤就再追加一筆。

## [2026-05-08] schema-update | 建立 LLM Wiki 模式骨架

- 建立 `AGENTS.md`、三個 collection（raw / wiki / posts）、wiki-link 解析、backlinks
- 新建頁：[[karpathy]]、[[llm-wiki-pattern]]、[[karpathy-llm-wiki]]、[[knowledge-management]]
- 既有筆記 `astro-note.md` 移入 wiki，重命為 [[astro-runtime|Astro Runtime 與 Hydration]]
- 既有文章 `astro-introduction.md` 移入 posts/

## [2026-05-08] ingest | Karpathy 的 LLM Wiki Gist

- 來源：[[karpathy-llm-wiki]]
- 觸碰：[[llm-wiki-pattern]]（新建）、[[karpathy]]（新建）、[[knowledge-management]]（新建）、[[index|wiki/index.md]]（更新）
- 偵測到矛盾：無
- TODO：補 Karpathy 學經歷；展開 Zettelkasten / digital garden 等相關概念頁
