import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { productApi } from "~/api/productApi";
import { CategoryCarouselSkeleton } from "~/features/landing/home/components/Home/HomeProductSkeletons";
import { HomeProductEmptyState } from "~/features/landing/home/components/Home/HomeProductEmptyState";

interface CategoryDisplayItem {
  id: number | string;
  name: string;
  queryParam: string;
  image: string;
}

export function ShopByCategorySection() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<CategoryDisplayItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategoryData() {
      try {
        const prodRes = await productApi.getAll();
        const prods = Array.isArray(prodRes?.data) ? prodRes.data : [];

        if (prods.length > 0) {
          const catMap = new Map<string, string>();
          prods.forEach((p) => {
            const catName = p.category;
            if (catName && !catMap.has(catName) && p.image) {
              catMap.set(catName, p.image);
            }
          });

          // Only list real categories from products
          const list: CategoryDisplayItem[] = Array.from(catMap.entries()).map(([name, image], idx) => ({
            id: idx + 1,
            name,
            queryParam: name,
            image,
          }));

          setCategories(list);
        } else {
          setCategories([]);
        }
      } catch (e) {
        console.error("Gagal memuat kategori:", e);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryData();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -240, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 240, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full font-sans space-y-6 py-4 relative">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#191C1F] tracking-tight">
          Kategori Koleksi Baju Jersey
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          Pilihan model jersey dan apparel olahraga berkualitas sesuai katalog konveksi FCSV.
        </p>
      </div>

      {loading ? (
        <CategoryCarouselSkeleton />
      ) : categories.length === 0 ? (
        <HomeProductEmptyState
          title="Belum Ada Kategori Produk"
          description="Admin FCSV sedang memperbarui kategori produk. Anda tetap dapat langsung melakukan pemesanan jersey kustom bersama tim kami."
          actionText="Pesan Custom Jersey"
          actionHref="/customer/custom-jersey"
        />
      ) : (
        <div className="relative group/slider px-2">
          <button
            type="button"
            onClick={scrollLeft}
            title="Sebelumnya"
            aria-label="Kategori Sebelumnya"
            className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#FA8232] hover:bg-[#e06d20] text-white items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex items-center gap-4 overflow-x-auto scrollbar-none scroll-smooth py-2 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/category?category=${encodeURIComponent(cat.queryParam)}`)}
                className="bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col items-center justify-between text-center hover:border-[#FA8232]/60 hover:shadow-md transition-all duration-300 cursor-pointer group shrink-0 w-44 md:w-48 h-56"
              >
                <div className="w-32 h-32 flex items-center justify-center p-2 rounded-xl bg-zinc-50 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <h4 className="text-xs md:text-sm font-semibold text-[#191C1F] group-hover:text-[#FA8232] transition-colors mt-2 text-center line-clamp-1">
                  {cat.name}
                </h4>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={scrollRight}
            title="Berikutnya"
            aria-label="Kategori Berikutnya"
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#FA8232] hover:bg-[#e06d20] text-white items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
}
