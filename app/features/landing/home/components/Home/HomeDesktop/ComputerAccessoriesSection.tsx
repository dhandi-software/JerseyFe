import React, { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ShoppingCart, Check, ChevronLeft, ChevronRight, Heart, Eye } from "lucide-react";
import { cn } from "~/lib/utils";
import { useCart } from "~/context/CartContext";
import { useWishlist } from "~/hooks/useWishlist";
import { useProducts } from "~/hooks/useProducts";
import { CatalogProductsSkeleton } from "~/features/landing/home/components/Home/HomeProductSkeletons";
import { HomeProductEmptyState } from "~/features/landing/home/components/Home/HomeProductEmptyState";

export function ComputerAccessoriesSection() {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { products, loading } = useProducts();
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const highlightProduct = products[0];

  const realAccessoryProducts = products.map((p) => {
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

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handleAddToCart = (e: React.MouseEvent, product: { id: string; title: string; price: string; image: string }) => {
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
    ? realAccessoryProducts
    : realAccessoryProducts.filter((p) => p.categorySlug.includes(activeTab.toLowerCase()));

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <section className="w-full my-8">
        <CatalogProductsSkeleton />
      </section>
    );
  }

  if (realAccessoryProducts.length === 0) {
    return (
      <section className="w-full my-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
          <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
            Katalog Lengkap Baju Jersey FCSV
          </h2>
        </div>
        <HomeProductEmptyState
          title="Katalog Jersey Belum Tersedia"
          description="Admin FCSV sedang mempersiapkan katalog koleksi baju dan material jersey. Anda tetap dapat memesan custom jersey sesuai spesifikasi tim Anda."
          actionText="Pesan Custom Jersey"
          actionHref="/customer/custom-jersey"
        />
      </section>
    );
  }

  return (
    <section className="w-full my-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Side Highlight Card */}
        <div className="lg:col-span-1 bg-[#191C1F] text-white rounded-2xl p-6 flex flex-col justify-between shadow-md relative overflow-hidden min-h-[460px]">
          <div className="space-y-3 z-10">
            <span className="text-[#FA8232] font-bold text-xs uppercase tracking-wider">
              {highlightProduct?.category || "MATERIAL UNGGULAN"}
            </span>
            <h3 className="text-2xl font-black leading-tight text-white line-clamp-2">
              {highlightProduct?.title || "Dri-Fit Premium FCSV"}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
              {highlightProduct?.short_description || "Bahan pakaian olahraga kualitas terbaik dari database FCSV."}
            </p>
          </div>

          <div className="my-auto py-4 flex items-center justify-center relative group">
            <Link to={highlightProduct ? `/product/${highlightProduct.id}` : "/category"}>
              <img
                src={highlightProduct?.image || "/images/jersey_hero.webp"}
                alt={highlightProduct?.title || "Kain Jersey"}
                className="max-h-48 object-contain drop-shadow-xl hover:scale-105 transition-transform"
              />
            </Link>
          </div>

          <div className="z-10 space-y-2">
            <Link
              to={highlightProduct ? `/product/${highlightProduct.id}` : "/category"}
              className="w-full bg-[#FA8232] hover:bg-[#e06d20] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <span>LIHAT DETAIL</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            {highlightProduct && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={(e) => handleToggleWishlist(e, {
                    id: String(highlightProduct.id),
                    title: highlightProduct.title,
                    price: highlightProduct.price,
                    image: highlightProduct.image,
                    categoryName: highlightProduct.category,
                  })}
                  className={cn(
                    "py-2 px-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white",
                    isInWishlist(highlightProduct.id) && "bg-rose-950/60 border-rose-600 text-rose-300"
                  )}
                >
                  <Heart className={cn("w-3.5 h-3.5", isInWishlist(highlightProduct.id) && "fill-current text-rose-500")} />
                  <span>{isInWishlist(highlightProduct.id) ? "Tersimpan" : "Favorit"}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleAddToCart(e, {
                    id: String(highlightProduct.id),
                    title: highlightProduct.title,
                    price: `Rp ${highlightProduct.price.toLocaleString("id-ID")}`,
                    image: highlightProduct.image || "/images/jersey_hero.webp",
                  })}
                  className={cn(
                    "py-2 px-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white",
                    addedIds[String(highlightProduct.id)] && "bg-emerald-800/80 border-emerald-500 text-white"
                  )}
                >
                  {addedIds[String(highlightProduct.id)] ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Masuk</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Beli</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Products Grid */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
            <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
              Katalog Lengkap Baju Jersey FCSV
            </h2>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
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

          {paginatedProducts.length === 0 ? (
            <HomeProductEmptyState
              compact
              title="Tidak Ada Produk di Kategori Ini"
              description="Belum ada produk untuk kategori yang dipilih. Coba pilih kategori lain atau reset filter."
              actionText="Lihat Semua Kategori"
              actionHref="/category"
              secondaryActionText="Reset Filter"
              onSecondaryAction={() => handleTabChange("all")}
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {paginatedProducts.map((product) => {
                const isAdded = addedIds[product.id];
                const isWished = isInWishlist(product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between shadow-2xs hover:border-[#FA8232]/50 hover:shadow-md transition-all group relative"
                  >
                    <div className="space-y-3">
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

                        {/* Hover Actions Overlay */}
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

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100 cursor-pointer"
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-zinc-600">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100 cursor-pointer"
                aria-label="Halaman berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
