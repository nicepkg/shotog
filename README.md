# ShotOG

**Beautiful OG images. One API call.**

Generate stunning Open Graph images for your website with a single URL — no design tools, no headless browsers, no infrastructure to manage.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://shotog.2214962083.workers.dev) [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![API Status](https://img.shields.io/badge/API-v0.6.0-blue)](https://shotog.2214962083.workers.dev/health)

![ShotOG Basic Template](https://shotog.2214962083.workers.dev/v1/og?title=ShotOG&subtitle=Beautiful%20OG%20images.%20One%20API%20call.&template=product&domain=github.com/nicepkg/shotog)

## Why ShotOG?

Every page you share on Twitter, Slack, or Discord needs an OG image. You can:

1. ~~Design each one manually in Figma~~ (doesn't scale)
2. ~~Run a headless browser on your server~~ (slow, expensive, breaks)
3. **Call ShotOG's API** — one URL, beautiful image, ~50ms at the edge

ShotOG runs on Cloudflare Workers. No cold starts. No servers. Just fast images.

## Quick Start

### Option 1: Just use a URL

Drop this into your HTML `<head>`:

```html
<meta property="og:image" content="https://shotog.2214962083.workers.dev/v1/og?title=My%20Page%20Title&template=blog&author=John" />
```

That's it. No signup required for up to 10 images/day.

### Option 2: Use the TypeScript SDK

```bash
npm install shotog
```

```typescript
import { ShotOG } from "shotog";

const og = new ShotOG({ apiKey: "sk_..." }); // optional, increases rate limit

// Generate a URL (no network request)
const imageUrl = og.url({
  title: "How We Scaled to 1M Users",
  subtitle: "A deep dive into our infrastructure",
  template: "blog",
  author: "Jane Smith",
});
// → https://shotog.2214962083.workers.dev/v1/og?title=How+We+Scaled...

// Or fetch the image binary directly
const imageBuffer = await og.generate({
  title: "Product Launch",
  template: "announcement",
});
```

### Option 3: cURL

```bash
# GET — returns PNG directly
curl "https://shotog.2214962083.workers.dev/v1/og?title=Hello&template=basic" -o og.png

# POST — JSON body, more options
curl -X POST https://shotog.2214962083.workers.dev/v1/og \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello World","template":"product","subtitle":"Built with ShotOG"}' \
  -o og.png
```

## Templates

8 professionally designed templates for every use case:

| Template | Best For | Preview |
|----------|----------|---------|
| `basic` | General pages, social sharing | ![](https://shotog.2214962083.workers.dev/v1/og?title=Basic%20Template&template=basic&width=600&height=315) |
| `blog` | Blog posts, articles | ![](https://shotog.2214962083.workers.dev/v1/og?title=Blog%20Template&template=blog&author=Author&width=600&height=315) |
| `product` | SaaS products, launches | ![](https://shotog.2214962083.workers.dev/v1/og?title=Product%20Template&template=product&width=600&height=315) |
| `social` | Social media posts | ![](https://shotog.2214962083.workers.dev/v1/og?title=Social%20Template&template=social&width=600&height=315) |
| `event` | Events, webinars | ![](https://shotog.2214962083.workers.dev/v1/og?title=Event%20Template&template=event&subtitle=Feb%202026&width=600&height=315) |
| `changelog` | Release notes | ![](https://shotog.2214962083.workers.dev/v1/og?title=Changelog%20Template&template=changelog&width=600&height=315) |
| `testimonial` | Customer quotes | ![](https://shotog.2214962083.workers.dev/v1/og?title=Great%20product!&template=testimonial&author=Happy%20User&width=600&height=315) |
| `announcement` | Major updates, launches | ![](https://shotog.2214962083.workers.dev/v1/og?title=Announcement&template=announcement&width=600&height=315) |

[Browse all templates →](https://shotog.2214962083.workers.dev/templates)

## API Reference

### Generate OG Image

```
GET /v1/og?title=...&template=...
POST /v1/og  (JSON body)
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | Yes | Main heading text |
| `template` | string | No | Template name (default: `basic`) |
| `subtitle` | string | No | Secondary text |
| `eyebrow` | string | No | Small text above title (category, label) |
| `author` | string | No | Author name |
| `avatar` | string | No | Avatar image URL (shown in blog/social/testimonial) |
| `logo` | string | No | Logo image URL (shown in basic/product) |
| `fontUrl` | string | No | URL to TTF/OTF font file (max 5MB, cached 1h) |
| `domain` | string | No | Domain watermark |
| `bgColor` | string | No | Background color (hex, e.g. `1a1a2e`) |
| `textColor` | string | No | Text color (hex) |
| `accentColor` | string | No | Accent color (hex) |
| `format` | string | No | `png` (default) or `svg` |
| `width` | number | No | Image width 200-2400 (default: 1200) |
| `height` | number | No | Image height 200-1260 (default: 630) |
| `api_key` | string | No | API key for higher limits |

### Batch Generate (up to 20 images)

```bash
curl -X POST https://shotog.2214962083.workers.dev/v1/og/batch \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: sk_..." \
  -d '{
    "images": [
      {"id": "hero", "title": "My Product", "template": "product"},
      {"id": "blog-1", "title": "First Post", "template": "blog", "author": "Alice"},
      {"id": "blog-2", "title": "Second Post", "template": "blog", "author": "Bob"}
    ],
    "defaults": {"format": "png", "width": 1200, "domain": "example.com"}
  }'
```

Response:
```json
{
  "results": [
    {"id": "hero", "success": true, "dataUri": "data:image/png;base64,..."},
    {"id": "blog-1", "success": true, "dataUri": "data:image/png;base64,..."},
    {"id": "blog-2", "success": true, "dataUri": "data:image/png;base64,..."}
  ],
  "summary": {"total": 3, "succeeded": 3, "failed": 0}
}
```

**Batch features:**
- Max 20 images per request
- `defaults` object applies to all images (individual params override)
- Parallel rendering via `Promise.allSettled`
- Quota pre-check: if insufficient quota, returns 429 before rendering
- Only successful renders count toward usage

### Get API Key (Self-Service)

```bash
curl -X POST https://shotog.2214962083.workers.dev/v1/keys \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com"}'
```

Returns:
```json
{
  "id": "key_abc123",
  "key": "sk_live_...",
  "tier": "free",
  "monthly_limit": 500,
  "message": "Store your API key safely — it cannot be retrieved later."
}
```

### Check Usage

```bash
curl https://shotog.2214962083.workers.dev/v1/keys/usage \
  -H "X-Api-Key: sk_live_..."
```

### List Templates

```bash
curl https://shotog.2214962083.workers.dev/v1/og/templates
```

## SDK

The TypeScript/JavaScript SDK wraps all API functionality:

```typescript
import { ShotOG } from "shotog";

// Initialize
const og = new ShotOG({ apiKey: "sk_..." });

// Build image URL (no network call)
og.url({ title: "My Post", template: "blog" });

// Generate image binary
await og.generate({ title: "My Post", template: "blog" });

// List templates
await og.templates();

// Check usage
await og.usage();

// Create a new API key (static method)
await ShotOG.createKey("email@example.com");
```

## Framework Examples

### Next.js

```tsx
// app/layout.tsx
export function generateMetadata({ params }) {
  return {
    openGraph: {
      images: [`https://shotog.2214962083.workers.dev/v1/og?title=${encodeURIComponent(params.title)}&template=blog`],
    },
  };
}
```

### Astro

```astro
---
const ogImage = `https://shotog.2214962083.workers.dev/v1/og?title=${encodeURIComponent(title)}&template=product`;
---
<meta property="og:image" content={ogImage} />
```

### Hugo

```html
{{ $ogImage := printf "https://shotog.2214962083.workers.dev/v1/og?title=%s&template=blog&author=%s" (querify .Title) (querify .Params.author) }}
<meta property="og:image" content="{{ $ogImage }}" />
```

## Tech Stack

- **Runtime**: Cloudflare Workers (edge, ~17ms cold start)
- **Framework**: [Hono](https://hono.dev) (lightweight, fast)
- **Rendering**: [@cf-wasm/satori](https://github.com/aspect-build/cf-wasm) (JSX → SVG at the edge)
- **Rasterizer**: [@cf-wasm/resvg](https://github.com/aspect-build/cf-wasm) (SVG → PNG)
- **Database**: Cloudflare D1 (API keys + usage tracking)
- **Caching**: Built-in CDN cache headers

## Self-Hosting

ShotOG is MIT licensed. Deploy your own instance:

```bash
git clone https://github.com/nicepkg/shotog.git
cd shotog
npm install

# Set up D1 database
npx wrangler d1 create shotog-prod
# Update wrangler.toml with your database_id
npx wrangler d1 execute shotog-prod --file=./migrations/001_init.sql

# Deploy
npx wrangler deploy
```

## Pricing

| Plan | Price | Monthly Images | Rate Limit |
|------|-------|---------------|------------|
| Demo | Free | 10/day | 10/day |
| Free | Free | 500/month | 60/min |
| Starter | $9/mo | 5,000/month | 120/min |
| Pro | $29/mo | 25,000/month | 300/min |
| Scale | $79/mo | 100,000/month | 600/min |

[See pricing details →](https://shotog.2214962083.workers.dev/pricing)

## License

[MIT](LICENSE)

## Links

- [Live Demo & Playground](https://shotog.2214962083.workers.dev)
- [API Documentation](https://shotog.2214962083.workers.dev/docs)
- [Template Gallery](https://shotog.2214962083.workers.dev/templates)
- [Pricing](https://shotog.2214962083.workers.dev/pricing)
