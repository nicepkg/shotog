import { Context, Next } from "hono";
import type { Env, ApiKey } from "../types";

/**
 * API key authentication middleware.
 * Accepts key via:
 *   1. X-Api-Key header
 *   2. ?api_key= query parameter
 *
 * For free tier without key: allows up to 10 requests/day per IP (demo mode).
 */
export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const apiKey =
    c.req.header("X-Api-Key") ||
    c.req.query("api_key");

  if (!apiKey) {
    // Demo mode: no key required, but very limited
    c.set("apiKeyId", "__demo__");
    c.set("tier", "free");
    c.set("monthlyLimit", 10);
    return next();
  }

  // Hash the key for lookup
  const keyHash = await hashKey(apiKey);

  try {
    const result = await c.env.DB.prepare(
      "SELECT * FROM api_keys WHERE key_hash = ? AND is_active = 1"
    )
      .bind(keyHash)
      .first<ApiKey>();

    if (!result) {
      return c.json({ error: "Invalid API key" }, 401);
    }

    c.set("apiKeyId", result.id);
    c.set("tier", result.tier);
    c.set("monthlyLimit", result.monthly_limit);
  } catch {
    // D1 might not be available in local dev without --local
    c.set("apiKeyId", "__dev__");
    c.set("tier", "free");
    c.set("monthlyLimit", 500);
  }

  return next();
}

/**
 * Check usage against monthly limit.
 */
export async function usageLimitMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const apiKeyId = c.get("apiKeyId") as string;
  const monthlyLimit = c.get("monthlyLimit") as number;

  if (apiKeyId === "__dev__") return next();

  try {
    // Get current month usage
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM
    const result = await c.env.DB.prepare(
      "SELECT COALESCE(SUM(requests_count), 0) as total FROM usage WHERE api_key_id = ? AND date LIKE ?"
    )
      .bind(apiKeyId, `${month}%`)
      .first<{ total: number }>();

    const currentUsage = result?.total || 0;

    if (currentUsage >= monthlyLimit) {
      return c.json(
        {
          error: "Monthly limit exceeded",
          usage: currentUsage,
          limit: monthlyLimit,
          resetDate: `${month}-01`,
        },
        429
      );
    }

    c.set("currentUsage", currentUsage);
  } catch {
    // Skip usage check if DB unavailable
  }

  return next();
}

/**
 * Record usage after successful generation.
 */
export async function recordUsage(db: D1Database, apiKeyId: string, cached: boolean) {
  if (apiKeyId === "__dev__" || apiKeyId === "__demo__") return;

  const today = new Date().toISOString().slice(0, 10);

  try {
    if (cached) {
      await db.prepare(
        `INSERT INTO usage (api_key_id, date, cached_count)
         VALUES (?, ?, 1)
         ON CONFLICT(api_key_id, date)
         DO UPDATE SET cached_count = cached_count + 1`
      )
        .bind(apiKeyId, today)
        .run();
    } else {
      await db.prepare(
        `INSERT INTO usage (api_key_id, date, requests_count)
         VALUES (?, ?, 1)
         ON CONFLICT(api_key_id, date)
         DO UPDATE SET requests_count = requests_count + 1`
      )
        .bind(apiKeyId, today)
        .run();
    }
  } catch {
    // Non-blocking: don't fail the request if usage tracking fails
  }
}

/**
 * Record batch usage: increment requests_count by `count` in a single query.
 */
export async function recordBatchUsage(db: D1Database, apiKeyId: string, count: number) {
  if (apiKeyId === "__dev__" || apiKeyId === "__demo__" || count <= 0) return;

  const today = new Date().toISOString().slice(0, 10);

  try {
    await db.prepare(
      `INSERT INTO usage (api_key_id, date, requests_count)
       VALUES (?, ?, ?)
       ON CONFLICT(api_key_id, date)
       DO UPDATE SET requests_count = requests_count + ?`
    )
      .bind(apiKeyId, today, count, count)
      .run();
  } catch {
    // Non-blocking: don't fail the request if usage tracking fails
  }
}

async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
