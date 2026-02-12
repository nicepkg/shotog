import type { OGImageParams } from "../types";
import { getFonts } from "./fonts";
import { getTemplate } from "../templates";
import { fetchImageAsDataUri } from "./image";

export async function renderOGImage(params: OGImageParams): Promise<{
  data: ArrayBuffer;
  contentType: string;
  timings: { svgMs: number; pngMs: number; totalMs: number };
}> {
  const start = Date.now();
  const format = params.format || "png";
  const width = params.width || 1200;
  const height = params.height || 630;

  // Pre-fetch external images in parallel
  const [avatarDataUri, logoDataUri] = await Promise.all([
    params.avatar ? fetchImageAsDataUri(params.avatar) : null,
    params.logo ? fetchImageAsDataUri(params.logo) : null,
  ]);
  params._avatarDataUri = avatarDataUri;
  params._logoDataUri = logoDataUri;

  const satori = (await import("@cf-wasm/satori")).default;
  const template = getTemplate(params);

  const svg = await satori(template, {
    width,
    height,
    fonts: getFonts(),
  });

  const svgMs = Date.now() - start;

  if (format === "svg") {
    return {
      data: new TextEncoder().encode(svg).buffer as ArrayBuffer,
      contentType: "image/svg+xml",
      timings: { svgMs, pngMs: 0, totalMs: svgMs },
    };
  }

  const pngStart = Date.now();
  const { Resvg } = await import("@cf-wasm/resvg");
  const resvg = await Resvg.async(svg, { fitTo: { mode: "width" as const, value: width } });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  const pngMs = Date.now() - pngStart;

  return {
    data: pngBuffer.buffer as ArrayBuffer,
    contentType: "image/png",
    timings: { svgMs, pngMs, totalMs: Date.now() - start },
  };
}
