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
  format?: "png" | "svg";
  width?: number;
  height?: number;
  /** Pre-fetched image data URIs (populated by render pipeline) */
  _avatarDataUri?: string | null;
  _logoDataUri?: string | null;
};
