# OpenFetch Icons

This directory contains the application icons for OpenFetch.

## Required Files

- `32x32.png` - Small icon
- `128x128.png` - Standard icon  
- `128x128@2x.png` - Retina icon (256x256 pixels)
- `icon.icns` - macOS icon bundle
- `icon.ico` - Windows icon

## Generating Icons

To generate icons from a source SVG/PNG, use the Tauri CLI:

```bash
pnpm tauri icon path/to/icon.png
```

This will automatically generate all required sizes.

## Placeholder Icons

For CI/CD builds without real icons, the workflow uses tauri-action which handles this automatically.
For local development, run: `pnpm tauri icon` with a 1024x1024 PNG source.
