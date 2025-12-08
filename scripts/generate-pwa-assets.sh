#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="public"

# 1) Generate icons (Android + maskable) + favicons, update manifest
pnpm dlx pwa-asset-generator@latest "$OUT_DIR/logo.svg" "$OUT_DIR" \
  -m "$OUT_DIR/web.manifest" \
  -i "$OUT_DIR/pwa-asset-generator-changes.html" \
  --favicon \
  --maskable true \
  --type png \
  --path "/"

# 2) Normalize Apple touch icon name (tool often emits apple-icon-180.png)
if [[ -f "$OUT_DIR/apple-icon-180.png" && ! -f "$OUT_DIR/apple-touch-icon.png" ]]; then
  cp -f "$OUT_DIR/apple-icon-180.png" "$OUT_DIR/apple-touch-icon.png"
fi

# 3) Ensure favicons exist; derive from 512 if generator skipped them
BASE_ICON="$OUT_DIR/icon-512x512.png"
if [[ -f "$BASE_ICON" ]]; then
  [[ ! -f "$OUT_DIR/favicon-16x16.png" ]] && sips -s format png "$BASE_ICON" --resampleHeightWidth 16 16 --out "$OUT_DIR/favicon-16x16.png" >/dev/null
  [[ ! -f "$OUT_DIR/favicon-32x32.png" ]] && sips -s format png "$BASE_ICON" --resampleHeightWidth 32 32 --out "$OUT_DIR/favicon-32x32.png" >/dev/null
fi

# 4) Optional: Safari pinned tab if your logo works as monochrome
if [[ -f "$OUT_DIR/logo.svg" && ! -f "$OUT_DIR/safari-pinned-tab.svg" ]]; then
  cp -f "$OUT_DIR/logo.svg" "$OUT_DIR/safari-pinned-tab.svg"
fi

echo "PWA assets generated and normalized in $OUT_DIR"