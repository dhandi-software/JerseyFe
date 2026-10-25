import React, { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ShoppingCart, Check, Heart, Eye } from "lucide-react";
import { cn } from "~/lib/utils";
import { useCart } from "~/context/CartContext";
import { useWishlist } from "~/hooks/useWishlist";
import { useProducts } from "~/hooks/useProducts";
import { FeaturedProductsSkeleton } from "~/features/landing/home/components/Home/HomeProductSkeletons";
import { HomeProductEmptyState } from "~/features/landing/home/components/Home/HomeProductEmptyState";

export function FeaturedProductsSection() {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { products, loading } = useProducts();
  const [activeTab, setActiveTab] = useState("all");
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const realFeaturedProducts = products.map((p) => {
    let badgeText = "TERSEDIA";
    let badgeColor = "bg-emerald-600";
    if (p.stock <= 0 || p.is_active === false) {
      badgeText = "HABIS";
      badgeColor = "bg-red-500";
    } else if (p.stock <= 20) {
      badgeText = "STOK MENIPIS";
      badgeColor = "bg-amber-500";
    }

    return {
      id: String(p.id),
      title: p.title,
      price: `Rp ${p.price.toLocaleString("id-ID")}`,
      rawPrice: p.price,
      image: p.image || "/images/jersey_hero.webp",
      categoryName: p.category || "Bahan Baju",
      categorySlug: (p.category || "").toLowerCase(),
      stockText: `${p.stock} kg`,
      badge: { text: badgeText, color: badgeColor },
    };
  });

  const categoriesSet = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const tabs = [
    { id: "all", label: "Semua Produk" },
    ...categoriesSet.map((cat) => ({ id: cat.toLowerCase(), label: cat })),
  ];

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist({
      id: product.id,
      name: product.title,
      price: product.rawPrice ?? product.price,
      image: product.image,
      stockStatus: "IN STOCK",
      category: product.categoryName,
    });
  };

  const filteredProducts = activeTab === "all"
    ? realFeaturedProducts
    : realFeaturedProducts.filter((p) => p.categorySlug.includes(activeTab.toLowerCase()));

  const bannerProduct = realFeaturedProducts[0];

  if (loading) {
    return (
      <section className="w-full py-8">
        <FeaturedProductsSkeleton />
      </section>
    );
  }

  if (realFeaturedProducts.length === 0) {
    return (
      <section className="w-full py-8 font-sans space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
          <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
            Produk Unggulan FCSV
          </h2>
        </div>
        <HomeProductEmptyState
          title="Katalog Produk Unggulan Belum Tersedia"
          description="Saat ini belum ada produk unggulan yang didaftarkan oleh admin. Anda dapat memesan custom jersey dengan desain Anda sendiri."
          actionText="Pesan Custom Jersey"
          actionHref="/customer/custom-jersey"
        />
      </section>
    );
  }

  return (
    <section className="w-full py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Left Side Banner */}
        <div className="w-full lg:w-80 h-full min-h-[580px] bg-gradient-to-b from-[#F7E070] via-[#F5D547] to-[#E5B82C] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-sm border border-amber-200/80 shrink-0">
          <div className="z-10 text-center flex flex-col items-center">
            <span className="text-[#BE4624] font-bold text-xs uppercase tracking-wider block">
              PILIHAN UNGGULAN
            </span>
            <h3 className="text-2xl font-extrabold text-gray-900 leading-tight mt-1 line-clamp-2">
              {bannerProduct ? bannerProduct.title : "Jersey FCSV Premium"}
            </h3>
            <p className="text-xs text-gray-800 font-medium mt-1">
              Standar Jahitan & Sablon Sublimasi Terbaik
            </p>
          </div>

          <div className="relative my-auto py-6 flex items-center justify-center">
            <Link to={bannerProduct ? `/product/${bannerProduct.id}` : "/category"}>
              <img
                src={bannerProduct?.image || "/images/jersey_hero.webp"}
                alt="Unggulan"
                className="max-h-64 object-contain drop-shadow-xl hover:scale-105 transition-transform"
              />
            </Link>
          </div>

          <div className="z-10 text-center">
            <div className="mb-3">
              <span className="text-xs text-gray-800 block">Harga Spesial:</span>
              <span className="text-2xl font-black text-[#191C1F]">
                {bannerProduct?.price || "Rp 150.000"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to={bannerProduct ? `/product/${bannerProduct.id}` : "/category"}
                className="w-full bg-[#191C1F] hover:bg-black text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-98 cursor-pointer"
              >
                <span>DETAIL</span>
                <Eye className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/customer/custom-jersey"
                className="w-full bg-[#FA8232] hover:bg-[#e06d20] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-98 cursor-pointer"
              >
                <span>CUSTOM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side Products Grid */}
        <div className="space-y-6">
          {/* Header & Category Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
            <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
              Produk Unggulan FCSV
            </h2>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-[#191C1F] text-white"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <HomeProductEmptyState
              compact
              title="Tidak Ada Produk di Kategori Ini"
              description="Belum ada produk untuk kategori yang dipilih. Coba pilih kategori lain atau reset filter untuk melihat semua produk."
              actionText="Lihat Semua Kategori"
              actionHref="/category"
              secondaryActionText="Reset Filter"
              onSecondaryAction={() => setActiveTab("all")}
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.slice(0, 8).map((product) => {
                const isAdded = addedIds[product.id];
                const isWished = isInWishlist(product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between shadow-2xs hover:border-[#FA8232]/50 hover:shadow-md transition-all group relative"
                  >
                    <div className="space-y-3">
                      {/* Image Area with Actions Overlay */}
                      <div className="relative w-full aspect-square flex items-center justify-center p-2 rounded-xl bg-zinc-50 overflow-hidden">
                        {product.badge && (
                          <span className={cn(
                            "absolute top-2 left-2 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider z-10",
                            product.badge.color
                          )}>
                            {product.badge.text}
                          </span>
                        )}

                        <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        {/* Hover Action Buttons Overlay */}
                        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 rounded-xl z-20">
                          <button
                            type="button"
                            onClick={(e) => handleToggleWishlist(e, product)}
                            className={cn(
                              "w-9 h-9 rounded-full bg-white flex items-center justify-center text-zinc-700 hover:bg-rose-50 hover:text-rose-600 shadow transition-all duration-200 cursor-pointer",
                              isWished && "bg-rose-50 text-rose-600 ring-2 ring-rose-300"
                            )}
                            title={isWished ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                            aria-label="Wishlist"
                          >
                            <Heart className={cn("w-4 h-4", isWished && "fill-current text-rose-600")} />
                          </button>

                          <Link
                            to={`/product/${product.id}`}
                            className="w-9 h-9 rounded-full bg-[#FA8232] text-white flex items-center justify-center hover:bg-[#D25026] shadow transition-all duration-200"
                            title="Lihat Detail Produk"
                            aria-label="Lihat Detail Produk"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(e, product)}
                            className={cn(
                              "w-9 h-9 rounded-full bg-white flex items-center justify-center text-zinc-700 hover:bg-[#FA8232] hover:text-white shadow transition-all duration-200 cursor-pointer",
                              isAdded && "bg-emerald-600 text-white hover:bg-emerald-700"
                            )}
                            title="Tambah ke Keranjang"
                            aria-label="Tambah ke Keranjang"
                          >
                            {isAdded ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-zinc-500 font-medium">
                          <span className="truncate">{product.categoryName}</span>
                          <span className="text-zinc-600 font-semibold shrink-0">Stok: {product.stockText}</span>
                        </div>

                        <Link to={`/product/${product.id}`} className="block">
                          <h4 className="text-xs font-semibold text-zinc-900 line-clamp-2 leading-snug group-hover:text-[#FA8232] transition-colors">
                            {product.title}
                          </h4>
                        </Link>

                        <div className="flex items-baseline gap-1 pt-1">
                          <span className="text-sm font-extrabold text-[#D25026]">
                            {product.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Bottom */}
                    <div className="pt-3 grid grid-cols-[1fr_auto] gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        className={cn(
                          "py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                          isAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-zinc-100 hover:bg-[#FA8232] text-zinc-700 hover:text-white"
                        )}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>DITAMBAH</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>BELI</span>
                          </>
                        )}
                      </button>

                      <Link
                        to={`/product/${product.id}`}
                        className="p-2 bg-zinc-100 hover:bg-zinc-900 hover:text-white text-zinc-600 rounded-xl flex items-center justify-center transition-colors"
                        title="Lihat Detail Produk"
                        aria-label="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
