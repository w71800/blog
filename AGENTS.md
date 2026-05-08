# AGENTS.md

這份文件規範任何 AI agent（Cursor、Claude Code、Codex…）在本 repo 中的工作方式。
本 repo 同時是個人筆記庫（LLM Wiki 模式）與公開部落格站（Astro）。

請在每次 session 開始時讀完這份文件，並在執行任何 ingest / query / lint / promote
操作時嚴格遵守此處的規範。

---

## 1. 專案定位

| 角色 | 路徑 | 維護者 | 性質 |
|---|---|---|---|
| 原始素材 | `src/content/raw/` | 使用者 | 不可變 (immutable)。LLM 只讀，不改。 |
| Wiki 筆記 | `src/content/wiki/` | LLM 為主、人類審閱 | 持續演化、互相連結。 |
| 部落格成品 | `src/content/posts/` | 使用者為主 | 公開發表、長文、有完成度。 |

核心理念：知識在 `wiki/` 中持續複利累積。`posts/` 是 wiki 內容成熟後的「對外輸出」。

關於對外渲染：
- `posts/` 渲染在 `/posts/<slug>/`，並列在首頁。
- `wiki/` 渲染在 `/wiki/<slug>/`，入口在 `/wiki`，採扁平 URL 命名空間。
- `raw/` **不渲染為網頁**，只進 git 作為備份／來源真相。

---

## 2. 內容架構

### 2.1 raw/

- 命名：`raw/<source-type>/<slug>.md`，例如：
  - `raw/article/karpathy-llm-wiki.md`
  - `raw/paper/attention-is-all-you-need.md`
  - `raw/talk/why-greatness-cannot-be-planned.md`
- 每份 source 必須在 frontmatter 標明來源資訊（見 §3.1）。
- LLM 絕對不能修改 `raw/` 下任何檔案的內容主體。
- 若 source 有圖片，放到 `raw/_assets/<slug>/`。

### 2.2 wiki/

子分類（用資料夾組織，但**檔名必須全 wiki 唯一**以方便 wiki-link 解析）：

- `wiki/entity/`：人物、組織、產品、地點等具體事物
- `wiki/concept/`：抽象概念、術語、模式
- `wiki/topic/`：主題式長頁（會持續累加）
- `wiki/source/`：每份 raw 對應的摘要頁（一個 source 一頁）
- `wiki/index.md`：全 wiki 目錄（特殊頁，見 §6）
- `wiki/log.md`：操作時間軸（特殊頁，見 §6）

URL 規則：所有 wiki 頁的對外路徑都是 `/wiki/<檔名>/`，**子資料夾不出現在 URL**。
這意味著檔名必須在整個 `wiki/` 下唯一。

### 2.3 posts/

`posts/<slug>.md`，扁平結構，按 `pubDate` 排序顯示在首頁。

---

## 3. Frontmatter 規範

所有 markdown 檔案都必須通過 Astro Content Collections 的 zod schema。

### 3.1 raw/

```yaml
---
title: 原始素材的標題
sourceType: article | paper | talk | podcast | book | thread | other
sourceUrl: https://...        # 若有
author: 作者名稱               # 若有
publishedDate: 2026-04-15     # source 的原發表日，非匯入日
ingestedDate: 2026-05-08      # 匯入本 repo 的日期
tags: [llm, knowledge-management]
---
```

### 3.2 wiki/

```yaml
---
title: 頁面標題
aliases: [別名1, 別名2]              # 可選，供未來 wiki-link 別名解析
type: entity | concept | topic | source | meta
status: seedling | budding | evergreen   # 成熟度
sources: [karpathy-llm-wiki]         # 引用了哪些 raw（用 raw 的 slug）
links: [其他-wiki-頁-slug]            # 主要的出向連結
tags: [llm, knowledge-management]
createdDate: 2026-05-08
updatedDate: 2026-05-08
---
```

`status` 三階段定義：
- `seedling`：剛開的頁，內容稀疏、可能有錯
- `budding`：累積了 2–5 個 sources，結構成形
- `evergreen`：經多次審閱、內容穩定，可信度高

### 3.3 posts/

