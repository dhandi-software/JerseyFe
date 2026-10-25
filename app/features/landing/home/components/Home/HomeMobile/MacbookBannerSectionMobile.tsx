import React, { useState } from "react";
import { ArrowRight, Check, Heart, Eye } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { useCart } from "~/context/CartContext";
import { useWishlist } from "~/hooks/useWishlist";
import { useProducts } from "~/hooks/useProducts";
import { Skeleton } from "~/components/ui/skeleton";
import { HomeProductEmptyState } from "../HomeProductEmptyState";

export function MacbookBannerSectionMobile() {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { products, loading } = useProducts();
  const [isAdded, setIsAdded] = useState(false);

  const featuredProduct = products[2] || products[0] || null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!featuredProduct) return;
    addToCart({
      id: String(featuredProduct.id),
      title: featuredProduct.title,
      price: `Rp ${featuredProduct.price.toLocaleString("id-ID")}`,
      image: featuredProduct.image || "/images/desain-jersey.jpg",
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!featuredProduct) return;
    addToWishlist({
      id: String(featuredProduct.id),
      name: featuredProduct.title,
      price: featuredProduct.price,
      image: featuredProduct.image || "/images/desain-jersey.jpg",
      stockStatus: "IN STOCK",
      category: featuredProduct.category,
    });
  };

  if (loading) {
    return (
      <section className="w-full my-6">
        <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/50 space-y-3">
          <Skeleton className="h-4 w-20 bg-amber-100 rounded" />
          <Skeleton className="h-6 w-44 bg-amber-200/70 rounded" />
          <Skeleton className="h-3 w-3/4 bg-amber-100 rounded" />
          <Skeleton className="h-10 w-32 bg-amber-200/80 rounded-lg mt-2" />
        </div>
      </section>
    );
  }

  if (!featuredProduct) {
    return (
      <section className="w-full my-6">
        <HomeProductEmptyState
          compact
          title="Rekomendasi Bahan Sedang Disiapkan"
          description="Admin belum menentukan bahan atau produk rekomendasi pilihan."
          actionText="Konsultasi Bahan Jersey"
          actionHref="/customer/custom-jersey"
        />
      </section>
    );
  }

  const isWished = isInWishlist(featuredProduct.id);

  return (
    <section className="w-full my-6">
      <div className="bg-[#FFEEDD] rounded-2xl p-5 relative overflow-hidden shadow-sm border border-amber-200/50 space-y-4">
        {/* Floating Price Badge */}
        <div className="absolute top-4 right-4 z-20 w-14 h-14 rounded-full bg-[#FFD4B2] text-[#191C1E] font-black flex flex-col items-center justify-center text-xs shadow border-2 border-white">
          <span className="text-[8px] text-amber-900">HARGA</span>
          <span className="text-[11px] font-extrabold">
            {`Rp ${(featuredProduct.price / 1000).toFixed(0)}K`}
          </span>
        </div>

        <div className="space-y-2 z-10 pr-16">
          <span className="bg-[#2DA5F3] text-white text-[10px] font-bold px-2.5 py-0.5 uppercase rounded-sm inline-block tracking-wider">
            {featuredProduct.category || "REKOMENDASI"}
          </span>

          <Link to={`/product/${featuredProduct.id}`} className="block">
            <h2 className="text-xl font-black text-[#191C1F] leading-tight">
              {featuredProduct.title}
            </h2>
          </Link>

          {featuredProduct.description ? (
            <p className="text-xs text-gray-700 font-normal leading-relaxed line-clamp-2">
              {featuredProduct.description}
            </p>
          ) : null}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 bg-[#FA8232] hover:bg-[#e07228] text-white font-bold px-4 h-11 rounded-xl flex items-center justify-center gap-1.5 text-xs uppercase shadow active:scale-95 cursor-pointer"
            >
              <span>{isAdded ? "DITAMBAH" : "PESAN"}</span>
              {isAdded ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>

            <Link
              to={`/product/${featuredProduct.id}`}
              className="w-11 h-11 rounded-xl border border-amber-300 bg-white text-zinc-700 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-colors shrink-0"
              title="Lihat Detail Produk"
              aria-label="Lihat Detail"
            >
              <Eye className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={handleToggleWishlist}
              className={cn(
                "w-11 h-11 rounded-xl border border-amber-300 bg-white flex items-center justify-center text-zinc-600 transition-colors cursor-pointer shrink-0",
                isWished && "bg-rose-50 border-rose-300 text-rose-600"
              )}
              title={isWished ? "Hapus dari Favorit" : "Tambah ke Favorit"}
              aria-label="Wishlist"
            >
              <Heart className={cn("w-4 h-4", isWished && "fill-current text-rose-600")} />
            </button>
          </div>
        </div>

        <div className="w-full h-44 flex items-center justify-center relative z-0 pt-2">
          <Link to={`/product/${featuredProduct.id}`} className="h-full flex items-center justify-center">
            <img
              src={featuredProduct.image || "/images/desain-jersey.jpg"}
              alt={featuredProduct.title}
              className="max-h-full max-w-full object-contain rounded-xl drop-shadow-md"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

