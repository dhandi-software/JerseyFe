import * as React from "react";
import { Link } from "react-router";
import { Heart, ShoppingCart, Eye, Check } from "lucide-react";
import { useProducts } from "~/hooks/useProducts";
import { useCart } from "~/context/CartContext";
import { useWishlist } from "~/hooks/useWishlist";
import { cn, formatRupiah } from "~/lib/utils";

interface ProductRelatedWidgetSectionProps {
  currentProductId: string | number;
  currentCategory?: string;
}

export function ProductRelatedWidgetSection({ currentProductId }: ProductRelatedWidgetSectionProps) {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const [addedIds, setAddedIds] = React.useState<Record<string, boolean>>({});

  const related = products
    .filter((p) => String(p.id) !== String(currentProductId))
    .slice(0, 4);

  if (loading || related.length === 0) {
    return null;
  }

  const handleAddToCart = (e: React.MouseEvent, p: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: p.id,
      title: p.title,
      price: p.price,
      image: p.image,
    });
    setAddedIds((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [p.id]: false }));
    }, 1500);
  };

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
          <p className="text-xs text-zinc-500 mt-0.5">
            Pilihan bahan kain & produk unggulan lainnya dari katalog resmi FCSV
          </p>
        </div>
        <Link
          to="/"
          className="text-xs font-bold text-[#D25026] hover:text-[#FA8232] transition-colors"
        >
          Lihat Semua Produk
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((prod) => {
          const isWished = isInWishlist(prod.id);
          const isAdded = addedIds[prod.id];
          const displayPrice = typeof prod.price === "number" ? formatRupiah(prod.price) : prod.price;

          return (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-zinc-200 p-4 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-[#FA8232]/50 transition-all duration-200 group"
            >
              <div>
                <div className="relative w-full aspect-square rounded-xl bg-zinc-50 p-2 overflow-hidden flex items-center justify-center">
                  <img
                    src={prod.image || "/images/jersey_hero.webp"}
                    alt={prod.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Action Overlay */}
                  <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 rounded-xl">
                    <button
                      type="button"
                      onClick={(e) => handleToggleWishlist(e, prod)}
                      className={cn(
                        "w-9 h-9 rounded-full bg-white flex items-center justify-center text-zinc-700 hover:bg-rose-50 hover:text-rose-600 shadow transition-all duration-200 cursor-pointer",
                        isWished && "bg-rose-50 text-rose-600 ring-2 ring-rose-300"
                      )}
                      title={isWished ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                      aria-label="Wishlist"
                    >
                      <Heart className={cn("w-4 h-4", isWished && "fill-current text-rose-600")} />
                    </button>

                    <Link
                      to={`/product/${prod.id}`}
                      className="w-9 h-9 rounded-full bg-[#FA8232] text-white flex items-center justify-center hover:bg-[#D25026] shadow transition-all duration-200"
                      title="Lihat Detail Produk"
                      aria-label="Lihat Detail Produk"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block truncate">
                    {prod.category || "Bahan Jersey"}
                  </span>
                  <Link
                    to={`/product/${prod.id}`}
                    className="text-xs font-bold text-zinc-900 line-clamp-2 leading-snug group-hover:text-[#D25026] transition-colors"
                  >
                    {prod.title}
                  </Link>
                  <p className="text-sm font-extrabold text-[#D25026] pt-1">
                    {displayPrice}
                  </p>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={(e) => handleAddToCart(e, prod)}
                  className={cn(
                    "w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                    isAdded
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-100 hover:bg-[#FA8232] text-zinc-800 hover:text-white"
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
                      <span>TAMBAH KERANJANG</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
