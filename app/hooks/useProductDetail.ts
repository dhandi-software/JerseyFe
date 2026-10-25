import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import { productApi } from "~/api/productApi";
import type { ProductDetailData, ProductDetailTabType } from "~/types/productDetail";
import { formatRupiah } from "~/lib/utils";

const DEFAULT_COLORS = [
  { id: "black", name: "Hitam Solid", hex: "#111827" },
  { id: "white", name: "Putih Bersih", hex: "#F9FAFB" },
  { id: "navy", name: "Biru Navy", hex: "#1E3A8A" },
  { id: "red", name: "Merah Crimson", hex: "#DC2626" },
  { id: "emerald", name: "Hijau Emerald", hex: "#059669" },
];

const DEFAULT_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

function buildDetailFromApiProduct(p: any): ProductDetailData {
  const rawPrice = Number(p.price) || 150000;
  const isDiscount = Boolean(p.discount_price && p.discount_price > 0 && p.discount_price < p.price);
  const finalPrice = isDiscount && p.discount_price ? p.discount_price : rawPrice;
  const origPrice = isDiscount ? rawPrice : undefined;

  const stockKg = typeof p.stock === "number" ? p.stock : 50;
  let availability = "Tersedia (Siap Produksi)";
  if (stockKg <= 0 || p.is_active === false) {
    availability = "Stok Habis";
  } else if (stockKg <= 20) {
    availability = `Stok Menipis (${stockKg} kg)`;
  } else {
    availability = `Stok Aman (${stockKg} kg)`;
  }

  const primaryImage = p.image || "/images/jersey_hero.webp";
  const galleryImages = [
    primaryImage,
    "/images/desain-jersey.webp",
    "/images/desain-jersey-2.webp",
    "/images/contoh-mockup-desain.webp",
  ].filter((img, idx, arr) => arr.indexOf(img) === idx);

  const title = p.title || "Kain Jersey Custom FCSV";
  const desc = p.description || p.short_description || 
    "Kain bahan jersey premium pilihan konveksi FCSV. Memiliki serat sirkulasi udara mikro yang sejuk, daya serap keringat tinggi, dan sangat nyaman digunakan untuk seragam sepak bola, futsal, running, dan e-sport.";

  return {
    id: String(p.id),
    title,
    category: p.category || "Bahan Baju",
    categoryId: (p.category || "bahan-baju").toLowerCase().replace(/\s+/g, "-"),
    price: formatRupiah(finalPrice),
    originalPrice: origPrice ? formatRupiah(origPrice) : undefined,
    rawPrice: finalPrice,
    rawOriginalPrice: origPrice,
    discountBadge: isDiscount ? "PROMO KHUSUS" : undefined,
    rating: 4.9,
    reviewsCount: 42,
    availability,
    brand: p.brand || "FCSV Authentic",
    sku: p.sku || `FCSV-${p.id}`,
    description: desc,
    shortDescription: p.short_description || desc,
    stockKg,
    features: [
      "Serat mikro berpori lembut dengan sirkulasi udara optimal",
      "Cepat kering (Quick Dry) dan menyerap keringat tanpa rasa lengket",
      "Elastisitas tinggi, tahan tarikan, dan tidak mudah kusut",
      "Optimal untuk sablon Sublimasi Full Print warna tajam & Polyflex DTF",
      "Kualitas grade industri apparel jersey profesional",
    ],
    images: galleryImages,
    colors: DEFAULT_COLORS,
    sizes: DEFAULT_SIZES,
    specs: {
      "Tipe Bahan": title,
      "Kategori": p.category || "Bahan Jersey Olahraga",
      "Stok Bahan": `${stockKg} kg`,
      "Teknologi Kain": "Moisture Wicking & Quick Dry",
      "Rekomendasi Pemakaian": "Sepak Bola, Futsal, Basket, Badminton, E-Sport",
      "Sertifikasi Mutu": "Standar Konveksi Garment FCSV Sportswear",
    },
    additionalInfo: {
      weight: `${stockKg} kg (Gudang FCSV)`,
      dimensions: "Lebar setting kain 180 cm",
      colorOptions: "Dapat dicustom warna dan sublimasi sesuai permintaan",
      warranty: "Garansi retur bila cacat kain atau cacat produksi sablon",
      modelNumber: p.sku || `FCSV-PROD-${p.id}`,
    },
    shippingWarranty: {
      courier: "J&T Cargo, SiCepat, JNE, Ekspedisi Truk (Partai Besar)",
      deliveryTime: "Pengiriman cepat 1-3 hari kerja ke seluruh Indonesia",
      guarantee: "100% Produk Bahan Resmi FCSV Apparel",
    },
  };
}

export function useProductDetail(customId?: string | number) {
  const { id: routeId } = useParams();
  const targetId = customId !== undefined ? String(customId) : (routeId || "1");

  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("black");
  const [selectedSize, setSelectedSize] = useState<string>("L");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<ProductDetailTabType>("description");

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const found = await productApi.getById(targetId);
      if (found) {
        const detail = buildDetailFromApiProduct(found);
        setProduct(detail);
        setSelectedImage(detail.images[0] || "");
      } else {
        // Fallback to first available if not found
        const allRes = await productApi.getAll();
        const first = allRes?.data?.[0];
        if (first) {
          const detail = buildDetailFromApiProduct(first);
          setProduct(detail);
          setSelectedImage(detail.images[0] || "");
        } else {
          setError("Produk tidak ditemukan");
        }
      }
    } catch (err: any) {
      console.error("Gagal memuat detail produk:", err);
      setError(err?.message || "Gagal memuat detail produk");
    } finally {
      setLoading(false);
    }
  }, [targetId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleIncrement = () => {
    setQuantity((q) => q + 1);
  };

  const handleDecrement = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  return {
    product,
    loading,
    error,
    selectedImage,
    setSelectedImage,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    quantity,
    setQuantity,
    handleIncrement,
    handleDecrement,
    activeTab,
    setActiveTab,
    refetch: fetchDetail,
  };
}
