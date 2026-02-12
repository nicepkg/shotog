import { Hono } from "hono";
import type { Env } from "../types";
import { listTemplates } from "../templates";

const pages = new Hono<{ Bindings: Env }>();

function layout(
  baseUrl: string,
  title: string,
  description: string,
  path: string,
  body: string
) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${baseUrl}${path}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${baseUrl}/v1/og?title=${encodeURIComponent(title)}&template=product&eyebrow=ShotOG&accentColor=%236366f1">
  <meta property="og:url" content="${baseUrl}${path}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ShotOG",
    "description": "${description}",
    "url": "${baseUrl}",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }
  </script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif; background: #0f172a; color: #e2e8f0; line-height: 1.7; }
    .container { max-width: 900px; margin: 0 auto; padding: 0 24px; }
    nav { padding: 20px 0; border-bottom: 1px solid #1e293b; margin-bottom: 40px; }
    nav .inner { max-width: 900px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; }
    nav a { color: #94a3b8; text-decoration: none; font-size: 14px; margin-left: 24px; }
    nav a:hover { color: #e2e8f0; }
    nav .logo { font-size: 18px; font-weight: 700; color: #6366f1; text-decoration: none; margin-left: 0; }
    h1 { font-size: 40px; font-weight: 800; letter-spacing: -0.03em; color: #f1f5f9; margin-bottom: 16px; }
    h2 { font-size: 28px; font-weight: 700; color: #f1f5f9; margin: 48px 0 16px; }
    h3 { font-size: 20px; font-weight: 600; color: #f1f5f9; margin: 32px 0 12px; }
    p { color: #94a3b8; font-size: 16px; margin-bottom: 16px; }
    pre { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 20px; overflow-x: auto; font-size: 14px; line-height: 1.6; margin: 16px 0; }
    code { font-family: 'SF Mono', 'Fira Code', monospace; color: #e2e8f0; }
    .inline-code { background: #1e293b; padding: 2px 6px; border-radius: 4px; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { text-align: left; padding: 12px 16px; border-bottom: 1px solid #1e293b; font-size: 14px; }
    th { color: #f1f5f9; font-weight: 600; background: #1e293b; }
    td { color: #94a3b8; }
    .str { color: #34d399; }
    .cmt { color: #64748b; }
    footer { padding: 40px 0; text-align: center; color: #475569; font-size: 14px; border-top: 1px solid #1e293b; margin-top: 60px; }
    footer a { color: #6366f1; text-decoration: none; }
    .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 24px 0; }
    .price-card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 28px; text-align: center; }
    .price-card.featured { border-color: #6366f1; position: relative; }
    .price-card.featured::before { content: "POPULAR"; position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #6366f1; color: white; font-size: 11px; font-weight: 700; padding: 2px 12px; border-radius: 10px; letter-spacing: 1px; }
    .price-card h3 { margin: 0 0 8px; font-size: 18px; }
    .price-card .amount { font-size: 40px; font-weight: 800; color: #f1f5f9; }
    .price-card .amount span { font-size: 16px; font-weight: 400; color: #64748b; }
    .price-card .quota { color: #94a3b8; font-size: 14px; margin: 8px 0 0; }
    .price-card ul { text-align: left; list-style: none; margin-top: 20px; }
    .price-card ul li { padding: 6px 0; font-size: 14px; color: #94a3b8; }
    .price-card ul li::before { content: "\\2713"; color: #22c55e; margin-right: 8px; }
    .templates-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; margin: 24px 0; }
    .tpl-card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; overflow: hidden; }
    .tpl-card img { width: 100%; height: auto; display: block; }
    .tpl-card .info { padding: 16px 20px; }
    .tpl-card .info h3 { margin: 0 0 4px; font-size: 16px; }
    .tpl-card .info p { font-size: 13px; margin: 0; }
  </style>
</head>
<body>
  <nav>
    <div class="inner">
      <a href="/" class="logo">ShotOG</a>
      <div>
        <a href="/docs">Docs</a>
        <a href="/templates">Templates</a>
        <a href="/pricing">Pricing</a>
        <a href="https://github.com/nicepkg/shotog">GitHub</a>
      </div>
    </div>
  </nav>
  <div class="container">
    ${body}
    <footer>
      ShotOG &mdash; Screenshot & OG Images API<br>
      <a href="https://github.com/nicepkg/shotog">GitHub</a> &middot;
      <a href="/docs">Docs</a> &middot;
      <a href="/pricing">Pricing</a>
    </footer>
  </div>
</body>
</html>`;
}

/**
 * GET /docs — API documentation
 */
pages.get("/docs", (c) => {
  const baseUrl = new URL(c.req.url).origin;
  const body = `
    <h1>API Documentation</h1>
    <p>ShotOG generates beautiful OG images with a single API call. Edge-native, globally fast, developer-friendly.</p>

    <h2>Authentication</h2>
    <p>Pass your API key via the <code class="inline-code">X-Api-Key</code> header or <code class="inline-code">api_key</code> query parameter. Demo mode (no key) allows 10 requests/day.</p>
    <pre><code><span class="cmt"># Create a free API key</span>
curl -X POST ${baseUrl}/v1/keys \\
  -H "Content-Type: application/json" \\
  -d '{"email":"you@example.com"}'

<span class="cmt"># Returns: { "key": "sk_...", "tier": "free", "monthly_limit": 500 }</span></code></pre>

    <h2>Generate OG Image</h2>

    <h3>GET /v1/og</h3>
    <p>Generate an image via query parameters. Perfect for embedding in <code class="inline-code">&lt;meta&gt;</code> tags.</p>
    <pre><code><span class="cmt"># Simple</span>
curl "${baseUrl}/v1/og?title=Hello%20World"

<span class="cmt"># Full options</span>
curl "${baseUrl}/v1/og?title=My%20Post&subtitle=Great%20read&template=blog&eyebrow=Tech&author=Jane&api_key=sk_..."</code></pre>

    <h3>POST /v1/og</h3>
    <p>Generate an image via JSON body.</p>
    <pre><code>curl -X POST ${baseUrl}/v1/og \\
  -H "Content-Type: application/json" \\
  -H "X-Api-Key: sk_..." \\
  -d '{
    "title": "My Post",
    "template": "blog",
    "subtitle": "A great read",
    "eyebrow": "Tech",
    "author": "Jane Doe"
  }'</code></pre>

    <h3>POST /v1/og/batch</h3>
    <p>Generate up to 20 images in a single request. Returns JSON with base64 data URIs.</p>
    <pre><code>curl -X POST ${baseUrl}/v1/og/batch \\
  -H "Content-Type: application/json" \\
  -H "X-Api-Key: sk_..." \\
  -d '{
    "images": [
      {"id": "hero", "title": "My Product", "template": "product"},
      {"id": "blog-1", "title": "First Post", "template": "blog", "author": "Alice"}
    ],
    "defaults": {"format": "png", "width": 1200, "domain": "example.com"}
  }'

<span class="cmt"># Response:</span>
<span class="cmt"># {</span>
<span class="cmt">#   "results": [</span>
<span class="cmt">#     {"id":"hero","success":true,"dataUri":"data:image/png;base64,..."},</span>
<span class="cmt">#     {"id":"blog-1","success":true,"dataUri":"data:image/png;base64,..."}  </span>
<span class="cmt">#   ],</span>
<span class="cmt">#   "summary": {"total":2,"succeeded":2,"failed":0}</span>
<span class="cmt"># }</span></code></pre>

    <h2>Parameters</h2>
    <table>
      <thead><tr><th>Parameter</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code class="inline-code">title</code></td><td>string</td><td>Yes</td><td>Main title text</td></tr>
        <tr><td><code class="inline-code">template</code></td><td>string</td><td>No</td><td>Template name (default: basic). Options: basic, blog, product, social, event, changelog, testimonial, announcement</td></tr>
        <tr><td><code class="inline-code">subtitle</code></td><td>string</td><td>No</td><td>Subtitle or description</td></tr>
        <tr><td><code class="inline-code">eyebrow</code></td><td>string</td><td>No</td><td>Small text above title (e.g. "NEW", "Blog")</td></tr>
        <tr><td><code class="inline-code">author</code></td><td>string</td><td>No</td><td>Author name</td></tr>
        <tr><td><code class="inline-code">domain</code></td><td>string</td><td>No</td><td>Domain watermark (default: shotog.com)</td></tr>
        <tr><td><code class="inline-code">bgColor</code></td><td>string</td><td>No</td><td>Background color (hex, e.g. #667eea)</td></tr>
        <tr><td><code class="inline-code">textColor</code></td><td>string</td><td>No</td><td>Text color (hex)</td></tr>
        <tr><td><code class="inline-code">accentColor</code></td><td>string</td><td>No</td><td>Accent color (hex)</td></tr>
        <tr><td><code class="inline-code">format</code></td><td>string</td><td>No</td><td>Output format: png (default) or svg</td></tr>
        <tr><td><code class="inline-code">width</code></td><td>number</td><td>No</td><td>Image width, 200-2400 (default: 1200)</td></tr>
        <tr><td><code class="inline-code">height</code></td><td>number</td><td>No</td><td>Image height, 200-1260 (default: 630)</td></tr>
        <tr><td><code class="inline-code">fontUrl</code></td><td>string</td><td>No</td><td>URL to a TTF/OTF font file (max 5MB, cached 1h)</td></tr>
        <tr><td><code class="inline-code">avatar</code></td><td>string</td><td>No</td><td>Avatar image URL (for blog, social, testimonial templates)</td></tr>
        <tr><td><code class="inline-code">logo</code></td><td>string</td><td>No</td><td>Logo image URL (for basic, product templates)</td></tr>
      </tbody>
    </table>

    <h2>Other Endpoints</h2>
    <table>
      <thead><tr><th>Endpoint</th><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code class="inline-code">/v1/og/templates</code></td><td>GET</td><td>List all available templates</td></tr>
        <tr><td><code class="inline-code">/v1/keys</code></td><td>POST</td><td>Create a new API key (self-service)</td></tr>
        <tr><td><code class="inline-code">/v1/keys/usage</code></td><td>GET</td><td>Check usage (requires X-Api-Key header)</td></tr>
        <tr><td><code class="inline-code">/v1/og/batch</code></td><td>POST</td><td>Batch generate up to 20 images (returns JSON with base64)</td></tr>
        <tr><td><code class="inline-code">/health</code></td><td>GET</td><td>Health check</td></tr>
      </tbody>
    </table>

    <h2>SDK (TypeScript / JavaScript)</h2>
    <pre><code>npm install shotog</code></pre>
    <pre><code>import { ShotOG } from "shotog";

const og = new ShotOG({ apiKey: "sk_..." });

<span class="cmt">// Generate URL (no network request)</span>
const url = og.url({ title: "Hello", template: "blog" });

<span class="cmt">// Generate image binary</span>
const buffer = await og.generate({ title: "Hello", template: "blog" });</code></pre>

    <h2>Response Headers</h2>
    <table>
      <thead><tr><th>Header</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code class="inline-code">X-Cache</code></td><td>HIT or MISS — indicates cache status</td></tr>
        <tr><td><code class="inline-code">X-Render-Time-Ms</code></td><td>Total render time in milliseconds</td></tr>
        <tr><td><code class="inline-code">X-SVG-Time-Ms</code></td><td>SVG generation time</td></tr>
        <tr><td><code class="inline-code">X-PNG-Time-Ms</code></td><td>PNG conversion time</td></tr>
      </tbody>
    </table>

    <h2>Rate Limits</h2>
    <p>See <a href="/pricing" style="color:#6366f1">Pricing</a> for tier-based limits. Demo mode (no API key): 10 requests/day.</p>
  `;
  return c.html(layout(baseUrl, "API Docs — ShotOG", "Complete API documentation for ShotOG OG image generation API. REST endpoints, parameters, SDK, and examples.", "/docs", body));
});

/**
 * GET /pricing — Pricing page
 */
pages.get("/pricing", (c) => {
  const baseUrl = new URL(c.req.url).origin;
  const body = `
    <h1>Pricing</h1>
    <p>Start free. Scale as you grow. All plans include all 8 templates, PNG & SVG output, and edge caching.</p>

    <div class="pricing-grid">
      <div class="price-card">
        <h3>Free</h3>
        <div class="amount">$0<span>/mo</span></div>
        <div class="quota">500 images/month</div>
        <ul>
          <li>All 8 templates</li>
          <li>PNG & SVG output</li>
          <li>Edge caching (24h)</li>
          <li>Community support</li>
        </ul>
      </div>
      <div class="price-card featured">
        <h3>Starter</h3>
        <div class="amount">$9<span>/mo</span></div>
        <div class="quota">5,000 images/month</div>
        <ul>
          <li>Everything in Free</li>
          <li>Priority rendering</li>
          <li>Email support</li>
          <li>Usage analytics</li>
        </ul>
      </div>
      <div class="price-card">
        <h3>Pro</h3>
        <div class="amount">$29<span>/mo</span></div>
        <div class="quota">20,000 images/month</div>
        <ul>
          <li>Everything in Starter</li>
          <li>Custom fonts</li>
          <li>Remove watermark</li>
          <li>Priority support</li>
        </ul>
      </div>
      <div class="price-card">
        <h3>Scale</h3>
        <div class="amount">$79<span>/mo</span></div>
        <div class="quota">100,000 images/month</div>
        <ul>
          <li>Everything in Pro</li>
          <li>Custom templates</li>
          <li>Dedicated support</li>
          <li>SLA guarantee</li>
        </ul>
      </div>
    </div>

    <h2>FAQ</h2>
    <h3>What counts as an image?</h3>
    <p>Each unique image generation counts as one request. Cached responses (within 24h) are free.</p>

    <h3>Can I change plans?</h3>
    <p>Yes, upgrade or downgrade at any time. Changes take effect immediately.</p>

    <h3>What happens if I exceed my limit?</h3>
    <p>API returns a 429 status with your current usage. No surprise charges — upgrade to continue.</p>

    <h3>Is there a free tier?</h3>
    <p>Yes! 500 images/month, no credit card required. Get an API key in seconds.</p>
  `;
  return c.html(layout(baseUrl, "Pricing — ShotOG", "Simple, transparent pricing for ShotOG OG image API. Start free with 500 images/month. Scale to 100K+ images.", "/pricing", body));
});

/**
 * GET /templates — Template gallery
 */
pages.get("/templates", (c) => {
  const baseUrl = new URL(c.req.url).origin;
  const templates = [
    { name: "basic", desc: "Clean gradient background. Great for general pages and social sharing.", params: "title=Basic%20Template&subtitle=Clean%20and%20versatile" },
    { name: "blog", desc: "Article-style with category badge and author. Perfect for blog posts.", params: "title=Blog%20Template&subtitle=Perfect%20for%20articles&eyebrow=Blog&author=ShotOG" },
    { name: "product", desc: "Bold left-aligned with accent bar. Ideal for SaaS and product pages.", params: "title=Product%20Template&subtitle=Bold%20and%20professional&eyebrow=Launch" },
    { name: "social", desc: "Vibrant card with decorative accents. Built for social media posts.", params: "title=Social%20Template&subtitle=Share%20your%20wins&eyebrow=Update&author=ShotOG" },
    { name: "event", desc: "Conference/meetup style with gradient accents. For events and webinars.", params: "title=Event%20Template&subtitle=The%20future%20of%20web&eyebrow=Conference&author=Speaker" },
    { name: "changelog", desc: "Version release style with status indicator. For changelogs and release notes.", params: "title=Changelog%20Template&subtitle=Performance%20improvements&eyebrow=v3.0" },
    { name: "testimonial", desc: "Quote card with author info. For customer testimonials and reviews.", params: "title=This%20API%20is%20amazing&author=Jane%20Doe&subtitle=CTO%20at%20Acme" },
    { name: "announcement", desc: "Centered bold text with gradient lines. For major announcements.", params: "title=Announcement%20Template&subtitle=Something%20big%20is%20coming&eyebrow=New" },
  ];

  const cards = templates.map(t => `
    <div class="tpl-card">
      <img src="${baseUrl}/v1/og?template=${t.name}&${t.params}" alt="${t.name} template" loading="lazy">
      <div class="info">
        <h3>${t.name}</h3>
        <p>${t.desc}</p>
      </div>
    </div>
  `).join("");

  const body = `
    <h1>Templates</h1>
    <p>8 built-in templates, each fully customizable with colors, text, and more. Use the <code class="inline-code">template</code> parameter to select one.</p>

    <div class="templates-grid">
      ${cards}
    </div>

    <h2>Customization</h2>
    <p>Every template supports these customization options:</p>
    <table>
      <thead><tr><th>Option</th><th>Description</th><th>Example</th></tr></thead>
      <tbody>
        <tr><td><code class="inline-code">bgColor</code></td><td>Background color</td><td>#667eea</td></tr>
        <tr><td><code class="inline-code">textColor</code></td><td>Text color</td><td>#ffffff</td></tr>
        <tr><td><code class="inline-code">accentColor</code></td><td>Accent/highlight color</td><td>#764ba2</td></tr>
        <tr><td><code class="inline-code">eyebrow</code></td><td>Small label above title</td><td>NEW, Blog, v2.0</td></tr>
        <tr><td><code class="inline-code">author</code></td><td>Author name</td><td>Jane Doe</td></tr>
        <tr><td><code class="inline-code">domain</code></td><td>Domain watermark</td><td>example.com</td></tr>
      </tbody>
    </table>

    <h2>Try It</h2>
    <p>Go to the <a href="/" style="color:#6366f1">Playground</a> to preview templates live, or use the API directly:</p>
    <pre><code>curl "${baseUrl}/v1/og?title=Hello&template=social&eyebrow=NEW&accentColor=%23e94560"</code></pre>
  `;
  return c.html(layout(baseUrl, "Templates — ShotOG", "8 beautiful OG image templates: basic, blog, product, social, event, changelog, testimonial, announcement. Fully customizable.", "/templates", body));
});

export { pages };
