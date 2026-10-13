import { client, UPLOADS_URL } from "./client";
import type { ProductItem } from "~/types/product";

function getJerseyImageByName(nama: string = "", index: number = 0): string {
  const lower = nama.toLowerCase();
  if (lower.includes("dri-fit") || lower.includes("drifit")) {
    return "/images/jersey_hero.png";
  }
  if (lower.includes("mesh") || lower.includes("basket")) {
    return "/images/desain-jersey-2.jpg";
  }
  if (lower.includes("poly") || lower.includes("cool")) {
    return "/images/desain-jersey.jpg";
  }
  if (lower.includes("twist")) {
    return "/images/contoh-mockup-desain.png";
  }
  if (lower.includes("serena") || lower.includes("paragon")) {
    return "/images/mockup-jersey.jpg";
  }
  const jerseyCycle = [
    "/images/jersey_hero.png",
    "/images/desain-jersey-2.jpg",
    "/images/desain-jersey.jpg",
    "/images/contoh-mockup-desain.png",
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

export function formatBahanToProduct(bahan: any, index: number = 0): ProductItem {
  const rawPrice = Number(bahan.harga) || 0;
  const image = bahan.imageUrl
    ? (bahan.imageUrl.startsWith("http") ? bahan.imageUrl : `${UPLOADS_URL}${bahan.imageUrl}`)
    : getJerseyImageByName(bahan.nama, index);

  const displayTitle = bahan.nama ? bahan.nama.trim() : "Bahan Baju";

  return {
    id: bahan.id,
    sku: `BAHAN-${bahan.id}`,
    title: displayTitle,
    category: getCategoryByName(bahan.nama),
    price: rawPrice,
    discount_price: undefined,
    stock: Number(bahan.kuantitasKg) || 0,
    brand: "FCSV Authentic",
    is_featured: true,
    is_active: bahan.status !== "Habis",
    is_best_deal: false,
    image,
    short_description: bahan.deskripsi || "",
    description: bahan.deskripsi || "",
  };
}

export const productApi = {
  async getAll(params?: { category?: string; q?: string; featured?: boolean; active?: boolean }) {
    try {
      const res = await client.get<{ status: string; data: any[] }>("/bahan-baju");
      if (res.data && res.data.status === "success" && Array.isArray(res.data.data)) {
        const mapped: ProductItem[] = res.data.data.map((bahan, idx) => formatBahanToProduct(bahan, idx));
        return {
          total: mapped.length,
          data: mapped,
        };
      }
    } catch (err) {
      console.error("Gagal mengambil bahan-baju dari backend:", err);
    }

    return {
      total: 0,
      data: [],
    };
  },

  async getById(id: string | number): Promise<ProductItem | null> {
    const all = await this.getAll();
    const found = all.data.find((p) => String(p.id) === String(id) || p.sku === id);
    return found || null;
  },
};

