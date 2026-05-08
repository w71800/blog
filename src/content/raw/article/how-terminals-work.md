---
title: How Terminals Work
sourceType: article
sourceUrl: https://how-terminals-work.vercel.app/?media_id=3816087223682998749_63269140023&media_author_id=63269140023&utm_source=ig_text_feed_timeline
ingestedDate: 2026-05-08
tags:
  - terminal
  - cli
  - tui
  - systems
---

# How Terminals Work

Interactive explainer about how modern terminals work, covering cells, colors, escape sequences, keyboard input, signals, cooked/raw input modes, PTYs, TUI layout, alternate screen buffers, Nerd Font icons, selections, `$TERM`, terminfo, terminal emulators, shells, and common confusions.

Original page: https://how-terminals-work.vercel.app/?media_id=3816087223682998749_63269140023&media_author_id=63269140023&utm_source=ig_text_feed_timeline

## Extracted Text

### Terminal Cells And Colors

Terminals render a grid of cells. Each cell can hold a character, foreground color, background color, and attributes such as bold or underline.

Modern terminals support several color depths:

- 16 colors: classic ANSI colors
- 256 colors: extended palette
- Truecolor: 16,777,216 colors, using 24-bit color

The original 16 colors include normal and bright variants: black, red, green, yellow, blue, magenta, cyan, white, and bright versions of the same colors.

Escape sequence examples:

- `^[ [38;5;<0-15>m` sets foreground color from the 16-color palette
- `^[ [48;5;<0-15>m` sets background color from the 16-color palette
- `^[ [1m` turns on bold
- `^[ [4m` turns on underline
- `^[ [0m` resets all styles

`^[` represents the ESC character, byte `0x1B`. The 16-color palette also uses codes `30-37` for normal colors and `90-97` for bright variants.

### Cursor Sequences

Cursor movement is controlled by escape sequences:

- `^[ [2J`: clear entire screen
- `^[ [H`: move cursor to home `(0, 0)`
- `^[ [5;10H`: move cursor to row 5, column 10

Terminal coordinates are one-indexed when encoded in cursor-positioning sequences. Row 1, column 1 is the top-left cell.

Example:

```c
printf("\033[1;1H");
```

### Keyboard Input

When a user presses an arrow key, the terminal does not send a semantic "arrow up" event. It sends bytes such as `ESC [ A`. Programs that do not understand this sequence may print `^[[A` literally.

Regular keys become bytes:

- `a` -> `0x61`
- Enter -> `0x0D`
- Up arrow -> `^[[A`

Signal keys also begin as bytes, but the kernel line discipline can intercept them and convert them into OS signals:

- `Ctrl+C` -> `0x03` -> `SIGINT`
- `Ctrl+Z` -> `0x1A` -> `SIGTSTP`

### Signals

Signals are an operating-system communication mechanism for running programs. When the user presses `Ctrl+C`, the terminal sends byte `0x03` to the PTY, but the kernel intercepts it and converts it into `SIGINT` before the program sees it.

`Ctrl+C` sends `SIGINT` to the foreground process, which most programs treat as an instruction to stop. For example, running `sleep 100` and pressing `Ctrl+C` stops it immediately.

`Ctrl+Z` sends `SIGTSTP`, which suspends the foreground process.

### Cooked And Raw Input Modes

In cooked mode, also called canonical mode, the kernel's line discipline buffers input until the user presses Enter. Backspace edits the buffer. The program receives the completed line, such as `"...\n"`.

In raw mode, input is delivered immediately per key. Backspace is just another key, `Ctrl+C` can be delivered as byte `0x03` instead of becoming `SIGINT`, and the program handles arrow keys directly.

Quick comparison:

| Behavior | Cooked Mode | Raw Mode |
| --- | --- | --- |
| When input is sent | After pressing Enter | Immediately per key |
| Backspace | Deletes from buffer | Just another key |
| Ctrl+C | Line discipline generates SIGINT | Program receives 0x03 |
| Arrow keys | Line recall/history | Program handles it |
| Used by | bash, zsh, cat | vim, htop, ssh, less |

### Terminal Stack

The terminal stack is layered:

1. You press physical keys on the keyboard.
2. The terminal emulator encodes input and renders output.
3. The PTY acts as a bidirectional pipe.
4. The shell or CLI program reads input and writes output.

Data flows both ways. Keystrokes travel inward; output travels outward. Each layer transforms the data.

### TUI Architecture

Advanced TUIs divide the terminal into regions. Each region is a rectangular area with its own content and borders. The TUI framework tracks each region's position and size in the character grid.

Under the hood:

