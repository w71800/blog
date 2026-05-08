---
title: Shell
aliases:
  - command shell
  - Unix shell
  - 命令列 shell
type: concept
status: seedling
sources:
  - how-terminals-work
links:
  - terminal-emulator
  - pseudo-terminal
  - terminal-input-modes
tags:
  - terminal
  - cli
  - systems
createdDate: 2026-05-08
updatedDate: 2026-05-08
---

## 概念

Shell 是使用者和作業系統互動的命令直譯器。它通常在 [[terminal-emulator|terminal emulator]] 啟動時被開啟，透過 [[pseudo-terminal|PTY]] 收到鍵盤輸入、解析 command line、尋找可執行檔、設定環境變數，並把程式輸出交回終端機顯示。

常見 shell 包含 sh、bash、zsh、fish、ksh、tcsh 與 nushell。macOS 自 2019 起預設互動 shell 為 zsh。

## 它負責什麼

- 解析使用者輸入的 command line
- 根據 `PATH` 尋找 command
- 管理 history、completion、alias、prompt
- 展開變數與 glob
- 啟動 foreground/background process
- 讀取設定檔，例如 `.zshrc`、`.zprofile`、`.bashrc`

## 和 Terminal Emulator 的差異

Terminal emulator 控制視窗、字型、顏色與文字 grid；shell 控制命令語意。當使用者說「我的 terminal 找不到 command」，多半是 shell 的 `PATH` 或 command resolution 問題，而不是 terminal emulator 的問題。

方向鍵召回歷史也是 shell 行為。Shell 維護 history 檔案（例如 `~/.zsh_history`），再把召回的命令列文字輸出到終端機畫面。

## 設定檔 reload

Shell 通常在啟動時讀取設定檔。修改 `.zshrc` 後，既有 shell 不會自動套用新設定；可以開新 shell，或執行：

```sh
source ~/.zshrc
```
