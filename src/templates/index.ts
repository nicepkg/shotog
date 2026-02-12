import type { OGImageParams } from "../types";
import { basicTemplate } from "./basic";
import { blogTemplate } from "./blog";
import { productTemplate } from "./product";

const templates: Record<string, (params: OGImageParams) => any> = {
  basic: basicTemplate,
  blog: blogTemplate,
  product: productTemplate,
};

export function getTemplate(params: OGImageParams): any {
  const templateFn = templates[params.template] || templates.basic;
  return templateFn(params);
}

export function listTemplates(): string[] {
  return Object.keys(templates);
}
