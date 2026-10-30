import { Link } from "react-router";
import {
    Flame,
    Info,
    Heart,
    ShoppingCart,
    Check,
    ShieldCheck,
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { HomeCatalogProductCardProps } from "~/types";

export function HomeCatalogProductCard({
    item,
    isAddedToCart,
    isWishlisted,
    onAddToCart,
    onToggleWishlist,
}: HomeCatalogProductCardProps) {
    return (
        <article className="relative bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
            <div className="flex items-center justify-between pl-6 pt-3 pr-0">
                <div className="flex items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <ShieldCheck className="w-4 h-4 text-[#5B1D99]" />
                        <span>{item.brand}</span>
                    </span>
                    <button
                        type="button"
                        onClick={() => onToggleWishlist(item)}
                        aria-label={
                            isWishlisted
                                ? "Hapus dari Wishlist"
                                : "Simpan ke Wishlist"
                        }
                        className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer",
                            isWishlisted
                                ? "bg-rose-50 text-rose-600"
                                : "text-slate-400 hover:bg-slate-100 hover:text-rose-500",
                        )}
                    >
                        <Heart
                            className={cn(
                                "w-4 h-4",
                                isWishlisted && "fill-current text-rose-600",
                            )}
                        />
                    </button>
                </div>

                <div className="bg-[#F2F0FF] text-[#5B1D99] text-xs font-semibold px-4 py-1.5 rounded-bl-2xl max-w-[62%] truncate">
                    {item.category}
                </div>
            </div>

            <div className="px-6 pt-3 pb-6 flex-1 flex flex-col justify-between gap-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1 min-w-0">
                        <Link
                            to={`/product/${item.id}`}
                            className="block group-hover:text-[#5B1D99] transition-colors"
                        >
                            <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2">
                                {item.title}
                            </h3>
                        </Link>
                        <div className="space-y-0.5 text-xs text-slate-500 font-medium">
                            <p>Stok: {item.stockLabel}</p>
                            <p>Material: {item.materialGroup}</p>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-0.5">
                            {item.description}
                        </p>
                    </div>

                    <div className="relative shrink-0">
                        <Link
                            to={`/product/${item.id}`}
                            className="block w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200/70 overflow-hidden p-1"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        "/images/jersey_hero.webp";
                                }}
                            />
                        </Link>
                        <span
                            className={cn(
                                "absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs whitespace-nowrap",
                                !item.isAvailable
                                    ? "bg-rose-600"
                                    : item.isLowStock
                                      ? "bg-amber-500"
                                      : "bg-[#6A1B9A]",
                            )}
                        >
                            {!item.isAvailable
                                ? "HABIS"
                                : item.isLowStock
                                  ? "TIPIS"
                                  : "READY"}
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className={cn(
                                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
                                !item.isAvailable
                                    ? "bg-rose-50 text-rose-700"
                                    : "bg-pink-50 text-pink-700",
                            )}
                        >
                            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                            <span>{item.badgeLabel}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium">
                            <span>Bisa Custom Desain Tim</span>
                            <Info className="w-3.5 h-3.5 text-emerald-600" />
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                        <div>
                            <span className="text-xs text-slate-400 block">
                                Harga Satuan / Kg
                            </span>
                            <span className="text-base font-extrabold text-slate-900">
                                {item.formattedPrice}
                            </span>
                        </div>
                        <div>
                            <span className="text-xs text-slate-400 block">
                                Estimasi DP (50%)
                            </span>
                            <span className="text-base font-extrabold text-slate-900">
                                {item.formattedDpEstimate}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-[1fr_1fr_auto] gap-2.5 pt-1">
                        <Link
                            to={`/product/${item.id}`}
                            className="min-h-[48px] px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-xs sm:text-sm font-semibold flex items-center justify-center text-center transition-colors"
                        >
                            Detail
                        </Link>

                        <Link
                            to={`/customer/custom-jersey/detail/${item.id}`}
                            className="min-h-[48px] px-3 rounded-xl bg-[#240B36] hover:bg-[#3B1258] text-white text-xs sm:text-sm font-semibold flex items-center justify-center text-center transition-colors"
                        >
                            Pesan Jersey
                        </Link>

                        <button
                            type="button"
                            onClick={() => onAddToCart(item)}
                            title={
                                isAddedToCart
                                    ? "Sudah masuk keranjang"
                                    : "Tambah ke keranjang"
                            }
                            aria-label="Tambah ke keranjang"
                            className={cn(
                                "min-h-[48px] w-12 rounded-xl border flex items-center justify-center transition-colors cursor-pointer shrink-0",
                                isAddedToCart
                                    ? "bg-emerald-600 border-emerald-600 text-white"
                                    : "border-slate-200 bg-slate-50 hover:bg-purple-50 hover:border-purple-200 text-slate-700 hover:text-[#5B1D99]",
                            )}
                        >
                            {isAddedToCart ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <ShoppingCart className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}

