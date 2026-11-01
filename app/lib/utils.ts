import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateBahanUuid(
  id: number | string,
  existingUuid?: string | null
): string {
  if (existingUuid && typeof existingUuid === "string" && existingUuid.length >= 8) {
    return existingUuid;
  }
  const str = `fcsv-bahan-baju-v1-${id}`;
  const hash32 = (seed: number) => {
    let h = seed >>> 0;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 0x5bd1e995);
      h = (h ^ (h >>> 13)) >>> 0;
    }
    h = Math.imul(h ^ (h >>> 15), 0x27d4eb2d);
    return (h ^ (h >>> 15)) >>> 0;
  };
  const p1 = hash32(0x9747b28c).toString(16).padStart(8, "0");
  const p2 = hash32(0x85ebca6b).toString(16).padStart(8, "0");
  const p3 = hash32(0xc2b2ae35).toString(16).padStart(8, "0");
  const p4 = hash32(0x27d4eb2f).toString(16).padStart(8, "0");

  const timeLow = p1;
  const timeMid = p2.slice(0, 4);
  const timeHiAndVersion = "4" + p2.slice(5, 8);
  const variantNibble = ((parseInt(p3[0], 16) & 0x3) | 0x8).toString(16);
  const clockSeq = variantNibble + p3.slice(1, 4);
  const node = p3.slice(4, 8) + p4;
  return `${timeLow}-${timeMid}-${timeHiAndVersion}-${clockSeq}-${node}`;
}

export function getProductDetailUrl(
  product?: {
    id?: string | number;
    uuid?: string;
    sku?: string;
    rawProduct?: { sku?: string; id?: string | number; uuid?: string };
  } | null
): string {
  if (!product) return "/product/1";
  const rawUuid = product.uuid ?? product.rawProduct?.uuid;
  if (rawUuid) return `/product/${encodeURIComponent(rawUuid)}`;
  const id = product.id ?? product.rawProduct?.id;
  if (id !== undefined && id !== null && /^\d+$/.test(String(id))) {
    return `/product/${encodeURIComponent(generateBahanUuid(id))}`;
  }
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

export function convertImageToWebP(
  file: File,
  quality = 0.8,
  maxDimension = 1600
): Promise<File> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => resolve(file);
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => resolve(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const baseName = file.name.replace(/\.[^/.]+$/, "");
              resolve(
                new File([blob], `${baseName}.webp`, {
                  type: "image/webp",
                  lastModified: Date.now(),
                })
              );
            } else {
              resolve(file);
            }
          },
          "image/webp",
          quality
        );
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
