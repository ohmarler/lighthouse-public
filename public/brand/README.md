# Brand Assets

This directory contains customizable brand assets for the Lighthouse Dashboard.

## Customization

Replace these files with your own brand assets:

### logo.svg
- **Size**: 40x40px recommended
- **Format**: SVG preferred for crisp display at any size
- **Usage**: Displayed in the dashboard header

### favicon.svg
- **Size**: 32x32px recommended
- **Format**: SVG or ICO
- **Usage**: Browser tab icon

## Local Development (without committing your real assets)

`public/brand/local/` is gitignored. Drop your real files there and point
to them via `.env.local` — the committed placeholder files stay untouched:

```bash
# public/brand/local/logo.svg    ← your real logo (gitignored)
# public/brand/local/favicon.svg ← your real favicon (gitignored)

# In .env.local:
NEXT_PUBLIC_BRAND_LOGO_PATH=/brand/local/logo.svg
NEXT_PUBLIC_BRAND_FAVICON_PATH=/brand/local/favicon.svg
```

## Environment Variables

To point to any other path (relative to `public/`):

```bash
NEXT_PUBLIC_BRAND_LOGO_PATH=/your-logo.svg
NEXT_PUBLIC_BRAND_FAVICON_PATH=/your-favicon.svg
```

## Brand Colors

Customize colors via environment variables:

```bash
NEXT_PUBLIC_BRAND_NAME="Your Company Dashboard"
NEXT_PUBLIC_BRAND_PRIMARY="#1a365d"    # Header/button color
NEXT_PUBLIC_BRAND_ACCENT="#d97706"     # Highlight color
NEXT_PUBLIC_BRAND_BACKGROUND="#f7f7f7" # Page background
NEXT_PUBLIC_BRAND_TEXT="#1a365d"       # Text color
```

## Default Theme

The default theme uses:
- **Primary**: Navy blue (#0B3D91)
- **Accent**: Bronze/amber (#B45309)
- **Background**: Warm off-white (#FAF7F2)
- **Text**: Navy blue (#0B3D91)
