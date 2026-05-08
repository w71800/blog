---
title: Terminfo
aliases:
  - TERM
  - terminal capabilities
  - 終端機能力資料庫
type: concept
status: seedling
sources:
  - how-terminals-work
links:
  - terminal-emulator
  - ansi-escape-sequences
  - terminal-user-interface
tags:
  - terminal
  - cli
  - systems
createdDate: 2026-05-08
updatedDate: 2026-05-08
---

## 概念

Terminfo 是程式查詢終端機能力的資料庫。程式通常先讀取 `$TERM` 環境變數，例如 `xterm-256color`、`screen-256color`、`vt100` 或 `dumb`，再到 terminfo 查這類終端機支援哪些功能與控制序列。

`$TERM` 只是字串約定，不是 [[terminal-emulator|terminal emulator]] 強制執行的能力宣告。因此設定錯誤時，程式可能誤以為終端機支援或不支援某些功能。

## 能力範例

程式可能透過 terminfo 判斷：

- 是否支援 256 colors
- 是否支援 alternate screen
- 是否支援 mouse tracking
- 清畫面、移動游標等 [[ansi-escape-sequences|escape sequences]] 應該如何輸出
- 是否適合顯示 Unicode 或 box drawing characters

## 直接查詢

除了查 `$TERM` 與 terminfo，程式也可以直接向終端機查詢。例如 DA1 query `ESC[c` 會問「你是什麼終端機？」終端機再回傳 capability codes。

這種能力協商解釋了為什麼 TUI 程式啟動時常會發出一串看不見的控制序列：它們在確認或啟用後續互動所需的功能。
