# PY Notepad Studio

A modern, standalone Python IDE, interactive notebook, and workspace that runs genuinely inside your web browser and installs as a Progressive Web App (PWA) on any device — with zero server dependencies, zero accounts, and complete offline privacy.

---

## Overview

**PY Notepad Studio** is a client-side Python development environment built with [Pyodide](https://pyodide.org/) (WebAssembly). It provides a full-featured programming workspace on desktop, tablet, and mobile devices directly in the browser:

- **No Python Installation Required**: The entire Python 3.12 runtime and standard library are compiled to WebAssembly and run locally inside the client's browser.
- **Client-Side Persistence**: Projects, code files, CSV datasets, and notebooks are stored directly on your device using browser `IndexedDB`. No code is sent to external servers.
- **Progressive Web App (PWA)**: Can be used on the web and installed natively to your home screen or desktop for a standalone windowed app experience with offline support via Service Workers.

---

## Key Features

### 1. Code Editor
- **Real Python Runtime**: Executes full Python 3.12 syntax including `async/await`, dataclasses, generators, and the comprehensive standard library.
- **Syntax Highlighting**: Real-time syntax coloring for keywords, built-ins, strings, numbers, comments, and operators.
- **Python-Aware Indentation**: Automatic 4-space auto-indentation, smart unindent on statements like `return`/`pass`/`break`, block indentation via `Tab` / `Shift+Tab`, and smart backspace.
- **Line Numbers & Autosave**: Tabular-numeral line gutter and automated debounced persistence to IndexedDB.

### 2. Interactive Notebook (`.pinb`)
- **Mixed Media Cells**: Create executable Python code cells and rendered Markdown text cells with headings, bold text, and code formatting.
- **Inline Matplotlib Plotting**: Interactive Matplotlib charts are captured headlessly (`Agg` backend) and automatically rendered inline directly beneath code cells.
- **Cell Management**: Reorder cells up or down, delete cells, or execute all cells sequentially with **Run all**.

### 3. Interactive REPL / Console
- **Direct Terminal Input**: Run one-off Python expressions, statements, and commands interactively.
- **Command History**: Navigate previous inputs using the `Up` and `Down` arrow keys.
- **Standard Output & Error Tracebacks**: Color-coded standard output, evaluated return values, formatted exception messages, and collapsible full tracebacks.

### 4. File Explorer & Project Storage
- **Hierarchical File Tree**: Create nested files, directories, and view project structures.
- **Data Previews**: Built-in visual previews for images (`.png`, `.jpg`, `.svg`) and tabular viewing for `.csv` files.
- **Project Export & Import**:
  - Export full projects as a compressed `.zip` bundle using JSZip.
  - Import individual files or unpack `.zip` archives directly into the browser workspace.

### 5. Package Management
- **Scientific Stack**: One-tap installation of pre-compiled Pyodide packages including `NumPy`, `Pandas`, `Matplotlib`, `SciPy`, `SymPy`, `scikit-learn`, `Pillow`, and `networkx`.
- **Pure-Python PyPI Packages**: Install any pure-Python wheel directly from PyPI at runtime via `micropip`.

### 6. Progressive Web App (PWA) & Offline Mode
- **Native Installation**: Easily installed as a standalone desktop app (Windows, macOS, Linux, ChromeOS) or mobile app (Android, iOS) via the **Install App** button.
- **Service Worker Caching**: Precaches the application shell, UI assets, and caches downloaded Pyodide runtime files, enabling offline editing and execution once loaded.
- **Adaptive UI**: Responsive layouts tailored for mobile split-navigation or desktop multi-pane workflows, with automatic dark/light theme detection and toggling.

---

## Technical Architecture

```
┌────────────────────────────────────────────────────────┐
│                   PY Notepad UI Shell                  │
│       (Editor · Notebook · Console · File Explorer)     │
└─────────────┬────────────────────────────┬─────────────┘
              │                            │
              ▼                            ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│      Pyodide (Wasm)      │  │     IndexedDB Storage    │
│  - Python 3.12 Runtime   │  │  - Virtual File Tree     │
│  - MEMFS Virtual FS      │  │  - Notebook State        │
│  - Matplotlib Agg Engine │  │  - Persistent User Data  │
└──────────────────────────┘  └──────────────────────────┘
              ▲
              │ Precaching & Fetch Strategy
┌────────────────────────────────────────────────────────┐
│             Service Worker (sw.js & Cache API)          │
└────────────────────────────────────────────────────────┘
```

1. **DOM & Editor Layer**: Built with semantic HTML, Vanilla CSS, and lightweight DOM manipulation.
2. **Virtual File System Synchronization**: When Python code executes, files saved in IndexedDB are synced into Pyodide's virtual MEMFS under `/home/pyodide/proj`. File modifications or output written in Python (e.g. `open('result.txt', 'w')`) are synced back to IndexedDB.
3. **Graphics Capture Engine**: Captures figures from `matplotlib.pyplot.get_fignums()` in base64 format without blocking UI rendering.

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Enter` / `Cmd + Enter` | Run active file (Editor) or active cell (Notebook) |
| `Ctrl + S` / `Cmd + S` | Flush and save current file to IndexedDB |
| `Tab` | Indent line or selected block by 4 spaces |
| `Shift + Tab` | Outdent line or selected block by 4 spaces |
| `Ctrl + Shift + P` / `Cmd + Shift + P` | Quick pane jump (`files`, `editor`, `notebook`, `console`, `packages`) |
| `Up` / `Down` (in Console) | Cycle through command history |
| `Escape` | Dismiss installation guide modal |

---

## Project Structure

```
.
├── index.html         # Main PWA application and editor interface
├── landing.html       # Informational page and user guide
├── manifest.json      # Web App Manifest defining PWA metadata & icons
├── sw.js              # Service Worker providing offline caching
├── icon-192.png       # PWA app icon (192x192)
├── icon-512.png       # PWA app icon (512x512)
├── icon.svg           # Scalable vector icon
└── README.md          # Project documentation
```

---

## Privacy & Security

- **100% Client-Side**: All code evaluation takes place inside your browser's WebAssembly sandbox.
- **No External Telemetry**: Code, datasets, and files never leave your local machine or browser storage.