```yaml
---
title: 文章標題
description: 一句話描述（用於列表頁與 SEO）
pubDate: 2026-05-08
updatedDate: 2026-05-12       # 可選
draft: false
tags: [文章]
derivedFrom: [wiki-page-slug] # 可選，標明是從哪些 wiki 頁提煉的
---
```

---

## 4. 連結規範

### 4.1 Wiki-link 語法

在 `wiki/` 內部，引用其他 wiki 頁時使用 `[[slug]]` 或 `[[slug|顯示文字]]`：

```markdown
這個概念與 [[islands-architecture]] 密切相關，也可以對照
[[hydration|Hydrate 機制]] 來看。
```

build-time 會由 remark plugin（`src/lib/remark-wiki-link.mjs`）解析，並：
1. 將 `[[slug]]` 轉為 `<a href="/wiki/slug/">slug</a>`
2. 將 `[[slug|label]]` 轉為 `<a href="/wiki/slug/">label</a>`
3. 為連結加上 `data-wikilink` 屬性、CSS class `wiki-link`，便於樣式與孤兒檢測

slug 解析失敗（沒有對應檔）時，連結會帶上 `wiki-link--missing` class，
方便視覺辨識，這也是 `lint` 操作的偵測點之一。

### 4.2 引用 raw

從 wiki 頁引用原始 source 時，使用標準 markdown link 並指向 source 摘要頁：

```markdown
（參考 [Karpathy 的 LLM Wiki](/wiki/karpathy-llm-wiki/)）
```

不要直接連到 `raw/` 路徑——`raw/` 不對外渲染。

### 4.3 從 posts/ 反向連結到 wiki

posts 可以引用 wiki，但要意識到 wiki 內容會變動。引用時建議在 frontmatter
的 `derivedFrom` 標明，方便日後追溯。

---

## 5. 工作流（Operations）

### 5.1 Ingest（匯入新 source）

當使用者說「幫我 ingest 這個」或丟了一篇文章/連結時，agent 應：

1. 把 source 落地到 `src/content/raw/<sourceType>/<slug>.md`，frontmatter 完整
2. 在 `wiki/source/<slug>.md` 建立摘要頁（200–500 字，列出 key takeaways）
3. 識別 source 中提到的關鍵 entity / concept：
   - 已存在對應 wiki 頁 → **更新** 該頁，把新資訊整合進去，必要時標註矛盾
   - 不存在 → **新建** seedling 頁，並加入足夠資訊讓它可以獨立閱讀
4. 更新所有相關頁的 `sources`、`links`、`updatedDate`
5. 更新 `wiki/index.md`
6. 在 `wiki/log.md` append 一筆：`## [YYYY-MM-DD] ingest | <source-title>`
7. 結束前向使用者報告：碰了哪些頁、新建了哪些頁、有沒有偵測到矛盾

**重要**：一次 ingest 通常會觸碰 5–15 個頁面。不要嫌多。但每筆改動都要有依據，
不確定的內容寫進頁面時要用 `> [!note] 待驗證` callout 標註。

### 5.2 Query（提問）

使用者提問時，agent 應：

1. **先讀 `wiki/index.md`**，找出可能相關的頁
2. 讀那些頁、必要時跟著 `links` 與 wiki-link 跳轉
3. 綜合資訊回答，**每個論點都要附上 `[[slug]]` 引用**
4. 若答案本身有保留價值（比較、分析、發現的關聯），詢問使用者是否要回填成 wiki 頁

不要：
- 不要在沒讀 index 的情況下亂猜頁名
- 不要憑印象回答 wiki 已經有的內容
- 不要編造不存在的頁面 slug

### 5.3 Lint（健檢）

使用者說「lint 一下」時，agent 應產出一份 markdown 報告，檢查：

- **斷鏈**：`[[slug]]` 指向不存在的頁
- **孤兒頁**：沒有任何頁連向它的 wiki 頁（除了 entry-point 性質的 topic 頁）
- **缺頁概念**：在多個頁中被提到、但自己沒有專屬頁的 entity/concept
- **矛盾**：不同頁對同一事實有不一致敘述
- **過時 status**：sources 已 ≥ 5 但仍標 seedling 的頁
- **缺少 sources**：wiki 頁宣稱事實但 frontmatter 的 `sources` 為空
- **frontmatter 不合法**：欄位缺失、日期格式錯誤等
- **檔名衝突**：`wiki/` 下出現重名檔（會破壞 wiki-link 唯一性）

