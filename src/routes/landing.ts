import { Context } from "hono";
import type { Env } from "../types";

export async function landingPage(c: Context<{ Bindings: Env }>) {
  const baseUrl = new URL(c.req.url).origin;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ShotOG — Screenshot & OG Images. One API Call.</title>
  <meta name="description" content="Generate beautiful OG images and website screenshots with a single API call. Edge-native, globally fast, developer-friendly.">
  <meta property="og:title" content="ShotOG — Screenshot & OG Images API">
  <meta property="og:description" content="Generate beautiful OG images with a single API call. Edge-native, globally fast.">
  <meta property="og:image" content="${baseUrl}/v1/og?title=ShotOG&subtitle=Screenshot%20%26%20OG%20Images.%20One%20API%20Call.&template=product&eyebrow=API&accentColor=%236366f1">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif; background: #0f172a; color: #e2e8f0; line-height: 1.6; }
    .container { max-width: 900px; margin: 0 auto; padding: 0 24px; }
    header { padding: 80px 0 40px; text-align: center; }
    h1 { font-size: 48px; font-weight: 800; letter-spacing: -0.03em; background: linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .tagline { font-size: 20px; color: #94a3b8; margin-top: 12px; }
    .hero-features { display: flex; gap: 32px; justify-content: center; margin-top: 32px; flex-wrap: wrap; }
    .feature { display: flex; align-items: center; gap: 8px; font-size: 15px; color: #cbd5e1; }
    .feature .dot { width: 8px; height: 8px; border-radius: 50%; background: #6366f1; }
    .preview { margin: 48px 0; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b; background: #1e293b; }
    .preview img { width: 100%; height: auto; display: block; }
    .section { margin: 56px 0; }
    .section h2 { font-size: 28px; font-weight: 700; margin-bottom: 16px; color: #f1f5f9; }
    .section p { color: #94a3b8; font-size: 16px; }
    pre { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 20px; overflow-x: auto; font-size: 14px; line-height: 1.6; margin: 16px 0; }
    code { font-family: 'SF Mono', 'Fira Code', monospace; color: #e2e8f0; }
    .kw { color: #c084fc; }
    .str { color: #34d399; }
    .cmt { color: #64748b; }
    .templates { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-top: 20px; }
    .template-card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; overflow: hidden; transition: border-color 0.2s; }
    .template-card:hover { border-color: #6366f1; }
    .template-card img { width: 100%; height: auto; display: block; }
    .template-card .name { padding: 12px 16px; font-weight: 600; font-size: 14px; }
    .pricing { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 20px; }
    .price-card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 24px; text-align: center; }
    .price-card.popular { border-color: #6366f1; }
    .price-card h3 { font-size: 18px; margin-bottom: 8px; }
    .price-card .price { font-size: 36px; font-weight: 800; color: #f1f5f9; }
    .price-card .price span { font-size: 16px; font-weight: 400; color: #64748b; }
    .price-card .quota { color: #94a3b8; font-size: 14px; margin-top: 4px; }
    .cta { text-align: center; margin: 56px 0; }
    .btn { display: inline-block; padding: 14px 32px; background: #6366f1; color: white; font-size: 16px; font-weight: 600; border-radius: 8px; text-decoration: none; transition: background 0.2s; }
    .btn:hover { background: #4f46e5; }
    footer { padding: 40px 0; text-align: center; color: #475569; font-size: 14px; border-top: 1px solid #1e293b; margin-top: 40px; }
    .playground { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 24px; margin-top: 20px; }
    .playground label { display: block; font-size: 14px; color: #94a3b8; margin-bottom: 6px; margin-top: 16px; }
    .playground label:first-child { margin-top: 0; }
    .playground input, .playground select { width: 100%; padding: 10px 12px; background: #0f172a; border: 1px solid #334155; border-radius: 6px; color: #e2e8f0; font-size: 14px; }
    .playground .row { display: flex; gap: 12px; }
    .playground .row > div { flex: 1; }
    .playground-preview { margin-top: 20px; border-radius: 8px; overflow: hidden; background: #0f172a; min-height: 200px; display: flex; align-items: center; justify-content: center; }
    .playground-preview img { width: 100%; height: auto; }
    .playground-btn { margin-top: 16px; width: 100%; padding: 12px; background: #6366f1; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; }
    .playground-btn:hover { background: #4f46e5; }
    .playground-url { margin-top: 12px; background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 10px 12px; font-family: monospace; font-size: 12px; color: #94a3b8; word-break: break-all; }
    @media (max-width: 640px) { h1 { font-size: 32px; } .hero-features { flex-direction: column; align-items: center; } }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>ShotOG</h1>
      <p class="tagline">Screenshot & OG Images. One API Call.</p>
      <div class="hero-features">
        <div class="feature"><span class="dot"></span> 3 Beautiful Templates</div>
        <div class="feature"><span class="dot"></span> Edge-Native (140ms)</div>
        <div class="feature"><span class="dot"></span> PNG & SVG Output</div>
        <div class="feature"><span class="dot"></span> 500 Free/month</div>
      </div>
    </header>

    <div class="preview">
      <img src="${baseUrl}/v1/og?title=Your%20Next%20Blog%20Post&subtitle=Beautiful%20OG%20images%20generated%20in%20140ms&template=blog&eyebrow=Tutorial&author=ShotOG" alt="ShotOG example" loading="lazy">
    </div>

    <div class="section">
      <h2>Quick Start</h2>
      <p>Generate an OG image with a single HTTP request:</p>
      <pre><code><span class="cmt"># Simple GET request</span>
curl "<span class="str">${baseUrl}/v1/og?title=Hello%20World&template=basic</span>"

<span class="cmt"># With all options</span>
curl "<span class="str">${baseUrl}/v1/og?title=My%20Post&subtitle=A%20great%20read&template=blog&eyebrow=Tech&author=Jane</span>"

<span class="cmt"># Or use POST with JSON</span>
curl -X POST <span class="str">${baseUrl}/v1/og</span> \\
  -H <span class="str">"Content-Type: application/json"</span> \\
  -d <span class="str">'{"title":"Hello","template":"product","eyebrow":"NEW"}'</span></code></pre>
    </div>

    <div class="section">
      <h2>Templates</h2>
      <p>Choose from 3 built-in templates, each fully customizable:</p>
      <div class="templates">
        <div class="template-card">
          <img src="${baseUrl}/v1/og?title=Basic%20Template&subtitle=Clean%20%26%20versatile&template=basic&format=png" alt="Basic template" loading="lazy">
          <div class="name">basic</div>
        </div>
        <div class="template-card">
          <img src="${baseUrl}/v1/og?title=Blog%20Template&subtitle=Perfect%20for%20articles&template=blog&eyebrow=Blog&author=ShotOG" alt="Blog template" loading="lazy">
          <div class="name">blog</div>
        </div>
        <div class="template-card">
          <img src="${baseUrl}/v1/og?title=Product%20Template&subtitle=Bold%20%26%20professional&template=product&eyebrow=Launch" alt="Product template" loading="lazy">
          <div class="name">product</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Playground</h2>
      <p>Try it live — customize and preview your OG image:</p>
      <div class="playground">
        <label for="pg-template">Template</label>
        <select id="pg-template">
          <option value="basic">basic</option>
          <option value="blog">blog</option>
          <option value="product">product</option>
        </select>
        <label for="pg-title">Title *</label>
        <input id="pg-title" value="My Awesome Project" placeholder="Enter title...">
        <label for="pg-subtitle">Subtitle</label>
        <input id="pg-subtitle" value="Built with ShotOG API" placeholder="Enter subtitle...">
        <div class="row">
          <div>
            <label for="pg-eyebrow">Eyebrow</label>
            <input id="pg-eyebrow" placeholder="e.g. NEW, Blog, API">
          </div>
          <div>
            <label for="pg-author">Author</label>
            <input id="pg-author" placeholder="e.g. Jane Doe">
          </div>
        </div>
        <div class="row">
          <div>
            <label for="pg-bg">Background</label>
            <input id="pg-bg" placeholder="#667eea">
          </div>
          <div>
            <label for="pg-accent">Accent</label>
            <input id="pg-accent" placeholder="#764ba2">
          </div>
          <div>
            <label for="pg-format">Format</label>
            <select id="pg-format">
              <option value="png">PNG</option>
              <option value="svg">SVG</option>
            </select>
          </div>
        </div>
        <button class="playground-btn" onclick="generatePreview()">Generate Preview</button>
        <div class="playground-preview" id="pg-preview">
          <span style="color:#475569">Click "Generate Preview" to see your image</span>
        </div>
        <div class="playground-url" id="pg-url"></div>
      </div>
    </div>

    <div class="section">
      <h2>Pricing</h2>
      <div class="pricing">
        <div class="price-card">
          <h3>Free</h3>
          <div class="price">$0<span>/mo</span></div>
          <div class="quota">500 images/month</div>
        </div>
        <div class="price-card popular">
          <h3>Starter</h3>
          <div class="price">$9<span>/mo</span></div>
          <div class="quota">5,000 images/month</div>
        </div>
        <div class="price-card">
          <h3>Pro</h3>
          <div class="price">$29<span>/mo</span></div>
          <div class="quota">20,000 images/month</div>
        </div>
        <div class="price-card">
          <h3>Scale</h3>
          <div class="price">$79<span>/mo</span></div>
          <div class="quota">100,000 images/month</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Get API Key</h2>
      <pre><code>curl -X POST <span class="str">${baseUrl}/v1/keys</span> \\
  -H <span class="str">"Content-Type: application/json"</span> \\
  -d <span class="str">'{"email":"you@example.com"}'</span>

<span class="cmt"># Returns: { "key": "sk_...", "tier": "free", "monthly_limit": 500 }</span></code></pre>
    </div>

    <div class="cta">
      <a href="${baseUrl}/v1/og?title=Hello%20ShotOG&template=basic" class="btn">Try it now — no signup needed</a>
    </div>

    <footer>
      ShotOG &mdash; Screenshot & OG Images API<br>
      <a href="https://github.com/nicepkg/shotog" style="color:#6366f1;text-decoration:none;">GitHub</a> &middot;
      <a href="${baseUrl}/v1/og/templates" style="color:#6366f1;text-decoration:none;">API Docs</a>
    </footer>
  </div>

  <script>
    function generatePreview() {
      const params = new URLSearchParams();
      const title = document.getElementById('pg-title').value;
      if (!title) { alert('Title is required'); return; }
      params.set('title', title);

      const fields = {
        template: 'pg-template', subtitle: 'pg-subtitle', eyebrow: 'pg-eyebrow',
        author: 'pg-author', bgColor: 'pg-bg', accentColor: 'pg-accent', format: 'pg-format'
      };
      for (const [key, id] of Object.entries(fields)) {
        const val = document.getElementById(id).value;
        if (val) params.set(key, val);
      }

      const url = '${baseUrl}/v1/og?' + params.toString();
      document.getElementById('pg-url').textContent = url;

      const preview = document.getElementById('pg-preview');
      preview.innerHTML = '<span style="color:#475569">Loading...</span>';
      const img = new Image();
      img.onload = () => { preview.innerHTML = ''; preview.appendChild(img); };
      img.onerror = () => { preview.innerHTML = '<span style="color:#ef4444">Failed to generate</span>'; };
      img.src = url;
      img.style.width = '100%';
      img.alt = 'Generated OG image preview';
    }
  </script>
</body>
</html>`;

  return c.html(html);
}
