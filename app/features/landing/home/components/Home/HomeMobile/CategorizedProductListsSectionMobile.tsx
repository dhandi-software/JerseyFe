import React, { useState } from "react";
import { Link } from "react-router";
import { Check, ShoppingCart, Heart, Eye } from "lucide-react";
import { cn } from "~/lib/utils";
import { useCart } from "~/context/CartContext";
import { useWishlist } from "~/hooks/useWishlist";
import { useProducts } from "~/hooks/useProducts";
import { CategorizedListsMobileSkeleton } from "~/features/landing/home/components/Home/HomeProductSkeletons";
import { HomeProductEmptyState } from "~/features/landing/home/components/Home/HomeProductEmptyState";
import type { MiniProductItem } from "../HomeDesktop/CategorizedProductListsSection";

export function CategorizedProductListsSectionMobile() {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
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
      rawPrice: p.price,
      image: p.image || "/images/jersey_hero.webp",
      category: p.category,
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

  const handleToggleWishlist = (e: React.MouseEvent, product: MiniProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist({
      id: product.id,
      name: product.title,
      price: product.rawPrice ?? product.price,
      image: product.image,
      stockStatus: "IN STOCK",
      category: product.category,
    });
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
              const isWished = isInWishlist(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-200/80 p-3 flex items-center gap-3 shadow-2xs group relative"
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="w-16 h-16 shrink-0 bg-gray-50 rounded-xl border border-gray-100 p-1 flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </Link>

                  <div className="flex-1 space-y-1 overflow-hidden">
                    <Link to={`/product/${product.id}`} className="block">
                      <h4 className="text-xs text-gray-800 font-semibold line-clamp-1 leading-snug">
                        {product.title}
                      </h4>
                    </Link>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#D25026]">
                        {product.price}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleToggleWishlist(e, product)}
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer",
                            isWished && "text-rose-600 bg-rose-50"
                          )}
                          title={isWished ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                          aria-label="Wishlist"
                        >
                          <Heart className={cn("w-4 h-4", isWished && "fill-current text-rose-600")} />
                        </button>

                        <Link
                          to={`/product/${product.id}`}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-900 hover:text-white transition-colors"
                          title="Lihat Detail Produk"
                          aria-label="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(e, product)}
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer",
                            isAdded
                              ? "bg-emerald-600 text-white"
                              : "bg-zinc-100 text-zinc-600 hover:bg-[#FA8232] hover:text-white"
                          )}
                          aria-label={`Beli ${product.title}`}
                        >
                          {isAdded ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <ShoppingCart className="w-4 h-4" />
                          )}
                        </button>
                      </div>
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
