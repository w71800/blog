---
title: Karpathy 的 LLM Wiki Gist
aliases:
  - llm-wiki-gist
type: source
status: budding
sources: []
links:
  - llm-wiki-pattern
  - karpathy
  - knowledge-management
tags:
  - llm
  - knowledge-management
createdDate: 2026-05-08
updatedDate: 2026-05-08
---

## Source 摘要

[[karpathy|Karpathy]] 於 2026/04 發表的 GitHub Gist，提出 [[llm-wiki-pattern|LLM Wiki 模式]]——
讓 LLM 持續維護一份結構化的 markdown 知識庫，以取代每次重新檢索的 RAG 工作流。

原文位於 [gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)，
全文存於 raw 層：`raw/article/karpathy-llm-wiki.md`。

## Key Takeaways

1. **複利 vs 即查**：傳統 RAG 每次查詢都重新檢索；LLM Wiki 把知識編譯一次，後續持續維護更新。
2. **三層架構**：`raw/`（原始）、`wiki/`（LLM 維護）、schema（`CLAUDE.md` / `AGENTS.md`）。
3. **三種操作**：Ingest（吃進新資料）、Query（提問）、Lint（健檢矛盾與孤兒）。
4. **兩個特殊檔**：`index.md`（目錄）、`log.md`（時間軸，append-only）。
5. **責任分工**：人類負責 curating sources 與 asking good questions；LLM 負責 bookkeeping。
6. **比喻**：Obsidian 是 IDE，LLM 是 programmer，wiki 是 codebase。
7. **承襲 Memex**：Vannevar Bush 1945 願景的當代實作，補上「誰來維護」這個缺口。

## 與本 repo 的關係

本 repo 採用此模式的精神，但做了在地化調整：

- 不使用 Obsidian，改以 Cursor 為主要 IDE
- wiki 與 posts（部落格成品文章）共存於同一 Astro 站
- URL 採扁平命名空間（`/wiki/<slug>/`），目錄階層只用於人類組織

詳見 [`AGENTS.md`](https://github.com/) 第 §1–§4 節。
