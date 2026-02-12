/**
 * Fetch an external image URL and convert to base64 data URI for Satori.
 * Returns null if fetch fails (templates should fallback gracefully).
 */
export async function fetchImageAsDataUri(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "ShotOG/0.3" },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "image/png";
    const buffer = await res.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));

    return `data:${contentType};base64,${base64}`;
  } catch {
    return null;
  }
}
