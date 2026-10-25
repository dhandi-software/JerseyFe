import * as React from "react";
import { Link, useNavigate } from "react-router";
import {
  ShoppingCart,
  Star,
  Home,
  ChevronRight,
  Heart,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  ArrowLeft,
  Shirt,
  Package,
} from "lucide-react";
import { useWishlist } from "~/hooks/useWishlist";
import { useCart } from "~/context/CartContext";
import { useProductDetail } from "~/hooks/useProductDetail";
import { ProductDetailInfoTabs } from "../components/ProductDetailInfoTabs";
import { ProductRelatedWidgetSection } from "../components/ProductRelatedWidgetSection";
import { cn } from "~/lib/utils";

export function ProductDetailMobile() {
  const navigate = useNavigate();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
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
    quantity,
    handleIncrement,
    handleDecrement,
    activeTab,
    setActiveTab,
  } = useProductDetail();

  const [isAdded, setIsAdded] = React.useState(false);

  if (loading) {
    return (
      <div className="min-h-screen py-4 px-3 space-y-4 animate-pulse">
        <div className="h-8 bg-zinc-200/70 rounded-xl w-48" />
        <div className="bg-white rounded-2xl p-4 border border-zinc-200 space-y-4">
          <div className="aspect-4/3 bg-zinc-100 rounded-xl" />
          <div className="h-6 bg-zinc-100 rounded w-1/2" />
          <div className="h-8 bg-zinc-100 rounded w-3/4" />
          <div className="h-6 bg-zinc-100 rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#D25026] mb-3">
          <Package className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-extrabold text-zinc-900">Produk Tidak Ditemukan</h2>
        <p className="text-xs text-zinc-500 max-w-xs mt-1 mb-5">
          {error || "Produk yang Anda cari tidak tersedia atau belum dipublikasikan."}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        title: product.title,
        price: product.rawPrice,
        image: selectedImage || product.images[0],
      },
      quantity
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleToggleWishlist = () => {
    addToWishlist({
      id: product.id,
      name: product.title,
      price: product.rawPrice,
      originalPrice: product.rawOriginalPrice,
      image: selectedImage || product.images[0],
      stockStatus: "IN STOCK",
      category: product.category,
    });
  };

  const isLiked = isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-[url('/images/Background_Mobile.png')] bg-cover bg-top bg-no-repeat bg-fixed py-3 px-3 pb-28 font-sans">
      <div className="space-y-4">
        {/* Mobile Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="bg-white py-2.5 px-3.5 rounded-xl border border-zinc-200 shadow-2xs flex items-center gap-1.5 text-[11px] font-medium text-zinc-600 overflow-x-auto no-scrollbar"
        >
          <Link
            to="/"
            className="flex items-center gap-1 text-zinc-600 hover:text-[#D25026] shrink-0 font-semibold"
          >
            <Home className="size-3 text-zinc-500 shrink-0" />
            <span>Beranda</span>
          </Link>

          <ChevronRight className="size-3 text-zinc-400 shrink-0" />

          <Link
            to="/category"
            className="text-zinc-600 hover:text-[#D25026] shrink-0 font-semibold"
          >
            {product.category}
          </Link>

          <ChevronRight className="size-3 text-zinc-400 shrink-0" />

          <span className="font-bold text-[#D25026] truncate max-w-[130px] shrink-0">
            {product.title}
          </span>
        </nav>

        {/* Mobile Product Card */}
        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs space-y-4">
          {/* Main Image Container */}
          <div className="aspect-4/3 w-full rounded-xl border border-zinc-200 bg-zinc-50 relative overflow-hidden flex items-center justify-center p-4">
            {product.discountBadge && (
              <span className="absolute top-2.5 left-2.5 z-10 rounded-full bg-[#D25026] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs uppercase tracking-wider">
                {product.discountBadge}
              </span>
            )}
            <img
              src={selectedImage || product.images[0]}
              alt={product.title}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {product.images.map((imgUrl, idx) => {
                const isSelected = (selectedImage || product.images[0]) === imgUrl;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    className={cn(
                      "size-14 rounded-lg border-2 overflow-hidden flex items-center justify-center p-0.5 bg-zinc-50 shrink-0 cursor-pointer",
                      isSelected
                        ? "border-[#FA8232] ring-2 ring-orange-500/20"
                        : "border-zinc-200"
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
            <div className="flex items-center gap-1.5 text-xs">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-3.5",
                      i < Math.floor(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-200"
                    )}
                  />
                ))}
              </div>
              <span className="text-[11px] font-bold text-zinc-800">
                {product.rating}
              </span>
              <span className="text-zinc-300">•</span>
              <span className="text-[11px] text-zinc-500">
                ({product.reviewsCount} ulasan)
              </span>
            </div>

            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
              <Check className="size-2.5" />
              {product.availability}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-lg font-extrabold text-zinc-900 leading-snug">
            {product.title}
          </h1>

          {/* SKU & Category */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            <span>Kode: <strong>{product.sku}</strong></span>
            <span>•</span>
            <span>Brand: <strong className="text-[#D25026]">{product.brand}</strong></span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 py-1 border-b border-zinc-100">
            <span className="text-2xl font-black text-[#D25026]">
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm font-semibold text-zinc-400 line-through">
                {product.originalPrice}
              </span>
            )}
          </div>

          {/* Description Snippet */}
          <p className="text-xs text-zinc-600 leading-relaxed">
            {product.description}
          </p>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 block">
                Pilihan Warna:{" "}
                <span className="text-[#D25026]">
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
                        "size-9 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer",
                        isSelected
                          ? "border-[#D25026] ring-2 ring-orange-500/30 scale-105"
                          : "border-zinc-300"
                      )}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                    >
                      {isSelected && (
                        <Check
                          className={cn(
                            "size-3.5",
                            color.hex === "#FFFFFF" || color.hex === "#F9FAFB"
                              ? "text-zinc-900"
                              : "text-white"
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
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 block">
                Ukuran Jersey:
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
                        "min-w-[44px] h-11 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center",
                        isSelected
                          ? "bg-orange-50 border-[#FA8232] text-[#D25026] font-black"
                          : "bg-white border-zinc-200 text-zinc-700"
                      )}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
            <span className="text-xs font-bold text-zinc-800">Jumlah Pesanan:</span>
            <div className="flex items-center border border-zinc-200 rounded-xl bg-zinc-50 p-1">
              <button
                type="button"
                onClick={handleDecrement}
                aria-label="Kurangi jumlah"
                className="w-9 h-9 flex items-center justify-center text-zinc-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-10 text-center font-bold text-xs text-zinc-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                aria-label="Tambah jumlah"
                className="w-9 h-9 flex items-center justify-center text-zinc-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="pt-3 border-t border-zinc-100 grid grid-cols-3 gap-2 text-zinc-600 text-center">
            <div className="flex flex-col items-center gap-1 text-[10px] font-semibold">
              <Truck className="size-4 text-[#D25026]" />
              <span>Kirim Cepat</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-[10px] font-semibold">
              <ShieldCheck className="size-4 text-[#D25026]" />
              <span>100% Asli</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-[10px] font-semibold">
              <RotateCcw className="size-4 text-[#D25026]" />
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
        <ProductRelatedWidgetSection currentProductId={product.id} currentCategory={product.category} />
      </div>

      {/* Sticky Bottom Bar for Mobile - High thumb accessibility */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-zinc-200 p-3 z-40 shadow-lg flex items-center gap-2">
        {/* Wishlist Like Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          title={isLiked ? "Hapus dari Favorit" : "Simpan ke Favorit"}
          aria-label={isLiked ? "Hapus dari Favorit" : "Simpan ke Favorit"}
          className={cn(
            "w-12 h-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95",
            isLiked
              ? "bg-rose-50 text-rose-600 border-rose-300 ring-2 ring-rose-200"
              : "border-zinc-200 text-zinc-600 hover:bg-rose-50 hover:text-rose-500"
          )}
        >
          <Heart className={cn("size-5", isLiked && "fill-current text-rose-600")} />
        </button>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={cn(
            "flex-1 h-12 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95",
            isAdded
              ? "bg-emerald-600 text-white"
              : "bg-[#FA8232] hover:bg-[#D25026] text-white"
          )}
        >
          {isAdded ? (
            <>
              <Check className="size-4" />
              <span>DITAMBAHKAN</span>
            </>
          ) : (
            <>
              <ShoppingCart className="size-4" />
              <span>KERANJANG</span>
            </>
          )}
        </button>

        {/* Custom Jersey */}
        <button
          type="button"
          onClick={() => navigate("/customer/custom-jersey")}
          className="h-12 px-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
        >
          <Shirt className="size-4 text-[#FA8232]" />
          <span>KUSTOM</span>
        </button>
      </div>
    </div>
  );
}