報告以建議形式呈現，不直接動手修改，等使用者確認。

### 5.4 Promote（wiki → posts）

當某個 wiki 主題夠成熟、適合寫成公開文章時，使用者會說「把 X 升級成 post」。
agent 此時應：

1. 在 `posts/` 建立新檔，**重寫**內容（不是直接複製）以符合公開文章的口吻與結構
2. frontmatter 的 `derivedFrom` 列出所有引用的 wiki slug
3. 把對應 wiki 頁的 `status` 升為 `evergreen`（如果還不是）
4. 在 `wiki/log.md` append `## [YYYY-MM-DD] promote | <post-title>`

posts 不該大量塞 wiki-link，畢竟 wiki 是個人的工作區。引用 wiki 用一般
markdown link 即可，且要心理準備那些 wiki 頁會繼續演化。

---

## 6. 特殊檔案

### 6.1 wiki/index.md

`type: meta`。結構建議：

```markdown
# Wiki Index

## Entities
- [[karpathy]] — AI 研究者，提出 LLM Wiki 模式
- ...

## Concepts
- [[llm-wiki-pattern]] — 用 LLM 維護持久化 markdown wiki 的模式
- [[islands-architecture]] — Astro 的部分 hydration 設計
- ...

## Topics
- [[knowledge-management]] — 個人知識管理的演化與工具
- ...

## Sources
- [[karpathy-llm-wiki]] — 2026-04，原始 gist
- ...
```

每次 ingest 後 agent 必須更新此檔。

### 6.2 wiki/log.md

`type: meta`，append-only。每筆固定前綴：

```markdown
## [2026-05-08] ingest | Karpathy 的 LLM Wiki Gist
- 觸碰：[[llm-wiki-pattern]]（新建）、[[karpathy]]（更新）、
  [[knowledge-management]]（更新）
- 偵測到矛盾：無

## [2026-05-08] lint
- 5 個斷鏈、2 個孤兒頁，已產出報告

## [2026-05-09] promote | Astro Islands 深入解析
- 來源：[[islands-architecture]]、[[hydration]]
```

絕對不要重排或刪除 log 內容。修正錯誤就再追加一筆。

---

## 7. 命名規則

- **slug**：全 wiki 內使用 kebab-case，限英數與連字號（例：`llm-wiki-pattern`）
- **檔名 = slug + .md**，且在整個 `wiki/` 內唯一（不論放在哪個子資料夾）
- 中文標題寫在 frontmatter 的 `title`，不出現在檔名
- entity 頁若是英文人名，slug 用姓氏優先：`karpathy`、`appleton-maggie`
- 同一概念有多種說法時，把次要說法寫進 `aliases`，不要建多個頁

---

## 8. 給 Agent 的硬性規則

1. 回答前必先讀相關檔案，禁止憑印象回答 wiki 已有內容
2. 任何修改 wiki 頁的操作，都必須同步更新 `updatedDate`
3. 任何修改 wiki 結構的操作（新建/重命名/刪除頁），都必須同步更新 `index.md` 與 `log.md`
4. 不確定的內容用 `> [!note] 待驗證` callout 標註，不要寫成肯定句
5. 跨頁矛盾：保留兩種說法，用 callout 標註，不要擅自選一邊
6. 對話中產出的有保留價值的綜合答案，主動詢問是否回填
7. 連 PR 描述都不要替使用者寫——這是給人類的工作

---

## 9. Cursor 使用備註

- 本 repo 主要 IDE 是 Cursor。本檔案會被 Cursor 自動讀入 context
- 大批 ingest 時建議開新 chat；探索式提問可在同一 chat 累積
- 涉及多檔修改時，先在 chat 內列出計畫再動手
- 用 `Cmd+L` 把要 ingest 的素材直接拉進 context 比貼連結更可靠

---

## 10. 演化此檔案

這份文件是活的。每當你發現某個工作流不順、或 agent 行為與預期不符，請：

1. 與 agent 討論該修哪一條
2. 直接編輯本檔案
3. 在 `wiki/log.md` 用 `## [YYYY-MM-DD] schema-update | ...` 記錄變更
