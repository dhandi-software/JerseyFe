import React, { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Star, Heart, ShoppingCart, Eye, RefreshCw, Check } from "lucide-react";
import { cn, getProductDetailUrl } from "~/lib/utils";
import { useCart } from "~/context/CartContext";
import { useBestDeals } from "~/hooks/useBestDeals";
import { BestDealsSkeleton } from "~/features/landing/home/components/Home/HomeProductSkeletons";
import { HomeProductEmptyState } from "~/features/landing/home/components/Home/HomeProductEmptyState";

export function BestDealsSection() {
  const { addToCart } = useCart();
  const { featuredDeal, gridDeals, bestDeals, timeRemainingString, loading } = useBestDeals();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const handleAddToCart = (e: React.MouseEvent, deal: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: deal.id,
      title: deal.title,
      price: deal.price,
      image: deal.image,
    });
    setAddedIds((prev) => ({ ...prev, [deal.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [deal.id]: false }));
    }, 1500);
  };

  const renderStars = (rating: number = 5) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className="size-3.5 fill-[#FA8232] text-[#FA8232]"
        />
      );
    }
    return stars;
  };

  return (
    <section className="w-full font-sans space-y-6 pt-4">
      {/* 1. Header with Title, Dynamic Timer, and Browse All Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
            Best Deals FCSV
          </h2>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 bg-zinc-100 px-3 py-1.5 rounded-sm">
            <span>Berakhir dalam:</span>
            <span className="bg-[#EFD33D] text-zinc-950 font-extrabold px-2 py-0.5 rounded-xs font-mono">
              {timeRemainingString}
            </span>
          </div>
        </div>

        <Link
          to="/category"
          className="text-xs font-bold text-[#2DA5F3] hover:text-[#1982c7] transition-colors flex items-center gap-1 group cursor-pointer"
        >
          <span>Lihat Semua Produk</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* 2. Main Grid Layout */}
      {loading ? (
        <BestDealsSkeleton />
      ) : bestDeals.length === 0 ? (
        <HomeProductEmptyState
          title="Belum Ada Promo Best Deals"
          description="Saat ini belum ada produk promo khusus dari admin. Anda tetap dapat menjelajahi koleksi jersey lainnya atau memesan custom jersey."
          actionText="Pesan Custom Jersey"
          actionHref="/customer/custom-jersey"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          {/* A. Left Featured Deal Card */}
          {featuredDeal && (
            <div className="lg:col-span-1 bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative group hover:border-[#FA8232]/50 hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {featuredDeal.badge && (
                    <span className="bg-[#EE5858] text-white text-[11px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                      {featuredDeal.badge.text}
                    </span>
                  )}
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    UNGGULAN
                  </span>
                </div>

                <div className="w-full aspect-square flex items-center justify-center p-4 overflow-hidden rounded-xl bg-zinc-50">
                  <img
                    src={featuredDeal.image}
                    alt={featuredDeal.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    {renderStars(featuredDeal.rating)}
                    <span className="text-[11px] text-zinc-500 font-medium">
                      ({featuredDeal.reviewsCount})
                    </span>
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-zinc-900 line-clamp-2 leading-snug group-hover:text-[#FA8232] transition-colors">
                    {featuredDeal.title}
                  </h3>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-lg font-extrabold text-[#2DA5F3]">
                      {featuredDeal.price}
                    </span>
                    {featuredDeal.originalPrice && (
                      <span className="text-xs text-zinc-400 line-through">
                        {featuredDeal.originalPrice}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {featuredDeal.description}
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={(e) => handleAddToCart(e, featuredDeal)}
                  className="w-full bg-[#FA8232] hover:bg-[#e06d20] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
                >
                  {addedIds[featuredDeal.id] ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>BERHASIL DITAMBAHKAN</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>TAMBAH KE KERANJANG</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* B. Right 8-Item Product Grid */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            {gridDeals.map((deal) => {
              const isAdded = addedIds[deal.id];
              return (
                <div
                  key={deal.id}
                  className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col justify-between shadow-2xs relative group hover:border-[#FA8232]/50 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="relative w-full aspect-square flex items-center justify-center p-2 rounded-lg bg-zinc-50 overflow-hidden">
                      {deal.badge && (
                        <span className="absolute top-2 left-2 bg-[#FA8232] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider z-10">
                          {deal.badge.text}
                        </span>
                      )}
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        {renderStars(deal.rating)}
                        <span className="text-[10px] text-zinc-400">
                          ({deal.reviewsCount})
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-zinc-900 line-clamp-2 leading-snug group-hover:text-[#FA8232] transition-colors">
                        {deal.title}
                      </h4>

                      <div className="flex items-baseline gap-1.5 pt-1">
                        <span className="text-xs font-extrabold text-[#2DA5F3]">
                          {deal.price}
                        </span>
                        {deal.originalPrice && (
                          <span className="text-[10px] text-zinc-400 line-through">
                            {deal.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, deal)}
                      className={cn(
                        "w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                        isAdded
                          ? "bg-emerald-500 text-white"
                          : "bg-zinc-100 hover:bg-[#FA8232] text-zinc-700 hover:text-white"
                      )}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>DITAMBAHKAN</span>
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
        </div>
      )}
    </section>
  );
}
