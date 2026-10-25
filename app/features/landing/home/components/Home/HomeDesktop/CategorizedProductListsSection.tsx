import React, { useState } from "react";
import { Link } from "react-router";
import { Check, ShoppingCart, Heart, Eye } from "lucide-react";
import { cn } from "~/lib/utils";
import { useCart } from "~/context/CartContext";
import { useWishlist } from "~/hooks/useWishlist";
import { useProducts } from "~/hooks/useProducts";
import { CategorizedListsSkeleton } from "~/features/landing/home/components/Home/HomeProductSkeletons";
import { HomeProductEmptyState } from "~/features/landing/home/components/Home/HomeProductEmptyState";

export interface MiniProductItem {
  id: string;
  title: string;
  price: string;
  rawPrice?: number;
  image: string;
  category?: string;
}

export interface ProductColumn {
  title: string;
  products: MiniProductItem[];
}

export function CategorizedProductListsSection() {
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

  const columns: ProductColumn[] = [
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
      <section className="w-full my-8">
        <CategorizedListsSkeleton />
      </section>
    );
  }

  if (realMiniProducts.length < 6) {
    return (
      <section className="w-full my-8">
        <HomeProductEmptyState
          title="Koleksi Pilihan Sedang Disiapkan"
          description="Koleksi kurasi produk seperti Terlaris, Kualitas Terbaik, dan Bahan Terbaru akan tampil setelah admin menambahkan lebih banyak produk ke katalog."
          actionText="Lihat Katalog Produk"
          actionHref="/category"
        />
      </section>
    );
  }

  return (
    <section className="w-full my-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column, colIdx) => (
          <div key={colIdx} className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">
              {column.title}
            </h3>

            <div className="space-y-3">
              {column.products.map((product) => {
                const isAdded = addedIds[product.id];
                const isWished = isInWishlist(product.id);

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-gray-200/80 p-3 flex items-center gap-3 hover:border-[#FA8232]/60 hover:shadow-md transition-all duration-200 group relative"
                  >
                    <Link
                      to={`/product/${product.id}`}
                      className="w-20 h-20 shrink-0 bg-gray-50 rounded-xl border border-gray-100 p-1 flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                      />
                    </Link>

                    <div className="flex-1 space-y-1 overflow-hidden">
                      <Link to={`/product/${product.id}`} className="block">
                        <h4 className="text-xs text-gray-800 font-semibold line-clamp-2 group-hover:text-[#FA8232] transition-colors leading-snug">
                          {product.title}
                        </h4>
                      </Link>
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-sm font-bold text-[#D25026]">
                          {product.price}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleToggleWishlist(e, product)}
                            className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer",
                              isWished && "text-rose-600 bg-rose-50"
                            )}
                            title={isWished ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                            aria-label="Wishlist"
                          >
                            <Heart className={cn("w-3.5 h-3.5", isWished && "fill-current text-rose-600")} />
                          </button>

                          <Link
                            to={`/product/${product.id}`}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                            title="Lihat Detail Produk"
                            aria-label="Lihat Detail"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(e, product)}
                            className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#FA8232] hover:text-white transition-all cursor-pointer",
                              isAdded && "bg-emerald-600 text-white hover:bg-emerald-700"
                            )}
                            title="Tambah ke Keranjang"
                            aria-label={`Tambah ${product.title} ke keranjang`}
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
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
