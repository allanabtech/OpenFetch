# Plugin Development Guide

OpenFetch relies heavily on a flexible plugin system. Plugins can intercept downloads, extract assets from complex web pages, and customize download behavior.

## Plugin Architecture

Plugins are standard Rust dynamic libraries (`cdylib`). They expose C FFI boundaries (currently wrapped by internal helpers) and provide simple interfaces.

## Creating Your First Plugin

1. Create a new directory under `plugins/`
2. Define a `plugin.json` describing metadata.
3. Define a `Cargo.toml`.
4. Create a `src/lib.rs` exporting `analyze` and `download` handlers.

## Plugin Manifest (`plugin.json`)

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "author": "Author",
  "description": "...",
  "permissions": ["network", "filesystem"],
  "patterns": ["^https?://.*"]
}
```

## Plugin API

- `analyze(url: &str) -> Result<UrlAnalysisResult>`: Extracts metadata from the URL.
- `download(url: &str, output_path: &str, options: DownloadOptions) -> Result<()>`: Downloads the file.

## Testing and Publishing

Currently, test by placing the plugin folder in the `plugins` directory. A marketplace is planned for publishing.
