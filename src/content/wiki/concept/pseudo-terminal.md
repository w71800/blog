---
title: Pseudo-Terminal
aliases:
  - PTY
  - pseudo terminal
  - 偽終端機
type: concept
status: seedling
sources:
  - how-terminals-work
links:
  - terminal-emulator
  - shell
  - terminal-input-modes
  - ansi-escape-sequences
tags:
  - terminal
  - cli
  - systems
createdDate: 2026-05-08
updatedDate: 2026-05-08
---

## 概念

Pseudo-terminal（PTY）是核心提供的雙向通道，讓 [[terminal-emulator|terminal emulator]] 可以像傳統實體終端機一樣和 [[shell|shell]] 或 CLI 程式互動。鍵盤輸入往內流，程式輸出往外流，中間由 PTY 與 line discipline 處理終端機語意。

## 在終端機堆疊中的位置

典型資料流：

1. 使用者在鍵盤輸入。
2. Terminal emulator 把按鍵編碼成字元 byte 或 [[ansi-escape-sequences|escape sequence]]。
3. PTY 把資料送進 foreground process。
4. Shell 或 CLI 程式讀取輸入、產生輸出。
5. 輸出經 PTY 回到 terminal emulator render。

## Line Discipline

PTY 不是單純 byte pipe。核心的 line discipline 會在 [[terminal-input-modes|cooked mode]] 中緩衝整行輸入、處理 backspace，並攔截某些控制鍵。例如 `Ctrl+C` 先是 byte `0x03`，但會被轉成 `SIGINT` 送給 foreground process，而不是直接交給程式。

在 raw mode 中，這些處理會被關掉或減少，程式可以逐鍵接收輸入，因此 vim、htop、less、ssh 等程式能自行解讀方向鍵、快捷鍵與控制字元。
