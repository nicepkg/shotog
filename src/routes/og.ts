import { Hono } from "hono";
import type { Env, OGImageParams, BatchRequest, BatchResult, BatchResponse } from "../types";
import { renderOGImage } from "../lib/render";
import { authMiddleware, usageLimitMiddleware, recordUsage, recordBatchUsage } from "../middleware/auth";
import { cacheMiddleware } from "../middleware/cache";
import { listTemplates } from "../templates";

const og = new Hono<{ Bindings: Env }>();

/**
 * GET /v1/og -- Generate OG image
 *
 * Query params:
 *   template: basic|blog|product (default: basic)
 *   title: string (required)
 *   subtitle: string
 *   eyebrow: string
 *   author: string
 *   domain: string
 *   fontUrl: URL to a custom .ttf or .otf font file
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
    font: c.req.query("font"),
    fontUrl: c.req.query("fontUrl"),
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
    const apiKeyId = c.get("apiKeyId") as string;
    const result = await renderOGImage(params, c.executionCtx);

    // Record usage (non-blocking)
    c.executionCtx.waitUntil(recordUsage(c.env.DB, apiKeyId, false));

    const headers: Record<string, string> = {
      "Content-Type": result.contentType,
      "Cache-Control": "public, max-age=86400",
      "X-Render-Time-Ms": result.timings.totalMs.toString(),
      "X-SVG-Time-Ms": result.timings.svgMs.toString(),
      "X-PNG-Time-Ms": result.timings.pngMs.toString(),
      "Access-Control-Allow-Origin": "*",
    };

    if (result.fontFallback) {
      headers["X-Font-Fallback"] = "true";
    }

    return new Response(result.data, { headers });
  } catch (error: any) {
    return c.json(
      { error: "Image generation failed", message: error.message },
      500
    );
  }
});

/**
 * POST /v1/og -- Generate OG image from JSON body
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
    font: body.font,
    fontUrl: body.fontUrl,
    bgColor: body.bgColor,
    textColor: body.textColor,
    accentColor: body.accentColor,
    format: body.format || "png",
    width: Math.min(Math.max(body.width || 1200, 200), 2400),
    height: Math.min(Math.max(body.height || 630, 200), 1260),
  };

  try {
    const apiKeyId = c.get("apiKeyId") as string;
    const result = await renderOGImage(params, c.executionCtx);

    c.executionCtx.waitUntil(recordUsage(c.env.DB, apiKeyId, false));

    const headers: Record<string, string> = {
      "Content-Type": result.contentType,
      "Cache-Control": "public, max-age=86400",
      "X-Render-Time-Ms": result.timings.totalMs.toString(),
      "Access-Control-Allow-Origin": "*",
    };

    if (result.fontFallback) {
      headers["X-Font-Fallback"] = "true";
    }

    return new Response(result.data, { headers });
  } catch (error: any) {
    return c.json(
      { error: "Image generation failed", message: error.message },
      500
    );
  }
});

/**
 * POST /v1/og/batch -- Generate multiple OG images in one request
 *
 * Body:
 *   images: array of image params (each must have id + title, max 20)
 *   defaults: optional params applied to all images (image-level overrides)
 *
 * Returns JSON with base64-encoded images and per-image timings.
 */
og.post("/batch", authMiddleware, usageLimitMiddleware, async (c) => {
  const batchStart = Date.now();

  let body: BatchRequest;
  try {
    body = await c.req.json<BatchRequest>();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  // Validate top-level structure
  if (!body.images || !Array.isArray(body.images) || body.images.length === 0) {
    return c.json({ error: "images array is required and must not be empty" }, 400);
  }

  if (body.images.length > 20) {
    return c.json({ error: "Maximum 20 images per batch request", count: body.images.length }, 400);
  }

  // Validate each image has id + title
  for (let i = 0; i < body.images.length; i++) {
    const img = body.images[i];
    if (!img.id) {
      return c.json({ error: `images[${i}].id is required` }, 400);
    }
    if (!img.title) {
      return c.json({ error: `images[${i}].title is required` }, 400);
    }
  }

  // Check duplicate ids
  const ids = body.images.map((img) => img.id);
  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== ids.length) {
    return c.json({ error: "Duplicate id values in images array" }, 400);
  }

  // Check quota: does the user have enough remaining for the full batch?
  const apiKeyId = c.get("apiKeyId") as string;
  const monthlyLimit = c.get("monthlyLimit") as number;
  const currentUsage = (c.get("currentUsage") as number) || 0;

  if (apiKeyId !== "__dev__" && currentUsage + body.images.length > monthlyLimit) {
    return c.json(
      {
        error: "Insufficient quota for batch",
        requested: body.images.length,
        remaining: Math.max(0, monthlyLimit - currentUsage),
        limit: monthlyLimit,
      },
      429
    );
  }

  const defaults = body.defaults || {};

  // Build params for each image: defaults merged with image-specific overrides
  const tasks = body.images.map((img) => {
    const { id, ...imgParams } = img;
    const merged = { ...defaults, ...imgParams };

    const params: OGImageParams = {
      template: merged.template || "basic",
      title: merged.title!,
      subtitle: merged.subtitle,
      eyebrow: merged.eyebrow,
      author: merged.author,
      avatar: merged.avatar,
      logo: merged.logo,
      domain: merged.domain,
      font: merged.font,
      fontUrl: merged.fontUrl,
      bgColor: merged.bgColor,
      textColor: merged.textColor,
      accentColor: merged.accentColor,
      format: merged.format || "png",
      width: Math.min(Math.max(merged.width || 1200, 200), 2400),
      height: Math.min(Math.max(merged.height || 630, 200), 1260),
    };

    return { id, params };
  });

  // Render all images in parallel
  const settled = await Promise.allSettled(
    tasks.map(async ({ id, params }): Promise<BatchResult> => {
      const result = await renderOGImage(params, c.executionCtx);

      // Convert ArrayBuffer to base64 data URI
      const bytes = new Uint8Array(result.data);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);

      return {
        id,
        success: true,
        data: `data:${result.contentType};base64,${base64}`,
        contentType: result.contentType,
        timings: result.timings,
      };
    })
  );

  // Collect results
  const results: BatchResult[] = settled.map((outcome, i) => {
    if (outcome.status === "fulfilled") {
      return outcome.value;
    }
    return {
      id: tasks[i].id,
      success: false,
      error: outcome.reason?.message || "Unknown error",
    };
  });

  const succeeded = results.filter((r) => r.success).length;
  const failed = results.length - succeeded;

  // Record usage for successful renders only (single DB call)
  if (succeeded > 0) {
    c.executionCtx.waitUntil(recordBatchUsage(c.env.DB, apiKeyId, succeeded));
  }

  const response: BatchResponse = {
    results,
    summary: {
      total: results.length,
      succeeded,
      failed,
      totalMs: Date.now() - batchStart,
    },
  };

  return c.json(response);
});

/**
 * GET /v1/og/templates -- List available templates
 */
og.get("/templates", (c) => {
  return c.json({
    templates: listTemplates(),
    docs: "https://shotog.com/docs/templates",
  });
});

export { og };
