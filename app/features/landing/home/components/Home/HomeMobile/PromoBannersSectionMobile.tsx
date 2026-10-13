import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router";
import { useCart } from "~/context/CartContext";
import { useProducts } from "~/hooks/useProducts";
import { Skeleton } from "~/components/ui/skeleton";
import { HomeProductEmptyState } from "../HomeProductEmptyState";

export function PromoBannersSectionMobile() {
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const promoProducts = products.filter(
    (p) => Boolean(p.is_best_deal || (p.discount_price && p.discount_price < p.price))
  );
  const prod1 = promoProducts[0];
  const prod2 = promoProducts[1] || promoProducts[0];

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    if (!product) return;
    addToCart({
      id: String(product.id),
      title: product.title,
      price: `Rp ${product.price.toLocaleString("id-ID")}`,
      image: product.image,
    });

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
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

  if (promoProducts.length === 0 || !prod1) {
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

  return (
    <section className="w-full my-6 space-y-4">
      {/* 1. Mobile Banner 1 */}
      <div className="bg-[#F2F4F5] rounded-2xl p-5 flex items-center justify-between relative overflow-hidden shadow-sm">
        <div className="max-w-[60%] space-y-2 z-10">
          <span className="bg-[#2DA5F3] text-white text-[10px] font-semibold px-2.5 py-0.5 uppercase rounded-sm inline-block tracking-wider">
            {prod1.category || "PROMO SPESIAL"}
          </span>

          <h3 className="text-base font-extrabold text-[#191C1E] leading-snug line-clamp-1">
            {prod1.title}
          </h3>

          {prod1.short_description ? (
            <p className="text-[11px] text-gray-500 font-normal line-clamp-2">
              {prod1.short_description}
            </p>
          ) : null}

          <p className="text-xs font-black text-[#191C1F]">
            Rp {prod1.price.toLocaleString("id-ID")}
          </p>

          <button
            type="button"
            onClick={(e) => handleAddToCart(e, prod1)}
            className="mt-1 bg-[#FA8232] hover:bg-[#e07228] text-white font-bold px-4 h-11 rounded-lg flex items-center gap-1.5 text-xs uppercase shadow active:scale-95 cursor-pointer"
          >
            <span>{addedIds[prod1.id] ? "DITAMBAH" : "PESAN SEKARANG"}</span>
            {addedIds[prod1.id] ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <div className="w-[38%] h-full flex items-center justify-center relative z-0 p-2">
          <img
            src={prod1.image || "/images/desain-jersey.jpg"}
            alt={prod1.title}
            className="max-h-36 max-w-full object-contain drop-shadow-md"
          />
        </div>
      </div>

      {/* 2. Mobile Banner 2 */}
      <div className="bg-[#191C1E] text-white rounded-2xl p-5 flex items-center justify-between relative overflow-hidden shadow-sm">
        <div className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-[#2DA5F3] text-white font-bold flex flex-col items-center justify-center text-[10px] shadow border border-white/20">
          <span>{`${(prod2.price / 1000).toFixed(0)}K`}</span>
        </div>

        <div className="max-w-[60%] space-y-2 z-10">
          <span className="bg-[#EFD33D] text-gray-900 text-[10px] font-bold px-2.5 py-0.5 uppercase rounded-sm inline-block tracking-wider">
            {prod2.category || "SPESIAL KONVEKSI"}
          </span>

          <h3 className="text-base font-extrabold text-white leading-snug line-clamp-1">
            {prod2.title}
          </h3>

          {prod2.short_description ? (
            <p className="text-[11px] text-gray-400 font-normal line-clamp-2">
              {prod2.short_description}
            </p>
          ) : null}

          <p className="text-xs font-black text-amber-300">
            Rp {prod2.price.toLocaleString("id-ID")}
          </p>

          <button
            type="button"
            onClick={(e) => handleAddToCart(e, prod2)}
            className="mt-1 bg-[#FA8232] hover:bg-[#e07228] text-white font-bold px-4 h-11 rounded-lg flex items-center gap-1.5 text-xs uppercase shadow active:scale-95 cursor-pointer"
          >
            <span>{addedIds[prod2.id] ? "DITAMBAH" : "BELI SEKARANG"}</span>
            {addedIds[prod2.id] ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <div className="w-[38%] h-full flex items-center justify-center relative z-0 p-2">
          <img
            src={prod2.image || "/images/desain-jersey-2.jpg"}
            alt={prod2.title}
            className="max-h-36 max-w-full object-contain drop-shadow-md"
          />
        </div>
      </div>
    </section>
  );
}

