import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
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
  const rawPrice = Number(p.price) || 0;
  const stockKg = typeof p.stock === "number" ? p.stock : 0;
  const rasioKonversi = Number(p.rasioKonversi) || 2.5;
  const statusStr = String(p.status || "Tersedia").toLowerCase().trim();
  const isAvailable = statusStr !== "habis" && stockKg > 0 && p.is_active !== false;

  let availability = "Tersedia";
  if (!isAvailable) {
    availability = "Stok Habis";
  } else if (statusStr === "menipis" || stockKg <= 20) {
    availability = `Stok Menipis (${stockKg} kg)`;
  } else {
    availability = `Tersedia (${stockKg} kg)`;
  }

  const primaryImage = p.image || "/images/mockup-jersey.jpg";
  const galleryImages = Array.isArray(p.images) && p.images.length > 0
    ? p.images
    : [primaryImage];

  const title = p.title || "Bahan Jersey FCSV";
  const desc =
    p.description ||
    p.short_description ||
    "Bahan kain jersey pilihan konveksi FCSV Apparel. Memiliki serat sirkulasi udara mikro yang sejuk, daya serap keringat tinggi, dan nyaman digunakan untuk seragam olahraga.";

  const estimatedShortSleevePcs = Math.floor(stockKg * (rasioKonversi / 0.8333));
  const estimatedLongSleevePcs = Math.floor(stockKg * (rasioKonversi / 1.25));

  return {
    id: String(p.uuid || p.id),
    title,
    category: p.category || "Jersey",
    categoryId: (p.category || "jersey").toLowerCase().replace(/\s+/g, "-"),
    price: formatRupiah(rawPrice),
    rawPrice,
    rating: 0,
    reviewsCount: 0,
    availability,
    isAvailable,
    brand: p.brand || "FCSV Authentic",
    sku: p.sku || `BAHAN-${String(p.uuid || p.id).slice(0, 8).toUpperCase()}`,
    description: desc,
    shortDescription: p.short_description || desc,
    stockKg,
    rasioKonversi,
    estimatedShortSleevePcs,
    estimatedLongSleevePcs,
    features: [
      "Serat mikro berpori lembut dengan sirkulasi udara optimal",
      "Cepat kering (Quick Dry) dan menyerap keringat dengan baik",
      "Elastisitas terjaga, tahan tarikan, dan tidak mudah kusut",
      "Mendukung sablon Sublimasi Full Print warna tajam & Polyflex DTF",
      "Standar produksi konveksi apparel olahraga FCSV",
    ],
    images: galleryImages,
    colors: DEFAULT_COLORS,
    sizes: DEFAULT_SIZES,
    specs: {
      "Nama Bahan": title,
      "Kategori": p.category || "Jersey",
      "Status Ketersediaan": availability,
      "Stok Gudang": `${stockKg} kg (~${(stockKg * rasioKonversi).toFixed(1)} meter)`,
      "Rasio Konversi": `${rasioKonversi} meter / kg`,
      "Estimasi Produksi Lengan Pendek (S-2XL)": `${estimatedShortSleevePcs} pcs`,
      "Estimasi Produksi Lengan Panjang (S-2XL)": `${estimatedLongSleevePcs} pcs`,
    },
    additionalInfo: {
      weight: `${stockKg} kg (Gudang FCSV)`,
      dimensions: `Rasio konversi ${rasioKonversi} meter per kg`,
      colorOptions: "Dapat dicustom warna dan desain sublimasi sesuai permintaan tim",
      warranty: "Garansi retur bila terdapat cacat kain atau cacat produksi sablon",
      modelNumber: p.sku || `BAHAN-${p.id}`,
    },
    shippingWarranty: {
      courier: "J&T Cargo, SiCepat, JNE, Ekspedisi Kargo",
      deliveryTime: "Pengiriman ke seluruh wilayah Indonesia",
      guarantee: "Bahan Resmi Standar FCSV Apparel",
    },
  };
}

export function useProductDetail(customId?: string | number) {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const targetId = customId !== undefined ? String(customId) : (routeId || "");

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
      if (!targetId) {
        setProduct(null);
        setError("ID produk tidak valid.");
        return;
      }
      const found = await productApi.getById(targetId);
      if (found) {
        if (customId === undefined && found.uuid && routeId !== found.uuid) {
          navigate(`/product/${found.uuid}`, { replace: true });
        }
        const detail = buildDetailFromApiProduct(found);
        setProduct(detail);
        setSelectedImage(detail.images[0] || "");
      } else {
        setProduct(null);
        setError("Produk tidak ditemukan atau belum dibuat oleh admin.");
      }
    } catch (err: any) {
      console.error("Gagal memuat detail produk:", err);
      setProduct(null);
      setError(err?.message || "Gagal memuat detail produk dari server.");
    } finally {
      setLoading(false);
    }
  }, [targetId, customId, routeId, navigate]);

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
