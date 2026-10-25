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
  Sparkles,
  Package,
} from "lucide-react";
import { useWishlist } from "~/hooks/useWishlist";
import { useCart } from "~/context/CartContext";
import { useProductDetail } from "~/hooks/useProductDetail";
import { ProductDetailInfoTabs } from "../components/ProductDetailInfoTabs";
import { ProductRelatedWidgetSection } from "../components/ProductRelatedWidgetSection";
import { cn } from "~/lib/utils";

export function ProductDetailDesktop() {
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
      <div className="min-h-screen py-10 px-4 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-zinc-200/70 rounded-xl w-72" />
        <div className="bg-white rounded-3xl p-8 border border-zinc-200 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-4/3 bg-zinc-100 rounded-2xl" />
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="size-20 bg-zinc-100 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 space-y-6">
            <div className="h-6 bg-zinc-100 rounded w-1/3" />
            <div className="h-10 bg-zinc-100 rounded w-3/4" />
            <div className="h-8 bg-zinc-100 rounded w-1/4" />
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
        <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#D25026] mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-zinc-900">Produk Tidak Ditemukan</h2>
        <p className="text-xs text-zinc-500 max-w-md mt-1 mb-6">
          {error || "Produk yang Anda cari tidak tersedia atau belum dipublikasikan oleh tim FCSV."}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors"
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
    <div className="min-h-screen bg-[url('/images/Background_Eccomerce.png')] bg-cover bg-top bg-no-repeat bg-fixed py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="bg-white/90 backdrop-blur-md py-3 px-5 rounded-2xl border border-zinc-200 shadow-2xs flex items-center gap-2 text-xs font-medium text-zinc-600"
        >
          <Link
            to="/"
            className="flex items-center gap-1.5 text-zinc-600 hover:text-[#D25026] transition-colors font-semibold"
          >
            <Home className="size-3.5 text-zinc-500" />
            <span>Beranda</span>
          </Link>

          <ChevronRight className="size-3.5 text-zinc-400" />

          <Link
            to="/category"
            className="text-zinc-600 hover:text-[#D25026] transition-colors font-semibold"
          >
            {product.category}
          </Link>

          <ChevronRight className="size-3.5 text-zinc-400" />

          <span className="font-bold text-[#D25026] truncate max-w-md">
            {product.title}
          </span>
        </nav>

        {/* Main Product Card */}
        <div className="bg-white/90 backdrop-blur-md p-6 lg:p-8 rounded-3xl border border-zinc-200 shadow-lg shadow-zinc-950/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Product Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="aspect-4/3 w-full rounded-2xl border border-zinc-200 bg-zinc-50 relative overflow-hidden flex items-center justify-center p-6 group">
                {product.discountBadge && (
                  <span className="absolute top-4 left-4 z-10 rounded-full bg-[#D25026] px-3 py-1 text-xs font-bold text-white shadow-xs uppercase tracking-wider">
                    {product.discountBadge}
                  </span>
                )}
                <img
                  src={selectedImage || product.images[0]}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Thumbnails List */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {product.images.map((imgUrl, idx) => {
                    const isSelected = (selectedImage || product.images[0]) === imgUrl;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(imgUrl)}
                        className={cn(
                          "size-20 rounded-xl border-2 overflow-hidden flex items-center justify-center p-1 bg-zinc-50 transition-all cursor-pointer shrink-0",
                          isSelected
                            ? "border-[#FA8232] ring-2 ring-orange-500/20"
                            : "border-zinc-200 hover:border-zinc-300"
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
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "size-4",
                          i < Math.floor(product.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-zinc-200"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-zinc-800">
                    {product.rating}
                  </span>
                  <span className="text-zinc-300">•</span>
                  <span className="text-xs text-zinc-500">
                    ({product.reviewsCount} Ulasan Pelanggan)
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                  <Check className="size-3" />
                  {product.availability}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl font-extrabold text-zinc-900 leading-tight">
                {product.title}
              </h1>

              {/* SKU & Brand */}
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span>
                  Kode: <strong className="text-zinc-800">{product.sku}</strong>
                </span>
                <span>•</span>
                <span>
                  Produsen: <strong className="text-[#D25026]">{product.brand}</strong>
                </span>
                <span>•</span>
                <span>
                  Kategori: <strong className="text-zinc-700">{product.category}</strong>
                </span>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pb-2 border-b border-zinc-100">
                <span className="text-3xl font-black text-[#D25026]">
                  {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg font-semibold text-zinc-400 line-through">
                    {product.originalPrice}
                  </span>
                )}
              </div>

              {/* Description Snippet */}
              <p className="text-xs text-zinc-600 leading-relaxed">
                {product.description}
              </p>

              {/* Color Options */}
              {product.colors.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                    Pilihan Warna:{" "}
                    <span className="text-[#D25026]">
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
                          className={cn(
                            "size-8 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer",
                            isSelected
                              ? "border-[#D25026] ring-2 ring-orange-500/30 scale-110"
                              : "border-zinc-300 hover:scale-105"
                          )}
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && (
                            <Check
                              className={cn(
                                "size-4",
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

              {/* Size Options */}
              {product.sizes.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-800">
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
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border",
                            isSelected
                              ? "bg-orange-50 border-[#FA8232] text-[#D25026] shadow-2xs font-black"
                              : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300"
                          )}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity & Actions Row */}
              <div className="pt-2 flex items-center gap-3 flex-wrap sm:flex-nowrap">
                {/* Quantity Control */}
                <div className="flex items-center border border-zinc-200 rounded-xl bg-zinc-50 p-1">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    aria-label="Kurangi kuantitas"
                    className="size-8 flex items-center justify-center text-zinc-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-zinc-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrement}
                    aria-label="Tambah kuantitas"
                    className="size-8 flex items-center justify-center text-zinc-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>

                {/* Add To Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={cn(
                    "flex-1 h-12 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95",
                    isAdded
                      ? "bg-emerald-600 text-white"
                      : "bg-[#FA8232] hover:bg-[#D25026] text-white"
                  )}
                >
                  {isAdded ? (
                    <>
                      <Check className="size-4" />
                      <span>BERHASIL DITAMBAHKAN</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="size-4" />
                      <span>TAMBAH KE KERANJANG</span>
                    </>
                  )}
                </button>

                {/* Custom Jersey Direct Action */}
                <button
                  type="button"
                  onClick={() => navigate("/customer/custom-jersey")}
                  className="h-12 px-5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Shirt className="size-4 text-[#FA8232]" />
                  <span>KUSTOM DESAIN</span>
                </button>

                {/* Wishlist Like Button */}
                <button
                  type="button"
                  title={isLiked ? "Hapus dari Favorit" : "Simpan ke Favorit"}
                  aria-label={isLiked ? "Hapus dari Favorit" : "Simpan ke Favorit"}
                  onClick={handleToggleWishlist}
                  className={cn(
                    "size-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0",
                    isLiked
                      ? "bg-rose-50 text-rose-600 border-rose-300 ring-2 ring-rose-200"
                      : "border-zinc-200 text-zinc-600 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50/50"
                  )}
                >
                  <Heart className={cn("size-5", isLiked && "fill-current text-rose-600")} />
                </button>
              </div>

              {/* Guarantees Perks */}
              <div className="pt-4 border-t border-zinc-100 grid grid-cols-3 gap-3 text-zinc-600">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <Truck className="size-4 text-[#D25026]" />
                  <span>Kirim Cepat</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <ShieldCheck className="size-4 text-[#D25026]" />
                  <span>100% Asli FCSV</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <RotateCcw className="size-4 text-[#D25026]" />
                  <span>Garansi Retur</span>
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
        <ProductRelatedWidgetSection currentProductId={product.id} currentCategory={product.category} />
      </div>
    </div>
  );
}
