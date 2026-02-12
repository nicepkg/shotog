import { Hono } from "hono";
import type { Env, OGImageParams } from "../types";
import { renderOGImage } from "../lib/render";
import { authMiddleware, usageLimitMiddleware, recordUsage } from "../middleware/auth";
import { cacheMiddleware } from "../middleware/cache";
import { listTemplates } from "../templates";

const og = new Hono<{ Bindings: Env }>();

/**
 * GET /v1/og — Generate OG image
 *
 * Query params:
 *   template: basic|blog|product (default: basic)
 *   title: string (required)
 *   subtitle: string
 *   eyebrow: string
 *   author: string
 *   domain: string
 *   bgColor: hex color
 *   textColor: hex color
 *   accentColor: hex color
 *   format: png|svg (default: png)
 *   width: number (default: 1200)
 *   height: number (default: 630)
 */
og.get("/", cacheMiddleware, authMiddleware, usageLimitMiddleware, async (c) => {
  const title = c.req.query("title");
  if (!title) {
    return c.json({ error: "title parameter is required" }, 400);
  }

  const params: OGImageParams = {
    template: c.req.query("template") || "basic",
    title,
    subtitle: c.req.query("subtitle"),
    eyebrow: c.req.query("eyebrow"),
    author: c.req.query("author"),
    avatar: c.req.query("avatar"),
    logo: c.req.query("logo"),
    domain: c.req.query("domain"),
    bgColor: c.req.query("bgColor"),
    textColor: c.req.query("textColor"),
    accentColor: c.req.query("accentColor"),
    format: (c.req.query("format") as "png" | "svg") || "png",
    width: parseInt(c.req.query("width") || "1200"),
    height: parseInt(c.req.query("height") || "630"),
  };

  // Clamp dimensions
  params.width = Math.min(Math.max(params.width!, 200), 2400);
  params.height = Math.min(Math.max(params.height!, 200), 1260);

  try {
    const result = await renderOGImage(params);

    // Record usage (non-blocking)
    const apiKeyId = c.get("apiKeyId") as string;
    c.executionCtx.waitUntil(recordUsage(c.env.DB, apiKeyId, false));

    return new Response(result.data, {
      headers: {
        "Content-Type": result.contentType,
        "Cache-Control": "public, max-age=86400",
        "X-Render-Time-Ms": result.timings.totalMs.toString(),
        "X-SVG-Time-Ms": result.timings.svgMs.toString(),
        "X-PNG-Time-Ms": result.timings.pngMs.toString(),
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    return c.json(
      { error: "Image generation failed", message: error.message },
      500
    );
  }
});

/**
 * POST /v1/og — Generate OG image from JSON body
 * Same params as GET, but in request body.
 */
og.post("/", authMiddleware, usageLimitMiddleware, async (c) => {
  const body = await c.req.json<OGImageParams>();

  if (!body.title) {
    return c.json({ error: "title is required" }, 400);
  }

  const params: OGImageParams = {
    template: body.template || "basic",
    title: body.title,
    subtitle: body.subtitle,
    eyebrow: body.eyebrow,
    author: body.author,
    avatar: body.avatar,
    logo: body.logo,
    domain: body.domain,
    bgColor: body.bgColor,
    textColor: body.textColor,
    accentColor: body.accentColor,
    format: body.format || "png",
    width: Math.min(Math.max(body.width || 1200, 200), 2400),
    height: Math.min(Math.max(body.height || 630, 200), 1260),
  };

  try {
    const result = await renderOGImage(params);

    const apiKeyId = c.get("apiKeyId") as string;
    c.executionCtx.waitUntil(recordUsage(c.env.DB, apiKeyId, false));

    return new Response(result.data, {
      headers: {
        "Content-Type": result.contentType,
        "Cache-Control": "public, max-age=86400",
        "X-Render-Time-Ms": result.timings.totalMs.toString(),
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    return c.json(
      { error: "Image generation failed", message: error.message },
      500
    );
  }
});

/**
 * GET /v1/og/templates — List available templates
 */
og.get("/templates", (c) => {
  return c.json({
    templates: listTemplates(),
    docs: "https://shotog.com/docs/templates",
  });
});

export { og };
