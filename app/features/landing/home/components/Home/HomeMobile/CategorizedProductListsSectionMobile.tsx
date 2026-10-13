import React, { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { cn } from "~/lib/utils";
import { useCart } from "~/context/CartContext";
import { useProducts } from "~/hooks/useProducts";
import { CategorizedListsMobileSkeleton } from "~/features/landing/home/components/Home/HomeProductSkeletons";
import { HomeProductEmptyState } from "~/features/landing/home/components/Home/HomeProductEmptyState";
import type { MiniProductItem } from "../HomeDesktop/CategorizedProductListsSection";

export function CategorizedProductListsSectionMobile() {
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const realMiniProducts: MiniProductItem[] = products.map((p) => {
    const isDiscount = Boolean(p.discount_price && p.discount_price > 0 && p.discount_price < p.price);
    const formattedPrice = isDiscount && p.discount_price
      ? `Rp ${p.discount_price.toLocaleString("id-ID")}`
      : `Rp ${p.price.toLocaleString("id-ID")}`;

    return {
      id: String(p.id),
      title: p.title,
      price: formattedPrice,
      image: p.image || "/images/jersey_hero.png",
    };
  });

  const columns = [
    {
      title: "PROMO HARI INI",
      products: realMiniProducts.slice(0, 3),
    },
    {
      title: "TERLARIS",
      products: realMiniProducts.slice(3, 6).length > 0 ? realMiniProducts.slice(3, 6) : realMiniProducts.slice(0, 3),
    },
    {
      title: "KUALITAS TERBAIK",
      products: realMiniProducts.slice(1, 4).length > 0 ? realMiniProducts.slice(1, 4) : realMiniProducts.slice(0, 3),
    },
    {
      title: "BAHAN TERBARU",
      products: realMiniProducts.slice(2, 5).length > 0 ? realMiniProducts.slice(2, 5) : realMiniProducts.slice(0, 3),
    },
  ];

  const handleAddToCart = (e: React.MouseEvent, product: MiniProductItem) => {
    e.preventDefault();
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

  if (loading) {
    return (
      <section className="w-full my-6">
        <CategorizedListsMobileSkeleton />
      </section>
    );
  }

  if (realMiniProducts.length < 6) {
    return (
      <section className="w-full my-6">
        <HomeProductEmptyState
          compact
          title="Koleksi Pilihan Sedang Disiapkan"
          description="Koleksi kurasi produk terlaris dan bahan terbaru akan tampil setelah admin menambahkan lebih banyak produk."
          actionText="Semua Produk"
          actionHref="/category"
        />
      </section>
    );
  }

  return (
    <section className="w-full my-6 space-y-6">
      {columns.map((column, colIdx) => (
        <div key={colIdx} className="space-y-3">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">
            {column.title}
          </h3>

          <div className="space-y-2.5">
            {column.products.map((product) => {
              const isAdded = addedIds[product.id];

              return (
                <div
                  key={product.id}
                  onClick={(e) => handleAddToCart(e, product)}
                  className="bg-white rounded-xl border border-gray-200/80 p-3 flex items-center gap-3 shadow-2xs group cursor-pointer active:scale-98 transition-all"
                >
                  <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg border border-gray-100 p-1 flex items-center justify-center overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="flex-1 space-y-1 overflow-hidden">
                    <h4 className="text-xs text-gray-800 font-medium line-clamp-1 leading-snug">
                      {product.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#2DA5F3]">
                        {product.price}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer",
                          isAdded
                            ? "bg-emerald-500 text-white"
                            : "bg-zinc-100 text-zinc-600 hover:bg-[#FA8232] hover:text-white"
                        )}
                        aria-label={`Beli ${product.title}`}
                      >
                        {isAdded ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <ShoppingCart className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
