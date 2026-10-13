import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, PackageSearch } from "lucide-react";
import { Button } from "~/components/ui/button";
import { bannerApi } from "~/api/bannerApi";
import { useProducts } from "~/hooks/useProducts";
import { Skeleton } from "~/components/ui/skeleton";
import type { BannerItem } from "~/types/bannerTypes";

export function MainHeroBannerDesktop() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { products, loading: productsLoading } = useProducts();

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await bannerApi.getAll({ active: true });
        if (res.data && res.data.length > 0) {
          setBanners(res.data);
        }
      } catch (err) {
        console.error("Gagal memuat hero banner:", err);
      }
    };
    loadBanners();
  }, []);

  const activeBanner = banners.length > 0 ? banners[currentIndex] : null;
  const premierProduct = products[0] || null;
  const secondaryProduct = products[1] || products[0] || null;

  return (
    <div className="w-full font-sans">
      <div className="flex gap-6 items-stretch min-h-[440px]">
        {/* 1. MAIN HERO BANNER */}
        <div className="flex-1 bg-white/80 backdrop-blur-md border border-white/80 text-zinc-900 rounded-2xl p-8 md:p-10 relative overflow-hidden flex flex-col justify-between shadow-lg shadow-sky-950/5 min-w-0">
          <div className="flex items-center justify-center gap-8 lg:gap-12 my-auto z-10">
            <div className="space-y-3.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-6 h-[2px] bg-[#2DA5F3]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#2DA5F3]">
                  {activeBanner?.tagline || "FCSV AUTHENTIC APPAREL"}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-[#191C1F]">
                {activeBanner?.title || premierProduct?.title || "Konveksi Custom Jersey Premium"}
              </h1>
              <p className="text-xs md:text-sm text-[#5F6C72] leading-relaxed">
                {activeBanner?.subtitle ||
                  premierProduct?.description ||
                  "Wujudkan jersey impian tim Anda dengan material dryfit berteknologi breathable dan cetak sublimasi full print tajam."}
              </p>
              <div className="pt-2">
                <Button
                  asChild
                  size="md"
                  className="bg-[#FA8232] hover:bg-[#e06d20] text-white font-bold px-7 py-3.5 rounded-xl text-xs gap-2 shadow-md hover:translate-x-1 transition-all cursor-pointer"
                >
                  <Link to={activeBanner?.link_url || (premierProduct ? `/product/${premierProduct.id}` : "/customer/custom-jersey")}>
                    <span>{activeBanner?.button_text || "PESAN SEKARANG"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative w-[340px] h-[320px] flex items-center justify-center shrink-0">
              <img
                src={activeBanner?.image || premierProduct?.image || "/images/jersey_hero.png"}
                alt={activeBanner?.title || premierProduct?.title || "Custom Jersey"}
                className="w-full h-full object-contain drop-shadow-2xl scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/mockup-jersey.jpg";
                }}
              />
              <div className="absolute top-2 right-2 bg-[#2DA5F3] text-white font-extrabold text-xs text-center w-20 h-20 rounded-full flex items-center justify-center border-4 border-white shadow-xl z-20 px-1 leading-tight">
                {activeBanner?.price_badge || (premierProduct ? `Rp ${(premierProduct.price / 1000).toFixed(0)}K` : "CUSTOM ORDER")}
              </div>
            </div>
          </div>

          {banners.length > 1 && (
            <div className="flex items-center gap-2.5 z-20 pt-4">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? "w-3.5 h-3.5 bg-[#191C1F]"
                      : "w-2.5 h-2.5 bg-[#ADB7BC] hover:bg-[#191C1F]"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 2. RIGHT STACKED PROMO CARDS (DIRECT FROM ADMIN PRODUCTS) */}
        <div className="w-[360px] lg:w-[380px] shrink-0 flex flex-col justify-between gap-4">
          {productsLoading ? (
            <>
              <div className="flex-1 bg-zinc-900 text-white rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-md min-h-[215px]">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20 bg-zinc-700 rounded" />
                  <Skeleton className="h-5 w-36 bg-zinc-700 rounded" />
                  <Skeleton className="h-4 w-24 bg-zinc-800 rounded" />
                </div>
                <Skeleton className="h-9 w-32 bg-zinc-700 rounded-lg" />
              </div>
              <div className="flex-1 bg-white/80 backdrop-blur-md border border-white/80 rounded-2xl p-6 flex items-center justify-between gap-4 shadow-md min-h-[215px]">
                <Skeleton className="w-24 h-24 rounded-xl bg-zinc-100 shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-3 w-20 bg-zinc-100 rounded" />
                  <Skeleton className="h-5 w-32 bg-zinc-200 rounded" />
                  <Skeleton className="h-4 w-20 bg-zinc-200 rounded" />
                  <Skeleton className="h-8 w-28 bg-zinc-100 rounded-lg mt-2" />
                </div>
              </div>
            </>
          ) : !premierProduct ? (
            <div className="flex-1 bg-white/80 backdrop-blur-md border border-white/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-lg shadow-sky-950/5 min-h-[440px]">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#FA8232] mb-3">
                <PackageSearch className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-zinc-900">
                Produk Unggulan
              </h3>
              <p className="text-xs text-zinc-600 mt-2 w-full leading-relaxed">
                Admin belum menambahkan produk pilihan ke katalog. Anda dapat memesan jersey kustom secara langsung.
              </p>
              <Button
                asChild
                size="sm"
                className="mt-5 bg-[#FA8232] hover:bg-[#e06d20] text-white text-xs font-bold px-5 py-2.5 gap-1.5 rounded-xl cursor-pointer"
              >
                <Link to="/customer/custom-jersey">
                  <span>PESAN CUSTOM</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Card 1: Top Product from Admin */}
              <div className="flex-1 bg-[#191C1F] text-white rounded-2xl p-6 relative overflow-hidden flex items-center justify-between shadow-md min-h-[215px]">
                <div className="space-y-2 z-10 flex-1 min-w-0 pr-12">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    {premierProduct.category || "JERSEY TERBARU"}
                  </span>
                  <h3 className="text-lg font-bold leading-snug text-white line-clamp-1">
                    {premierProduct.title}
                  </h3>
                  <p className="text-xs text-zinc-300">
                    Rp {premierProduct.price.toLocaleString("id-ID")} / pcs
                  </p>
                  <div className="pt-2">
                    <Button
                      asChild
                      size="sm"
                      className="bg-[#FA8232] hover:bg-[#e06d20] text-white text-xs font-bold px-4 py-2 gap-1 rounded-lg cursor-pointer"
                    >
                      <Link to={`/product/${premierProduct.id}`}>
                        <span>ORDER SEKARANG</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <span className="absolute top-4 right-4 bg-amber-400 text-zinc-950 text-xs font-extrabold px-2.5 py-1 rounded-md shadow-xs z-20">
                  HOT
                </span>

                <img
                  src={premierProduct.image || "/images/Kain-Jersey-Serena.jpg"}
                  alt={premierProduct.title}
                  className="absolute -right-4 bottom-0 top-0 w-36 h-full object-contain pointer-events-none opacity-50 lg:opacity-75"
                />
              </div>

              {/* Card 2: Secondary Product from Admin */}
              {secondaryProduct && (
                <div className="flex-1 bg-white/80 backdrop-blur-md border border-white/80 rounded-2xl p-6 flex items-center justify-between gap-4 shadow-md min-h-[215px]">
                  <div className="w-28 h-28 shrink-0 flex items-center justify-center p-1 rounded-xl bg-zinc-50 overflow-hidden">
                    <img
                      src={secondaryProduct.image || "/images/Kain-Jersey-Paragon.jpg"}
                      alt={secondaryProduct.title}
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                  </div>

                  <div className="space-y-2 z-10 flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#FA8232] uppercase tracking-wider block">
                      {secondaryProduct.category || "BAHAN PILIHAN"}
                    </span>
                    <h3 className="text-base font-bold leading-tight text-[#191C1F] line-clamp-1">
                      {secondaryProduct.title}
                    </h3>
                    <p className="text-sm font-extrabold text-[#2DA5F3]">
                      Rp {secondaryProduct.price.toLocaleString("id-ID")}
                    </p>
                    <div className="pt-1">
                      <Button
                        asChild
                        size="sm"
                        className="bg-[#FA8232] hover:bg-[#e06d20] text-white text-xs font-bold px-4 py-2 gap-1 rounded-lg cursor-pointer"
                      >
                        <Link to={`/product/${secondaryProduct.id}`}>
                          <span>LIHAT PRODUK</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

