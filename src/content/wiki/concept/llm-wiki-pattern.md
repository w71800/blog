---
title: LLM Wiki 模式
aliases:
  - llm-wiki
  - karpathy-wiki-pattern
type: concept
status: seedling
sources:
  - karpathy-llm-wiki
links:
  - karpathy
  - knowledge-management
tags:
  - llm
  - knowledge-management
  - personal-wiki
createdDate: 2026-05-08
updatedDate: 2026-05-08
---

## 定義

由 [[karpathy|Andrej Karpathy]] 於 2026/04 提出的個人知識管理模式：
**讓 LLM 持續維護一份結構化、可互相連結的 markdown wiki**，以取代每次重新檢索的 RAG 工作流。

## 為何不只是 RAG

傳統 RAG 在每次查詢時都重新從原始文件中檢索片段。沒有累積、沒有 cross-reference、沒有
synthesis 的持久化。LLM Wiki 把這些一次性編譯，然後持續更新。

## 三層架構

| 層 | 路徑慣例 | 維護者 | 性質 |
|---|---|---|---|
| Raw | `raw/` | 人類 | Immutable 原始資料 |
| Wiki | `wiki/` | LLM | 結構化、互相連結的整理頁 |
| Schema | `AGENTS.md` / `CLAUDE.md` | 人類 + LLM 共同演化 | 工作流定義 |

## 三種操作

- **Ingest**：丟入 source，LLM 整合進現有 wiki，可能觸碰 10–15 個頁面。
- **Query**：對 wiki 提問，答案有保留價值時可回填成新 wiki 頁。
- **Lint**：定期健檢矛盾、孤兒頁、缺頁概念、過時宣稱。

## 兩個特殊檔案

- `index.md`：內容目錄，每次 ingest 後 LLM 更新。
- `log.md`：append-only 時間軸，每筆固定前綴方便 grep。

## 為什麼可行

> 維護知識庫的疲勞點不在閱讀或思考，而在 bookkeeping。LLM 不會無聊、不會忘了更新 cross-reference、能一次觸碰 15 個檔案。維護成本趨近於 0，wiki 才得以維持。

詳見 [[karpathy-llm-wiki|原始 gist]]。

## 本 repo 的實作

- 採用此模式的精神，但不用 Obsidian，改以 Cursor 為 IDE
- wiki 與 posts（部落格成品）共存於同一 Astro 站
- URL 採扁平命名空間（`/wiki/<slug>/`）
- 詳細工作流見根目錄 `AGENTS.md`
