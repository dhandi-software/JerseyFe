import { Link, useNavigate } from "react-router";
import {
  Home,
  ChevronRight,
  Heart,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
  Shirt,
  Package,
  Layers,
  Ruler,
} from "lucide-react";
import { useWishlist } from "~/hooks/useWishlist";
import { useProductDetail } from "~/hooks/useProductDetail";
import { ProductDetailInfoTabs } from "../components/ProductDetailInfoTabs";
import { ProductRelatedWidgetSection } from "../components/ProductRelatedWidgetSection";
import { cn } from "~/lib/utils";

export function ProductDetailMobile() {
  const navigate = useNavigate();
  const { addToWishlist, isInWishlist } = useWishlist();
  const {
    product,
    loading,
    error,
    selectedImage,
    setSelectedImage,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    activeTab,
    setActiveTab,
  } = useProductDetail();

  if (loading) {
    return (
      <div className="min-h-screen py-4 px-3 space-y-4 animate-pulse">
        <div className="h-8 bg-zinc-200/70 rounded-xl w-48" />
        <div className="bg-white rounded-2xl p-4 border border-zinc-200 space-y-4">
          <div className="aspect-4/3 bg-zinc-100 rounded-xl" />
          <div className="h-6 bg-zinc-100 rounded w-1/2" />
          <div className="h-8 bg-zinc-100 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#B83B14] mb-3">
          <Package className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-extrabold text-zinc-900">
          Produk Tidak Ditemukan
        </h2>
        <p className="text-xs text-zinc-600 max-w-xs mt-1 mb-5">
          {error ||
            "Produk yang Anda cari tidak tersedia atau belum ditambahkan oleh admin."}
        </p>
        <Link
          to="/category"
          className="min-h-[44px] inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke List Category</span>
        </Link>
      </div>
    );
  }

  const handleToggleWishlist = () => {
    addToWishlist({
      id: product.id,
      name: product.title,
      price: product.rawPrice,
      originalPrice: product.rawOriginalPrice,
      image: selectedImage || product.images[0],
      stockStatus: product.isAvailable ? "IN STOCK" : "OUT OF STOCK",
      category: product.category,
    });
  };

  const isLiked = isInWishlist(product.id);
  const stockKg = product.stockKg ?? 0;
  const rasio = product.rasioKonversi ?? 2.5;

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-4 px-3 pb-28 font-sans">
      <div className="space-y-4">
        {/* Mobile Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="bg-white py-2.5 px-3.5 rounded-xl border border-zinc-200 shadow-2xs flex items-center gap-1.5 text-xs font-medium text-zinc-600 overflow-x-auto no-scrollbar"
        >
          <Link
            to="/"
            className="flex items-center gap-1 text-zinc-700 hover:text-[#B83B14] shrink-0 font-semibold"
          >
            <Home className="size-3.5 text-zinc-600 shrink-0" />
            <span>Beranda</span>
          </Link>

          <ChevronRight className="size-3.5 text-zinc-500 shrink-0" />

          <Link
            to="/category"
            className="text-zinc-700 hover:text-[#B83B14] shrink-0 font-semibold"
          >
            List Category
          </Link>

          <ChevronRight className="size-3.5 text-zinc-500 shrink-0" />

          <span className="font-bold text-[#B83B14] truncate max-w-[140px] shrink-0">
            {product.title}
          </span>
        </nav>

        {/* Mobile Product Card */}
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs space-y-4">
          {/* Main Image Container */}
          <div className="aspect-4/3 w-full rounded-xl border border-zinc-200 bg-zinc-50 relative overflow-hidden flex items-center justify-center p-4">
            <img
              src={selectedImage || product.images[0]}
              alt={product.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/mockup-jersey.jpg";
              }}
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {product.images.map((imgUrl, idx) => {
                const isSelected =
                  (selectedImage || product.images[0]) === imgUrl;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    className={cn(
                      "size-14 rounded-lg border-2 overflow-hidden flex items-center justify-center p-0.5 bg-zinc-50 shrink-0 cursor-pointer",
                      isSelected
                        ? "border-[#B83B14] ring-2 ring-orange-500/20"
                        : "border-zinc-200",
                    )}
                    aria-label={`Foto ${idx + 1}`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.title} thumb ${idx + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 rounded-lg bg-orange-50 px-2.5 py-1 text-[11px] font-extrabold text-[#B83B14] border border-orange-200 uppercase">
              <Layers className="size-3" />
              <span>{product.category}</span>
            </span>

            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold border",
                product.isAvailable
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-red-50 text-red-800 border-red-200",
              )}
            >
              <Check className="size-3" />
              <span>{product.availability}</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-xl font-black text-zinc-900 leading-snug uppercase tracking-tight">
            {product.title}
          </h1>

          {/* SKU & Category */}
          <div className="flex items-center gap-2 text-xs text-zinc-600 pb-2 border-b border-zinc-200">
            <span>
              Kode: <strong className="text-zinc-900">{product.sku}</strong>
            </span>
            <span>•</span>
            <span>
              Brand: <strong className="text-[#B83B14]">{product.brand}</strong>
            </span>
          </div>

          {/* Description Snippet */}
          <p className="text-xs text-zinc-700 leading-relaxed">
            {product.description}
          </p>

          {/* Admin Stock Summary */}
          <div className="grid grid-cols-1 gap-2.5 bg-zinc-50 p-3.5 rounded-xl border border-zinc-200">
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4 text-[#B83B14] shrink-0" />
              <div className="text-xs">
                <span className="text-zinc-600 font-semibold">Stok Kain: </span>
                <strong className="text-zinc-900">
                  {stockKg} kg (~{(stockKg * rasio).toFixed(1)} meter)
                </strong>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Ruler className="w-4 h-4 text-[#B83B14] shrink-0" />
              <div className="text-xs">
                <span className="text-zinc-600 font-semibold">
                  Kapasitas Produksi:{" "}
                </span>
                <strong className="text-zinc-900">
                  Pendek {product.estimatedShortSleevePcs ?? 0} pcs / Panjang{" "}
                  {product.estimatedLongSleevePcs ?? 0} pcs
                </strong>
              </div>
            </div>
          </div>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-800 block">
                Referensi Warna:{" "}
                <span className="text-[#B83B14]">
                  {product.colors.find((c) => c.id === selectedColor)?.name}
                </span>
              </label>
              <div className="flex items-center gap-2.5">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColor(color.id)}
                      className={cn(
                        "size-10 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer",
                        isSelected
                          ? "border-[#B83B14] ring-2 ring-orange-500/30 scale-105"
                          : "border-zinc-300",
                      )}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                    >
                      {isSelected && (
                        <Check
                          className={cn(
                            "size-4",
                            color.hex === "#FFFFFF" || color.hex === "#F9FAFB"
                              ? "text-zinc-900"
                              : "text-white",
                          )}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-800 block">
                Ukuran Tersedia:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "min-w-[44px] min-h-[44px] px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center",
                        isSelected
                          ? "bg-orange-50 border-[#B83B14] text-[#B83B14] font-black"
                          : "bg-white border-zinc-300 text-zinc-800",
                      )}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Guarantees */}
          <div className="pt-3 border-t border-zinc-200 grid grid-cols-3 gap-2 text-zinc-700 text-center">
            <div className="flex flex-col items-center gap-1 text-[11px] font-semibold">
              <Truck className="size-4 text-[#B83B14]" />
              <span>Kirim Cepat</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-[11px] font-semibold">
              <ShieldCheck className="size-4 text-[#B83B14]" />
              <span>Bahan Resmi</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-[11px] font-semibold">
              <RotateCcw className="size-4 text-[#B83B14]" />
              <span>Garansi Mutu</span>
            </div>
          </div>

          {/* Tabs */}
          <ProductDetailInfoTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            product={product}
          />
        </div>

        {/* Related Products */}
        <ProductRelatedWidgetSection
          currentProductId={product.id}
          currentCategory={product.category}
        />
      </div>

      {/* Sticky Bottom Bar for Mobile */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-zinc-200 p-3 z-40 shadow-lg flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleWishlist}
          title={isLiked ? "Hapus dari Favorit" : "Simpan ke Favorit"}
          aria-label={isLiked ? "Hapus dari Favorit" : "Simpan ke Favorit"}
          className={cn(
            "w-12 h-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95",
            isLiked
              ? "bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-200"
              : "border-zinc-300 text-zinc-700 hover:bg-rose-50 hover:text-rose-600",
          )}
        >
          <Heart
            className={cn("size-5", isLiked && "fill-current text-rose-600")}
          />
        </button>

        <Link
          to="/category"
          className="min-h-[48px] px-4 rounded-xl border border-zinc-300 bg-white text-zinc-900 font-bold text-xs flex items-center justify-center gap-1.5 shrink-0"
        >
          <ArrowLeft className="size-4" />
          <span>Katalog</span>
        </Link>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/customer/custom-jersey/detail/${product.id}?size=${encodeURIComponent(selectedSize)}&sleeve=${encodeURIComponent(selectedSleeve)}`,
            )
          }
          className="flex-1 min-h-[48px] px-4 bg-[#B83B14] hover:bg-zinc-900 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
        >
          <Shirt className="size-4" />
          <span>Pesan Custom</span>
        </button>
      </div>
    </div>
  );
}
