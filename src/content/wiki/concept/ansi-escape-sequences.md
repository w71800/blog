---
title: ANSI Escape Sequences
aliases:
  - escape sequences
  - ANSI 控制序列
  - terminal escape codes
type: concept
status: seedling
sources:
  - how-terminals-work
links:
  - terminal-emulator
  - pseudo-terminal
  - terminal-user-interface
  - terminfo
tags:
  - terminal
  - cli
  - tui
  - systems
createdDate: 2026-05-08
updatedDate: 2026-05-08
---

## 概念

ANSI escape sequences 是終端機的控制語言。CLI 或 TUI 程式輸出一般文字時，[[terminal-emulator|terminal emulator]] 會把它畫到目前游標位置；輸出以 `ESC`（byte `0x1B`）開頭的控制序列時，terminal emulator 會把它解讀為「改變狀態」或「執行動作」。

常見用途包括改變顏色、開關文字樣式、清除畫面、移動游標、啟用 mouse tracking、切換 alternate screen、標記 bracketed paste 等。

## 例子

- `ESC [1m`：開啟 bold
- `ESC [4m`：開啟 underline
- `ESC [0m`：重設所有樣式
- `ESC [2J`：清除整個畫面
- `ESC [H`：把游標移到 home
- `ESC [5;10H`：把游標移到第 5 列、第 10 欄
- `ESC [?1049h`：進入 alternate screen
- `ESC [?1049l`：離開 alternate screen

終端機文件常把 `ESC` 顯示成 `^[` 或 `\x1b`。例如移動游標到左上角可寫成：

```c
printf("\033[1;1H");
```

## 顏色

經典 ANSI 顏色有 16 色：8 個 normal color 加 8 個 bright variant。後來終端機逐漸支援 256 色與 24-bit truecolor。

16 色常見範圍：

- `30-37`：前景 normal colors
- `90-97`：前景 bright colors
- `38;5;<n>`：指定 indexed foreground color
- `48;5;<n>`：指定 indexed background color

## 和 TUI 的關係

[[terminal-user-interface|TUI]] 不是直接操作像素，而是輸出字元與 escape sequences。它會移動唯一的終端機游標，把 box drawing characters、文字、顏色與樣式寫到指定 cell，組合出看起來像 GUI 的畫面。
