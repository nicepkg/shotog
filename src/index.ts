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

export default app;
