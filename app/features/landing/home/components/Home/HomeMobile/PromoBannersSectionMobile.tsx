import React, { useState } from "react";
import { ArrowRight, Check, Heart, Eye } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { useCart } from "~/context/CartContext";
import { useWishlist } from "~/hooks/useWishlist";
import { useProducts } from "~/hooks/useProducts";
import { Skeleton } from "~/components/ui/skeleton";
import { HomeProductEmptyState } from "../HomeProductEmptyState";

export function PromoBannersSectionMobile() {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { products, loading } = useProducts();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const promoProducts = products.filter(
    (p) => Boolean(p.is_best_deal || (p.discount_price && p.discount_price < p.price))
  );
  const activePromoList = promoProducts.length > 0 ? promoProducts : products.slice(0, 2);
  const prod1 = activePromoList[0];
  const prod2 = activePromoList[1] || activePromoList[0];

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    if (!product) return;
    addToCart({
      id: String(product.id),
      title: product.title,
      price: `Rp ${product.price.toLocaleString("id-ID")}`,
      image: product.image || "/images/desain-jersey.jpg",
    });

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    if (!product) return;
    addToWishlist({
      id: String(product.id),
      name: product.title,
      price: product.price,
      image: product.image || "/images/desain-jersey.jpg",
      stockStatus: "IN STOCK",
      category: product.category,
    });
  };

  if (loading) {
    return (
      <section className="w-full my-6 space-y-4">
        <div className="bg-zinc-100 rounded-2xl p-5 flex items-center justify-between min-h-[160px]">
          <div className="max-w-[60%] space-y-2 flex-1">
            <Skeleton className="h-4 w-20 bg-zinc-200 rounded" />
            <Skeleton className="h-5 w-32 bg-zinc-200 rounded" />
            <Skeleton className="h-3 w-28 bg-zinc-200/70 rounded" />
            <Skeleton className="h-9 w-28 bg-zinc-200 rounded-lg mt-1" />
          </div>
          <Skeleton className="w-24 h-24 rounded-xl bg-zinc-200/60" />
        </div>
      </section>
    );
  }

  if (!prod1) {
    return (
      <section className="w-full my-6">
        <HomeProductEmptyState
          compact
          title="Promo Produk Sedang Disiapkan"
          description="Saat ini belum ada penawaran promo produk khusus dari admin. Anda tetap dapat memesan jersey kustom."
          actionText="Pesan Custom Jersey"
          actionHref="/customer/custom-jersey"
        />
      </section>
    );
  }

  const isWished1 = isInWishlist(prod1.id);
  const isWished2 = prod2 ? isInWishlist(prod2.id) : false;

  return (
    <section className="w-full my-6 space-y-4">
      {/* 1. Mobile Banner 1 */}
      <div className="bg-[#F2F4F5] rounded-2xl p-4 flex items-center justify-between relative overflow-hidden shadow-2xs">
        <div className="max-w-[62%] space-y-1.5 z-10">
          <span className="bg-[#2DA5F3] text-white text-[10px] font-semibold px-2.5 py-0.5 uppercase rounded-sm inline-block tracking-wider">
            {prod1.category || "PROMO SPESIAL"}
          </span>

          <Link to={`/product/${prod1.id}`} className="block">
            <h3 className="text-sm font-extrabold text-[#191C1E] leading-snug line-clamp-1 hover:text-[#FA8232] transition-colors">
              {prod1.title}
            </h3>
          </Link>

          {prod1.short_description ? (
            <p className="text-[11px] text-gray-500 font-normal line-clamp-2">
              {prod1.short_description}
            </p>
          ) : null}

          <p className="text-xs font-black text-[#D25026]">
            Rp {prod1.price.toLocaleString("id-ID")}
          </p>

          <div className="pt-1 flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => handleAddToCart(e, prod1)}
              className="flex-1 bg-[#FA8232] hover:bg-[#e07228] text-white font-bold px-3 h-11 rounded-xl flex items-center justify-center gap-1 text-xs uppercase shadow active:scale-95 cursor-pointer"
            >
              <span>{addedIds[prod1.id] ? "DITAMBAH" : "PESAN"}</span>
              {addedIds[prod1.id] ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>

            <Link
              to={`/product/${prod1.id}`}
              className="w-11 h-11 rounded-xl bg-white border border-zinc-200 text-zinc-700 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-colors shrink-0"
              title="Lihat Detail Produk"
              aria-label="Lihat Detail"
            >
              <Eye className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={(e) => handleToggleWishlist(e, prod1)}
              className={cn(
                "w-11 h-11 rounded-xl bg-white border border-zinc-200 text-zinc-600 flex items-center justify-center transition-colors cursor-pointer shrink-0",
                isWished1 && "bg-rose-50 border-rose-300 text-rose-600"
              )}
              title={isWished1 ? "Hapus dari Favorit" : "Tambah ke Favorit"}
              aria-label="Wishlist"
            >
              <Heart className={cn("w-4 h-4", isWished1 && "fill-current text-rose-600")} />
            </button>
          </div>
        </div>

        <Link to={`/product/${prod1.id}`} className="w-[36%] h-full flex items-center justify-center relative z-0 p-1">
          <img
            src={prod1.image || "/images/desain-jersey.jpg"}
            alt={prod1.title}
            className="max-h-36 max-w-full object-contain drop-shadow-md"
          />
        </Link>
      </div>

      {/* 2. Mobile Banner 2 */}
      {prod2 && (
        <div className="bg-[#191C1E] text-white rounded-2xl p-4 flex items-center justify-between relative overflow-hidden shadow-2xs">
          <div className="absolute top-3 right-3 z-20 w-11 h-11 rounded-full bg-[#2DA5F3] text-white font-bold flex flex-col items-center justify-center text-[9px] shadow border border-white/20">
            <span>{`${(prod2.price / 1000).toFixed(0)}K`}</span>
          </div>

          <div className="max-w-[62%] space-y-1.5 z-10 pr-6">
            <span className="bg-[#EFD33D] text-gray-900 text-[10px] font-bold px-2.5 py-0.5 uppercase rounded-sm inline-block tracking-wider">
              {prod2.category || "SPESIAL KONVEKSI"}
            </span>

            <Link to={`/product/${prod2.id}`} className="block">
              <h3 className="text-sm font-extrabold text-white leading-snug line-clamp-1 hover:text-[#FA8232] transition-colors">
                {prod2.title}
              </h3>
            </Link>

            {prod2.short_description ? (
              <p className="text-[11px] text-gray-400 font-normal line-clamp-2">
                {prod2.short_description}
              </p>
            ) : null}

            <p className="text-xs font-black text-amber-300">
              Rp {prod2.price.toLocaleString("id-ID")}
            </p>

            <div className="pt-1 flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => handleAddToCart(e, prod2)}
                className="flex-1 bg-[#FA8232] hover:bg-[#e07228] text-white font-bold px-3 h-11 rounded-xl flex items-center justify-center gap-1 text-xs uppercase shadow active:scale-95 cursor-pointer"
              >
                <span>{addedIds[prod2.id] ? "DITAMBAH" : "BELI"}</span>
                {addedIds[prod2.id] ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </button>

              <Link
                to={`/product/${prod2.id}`}
                className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center hover:bg-white hover:text-zinc-900 transition-colors shrink-0"
                title="Lihat Detail Produk"
                aria-label="Lihat Detail"
              >
                <Eye className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={(e) => handleToggleWishlist(e, prod2)}
                className={cn(
                  "w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center transition-colors cursor-pointer shrink-0",
                  isWished2 && "bg-rose-950/60 border-rose-600 text-rose-500"
                )}
                title={isWished2 ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                aria-label="Wishlist"
              >
                <Heart className={cn("w-4 h-4", isWished2 && "fill-current text-rose-500")} />
              </button>
            </div>
          </div>

          <Link to={`/product/${prod2.id}`} className="w-[36%] h-full flex items-center justify-center relative z-0 p-1">
            <img
              src={prod2.image || "/images/desain-jersey-2.jpg"}
              alt={prod2.title}
              className="max-h-36 max-w-full object-contain drop-shadow-md"
            />
          </Link>
        </div>
      )}
    </section>
  );
}

