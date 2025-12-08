PWA app template with nextjs and tailwindcss

```
pnpm dlx pwa-asset-generator public/logo.svg public/assets -m public/web.manifest --padding "calc(50vh - 5%) calc(50vw - 10%)" -q 100 -i public/pwa-asset-generator-changes.html --favicon
```

Generate icons (Android + maskable) and favicons, and update the manifest

```
pnpm dlx pwa-asset-generator public/logo.svg public \
  -m public/web.manifest \
  -i public/pwa-asset-generator-changes.html \
  --favicon \
  --maskable true \
  --type png \
  --path "/"
```

Generate iOS splash screens (light)

```
pnpm dlx pwa-asset-generator public/logo.svg public \
  --splash-only \
  -i public/pwa-asset-generator-changes.html \
  --padding "calc(50vh - 5%) calc(50vw - 10%)" \
  -b "#ffffff" \
  --path "/"
```

Generate iOS splash screens (dark)

```
pnpm dlx pwa-asset-generator public/logo.svg public \
  --splash-only --dark \
  -i public/pwa-asset-generator-changes.html \
  --padding "calc(50vh - 5%) calc(50vw - 10%)" \
  -b "#0b1220" \
  --path "/"
```

Safari pinned tab (macOS)
If your logo.svg is monochrome or works as a single-color glyph:

```
cp public/logo.svg public/safari-pinned-tab.svg
```

```
chmod +x scripts/generate-pwa-assets.sh
./scripts/generate-pwa-assets.sh
```
