import { Context, Next } from "hono";
import type { Env } from "../types";

/**
 * Cache middleware using Cloudflare Cache API.
 * Caches successful image responses for 24h.
 * Cache key = full request URL (includes all params).
 */
export async function cacheMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const cache = caches.default;
  const cacheKey = new Request(c.req.url, { method: "GET" });

  // Try cache first
  const cached = await cache.match(cacheKey);
  if (cached) {
    const response = new Response(cached.body, cached);
    response.headers.set("X-Cache", "HIT");
    c.set("cacheHit", true);
    return response;
  }

  // Cache miss — proceed to handler
  c.set("cacheHit", false);
  await next();

  // Cache the response if it's an image
  const contentType = c.res.headers.get("Content-Type") || "";
  if (c.res.status === 200 && (contentType.includes("image/") || contentType.includes("svg"))) {
    const response = c.res.clone();
    response.headers.set("Cache-Control", "public, max-age=86400"); // 24h
    response.headers.set("X-Cache", "MISS");
    c.executionCtx.waitUntil(cache.put(cacheKey, response));
    c.res.headers.set("X-Cache", "MISS");
  }
}
