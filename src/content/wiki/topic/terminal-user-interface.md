---
title: Terminal User Interface
aliases:
  - TUI
  - terminal UI
  - 文字使用者介面
type: topic
status: seedling
sources:
  - how-terminals-work
links:
  - terminal-emulator
  - pseudo-terminal
  - ansi-escape-sequences
  - terminal-input-modes
  - terminfo
tags:
  - terminal
  - cli
  - tui
createdDate: 2026-05-08
updatedDate: 2026-05-08
---

## 範圍

Terminal User Interface（TUI）是在終端機 character grid 上建構的互動式介面。它看起來像有視窗、面板、選單、狀態列與游標，但底層仍是文字、Unicode 字元、[[ansi-escape-sequences|escape sequences]] 與一個由程式維護的狀態模型。

典型例子包含 vim、htop、less、file explorer、terminal dashboard、CI status monitor 與許多現代 CLI dev tools。

## 核心模型

進階 TUI 通常會把畫面拆成多個 region。每個 region 是 character grid 上的一個矩形，知道自己的位置、尺寸、內容與邊框。當 terminal resize 時，layout engine 重新計算這些 region 的 bounds。

常見架構：

1. **Layout engine**：維護類似 DOM 的 region tree，讓 bounds 從父節點傳遞到子節點。
2. **Event dispatch**：鍵盤與滑鼠事件先送到 focused region；未處理時再往上 bubble。
3. **Render loop**：每個 region render 成二維 cell buffer，再合併成 final screen buffer；最後只把改變的 cells 寫回終端機。

## Alternate Screen

許多 TUI 會切換到 alternate screen：一個獨立於 normal scrollback history 的畫布。進入時常用 `ESC [?1049h`，離開時用 `ESC [?1049l`。這讓 vim、less、htop 等程式結束後不會把整個互動畫面殘留在 shell 歷史中。

## 字元與圖示

TUI 的邊框常用 box drawing Unicode characters，例如 `┌ ┐ └ ┘ ─ │ ┬ ┴ ├ ┤ ┼`。這些不是特殊圖形 API，只是終端機以 monospace cell render 的普通字元。

Nerd Font icons 也是 Unicode codepoints 搭配特殊字型 glyph。終端機看到的是字元，字型負責把該 codepoint 畫成資料夾、檔案、語言 logo 或狀態 icon。

## 狀態在哪裡

終端機本身不知道應用程式的 mode、選取項目或 focus。這些狀態都在 TUI 程式記憶體中。當狀態改變，程式重新計算需要顯示的文字與樣式，再透過 [[terminal-emulator|terminal emulator]] 把更新後的畫面畫出來。
