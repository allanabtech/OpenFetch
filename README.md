<div align="center">
  <h1>⚡ OpenFetch</h1>
  <p><b>The last download manager you'll ever need.</b></p>

  [![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Tauri 2](https://img.shields.io/badge/Tauri-v2.0-24C8D8.svg?logo=tauri&logoColor=white)](https://tauri.app/)
  [![Rust](https://img.shields.io/badge/Rust-1.75+-DEA584.svg?logo=rust&logoColor=white)](https://www.rust-lang.org/)
  [![React 19](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react&logoColor=white)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Build Status](https://github.com/allanabtech/OpenFetch/actions/workflows/build.yml/badge.svg)](https://github.com/allanabtech/OpenFetch/actions)
  [![Release](https://img.shields.io/github/v/release/allanabtech/OpenFetch?color=green&label=latest%20release)](https://github.com/allanabtech/OpenFetch/releases/tag/v0.1.0)
</div>

<br />

**OpenFetch** is a flagship, production-ready, open-source desktop download manager built on **Tauri 2**, **Rust**, and **React 19**. Designed to feel like modern power-user tools like VS Code or Discord, OpenFetch delivers blazing performance, low resource consumption, and a plugin-first architecture.

---

## 📦 Download Latest Release (v0.1.0)

| Platform | Installer Type | Direct Download Link |
| :--- | :--- | :--- |
| 🪟 **Windows** | Setup Executable (`.exe`) | [Download .exe](https://github.com/allanabtech/OpenFetch/releases/download/v0.1.0/OpenFetch_0.1.0_x64-setup.exe) |
| 🪟 **Windows** | MSI Package (`.msi`) | [Download .msi](https://github.com/allanabtech/OpenFetch/releases/download/v0.1.0/OpenFetch_0.1.0_x64_en-US.msi) |
| 🍎 **macOS** | Disk Image (`.dmg`) | [Download .dmg](https://github.com/allanabtech/OpenFetch/releases/download/v0.1.0/OpenFetch_0.1.0_aarch64.dmg) |
| 🐧 **Linux** | Universal AppImage | [Download .AppImage](https://github.com/allanabtech/OpenFetch/releases/download/v0.1.0/OpenFetch_0.1.0_amd64.AppImage) |
| 🐧 **Linux** | Debian / Ubuntu (`.deb`) | [Download .deb](https://github.com/allanabtech/OpenFetch/releases/download/v0.1.0/OpenFetch_0.1.0_amd64.deb) |
| 🐧 **Linux** | Fedora / RedHat (`.rpm`) | [Download .rpm](https://github.com/allanabtech/OpenFetch/releases/download/v0.1.0/OpenFetch-0.1.0-1.x86_64.rpm) |

---

## ✨ Features

- **⚡ Blazing Fast Engine**: Core download engine built with Rust, `tokio`, and `reqwest` featuring multi-threaded chunked downloads and range requests.
- **🎨 Glassmorphism UI**: Dark-first interface styled with Tailwind CSS, custom design tokens, and smooth Framer Motion micro-animations.
- **🧩 Plugin-First Architecture**: Source extractors and download handlers run as modular plugins (`generic-http`, `github-releases`, and extensible custom plugins).
- **📋 Intelligent URL Analyzer**: Instant analysis of pasted URLs showing file title, media type, estimated size, content headers, and required plugin.
- **📂 Smart Organization**: Auto-categorization of downloads into Videos, Music, Documents, Archives, Software, and Repositories.
- **📊 Detailed Analytics**: In-app charts tracking daily bandwidth, average speed, domain distribution, and completion rates.
- **🔒 Privacy-First & Offline-First**: Zero telemetry, no tracking, local SQLite database storage for history and queues.

---

## 🛠️ Architecture & Tech Stack

```
OpenFetch Monorepo
├── apps/
│   └── desktop/               # Tauri 2 App (Rust Backend + React 19 Frontend)
├── packages/
│   ├── core/                  # Shared TypeScript types & utility helpers
│   ├── plugin-sdk/            # Plugin manifest schema & SDK interfaces
│   └── ui/                    # Shared design system components
├── plugins/
│   ├── generic-http/          # Rust HTTP chunk downloader plugin
│   ├── github-releases/       # GitHub release asset extractor plugin
│   ├── ftp/                   # FTP protocol plugin (stub)
│   ├── sftp/                  # SFTP protocol plugin (stub)
│   └── google-drive/          # Cloud storage plugin (stub)
└── docs/                      # Developer & Plugin documentation
```

- **Frontend**: React 19, TypeScript, Tailwind CSS, TanStack Query, Zustand, Framer Motion, Recharts
- **Backend & Native Desktop**: Tauri v2, Rust 2021, Tokio, Reqwest, Rusqlite, Arboard
- **Monorepo Management**: pnpm workspaces, Turborepo

---

## 💻 Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+) & [pnpm](https://pnpm.io/) (v9+)
- [Rust Toolchain](https://www.rust-lang.org/tools/install) (`rustup`, `cargo`)

### Setup & Run

```bash
# Clone the repository
git clone https://github.com/allanabtech/OpenFetch.git
cd OpenFetch

# Install workspace dependencies
pnpm install

# Run desktop app in development mode
pnpm dev
```

### Build for Production Locally

```bash
pnpm --filter desktop tauri build
```

---

## 🔌 Plugin System & SDK

OpenFetch is designed so the community can build custom plugins without modifying the core codebase.

- Read the [Plugin Development Documentation](./docs/plugin-development.md)
- Check out the [System Architecture Guide](./docs/architecture.md)
- Explore the [@openfetch/plugin-sdk](./packages/plugin-sdk/README.md) package

---

## 🤝 Contributing

Contributions of all kinds are welcome! Please read our [Contributing Guide](.github/CONTRIBUTING.md) before submitting a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
