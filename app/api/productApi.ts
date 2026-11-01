import { client, UPLOADS_URL } from "./client";
import { generateBahanUuid } from "~/lib/utils";
import type { ProductItem } from "~/types/product";

function getJerseyImageByName(nama: string = "", index: number = 0): string {
  const lower = nama.toLowerCase();
  if (lower.includes("dri-fit") || lower.includes("drifit")) {
    return "/images/jersey_hero.webp";
  }
  if (lower.includes("mesh") || lower.includes("basket")) {
    return "/images/desain-jersey-2.webp";
  }
  if (lower.includes("poly") || lower.includes("cool")) {
    return "/images/desain-jersey.webp";
  }
  if (lower.includes("twist")) {
    return "/images/contoh-mockup-desain.webp";
  }
  if (lower.includes("serena") || lower.includes("paragon")) {
    return "/images/mockup-jersey.webp";
  }
  const jerseyCycle = [
    "/images/jersey_hero.webp",
    "/images/desain-jersey-2.webp",
    "/images/desain-jersey.webp",
    "/images/contoh-mockup-desain.webp",
  ];
  return jerseyCycle[index % jerseyCycle.length];
}

function getCategoryByName(nama: string = ""): string {
  const lower = nama.toLowerCase();
  if (lower.includes("dri-fit") || lower.includes("drifit")) {
    return "Jersey Dri-Fit & Futsal";
  }
  if (lower.includes("mesh") || lower.includes("basket")) {
    return "Jersey Basket & Running";
  }
  if (lower.includes("poly") || lower.includes("cool")) {
    return "Jersey Sepak Bola Pro";
  }
  if (lower.includes("twist")) {
    return "Jersey Setelan Sublimasi";
  }
  return "Koleksi Jersey Custom";
}

export function isSeededDummyBahan(_bahan: any): boolean {
  return false;
}

export function formatBahanToProduct(bahan: any, index: number = 0): ProductItem {
  const rawPrice = Number(bahan.harga) || 0;
  const image = bahan.imageUrl
    ? (bahan.imageUrl.startsWith("http") ? bahan.imageUrl : `${UPLOADS_URL}${bahan.imageUrl}`)
    : getJerseyImageByName(bahan.nama, index);

  const displayTitle = bahan.nama ? bahan.nama.trim() : "Bahan Baju";
  const uuid = generateBahanUuid(bahan.id, bahan.uuid);

  return {
    id: bahan.id,
    uuid,
    sku: `BAHAN-${uuid.slice(0, 8).toUpperCase()}`,
    title: displayTitle,
    category: getCategoryByName(bahan.nama),
    price: rawPrice,
    discount_price: undefined,
    stock: Number(bahan.kuantitasKg) || 0,
    rasioKonversi: Number(bahan.rasioKonversi) || 2.5,
    status: bahan.status || "Tersedia",
    brand: "FCSV Authentic",
    is_featured: true,
    is_active: bahan.status !== "Habis" && Number(bahan.kuantitasKg) > 0,
    is_best_deal: false,
    image,
    short_description: bahan.deskripsi || "",
    description: bahan.deskripsi || "",
    createdAt: bahan.createdAt,
  };
}

export const FALLBACK_PRODUCTS: ProductItem[] = [];

export const productApi = {
  async getAll(params?: { category?: string; q?: string; featured?: boolean; active?: boolean }) {
    const res = await client.get<{ status: string; data: any[] }>("/bahan-baju");
    if (res.data && res.data.status === "success" && Array.isArray(res.data.data)) {
      const adminItems = res.data.data.filter((bahan) => !isSeededDummyBahan(bahan));
      const mapped: ProductItem[] = adminItems.map((bahan, idx) => formatBahanToProduct(bahan, idx));
      return {
        total: mapped.length,
        data: mapped,
      };
    }

    return {
      total: 0,
      data: [],
    };
  },

  async getById(id: string | number): Promise<ProductItem | null> {
    const all = await this.getAll();
    const target = String(id).trim();
    const found = all.data.find(
      (p) =>
        p.uuid === target ||
        String(p.id) === target ||
        p.sku === target
    );
    return found || null;
  },
};
