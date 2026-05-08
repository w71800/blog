---
title: Terminal Input Modes
aliases:
  - cooked mode
  - raw mode
  - canonical mode
  - 終端機輸入模式
type: concept
status: seedling
sources:
  - how-terminals-work
links:
  - pseudo-terminal
  - terminal-emulator
  - shell
  - terminal-user-interface
tags:
  - terminal
  - cli
  - systems
createdDate: 2026-05-08
updatedDate: 2026-05-08
---

## 概念

Terminal input modes 描述鍵盤輸入進入程式前，會不會先被核心 line discipline 緩衝、編輯或轉換。常見對比是 cooked mode（canonical mode）與 raw mode。

## Cooked Mode

Cooked mode 是 shell 平常使用的模式。使用者打字時，核心先把字元放入 line buffer；backspace 會刪除 buffer 內的字元；直到按下 Enter，整行才送給程式。

在這個模式中，某些控制鍵會被 line discipline 攔截：

- `Ctrl+C` 變成 `SIGINT`
- `Ctrl+Z` 變成 `SIGTSTP`
- backspace 編輯尚未送出的行

這也是 bash、zsh、cat 等簡單互動的基本模型。

## Raw Mode

Raw mode 讓程式更直接地取得輸入。按鍵可以逐個送到程式，backspace 只是另一個輸入，`Ctrl+C` 也可能以 byte `0x03` 的形式交給程式處理。

vim、htop、less、ssh 等程式常使用 raw mode，因為它們要自行處理方向鍵、快捷鍵、畫面狀態與 [[terminal-user-interface|TUI]] 互動。

## 為什麼重要

這個區分能解釋很多看似奇怪的現象：為什麼 shell 中可以先編輯一整行再 Enter、為什麼有些程式可以即時回應每個按鍵、為什麼 `Ctrl+C` 有時是中斷訊號，有時又只是程式可處理的一個控制字元。
