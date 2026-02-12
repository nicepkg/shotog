import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./types";
import { og } from "./routes/og";
import { apiKeys } from "./routes/api-keys";
import { landingPage } from "./routes/landing";
import { pages } from "./routes/pages";

const app = new Hono<{ Bindings: Env }>();

// CORS for API routes
app.use("/v1/*", cors());

// Landing page
app.get("/", landingPage);

// SEO pages
app.route("/", pages);

// API routes
app.route("/v1/og", og);
app.route("/v1/keys", apiKeys);

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", version: "0.6.0", name: "shotog" });
});

// SEO: sitemap.xml
app.get("/sitemap.xml", (c) => {
  const baseUrl = new URL(c.req.url).origin;
  const pages = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
    { loc: "/docs", priority: "0.9", changefreq: "weekly" },
    { loc: "/pricing", priority: "0.8", changefreq: "monthly" },
    { loc: "/templates", priority: "0.8", changefreq: "monthly" },
  ];
  const urls = pages
    .map(
      (p) => `  <url>
    <loc>${baseUrl}${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  return c.text(xml, 200, { "Content-Type": "application/xml" });
});

// SEO: robots.txt
app.get("/robots.txt", (c) => {
  const baseUrl = new URL(c.req.url).origin;
  const txt = `User-agent: *
Allow: /
Allow: /docs
Allow: /pricing
Allow: /templates
Disallow: /v1/keys
Disallow: /health

Sitemap: ${baseUrl}/sitemap.xml`;
  return c.text(txt);
});

export default app;
