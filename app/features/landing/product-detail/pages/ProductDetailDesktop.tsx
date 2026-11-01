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

export function ProductDetailDesktop() {
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
      <div className="min-h-screen py-10 px-4 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-zinc-200/70 rounded-xl w-72" />
        <div className="bg-white rounded-3xl p-8 border border-zinc-200 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-4/3 bg-zinc-100 rounded-2xl" />
          </div>
          <div className="lg:col-span-6 space-y-6">
            <div className="h-6 bg-zinc-100 rounded w-1/3" />
            <div className="h-10 bg-zinc-100 rounded w-3/4" />
            <div className="h-24 bg-zinc-100 rounded" />
            <div className="h-12 bg-zinc-100 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#B83B14] mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-zinc-900">
          Produk Tidak Ditemukan
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 max-w-md mt-1.5 mb-6">
          {error ||
            "Produk yang Anda cari tidak tersedia atau belum ditambahkan oleh admin FCSV."}
        </p>
        <div className="flex items-center gap-3">
          <Link
            to="/category"
            className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke List Category</span>
          </Link>
          <Link
            to="/"
            className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-800 text-xs font-bold hover:bg-zinc-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
          >
            <Home className="w-4 h-4" />
            <span>Beranda</span>
          </Link>
        </div>
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
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="bg-white py-3 px-5 rounded-2xl border border-zinc-200 shadow-2xs flex items-center justify-between gap-4 flex-wrap text-xs font-medium text-zinc-600"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-zinc-700 hover:text-[#B83B14] transition-colors font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B83B14] rounded"
            >
              <Home className="size-3.5 text-zinc-600" />
              <span>Beranda</span>
            </Link>

            <ChevronRight className="size-3.5 text-zinc-500" />

            <Link
              to="/category"
              className="text-zinc-700 hover:text-[#B83B14] transition-colors font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B83B14] rounded"
            >
              List Category
            </Link>

            <ChevronRight className="size-3.5 text-zinc-500" />

            <span className="font-bold text-[#B83B14] truncate max-w-md">
              {product.title}
            </span>
          </div>

          <Link
            to="/category"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-800 hover:text-[#B83B14] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B83B14] rounded"
          >
            <ArrowLeft className="size-3.5" />
            <span>Kembali ke Katalog</span>
          </Link>
        </nav>

        {/* Main Product Card */}
        <div className="bg-white p-6 lg:p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Product Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="aspect-4/3 w-full rounded-2xl border border-zinc-200 bg-zinc-50 relative overflow-hidden flex items-center justify-center p-6 group">
                <img
                  src={selectedImage || product.images[0]}
                  alt={product.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/mockup-jersey.jpg";
                  }}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105 rounded-xl"
                />
              </div>

              {/* Thumbnails List */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {product.images.map((imgUrl, idx) => {
                    const isSelected =
                      (selectedImage || product.images[0]) === imgUrl;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(imgUrl)}
                        className={cn(
                          "size-20 rounded-xl border-2 overflow-hidden flex items-center justify-center p-1 bg-zinc-50 transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B83B14]",
                          isSelected
                            ? "border-[#B83B14] ring-2 ring-orange-500/20"
                            : "border-zinc-200 hover:border-zinc-300",
                        )}
                        aria-label={`Pilih foto ${idx + 1}`}
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
            </div>

            {/* Right Column: Product Info & Actions */}
            <div className="lg:col-span-6 space-y-5">
              {/* Meta Top Info */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-orange-50 px-3 py-1 text-xs font-extrabold text-[#B83B14] border border-orange-200 uppercase tracking-wider">
                  <Layers className="size-3.5" />
                  <span>{product.category}</span>
                </span>

                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border",
                    product.isAvailable
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-red-50 text-red-800 border-red-200",
                  )}
                >
                  <Check className="size-3.5" />
                  <span>{product.availability}</span>
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 leading-tight uppercase tracking-tight">
                {product.title}
              </h1>

              {/* SKU & Brand */}
              <div className="flex items-center gap-4 text-xs text-zinc-600 flex-wrap pb-3 border-b border-zinc-200">
                <span>
                  Kode Bahan:{" "}
                  <strong className="text-zinc-900">{product.sku}</strong>
                </span>
                <span>•</span>
                <span>
                  Produsen:{" "}
                  <strong className="text-[#B83B14]">{product.brand}</strong>
                </span>
                <span>•</span>
                <span>
                  Kategori:{" "}
                  <strong className="text-zinc-900">{product.category}</strong>
                </span>
              </div>

              {/* Description Snippet */}
              <div className="space-y-1.5">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-800">
                  Deskripsi Bahan
                </h2>
                <p className="text-sm text-zinc-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Admin Stock & Production Capacity Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-[#B83B14] shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wide block">
                      Ketersediaan Stok Kain
                    </span>
                    <span className="text-sm font-extrabold text-zinc-900">
                      {stockKg} kg (~{(stockKg * rasio).toFixed(1)} meter)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-[#B83B14] shrink-0">
                    <Ruler className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wide block">
                      Estimasi Kapasitas Produksi
                    </span>
                    <span className="text-sm font-extrabold text-zinc-900">
                      Pendek: {product.estimatedShortSleevePcs ?? 0} pcs / Panjang:{" "}
                      {product.estimatedLongSleevePcs ?? 0} pcs
                    </span>
                  </div>
                </div>
              </div>

              {/* Color Options */}
              {product.colors.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-800 block">
                    Referensi Warna Dasar:{" "}
                    <span className="text-[#B83B14]">
                      {product.colors.find((c) => c.id === selectedColor)?.name}
                    </span>
                  </label>
                  <div className="flex items-center gap-3">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor === color.id;
                      return (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => setSelectedColor(color.id)}
                          title={color.name}
                          aria-label={`Pilih warna ${color.name}`}
                          className={cn(
                            "size-9 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B83B14]",
                            isSelected
                              ? "border-[#B83B14] ring-2 ring-orange-500/30 scale-110"
                              : "border-zinc-300 hover:scale-105",
                          )}
                          style={{ backgroundColor: color.hex }}
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

              {/* Size Options */}
              {product.sizes.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-800 block">
                    Ukuran Tersedia untuk Produksi:
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
                            "min-w-[44px] min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B83B14]",
                            isSelected
                              ? "bg-orange-50 border-[#B83B14] text-[#B83B14] shadow-2xs font-black"
                              : "bg-white border-zinc-300 text-zinc-800 hover:border-zinc-400",
                          )}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions Row */}
              <div className="pt-2 flex items-center gap-3 flex-wrap sm:flex-nowrap">
                {/* Custom Jersey Direct Action */}
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/customer/custom-jersey/detail/${product.id}?size=${encodeURIComponent(selectedSize)}&sleeve=${encodeURIComponent(selectedSleeve)}`,
                    )
                  }
                  className="flex-1 min-h-[48px] px-6 bg-[#B83B14] hover:bg-zinc-900 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B83B14]"
                >
                  <Shirt className="size-4" />
                  <span>Pesan Custom Jersey Ini</span>
                </button>

                {/* Back to List Category */}
                <Link
                  to="/category"
                  className="min-h-[48px] px-5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                >
                  <ArrowLeft className="size-4" />
                  <span>List Category</span>
                </Link>

                {/* Wishlist Like Button */}
                <button
                  type="button"
                  title={isLiked ? "Hapus dari Favorit" : "Simpan ke Favorit"}
                  aria-label={
                    isLiked ? "Hapus dari Favorit" : "Simpan ke Favorit"
                  }
                  onClick={handleToggleWishlist}
                  className={cn(
                    "size-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600",
                    isLiked
                      ? "bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-200"
                      : "border-zinc-300 text-zinc-700 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50",
                  )}
                >
                  <Heart
                    className={cn(
                      "size-5",
                      isLiked && "fill-current text-rose-600",
                    )}
                  />
                </button>
              </div>

              {/* Guarantees Perks */}
              <div className="pt-4 border-t border-zinc-200 grid grid-cols-3 gap-3 text-zinc-700">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <Truck className="size-4 text-[#B83B14] shrink-0" />
                  <span>Pengiriman Seluruh Indonesia</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <ShieldCheck className="size-4 text-[#B83B14] shrink-0" />
                  <span>Bahan Resmi FCSV</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <RotateCcw className="size-4 text-[#B83B14] shrink-0" />
                  <span>Garansi Retur Cacat</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information Tabbed Section */}
          <ProductDetailInfoTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            product={product}
          />
        </div>

        {/* Related Products Section */}
        <ProductRelatedWidgetSection
          currentProductId={product.id}
          currentCategory={product.category}
        />
      </div>
    </div>
  );
}
