import React, { useState } from "react";
import { ArrowRight, Check, Heart } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { useCart } from "~/context/CartContext";
import { useWishlist } from "~/hooks/useWishlist";
import { useProducts } from "~/hooks/useProducts";
import { Skeleton } from "~/components/ui/skeleton";
import { HomeProductEmptyState } from "../HomeProductEmptyState";

export function MacbookBannerSection() {
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
      image: featuredProduct.image,
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
      <section className="w-full my-8">
        <div className="bg-amber-50/60 rounded-2xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between min-h-[360px] border border-amber-200/50">
          <div className="flex-1 space-y-4 pr-4 w-full">
            <Skeleton className="h-5 w-32 bg-amber-100 rounded-sm" />
            <Skeleton className="h-9 w-64 bg-amber-200/70 rounded" />
            <Skeleton className="h-4 w-4/5 bg-amber-100/90 rounded" />
            <div className="flex items-center gap-3 pt-2">
              <Skeleton className="h-12 w-40 bg-amber-200/80 rounded-xl" />
              <Skeleton className="h-12 w-36 bg-amber-100 rounded-xl" />
            </div>
          </div>
          <Skeleton className="w-64 h-64 rounded-2xl bg-amber-100/80 mt-6 md:mt-0" />
        </div>
      </section>
    );
  }

  if (!featuredProduct) {
    return (
      <section className="w-full my-8">
        <HomeProductEmptyState
          title="Rekomendasi Bahan Sedang Disiapkan"
          description="Admin belum menentukan bahan atau produk rekomendasi pilihan. Anda tetap bisa berkonsultasi bahan jersey yang cocok untuk tim Anda."
          actionText="Konsultasi Bahan Jersey"
          actionHref="/customer/custom-jersey"
        />
      </section>
    );
  }

  const isWished = isInWishlist(featuredProduct.id);

  return (
    <section className="w-full my-8">
      <div className="bg-[#FFEEDD] rounded-2xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-sm border border-amber-200/50 min-h-[360px] group">
        {/* Content Left */}
        <div className="z-10 flex-1 space-y-4 pr-4">
          <span className="bg-[#2DA5F3] text-white text-xs font-bold px-3 py-1.5 uppercase rounded-sm inline-block tracking-wider">
            {featuredProduct.category || "REKOMENDASI KONVEKSI"}
          </span>

          <h2 className="text-3xl lg:text-5xl font-black text-[#191C1F] leading-tight">
            {featuredProduct.title}
          </h2>

          {featuredProduct.description ? (
            <p className="text-sm lg:text-base text-gray-700 font-normal leading-relaxed">
              {featuredProduct.description}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-[#FA8232] hover:bg-[#e07228] text-white font-bold px-7 py-3.5 rounded-xl flex items-center gap-2 text-sm uppercase shadow transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span>{isAdded ? "DITAMBAHKAN" : "PESAN SEKARANG"}</span>
              {isAdded ? (
                <Check className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              )}
            </button>

            <Link
              to={`/product/${featuredProduct.id}`}
              className="bg-white hover:bg-zinc-50 text-[#191C1E] font-bold px-6 py-3.5 rounded-xl border border-amber-300 text-sm uppercase shadow-xs transition-all cursor-pointer"
            >
              DETAIL BAHAN
            </Link>

            <button
              type="button"
              onClick={handleToggleWishlist}
              className={cn(
                "p-3.5 rounded-xl border border-amber-300 bg-white hover:bg-rose-50 text-zinc-600 hover:text-rose-600 transition-colors cursor-pointer shadow-xs",
                isWished && "bg-rose-50 border-rose-300 text-rose-600"
              )}
              title={isWished ? "Hapus dari Favorit" : "Tambah ke Favorit"}
              aria-label="Wishlist"
            >
              <Heart className={cn("w-4 h-4", isWished && "fill-current text-rose-600")} />
            </button>
          </div>
        </div>

        {/* Floating Price Badge & Image Right */}
        <div className="w-full md:w-[50%] flex items-center justify-center relative mt-8 md:mt-0 z-0">
          <div className="absolute top-0 left-4 md:left-8 z-20 w-20 h-20 rounded-full bg-[#FFD4B2] text-[#191C1E] font-black flex flex-col items-center justify-center text-xs shadow-lg border-4 border-white text-center">
            <span className="text-[10px] text-amber-900">HARGA</span>
            <span className="font-extrabold text-xs">
              {`Rp ${(featuredProduct.price / 1000).toFixed(0)}K`}
            </span>
          </div>

          <Link to={`/product/${featuredProduct.id}`} className="block">
            <img
              src={featuredProduct.image || "/images/desain-jersey.jpg"}
              alt={featuredProduct.title}
              className="max-h-[320px] w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-2xl rounded-xl"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

