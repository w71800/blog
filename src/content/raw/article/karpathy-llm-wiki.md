---
title: LLM Wiki — A pattern for building personal knowledge bases using LLMs
sourceType: article
sourceUrl: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
author: Andrej Karpathy
publishedDate: 2026-04-02
ingestedDate: 2026-05-08
tags:
  - llm
  - knowledge-management
  - personal-wiki
---

> 本檔為 raw 層保存。原文版權屬作者所有，本 repo 只在私人筆記庫中保留作為來源依據。
> 如需閱讀完整原文，請至 [gist 原始連結](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)。

## 全文重點摘錄

### 核心想法

不再像一般 RAG 在每次查詢時從原始文件即時檢索答案，而是讓 LLM **持續維護一份結構化的 wiki**：

> Instead of just retrieving from raw documents at query time, the LLM **incrementally builds and maintains a persistent wiki** — a structured, interlinked collection of markdown files that sits between you and the raw sources.

關鍵差異：

- **持久化、可複利的成品**：cross-references 已經建好；矛盾已經被標出；synthesis 已經反映你讀過的全部資料。
- 你（人類）負責：sourcing、exploration、提出對的問題。
- LLM 負責：summarizing、cross-referencing、filing、bookkeeping。
- 比喻：「Obsidian 是 IDE，LLM 是 programmer，wiki 是 codebase」。

### 應用情境

- Personal：自我目標、健康、心理、自我成長
- Research：對某主題深耕數週、數月
- Reading a book：邊讀邊建角色、主題、情節頁，最後得到陪讀 wiki
- Business/team：內部 wiki，由 LLM 整合 Slack、會議逐字稿、文件
- 其他：competitive analysis、due diligence、trip planning、course notes、hobby deep-dives

### 三層架構

1. **Raw sources** — 原始素材（articles、papers、images、data files）。Immutable，LLM 只讀不改。
2. **The wiki** — LLM 產生的 markdown 頁面（summaries、entity pages、concept pages、comparisons、overview、synthesis）。LLM 完全擁有此層。
3. **The schema** — `CLAUDE.md` / `AGENTS.md`，告訴 LLM wiki 的結構、慣例與工作流。是讓 LLM 變成「有紀律的 wiki 維護者」的關鍵設定。

### 三種操作

- **Ingest**：丟入新 source，LLM 讀、與你討論重點、寫摘要頁、更新所有相關 entity / concept 頁、更新 index、append log。一次可能觸碰 10–15 個頁面。
- **Query**：對 wiki 提問，LLM 找相關頁、合成答案附上引用。**有保留價值的答案應回填成新 wiki 頁**。
- **Lint**：定期健檢——找矛盾、過時宣稱、孤兒頁、缺頁概念、缺少 cross-reference、缺資料的研究 gap。

### 索引與日誌

- **`index.md`**：內容導向。所有頁的目錄。每次 ingest 後更新。在小至中規模（~100 sources、數百頁）下足以取代 embedding RAG。
- **`log.md`**：時序導向。append-only。每筆固定前綴（如 `## [2026-04-02] ingest | …`），可用 unix 工具 grep。

### Tips

- **Obsidian Web Clipper** 把網頁轉 markdown
- 設定 `raw/assets/` 自動下載圖片
- Obsidian 的 graph view 看 wiki 結構
- **Marp** 用於生成 slide deck
- **Dataview** plugin 配合 frontmatter 動態列表
- wiki 是 git repo of markdown files——版本控制、分支、協作免費

### 為什麼能成立

維護知識庫的疲勞點不在閱讀或思考，而在 bookkeeping。LLM 不會無聊、不會忘了更新 cross-reference、能一次觸碰 15 個檔案。維護成本趨近於 0，wiki 才得以維持。

人類負責 curate、引導分析、提好問題、思考 it all means。LLM 負責其餘一切。

### 致敬

文章結尾把這個想法連到 Vannevar Bush 1945 的 Memex——個人化、主動 curate、document 之間的關聯如同 document 本身有價值。Bush 沒解的問題是「誰來維護」，LLM 解了。
