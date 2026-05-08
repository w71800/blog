---
title: How Terminals Work
aliases:
  - how-terminals-work
type: source
status: budding
sources: []
links:
  - terminal-emulator
  - pseudo-terminal
  - ansi-escape-sequences
  - terminal-input-modes
  - terminal-user-interface
  - terminfo
  - shell
tags:
  - terminal
  - cli
  - tui
  - systems
createdDate: 2026-05-08
updatedDate: 2026-05-08
---

## Source 摘要

`How Terminals Work` 是一個互動式網頁，用可操作的 cell grid、按鍵模擬、TUI 介面與 alternate screen 示範，串起 [[terminal-emulator|terminal emulator]]、[[pseudo-terminal|PTY]]、[[ansi-escape-sequences|ANSI escape sequences]]、shell 與 CLI 程式之間的資料流。

原文位於 [How Terminals Work](https://how-terminals-work.vercel.app/?media_id=3816087223682998749_63269140023&media_author_id=63269140023&utm_source=ig_text_feed_timeline)，全文摘錄存於 raw 層：`raw/article/how-terminals-work.md`。

## Key Takeaways

1. **終端機是 cell grid**：每個 cell 可保存字元、前景色、背景色與粗體/底線等 attributes；TUI 其實是在更新這些 cell。
2. **escape sequence 是控制語言**：顏色、清畫面、移動游標、切換 alternate screen、啟用 mouse tracking 都靠 `ESC` 開頭的控制序列。
3. **鍵盤輸入是 byte stream**：方向鍵不是語意事件，而是像 `ESC [ A` 這樣的 byte 序列；程式不理解時就會印出 `^[[A`。
4. **line discipline 會改寫輸入路徑**：在 cooked mode，核心緩衝整行、處理 backspace，並把 `Ctrl+C` 轉成 `SIGINT`；raw mode 則讓程式逐鍵處理。
5. **PTY 是現代終端機的核心介面**：terminal emulator 與 shell/CLI program 之間透過 pseudo-terminal 雙向傳輸資料。
6. **TUI 的架構接近 GUI**：它們維護狀態、做 layout、dispatch events、render 到 buffer，再把差異寫回終端機。
7. **TERM/terminfo 是能力協商**：程式根據 `$TERM` 查 terminal capabilities，但這只是約定，不是終端機強制保證。

## 與本 wiki 的關係

這份 source 補上命令列工具背後的系統模型，特別適合之後延伸到 CLI UX、TUI 框架、shell 設定與開發工具介面設計。
