---
title: Terminal Emulator
aliases:
  - terminal
  - 終端機模擬器
type: concept
status: seedling
sources:
  - how-terminals-work
links:
  - pseudo-terminal
  - ansi-escape-sequences
  - terminfo
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

Terminal emulator 是現代使用者口中的「終端機」：一個軟體視窗，負責把鍵盤輸入編碼成 byte stream，透過 [[pseudo-terminal|PTY]] 送給 shell 或 CLI 程式，再把程式輸出的字元、[[ansi-escape-sequences|escape sequences]] 與 Unicode glyph render 成畫面。

歷史上的 terminal 原本是實體硬體，例如 VT100、VT220 或 IBM 3270。今天 iTerm2、Ghostty、kitty、Alacritty、xterm、Warp 等軟體承擔了類似角色，因此稱為 terminal emulator。

## 它負責什麼

- 顯示一個固定列寬的 character grid
- 套用字型、顏色、游標樣式、視窗大小等外觀設定
- 將按鍵轉成 byte 或 escape sequence，例如方向鍵可能送出 `ESC [ A`
- 解析程式輸出的控制序列，例如清畫面、移動游標、啟用 mouse tracking
- 在 normal screen 與 alternate screen 之間切換
- 處理 terminal-level 文字選取

## 常見混淆

「terminal 找不到 command」通常其實是 [[shell|shell]] 無法在 `PATH` 找到可執行檔。Terminal emulator 本身不負責命令解析，它只顯示 shell 或程式輸出的結果。

Terminal settings 控制字型、顏色、視窗大小；shell config（例如 `.zshrc`）控制 alias、`PATH`、prompt 與 completion。這兩層常被混稱，但責任不同。
