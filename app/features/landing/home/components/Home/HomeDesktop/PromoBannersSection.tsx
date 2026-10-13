import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router";
import { useCart } from "~/context/CartContext";
import { useProducts } from "~/hooks/useProducts";
import { Skeleton } from "~/components/ui/skeleton";
import { HomeProductEmptyState } from "../HomeProductEmptyState";

export function PromoBannersSection() {
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
      <section className="w-full my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-100 rounded-2xl p-8 lg:p-10 flex items-center justify-between min-h-[300px]">
            <div className="max-w-[55%] space-y-3 flex-1">
              <Skeleton className="h-5 w-24 bg-zinc-200 rounded-sm" />
              <Skeleton className="h-7 w-48 bg-zinc-200 rounded" />
              <Skeleton className="h-4 w-36 bg-zinc-200/70 rounded" />
              <Skeleton className="h-6 w-28 bg-zinc-200 rounded" />
              <Skeleton className="h-10 w-36 bg-zinc-200 rounded-xl mt-2" />
            </div>
            <Skeleton className="w-36 h-36 rounded-xl bg-zinc-200/60" />
          </div>
          <div className="bg-zinc-900 rounded-2xl p-8 lg:p-10 flex items-center justify-between min-h-[300px]">
            <div className="max-w-[55%] space-y-3 flex-1">
              <Skeleton className="h-5 w-28 bg-zinc-700 rounded-sm" />
              <Skeleton className="h-7 w-48 bg-zinc-700 rounded" />
              <Skeleton className="h-4 w-36 bg-zinc-800 rounded" />
              <Skeleton className="h-6 w-28 bg-zinc-700 rounded" />
              <Skeleton className="h-10 w-36 bg-zinc-700 rounded-xl mt-2" />
            </div>
            <Skeleton className="w-36 h-36 rounded-xl bg-zinc-800" />
          </div>
        </div>
      </section>
    );
  }

  if (promoProducts.length === 0 || !prod1) {
    return (
      <section className="w-full my-8">
        <HomeProductEmptyState
          title="Promo Produk Sedang Disiapkan"
          description="Saat ini belum ada penawaran promo produk khusus dari admin. Anda tetap dapat menjelajahi katalog bahan atau memesan custom jersey."
          actionText="Pesan Custom Jersey"
          actionHref="/customer/custom-jersey"
        />
      </section>
    );
  }

  return (
    <section className="w-full my-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Banner Card */}
        <div className="bg-[#F2F4F5] rounded-2xl p-8 lg:p-10 flex items-center justify-between relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group min-h-[300px]">
          <div className="z-10 max-w-[55%] space-y-3">
            <span className="bg-[#2DA5F3] text-white text-[11px] font-semibold px-3 py-1 uppercase rounded-sm inline-block tracking-wider">
              {prod1.category || "PROMO SPESIAL"}
            </span>

            <h3 className="text-2xl lg:text-3xl font-extrabold text-[#191C1F] leading-tight line-clamp-2">
              {prod1.title}
            </h3>

            {prod1.short_description ? (
              <p className="text-xs lg:text-sm text-gray-500 font-normal leading-relaxed line-clamp-2">
                {prod1.short_description}
              </p>
            ) : null}

            <div className="text-lg font-black text-[#191C1F]">
              Rp {prod1.price.toLocaleString("id-ID")}
            </div>

            <button
              type="button"
              onClick={(e) => handleAddToCart(e, prod1)}
              className="mt-2 bg-[#FA8232] hover:bg-[#e07228] text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 text-xs lg:text-sm uppercase shadow transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span>{addedIds[prod1.id] ? "DITAMBAHKAN" : "PESAN SEKARANG"}</span>
              {addedIds[prod1.id] ? (
                <Check className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              )}
            </button>
          </div>

          <div className="w-[45%] h-full flex items-center justify-center relative z-0 p-4">
            <img
              src={prod1.image || "/images/desain-jersey.jpg"}
              alt={prod1.title}
              className="max-h-60 max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xl"
            />
          </div>
        </div>

        {/* Right Banner Card */}
        <div className="bg-[#191C1E] text-white rounded-2xl p-8 lg:p-10 flex items-center justify-between relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group min-h-[300px]">
          <div className="absolute top-6 right-6 z-20 w-16 h-16 rounded-full bg-[#2DA5F3] text-white font-bold flex flex-col items-center justify-center text-xs shadow-lg border-2 border-white/20">
            <span className="text-[10px] text-sky-100">PROMO</span>
            <span>{`${(prod2.price / 1000).toFixed(0)}K`}</span>
          </div>

          <div className="z-10 max-w-[55%] space-y-3">
            <span className="bg-[#EFD33D] text-gray-900 text-[11px] font-bold px-3 py-1 uppercase rounded-sm inline-block tracking-wider">
              {prod2.category || "SPESIAL KONVEKSI"}
            </span>

            <h3 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight line-clamp-2">
              {prod2.title}
            </h3>

            {prod2.short_description ? (
              <p className="text-[11px] lg:text-xs text-gray-400 font-normal leading-relaxed line-clamp-2">
                {prod2.short_description}
              </p>
            ) : null}

            <div className="text-lg font-black text-amber-300">
              Rp {prod2.price.toLocaleString("id-ID")}
            </div>

            <button
              type="button"
              onClick={(e) => handleAddToCart(e, prod2)}
              className="mt-2 bg-[#FA8232] hover:bg-[#e07228] text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 text-xs lg:text-sm uppercase shadow transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span>{addedIds[prod2.id] ? "DITAMBAHKAN" : "BELI SEKARANG"}</span>
              {addedIds[prod2.id] ? (
                <Check className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              )}
            </button>
          </div>

          <div className="w-[45%] h-full flex items-center justify-center relative z-0 p-4">
            <img
              src={prod2.image || "/images/desain-jersey-2.jpg"}
              alt={prod2.title}
              className="max-h-64 max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

