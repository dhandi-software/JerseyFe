import React, { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Star, ShoppingCart, RefreshCw, Check } from "lucide-react";
import { cn } from "~/lib/utils";
import { useCart } from "~/context/CartContext";
import { useBestDeals } from "~/hooks/useBestDeals";
import { BestDealsMobileSkeleton } from "~/features/landing/home/components/Home/HomeProductSkeletons";
import { HomeProductEmptyState } from "~/features/landing/home/components/Home/HomeProductEmptyState";

export function BestDealsSectionMobile() {
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
          className="size-3 fill-[#FA8232] text-[#FA8232]"
        />
      );
    }
    return stars;
  };

  return (
    <section className="w-full font-sans space-y-4 pt-2">
      {/* 1. Header with Title and Timer */}
      <div className="flex items-center justify-between gap-2 border-b border-zinc-200 pb-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">
            Best Deals FCSV
          </h2>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-sm self-start">
            <span>Berakhir:</span>
            <span className="bg-[#EFD33D] text-zinc-950 font-extrabold px-1.5 py-0.5 rounded-xs font-mono">
              {timeRemainingString}
            </span>
          </div>
        </div>

        <Link
          to="/category"
          className="text-xs font-bold text-[#2DA5F3] hover:text-[#1982c7] transition-colors flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>Semua</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <BestDealsMobileSkeleton />
      ) : bestDeals.length === 0 ? (
        <HomeProductEmptyState
          compact
          title="Belum Ada Promo Best Deals"
          description="Saat ini belum ada promo aktif. Anda tetap dapat menjelajahi produk lainnya atau memesan jersey kustom."
          actionText="Pesan Custom"
          actionHref="/customer/custom-jersey"
        />
      ) : (
        <div className="space-y-4">
          {/* A. Featured Deal Card */}
          {featuredDeal && (
            <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm relative group">
              <div className="flex items-center justify-between mb-3">
                {featuredDeal.badge && (
                  <span className="bg-[#EE5858] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                    {featuredDeal.badge.text}
                  </span>
                )}
                <span className="text-[10px] font-semibold text-zinc-500 uppercase">UNGGULAN</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-24 h-24 shrink-0 p-2 rounded-xl bg-zinc-50 flex items-center justify-center overflow-hidden">
                  <img
                    src={featuredDeal.image}
                    alt={featuredDeal.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center gap-1">
                    {renderStars(featuredDeal.rating)}
                    <span className="text-[10px] text-zinc-400">({featuredDeal.reviewsCount})</span>
                  </div>
                  <h3 className="text-xs font-bold text-zinc-900 line-clamp-2 leading-tight">
                    {featuredDeal.title}
                  </h3>
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-sm font-extrabold text-[#2DA5F3]">
                      {featuredDeal.price}
                    </span>
                    {featuredDeal.originalPrice && (
                      <span className="text-[10px] text-zinc-400 line-through">
                        {featuredDeal.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={(e) => handleAddToCart(e, featuredDeal)}
                  className="w-full bg-[#FA8232] hover:bg-[#e06d20] text-white font-bold h-11 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
                >
                  {addedIds[featuredDeal.id] ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>DITAMBAHKAN</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>BELI SEKARANG</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* B. Grid Deals */}
          <div className="grid grid-cols-2 gap-3">
            {gridDeals.map((deal) => {
              const isAdded = addedIds[deal.id];
              return (
                <div
                  key={deal.id}
                  className="bg-white border border-zinc-200 rounded-xl p-3 flex flex-col justify-between shadow-2xs relative"
                >
                  <div className="space-y-2">
                    <div className="relative w-full aspect-square flex items-center justify-center p-2 rounded-lg bg-zinc-50 overflow-hidden">
                      {deal.badge && (
                        <span className="absolute top-1.5 left-1.5 bg-[#FA8232] text-white text-[8px] font-bold px-1 py-0.5 rounded-xs uppercase tracking-wider z-10">
                          {deal.badge.text}
                        </span>
                      )}
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-[11px] font-semibold text-zinc-900 line-clamp-2 leading-tight">
                        {deal.title}
                      </h4>
                      <div className="flex items-baseline gap-1 pt-0.5">
                        <span className="text-xs font-extrabold text-[#2DA5F3]">
                          {deal.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, deal)}
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
        </div>
      )}
    </section>
  );
}
