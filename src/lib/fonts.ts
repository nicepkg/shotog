import InterRegular from "../fonts/Inter-Regular.ttf";
import InterBold from "../fonts/Inter-Bold.ttf";

function ensureArrayBuffer(data: unknown): ArrayBuffer {
  if (data instanceof ArrayBuffer) return data;
  if (ArrayBuffer.isView(data)) {
    return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  }
  return data as ArrayBuffer;
}

export function getFonts() {
  return [
    {
      name: "Inter",
      data: ensureArrayBuffer(InterRegular),
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Inter",
      data: ensureArrayBuffer(InterBold),
      weight: 700 as const,
      style: "normal" as const,
    },
  ];
}
