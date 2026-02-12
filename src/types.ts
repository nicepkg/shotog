export type Env = {
  DB: D1Database;
  ENVIRONMENT: string;
};

export type Tier = "free" | "starter" | "pro" | "scale";

export type ApiKey = {
  id: string;
  key_hash: string;
  name: string;
  email: string | null;
  tier: Tier;
  monthly_limit: number;
  is_active: number;
  created_at: string;
  updated_at: string;
};

export type OGImageParams = {
  template: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  author?: string;
  avatar?: string;
  logo?: string;
  domain?: string;
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
  font?: string;
  /** URL to a custom .ttf or .otf font file (max 5MB, cached 1h) */
  fontUrl?: string;
  format?: "png" | "svg";
  width?: number;
  height?: number;
  /** Pre-fetched image data URIs (populated by render pipeline) */
  _avatarDataUri?: string | null;
  _logoDataUri?: string | null;
};

/** A single image entry in a batch request */
export type BatchImageInput = Partial<OGImageParams> & {
  /** User-defined identifier to match results */
  id: string;
  title: string;
};

/** Defaults applied to every image in the batch */
export type BatchDefaults = Partial<OGImageParams>;

/** POST /v1/og/batch request body */
export type BatchRequest = {
  images: BatchImageInput[];
  defaults?: BatchDefaults;
};

/** A single result in the batch response */
export type BatchResult = {
  id: string;
  success: boolean;
  data?: string;
  contentType?: string;
  timings?: { svgMs: number; pngMs: number; totalMs: number };
  error?: string;
};

/** POST /v1/og/batch response body */
export type BatchResponse = {
  results: BatchResult[];
  summary: {
    total: number;
    succeeded: number;
    failed: number;
    totalMs: number;
  };
};