1. Layout engine: the TUI maintains a tree of regions, similar to a DOM. Each region knows its bounds and can have children. When the container resizes, bounds propagate down the tree.
2. Event dispatch: input events go to the focused region first. If unhandled, they bubble up. Mouse clicks are hit-tested against region bounds.
3. Render loop: each region renders to a buffer, a two-dimensional array of cells. Buffers merge into a final screen buffer. Only changed cells are written to the terminal, minimizing escape sequences.

Box drawing characters such as `┌`, `┐`, `└`, `┘`, `─`, `│`, `┬`, `┴`, `├`, `┤`, `┼`, and `╬` are regular Unicode characters rendered by the terminal like any other text.

The terminal tracks a single cursor position. TUIs move that cursor using escape sequences to draw in different regions.

### Alternate Screen

Terminals have two screen buffers: the normal screen, which contains scrollback history, and the alternate screen, which is a separate canvas. Programs can switch between them. When they exit, the original screen reappears.

Escape sequences:

- `^[[?1049h`: enter alternate screen, saving the current screen and clearing the display
- `^[[?1049l`: exit alternate screen, restoring the saved normal screen

Programs such as vim, less, and htop use the alternate screen so their interface does not stay mixed into terminal history after they quit.

### Nerd Font Icons

Modern terminal apps can display icons for files, folders, and status indicators. These are not images. They are Unicode characters rendered by fonts that contain icon glyphs.

Nerd Font icons are usually single-width characters. CJK characters and some emoji are double-width. The font file contains glyphs for codepoints, and the glyphs are designed to fit the terminal cell.

Nerd Fonts combine multiple icon sets:

- Powerline: status bar separators and arrows
- Font Awesome: general-purpose icons
- Devicons: programming-language logos
- Octicons: GitHub-style icons

### Terminal App State

Terminal apps maintain state in memory like GUI apps. The terminal itself does not know about application modes; it only displays characters sent by the app.

Example cycle:

1. Input: user presses Shift+Tab, encoded as `ESC [ Z`.
2. Process: the app recognizes the sequence and updates its mode.
3. Render: the app redraws the relevant indicator.

### Selection And Cursor Position

Terminal-level text selection and application cursor position are different concepts. Terminal selection is handled by the terminal emulator. The application cursor is owned by the running program.

Clicking does not automatically move the application cursor. A click either selects text at the terminal layer or, if mouse tracking is enabled, sends a mouse event to the app. The app decides what to do.

Mouse tracking is disabled by default. Programs can request mouse tracking, after which clicks become escape sequences with coordinates. Example enable sequence: `^[[?1000h`.

### TERM, Terminfo, And Capabilities

Programs check the `TERM` environment variable to look up capabilities in the terminfo database. `TERM` is just a string; the terminal does not enforce it.

Examples:

- `xterm-256color`
- `xterm`
- `screen-256color`
- `vt100`
- `dumb`

Programs can also query the terminal directly. DA1 (`ESC[c`) asks "what are you?" and the terminal responds with capability codes.

Features are off by default and can be enabled by escape sequences:

- Mouse tracking
- Alternate screen
- Bracketed paste

### Terminal, Terminal Emulator, Shell, PTY, CLI

Historically, a terminal was a physical device with a keyboard and screen connected to a mainframe, such as a VT100, VT220, or IBM 3270. Today, "terminal" usually refers to a terminal emulator.

How the pieces fit:

- Terminal emulator: iTerm2, Ghostty, kitty
- PTY: pseudo-terminal in the kernel
- Shell: zsh, bash, fish
- CLI programs: git, npm, vim

Common shells include sh, bash, zsh, fish, ksh, tcsh, and nushell. Zsh became the default macOS shell in 2019 and is known for completion, spelling correction, and theming.

Common terminal emulators include xterm, iTerm2, Alacritty, kitty, Warp, and Ghostty.

### Common Confusions

"I opened my terminal" usually means opening a terminal emulator, which then starts a shell.

"My terminal can't find the command" usually means the shell cannot find the command in `PATH`; the terminal just displays shell output.

For interactive use, zsh has richer features. For scripts, bash is often more portable.

Terminal settings control appearance: fonts, colors, and window size. Shell configuration, such as `.zshrc`, controls aliases, `PATH`, and prompt behavior.

The Up arrow recalling previous commands is shell behavior. The shell keeps a history file such as `~/.zsh_history` and sends recalled commands back to the terminal for display.

After editing `.zshrc`, existing shells do not automatically reload it. Open a new shell or run `source ~/.zshrc`.

Quick reference:

```sh
# Which shell am I using?
echo $SHELL

# What terminal am I in?
echo $TERM_PROGRAM

# What's my PTY device?
tty

# List available shells
cat /etc/shells

# Change default shell to zsh
chsh -s /bin/zsh
```
