import { client, UPLOADS_URL } from "./client";
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

export const FALLBACK_PRODUCTS: ProductItem[] = [
  {
    id: 1,
    sku: "BAHAN-1",
    title: "Dryfit Milano Premium",
    category: "Jersey Dri-Fit & Futsal",
    price: 150000,
    stock: 50,
    brand: "FCSV Authentic",
    is_featured: true,
    is_active: true,
    is_best_deal: false,
    image: "/images/Kain-Jersey-Serena.webp",
    short_description: "Kain berserat zig-zag halus, sangat menyerap keringat dan adem untuk jersey olahraga.",
    description: "Kain berserat zig-zag halus, sangat menyerap keringat dan adem untuk jersey olahraga.",
  },
  {
    id: 2,
    sku: "BAHAN-2",
    title: "Dryfit Brazil High Quality",
    category: "Jersey Sepak Bola Pro",
    price: 165000,
    stock: 35,
    brand: "FCSV Authentic",
    is_featured: true,
    is_active: true,
    is_best_deal: false,
    image: "/images/Kain-Jersey-Paragon.webp",
    short_description: "Tekstur bintik rapat, elastis, dan lembut, pilihan terbaik untuk jersey sepak bola & futsal.",
    description: "Tekstur bintik rapat, elastis, dan lembut, pilihan terbaik untuk jersey sepak bola & futsal.",
  },
  {
    id: 3,
    sku: "BAHAN-3",
    title: "Dryfit Mesh Bintik",
    category: "Jersey Basket & Running",
    price: 145000,
    stock: 25,
    brand: "FCSV Authentic",
    is_featured: true,
    is_active: true,
    is_best_deal: false,
    image: "/images/Kain-Jersey-Twist.webp",
    short_description: "Poripori sirkulasi udara optimal, sangat ringan dan cepat kering.",
    description: "Poripori sirkulasi udara optimal, sangat ringan dan cepat kering.",
  },
  {
    id: 4,
    sku: "BAHAN-4",
    title: "Jersey Serena Soft Touch",
    category: "Jersey Setelan Sublimasi",
    price: 135000,
    stock: 40,
    brand: "FCSV Authentic",
    is_featured: true,
    is_active: true,
    is_best_deal: false,
    image: "/images/Kain-Jersey-Spandek-Korea.webp",
    short_description: "Permukaan rata, licin, dan sangat cocok untuk cetak sublimasi warna tajam.",
    description: "Permukaan rata, licin, dan sangat cocok untuk cetak sublimasi warna tajam.",
  },
  {
    id: 5,
    sku: "BAHAN-5",
    title: "Dryfit Waffle Tech",
    category: "Koleksi Jersey Custom",
    price: 155000,
    stock: 20,
    brand: "FCSV Authentic",
    is_featured: true,
    is_active: true,
    is_best_deal: false,
    image: "/images/Kain-Jersey-Crepe.webp",
    short_description: "Pola kotak berongga mikro dengan daya serap maksimal untuk aktivitas intensitas tinggi.",
    description: "Pola kotak berongga mikro dengan daya serap maksimal untuk aktivitas intensitas tinggi.",
  },
  {
    id: 6,
    sku: "BAHAN-6",
    title: "Dryfit Puma Sportswear",
    category: "Jersey Dri-Fit & Futsal",
    price: 140000,
    stock: 30,
    brand: "FCSV Authentic",
    is_featured: true,
    is_active: true,
    is_best_deal: false,
    image: "/images/Kain-Jersey-Rayon.webp",
    short_description: "Kain jersey lentur dengan ketahanan gesekan tinggi untuk seragam tim.",
    description: "Kain jersey lentur dengan ketahanan gesekan tinggi untuk seragam tim.",
  }
];

export const productApi = {
  async getAll(params?: { category?: string; q?: string; featured?: boolean; active?: boolean }) {
    try {
      const res = await client.get<{ status: string; data: any[] }>("/bahan-baju");
      if (res.data && res.data.status === "success" && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const mapped: ProductItem[] = res.data.data.map((bahan, idx) => formatBahanToProduct(bahan, idx));
        return {
          total: mapped.length,
          data: mapped,
        };
      }
    } catch (err) {
      console.warn("Backend bahan-baju tidak terhubung / timeout, menggunakan data katalog default FCSV:", err);
    }

    return {
      total: FALLBACK_PRODUCTS.length,
      data: FALLBACK_PRODUCTS,
    };
  },

  async getById(id: string | number): Promise<ProductItem | null> {
    const all = await this.getAll();
    const found = all.data.find((p) => String(p.id) === String(id) || p.sku === id);
    return found || null;
  },
};

