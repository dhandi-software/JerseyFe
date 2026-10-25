import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProductDetailUrl(product?: { id?: string | number; sku?: string; rawProduct?: { sku?: string; id?: string | number } } | null): string {
  if (!product) return "/product/1";
  const id = product.id ?? product.rawProduct?.id;
  return `/product/${encodeURIComponent(String(id || "1"))}`;
}

export function parseNumericPrice(price: number | string | undefined | null): number {
  if (typeof price === "number") return isNaN(price) ? 0 : price;
  if (!price) return 0;
  const cleaned = String(price).replace(/[^0-9]/g, "");
  return Number(cleaned) || 0;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

