import React, { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ShoppingCart, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "~/lib/utils";
import { useCart } from "~/context/CartContext";
import { useProducts } from "~/hooks/useProducts";
import { CatalogProductsMobileSkeleton } from "~/features/landing/home/components/Home/HomeProductSkeletons";
import { HomeProductEmptyState } from "~/features/landing/home/components/Home/HomeProductEmptyState";

export function ComputerAccessoriesSectionMobile() {
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

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

  const filteredProducts = activeTab === "all"
    ? realAccessoryProducts
    : realAccessoryProducts.filter((p) => p.categorySlug.includes(activeTab.toLowerCase()));

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <section className="w-full my-6 space-y-4">
        <CatalogProductsMobileSkeleton />
      </section>
    );
  }

  if (realAccessoryProducts.length === 0) {
    return (
      <section className="w-full my-6 space-y-4">
        <div className="border-b border-zinc-200 pb-3">
          <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">
            Katalog Lengkap Baju Jersey FCSV
          </h2>
        </div>
        <HomeProductEmptyState
          compact
          title="Katalog Jersey Belum Tersedia"
          description="Admin FCSV sedang mempersiapkan katalog jersey. Anda tetap dapat melakukan pemesanan custom jersey."
          actionText="Pesan Custom"
          actionHref="/customer/custom-jersey"
        />
      </section>
    );
  }

  return (
    <section className="w-full my-6 space-y-4">
      {/* 1. Header & Tabs */}
      <div className="space-y-2 border-b border-zinc-200 pb-3">
        <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">
          Katalog Lengkap Baju Jersey FCSV
        </h2>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
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

      {/* 2. Products Grid */}
      {paginatedProducts.length === 0 ? (
        <HomeProductEmptyState
          compact
          title="Tidak Ada Produk di Kategori Ini"
          description="Belum ada produk untuk kategori yang dipilih. Silakan coba kategori lainnya atau reset filter."
          actionText="Semua Kategori"
          actionHref="/category"
          secondaryActionText="Reset Filter"
          onSecondaryAction={() => handleTabChange("all")}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {paginatedProducts.map((product) => {
            const isAdded = addedIds[product.id];
            return (
              <div
                key={product.id}
                className="bg-white border border-zinc-200 rounded-xl p-3 flex flex-col justify-between shadow-2xs relative"
              >
                <div className="space-y-2">
                  <div className="relative w-full aspect-square flex items-center justify-center p-2 rounded-lg bg-zinc-50 overflow-hidden">
                    {product.badge && (
                      <span className={cn(
                        "absolute top-1.5 left-1.5 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider z-10",
                        product.badge.color
                      )}>
                        {product.badge.text}
                      </span>
                    )}
                    <img
                      src={product.image}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 block truncate font-medium">
                      {product.categoryName} • Stok {product.stockText}
                    </span>
                    <h4 className="text-[11px] font-semibold text-zinc-900 line-clamp-2 leading-tight">
                      {product.title}
                    </h4>
                    <div className="flex items-baseline gap-1 pt-0.5">
                      <span className="text-xs font-extrabold text-[#2DA5F3]">
                        {product.price}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, product)}
                    className={cn(
                      "w-full h-11 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                      isAdded
                        ? "bg-emerald-500 text-white"
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
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100 cursor-pointer"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-zinc-600">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100 cursor-pointer"
            aria-label="Halaman berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}
