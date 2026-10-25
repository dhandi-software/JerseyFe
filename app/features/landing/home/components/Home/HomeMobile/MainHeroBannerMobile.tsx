import React from "react";
import { Link } from "react-router";
import { ArrowRight, Heart } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { useWishlist } from "~/hooks/useWishlist";
import { useProducts } from "~/hooks/useProducts";
import { Skeleton } from "~/components/ui/skeleton";
import { HomeProductEmptyState } from "../HomeProductEmptyState";

export function MainHeroBannerMobile() {
  const { addToWishlist, isInWishlist } = useWishlist();
  const { products, loading: productsLoading } = useProducts();
  const premierProduct = products[0] || null;
  const secondaryProduct = products[1] || products[0] || null;

  if (productsLoading) {
    return (
      <div className="w-full font-sans space-y-4">
        <div className="bg-[#F2F4F5] rounded-2xl p-5 border border-zinc-200/60 space-y-4 animate-pulse">
          <div className="space-y-2">
            <Skeleton className="h-3 w-28 bg-zinc-200 rounded" />
            <Skeleton className="h-6 w-52 bg-zinc-200 rounded" />
            <Skeleton className="h-3 w-3/4 bg-zinc-200/70 rounded" />
          </div>
          <Skeleton className="w-full h-44 rounded-xl bg-zinc-200/80" />
          <Skeleton className="w-full h-12 rounded-xl bg-zinc-200" />
        </div>
        <div className="grid grid-cols-1 gap-3">
          <Skeleton className="w-full h-32 rounded-2xl bg-zinc-200" />
          <Skeleton className="w-full h-32 rounded-2xl bg-zinc-200" />
        </div>
      </div>
    );
  }

  if (!premierProduct) {
    return (
      <div className="w-full font-sans space-y-4">
        <HomeProductEmptyState
          compact
          title="Produk Unggulan Sedang Disiapkan"
          description="Admin FCSV belum mengunggah produk pilihan ke katalog saat ini. Silakan pesan custom jersey."
          actionText="Pesan Custom Jersey"
          actionHref="/customer/custom-jersey"
        />
      </div>
    );
  }

  return (
    <div className="w-full font-sans space-y-4">
      {/* 1. Main Hero Card */}
      <div className="bg-[#F2F4F5] text-zinc-900 rounded-2xl p-5 relative overflow-hidden flex flex-col shadow-2xs border border-zinc-200/60">
        {/* Top Header */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-[2px] bg-[#2DA5F3]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2DA5F3]">
              FCSV AUTHENTIC
            </span>
          </div>
          <Link to={`/product/${premierProduct.id}`} className="block">
            <h1 className="text-xl font-extrabold tracking-tight text-[#191C1F] leading-tight line-clamp-2 hover:text-[#FA8232] transition-colors">
              {premierProduct.title}
            </h1>
          </Link>
          <p className="text-xs text-[#5F6C72] leading-relaxed line-clamp-2">
            {premierProduct.description || "Wujudkan jersey impian tim Anda dengan material dryfit berteknologi breathable dan sublimasi tajam."}
          </p>
        </div>

        {/* Dedicated Product Showcase Frame with Price Badge */}
        <div className="w-full my-3.5 h-48 bg-white/80 rounded-xl border border-zinc-200/70 p-2 relative flex items-center justify-center overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => addToWishlist({
              id: String(premierProduct.id),
              name: premierProduct.title,
              price: premierProduct.price,
              image: premierProduct.image || "/images/jersey_hero.webp",
              stockStatus: "IN STOCK",
              category: premierProduct.category,
            })}
            className={cn(
              "absolute top-2.5 left-2.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-zinc-600 shadow-md z-10 transition-colors cursor-pointer",
              isInWishlist(premierProduct.id) && "text-rose-600 bg-rose-50"
            )}
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className={cn("w-4 h-4", isInWishlist(premierProduct.id) && "fill-current text-rose-600")} />
          </button>

          <Link to={`/product/${premierProduct.id}`} className="w-full h-full flex items-center justify-center">
            <img
              src={premierProduct.image || "/images/jersey_hero.webp"}
              alt={premierProduct.title}
              className="w-full h-full object-contain drop-shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/mockup-jersey.jpg";
              }}
            />
          </Link>
          <div className="absolute top-2.5 right-2.5 bg-[#2DA5F3] text-white font-extrabold text-[10px] text-center w-12 h-12 rounded-full flex flex-col items-center justify-center border-2 border-white shadow-md z-10 leading-tight">
            <span className="text-[8px] font-semibold opacity-90">START</span>
            <span className="text-[11px] font-black">
              {`${(premierProduct.price / 1000).toFixed(0)}K`}
            </span>
          </div>
        </div>

        {/* Full-width CTA & Navigation Dots */}
        <div className="space-y-3">
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Button
              asChild
              className="w-full bg-[#FA8232] hover:bg-[#e06d20] text-white font-bold h-12 rounded-xl text-xs uppercase tracking-wider gap-2 shadow-md active:scale-[0.99] transition-all cursor-pointer"
            >
              <Link to={`/product/${premierProduct.id}`}>
                <span>PESAN SEKARANG</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            <Link
              to={`/product/${premierProduct.id}`}
              className="w-12 h-12 rounded-xl border border-zinc-300 bg-white text-zinc-700 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-colors"
              title="Lihat Detail Produk"
              aria-label="Lihat Detail"
            >
              <span className="text-xs font-bold">INFO</span>
            </Link>
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-0.5">
            <span className="w-3.5 h-1.5 rounded-full bg-[#191C1F]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#ADB7BC]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#ADB7BC]" />
          </div>
        </div>
      </div>

      {/* 2. Mobile Promo Cards Grid */}
      <div className="grid grid-cols-1 gap-3">
        {/* Top Card: Premier Product */}
        <div className="bg-[#191C1F] text-white rounded-2xl p-4 relative overflow-hidden flex items-center justify-between gap-3 min-h-[140px] shadow-xs">
          <div className="space-y-1.5 z-10 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                {premierProduct.category || "JERSEY TERBARU"}
              </span>
              <span className="bg-amber-400 text-zinc-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">
                HOT
              </span>
            </div>
            <Link to={`/product/${premierProduct.id}`} className="block">
              <h3 className="text-sm font-bold leading-tight text-white line-clamp-1 hover:text-[#FA8232] transition-colors">
                {premierProduct.title}
              </h3>
            </Link>
            <p className="text-xs text-amber-300 font-extrabold">
              Rp {premierProduct.price.toLocaleString("id-ID")}
            </p>
            <div className="pt-1 flex items-center gap-2">
              <Button
                asChild
                size="sm"
                className="bg-[#FA8232] hover:bg-[#e06d20] text-white text-[11px] font-bold px-3.5 h-11 gap-1.5 rounded-xl cursor-pointer flex-1"
              >
                <Link to={`/product/${premierProduct.id}`}>
                  <span>ORDER SEKARANG</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
              <button
                type="button"
                onClick={() => addToWishlist({
                  id: String(premierProduct.id),
                  name: premierProduct.title,
                  price: premierProduct.price,
                  image: premierProduct.image || "/images/Kain-Jersey-Serena.jpg",
                  stockStatus: "IN STOCK",
                  category: premierProduct.category,
                })}
                className={cn(
                  "w-11 h-11 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-zinc-700",
                  isInWishlist(premierProduct.id) && "text-rose-500 bg-rose-950/60 border-rose-600"
                )}
                aria-label="Wishlist"
              >
                <Heart className={cn("w-4 h-4", isInWishlist(premierProduct.id) && "fill-current text-rose-500")} />
              </button>
            </div>
          </div>

          <Link to={`/product/${premierProduct.id}`} className="w-24 h-24 shrink-0 rounded-xl bg-zinc-800/80 p-1 flex items-center justify-center overflow-hidden border border-zinc-700/60">
            <img
              src={premierProduct.image || "/images/Kain-Jersey-Serena.jpg"}
              alt={premierProduct.title}
              className="w-full h-full object-contain drop-shadow-md"
            />
          </Link>
        </div>

        {/* Bottom Card: Secondary Product */}
        {secondaryProduct && (
          <div className="bg-[#F2F4F5] text-zinc-900 rounded-2xl p-4 flex items-center justify-between gap-3 min-h-[140px] border border-zinc-200/80 shadow-xs">
            <div className="space-y-1.5 z-10 flex-1 min-w-0">
              <span className="text-[10px] font-bold text-[#FA8232] uppercase tracking-wider block">
                {secondaryProduct.category || "BAHAN PILIHAN"}
              </span>
              <Link to={`/product/${secondaryProduct.id}`} className="block">
                <h3 className="text-sm font-bold leading-tight text-[#191C1F] line-clamp-1 hover:text-[#FA8232] transition-colors">
                  {secondaryProduct.title}
                </h3>
              </Link>
              <p className="text-xs font-extrabold text-[#D25026]">
                Rp {secondaryProduct.price.toLocaleString("id-ID")}
              </p>
              <div className="pt-1 flex items-center gap-2">
                <Button
                  asChild
                  size="sm"
                  className="bg-[#FA8232] hover:bg-[#e06d20] text-white text-[11px] font-bold px-3.5 h-11 gap-1.5 rounded-xl cursor-pointer flex-1"
                >
                  <Link to={`/product/${secondaryProduct.id}`}>
                    <span>LIHAT PRODUK</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
                <button
                  type="button"
                  onClick={() => addToWishlist({
                    id: String(secondaryProduct.id),
                    name: secondaryProduct.title,
                    price: secondaryProduct.price,
                    image: secondaryProduct.image || "/images/Kain-Jersey-Paragon.jpg",
                    stockStatus: "IN STOCK",
                    category: secondaryProduct.category,
                  })}
                  className={cn(
                    "w-11 h-11 rounded-xl bg-white text-zinc-600 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer border border-zinc-200",
                    isInWishlist(secondaryProduct.id) && "text-rose-600 bg-rose-50 border-rose-300"
                  )}
                  aria-label="Wishlist"
                >
                  <Heart className={cn("w-4 h-4", isInWishlist(secondaryProduct.id) && "fill-current text-rose-600")} />
                </button>
              </div>
            </div>

            <Link to={`/product/${secondaryProduct.id}`} className="w-24 h-24 shrink-0 flex items-center justify-center p-1 rounded-xl bg-white overflow-hidden border border-zinc-200/80">
              <img
                src={secondaryProduct.image || "/images/Kain-Jersey-Paragon.jpg"}
                alt={secondaryProduct.title}
                className="w-full h-full object-contain drop-shadow-md"
              />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

