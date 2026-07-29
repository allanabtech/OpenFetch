# OpenFetch Plugin SDK

The `@openfetch/plugin-sdk` is a TypeScript SDK for interacting with and typing OpenFetch plugins.

## What is the Plugin SDK
The Plugin SDK provides the types and utilities needed to construct a plugin definition for OpenFetch. OpenFetch relies on plugins to handle different URL formats, custom sites, and protocols. By adhering to the `PluginManifest` schema and API types provided by this SDK, developers can easily create and integrate custom plugins.

## Plugin manifest structure
A plugin requires a `plugin.json` containing its metadata. The manifest must follow this structure:
```json
{
  "id": "generic-http",
  "name": "Generic HTTP Downloader",
  "version": "1.0.0",
  "author": "OpenFetch Team",
  "description": "Download any direct HTTP/HTTPS URL",
  "permissions": ["network", "filesystem"],
  "patterns": ["^https?://.*"],
  "settings_schema": {
    "user_agent": {
      "type": "string",
      "label": "User Agent",
      "default": "OpenFetch/0.1.0"
    }
  }
}
```

## Plugin Types
Plugins can behave as:
- **HTTP Downloader**: Handlers for general protocols, managing chunking, resuming, and file streams.
- **Extractor**: Extracts direct URLs, video streams, or formats from custom sites (e.g. YouTube, GitHub).
- **Transformer**: Modifies files post-download or aggregates metadata.

## Discovery and Loading
OpenFetch scans the default `plugins` directory (or user-defined ones) on startup, parses `plugin.json`, registers patterns, and dynamically invokes them based on requested URLs.

## Plugin Permissions System
Plugins must explicitly request permissions in `plugin.json`:
- `network`: perform requests
- `filesystem`: write files
- `clipboard`: read/write clipboard
- `notifications`: trigger native notifications
- `shell`: execute binaries

## Example
Refer to the `plugins/generic-http` folder for a real implementation using Rust + C FFI bindings as an example.

## Publishing to the marketplace (future)
A marketplace for sharing plugins will be provided soon, allowing package manager-like interactions.

## Testing your plugin
Currently, you can test plugins by linking them locally to your OpenFetch app's data directory.
