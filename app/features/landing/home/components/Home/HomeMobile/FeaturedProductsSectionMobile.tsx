import React, { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ShoppingCart, Check, Heart, Eye } from "lucide-react";
import { cn } from "~/lib/utils";
import { useCart } from "~/context/CartContext";
import { useWishlist } from "~/hooks/useWishlist";
import { useProducts } from "~/hooks/useProducts";
import { FeaturedProductsMobileSkeleton } from "~/features/landing/home/components/Home/HomeProductSkeletons";
import { HomeProductEmptyState } from "~/features/landing/home/components/Home/HomeProductEmptyState";

export function FeaturedProductsSectionMobile() {
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
    { id: "all", label: "Semua" },
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
      <section className="w-full space-y-4 pt-2">
        <FeaturedProductsMobileSkeleton />
      </section>
    );
  }

  if (realFeaturedProducts.length === 0) {
    return (
      <section className="w-full space-y-4 pt-2">
        <div className="border-b border-zinc-200 pb-3">
          <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">
            Produk Unggulan FCSV
          </h2>
        </div>
        <HomeProductEmptyState
          compact
          title="Katalog Produk Belum Tersedia"
          description="Admin FCSV sedang mempersiapkan katalog produk jersey unggulan. Anda tetap bisa melakukan pemesanan custom jersey."
          actionText="Pesan Custom"
          actionHref="/customer/custom-jersey"
        />
      </section>
    );
  }

  return (
    <section className="w-full space-y-4 pt-2">
      {/* 1. Header & Scrollable Tabs */}
      <div className="space-y-2 border-b border-zinc-200 pb-3">
        <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">
          Produk Unggulan FCSV
        </h2>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-[#191C1F] text-white"
                  : "text-zinc-600 bg-zinc-100 hover:text-zinc-900"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Top Highlight Mini Banner */}
      {bannerProduct && (
        <div className="bg-gradient-to-r from-[#F7E070] to-[#E5B82C] rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="space-y-1 max-w-[60%]">
            <span className="text-[#BE4624] font-bold text-[10px] uppercase tracking-wider block">
              PILIHAN UNGGULAN
            </span>
            <h3 className="text-sm font-extrabold text-gray-900 line-clamp-1">
              {bannerProduct.title}
            </h3>
            <p className="text-xs font-extrabold text-gray-900 pt-0.5">
              {bannerProduct.price}
            </p>
            <div className="pt-1.5 flex items-center gap-1.5">
              <Link
                to={`/product/${bannerProduct.id}`}
                className="bg-[#191C1F] hover:bg-black text-white font-bold px-3 py-1.5 rounded-lg text-[11px] inline-flex items-center gap-1 cursor-pointer"
              >
                <span>DETAIL</span>
                <Eye className="w-3 h-3" />
              </Link>
              <Link
                to="/customer/custom-jersey"
                className="bg-[#FA8232] hover:bg-[#e06d20] text-white font-bold px-3 py-1.5 rounded-lg text-[11px] inline-flex items-center gap-1 cursor-pointer"
              >
                <span>CUSTOM</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="w-24 h-24 shrink-0 flex items-center justify-center">
            <img
              src={bannerProduct.image}
              alt="Highlight"
              className="max-h-full max-w-full object-contain drop-shadow"
            />
          </div>
        </div>
      )}

      {/* 3. Products Grid */}
      {filteredProducts.length === 0 ? (
        <HomeProductEmptyState
          compact
          title="Tidak Ada Produk di Kategori Ini"
          description="Belum ada produk untuk kategori ini. Silakan coba kategori lainnya atau reset filter."
          actionText="Semua Kategori"
          actionHref="/category"
          secondaryActionText="Reset Filter"
          onSecondaryAction={() => setActiveTab("all")}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.slice(0, 6).map((product) => {
            const isAdded = addedIds[product.id];
            const isWished = isInWishlist(product.id);
            return (
              <div
                key={product.id}
                className="bg-white border border-zinc-200 rounded-2xl p-3 flex flex-col justify-between shadow-2xs relative"
              >
                <div className="space-y-2">
                  <div className="relative w-full aspect-square flex items-center justify-center p-2 rounded-xl bg-zinc-50 overflow-hidden">
                    {product.badge && (
                      <span className={cn(
                        "absolute top-1.5 left-1.5 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider z-10",
                        product.badge.color
                      )}>
                        {product.badge.text}
                      </span>
                    )}

                    {/* Floating Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleWishlist(e, product)}
                      className={cn(
                        "absolute top-1 right-1 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-zinc-600 shadow-sm z-20 transition-all active:scale-95 cursor-pointer",
                        isWished && "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
                      )}
                      aria-label="Simpan ke Wishlist"
                    >
                      <Heart className={cn("w-4 h-4", isWished && "fill-current text-rose-600")} />
                    </button>

                    <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </Link>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 block truncate font-medium">
                      {product.categoryName} • Stok {product.stockText}
                    </span>
                    <Link to={`/product/${product.id}`} className="block">
                      <h4 className="text-[11px] font-semibold text-zinc-900 line-clamp-2 leading-tight hover:text-[#D25026] transition-colors">
                        {product.title}
                      </h4>
                    </Link>
                    <div className="flex items-baseline gap-1 pt-0.5">
                      <span className="text-xs font-extrabold text-[#D25026]">
                        {product.price}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 grid grid-cols-[1fr_auto] gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, product)}
                    className={cn(
                      "h-11 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95",
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
                    className="w-11 h-11 bg-zinc-100 hover:bg-zinc-900 hover:text-white text-zinc-700 rounded-xl flex items-center justify-center transition-colors active:scale-95"
                    title="Lihat Detail Produk"
                    aria-label="Lihat Detail Produk"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
