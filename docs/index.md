# OpenFetch Documentation

Welcome to OpenFetch, a modern, highly extensible download manager built with Rust, Tauri, React, and TypeScript.

## Getting Started

To get started, simply run the installer or build from source. 

## Installation

### From Source
1. Ensure you have Rust and Node.js installed.
2. Clone the repository.
3. Run `npm install` at the root.
4. Run `npm run tauri dev` to start the app in development mode.

## Usage

OpenFetch provides a simple UI to paste URLs and start downloading. 
Advanced users can tweak settings and install plugins to extend functionality.

## Plugin System

OpenFetch uses a powerful plugin system, mostly written in Rust using WebAssembly or dynamic libraries (currently cdylibs). See [Plugin Development](plugin-development.md) for more details.

## Contributing

See [Contributing Guide](contributing.md) for guidelines on how to contribute.
