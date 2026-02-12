import { Hono } from "hono";
import type { Env } from "../types";

const apiKeys = new Hono<{ Bindings: Env }>();

/**
 * POST /v1/keys — Create a new API key (self-service)
 * Body: { email: string, name?: string }
 * Returns the raw API key (only shown once).
 */
apiKeys.post("/", async (c) => {
  const { email, name } = await c.req.json<{ email: string; name?: string }>();

  if (!email || !email.includes("@")) {
    return c.json({ error: "Valid email is required" }, 400);
  }

  // Generate a random API key
  const rawKey = `sk_${generateId(32)}`;
  const keyHash = await hashKey(rawKey);
  const id = generateId(12);

  try {
    await c.env.DB.prepare(
      `INSERT INTO api_keys (id, key_hash, name, email, tier, monthly_limit)
       VALUES (?, ?, ?, ?, 'free', 500)`
    )
      .bind(id, keyHash, name || "Default", email)
      .run();

    return c.json({
      id,
      key: rawKey,
      tier: "free",
      monthly_limit: 500,
      message: "Save this key — it won't be shown again.",
    });
  } catch (error: any) {
    return c.json({ error: "Failed to create API key", message: error.message }, 500);
  }
});

/**
 * GET /v1/keys/usage — Get current usage for an API key
 * Requires X-Api-Key header
 */
apiKeys.get("/usage", async (c) => {
  const apiKey = c.req.header("X-Api-Key");
  if (!apiKey) {
    return c.json({ error: "X-Api-Key header required" }, 401);
  }

  const keyHash = await hashKey(apiKey);

  try {
    const keyInfo = await c.env.DB.prepare(
      "SELECT id, name, tier, monthly_limit, created_at FROM api_keys WHERE key_hash = ? AND is_active = 1"
    )
      .bind(keyHash)
      .first();

    if (!keyInfo) {
      return c.json({ error: "Invalid API key" }, 401);
    }

    const month = new Date().toISOString().slice(0, 7);
    const usage = await c.env.DB.prepare(
      `SELECT
        COALESCE(SUM(requests_count), 0) as total_requests,
        COALESCE(SUM(cached_count), 0) as cached_requests,
        COALESCE(SUM(failed_count), 0) as failed_requests
       FROM usage WHERE api_key_id = ? AND date LIKE ?`
    )
      .bind(keyInfo.id, `${month}%`)
      .first<{ total_requests: number; cached_requests: number; failed_requests: number }>();

    return c.json({
      key_id: keyInfo.id,
      name: keyInfo.name,
      tier: keyInfo.tier,
      monthly_limit: keyInfo.monthly_limit,
      period: month,
      usage: {
        billable_requests: usage?.total_requests || 0,
        cached_requests: usage?.cached_requests || 0,
        failed_requests: usage?.failed_requests || 0,
        remaining: (keyInfo.monthly_limit as number) - (usage?.total_requests || 0),
      },
    });
  } catch (error: any) {
    return c.json({ error: "Failed to get usage", message: error.message }, 500);
  }
});

function generateId(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => chars[b % chars.length]).join("");
}

async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export { apiKeys };
