import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProductDetailUrl(product?: { id?: string | number; sku?: string; rawProduct?: { sku?: string; id?: string | number } } | null): string {
  if (!product) return "/product/1";
  const sku = product.sku || product.rawProduct?.sku;
  const id = product.id || product.rawProduct?.id;
  const code = (sku && sku.trim() !== "") ? sku.trim() : id;
  return `/product/${encodeURIComponent(String(code || "1"))}`;
}

