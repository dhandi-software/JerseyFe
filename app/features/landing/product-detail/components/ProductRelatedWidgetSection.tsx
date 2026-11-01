import * as React from "react";
import { Link } from "react-router";
import { Heart, Eye } from "lucide-react";
import { useProducts } from "~/hooks/useProducts";
import { useWishlist } from "~/hooks/useWishlist";
import { cn } from "~/lib/utils";

interface ProductRelatedWidgetSectionProps {
  currentProductId: string | number;
  currentCategory?: string;
}

export function ProductRelatedWidgetSection({
  currentProductId,
}: ProductRelatedWidgetSectionProps) {
  const { products, loading } = useProducts();
  const { addToWishlist, isInWishlist } = useWishlist();

  const related = products
    .filter((p) => String(p.id) !== String(currentProductId))
    .slice(0, 4);

  if (loading || related.length === 0) {
    return null;
  }

  const handleToggleWishlist = (e: React.MouseEvent, p: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist({
      id: p.id,
      name: p.title,
      price: p.price,
      image: p.image,
      stockStatus: "IN STOCK",
      category: p.category,
    });
  };

  return (
    <section className="mt-12 space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">
            Produk Jersey Terkait
          </h2>
          <p className="text-xs text-zinc-600 mt-0.5">
            Pilihan bahan kain & produk lainnya dari katalog resmi Admin FCSV
          </p>
        </div>
        <Link
          to="/category"
          className="text-xs font-bold text-[#B83B14] hover:text-zinc-900 transition-colors"
        >
          Lihat Semua di List Category
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {related.map((prod) => {
          const isWished = isInWishlist(prod.id);

          return (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-zinc-200 p-4 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-zinc-300 transition-all duration-200 group"
            >
              <div>
                <div className="relative w-full aspect-square rounded-xl bg-zinc-50 p-2 overflow-hidden flex items-center justify-center">
                  <img
                    src={prod.image || "/images/mockup-jersey.jpg"}
                    alt={prod.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/images/mockup-jersey.jpg";
                    }}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />

                  <button
                    type="button"
                    onClick={(e) => handleToggleWishlist(e, prod)}
                    className={cn(
                      "absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white flex items-center justify-center text-zinc-700 hover:bg-rose-50 hover:text-rose-600 shadow-xs border border-zinc-200 transition-all duration-200 cursor-pointer",
                      isWished &&
                        "bg-rose-50 text-rose-600 ring-2 ring-rose-300",
                    )}
                    title={
                      isWished ? "Hapus dari Favorit" : "Tambah ke Favorit"
                    }
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={cn(
                        "w-4 h-4",
                        isWished && "fill-current text-rose-600",
                      )}
                    />
                  </button>
                </div>

                <div className="mt-3 space-y-1">
                  <span className="text-[11px] font-bold text-[#B83B14] uppercase tracking-wider block truncate">
                    {prod.category || "Bahan Jersey"}
                  </span>
                  <Link
                    to={`/product/${prod.id}`}
                    className="text-sm font-extrabold text-zinc-900 line-clamp-1 leading-snug group-hover:text-[#B83B14] transition-colors block"
                  >
                    {prod.title}
                  </Link>
                  <p className="text-xs text-zinc-600 line-clamp-2 pt-0.5">
                    {prod.description ||
                      "Bahan kain jersey pilihan dari katalog FCSV Apparel."}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to={`/product/${prod.id}`}
                  className="w-full min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-zinc-900 hover:bg-[#B83B14] text-white flex items-center justify-center gap-1.5 transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Detail</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
