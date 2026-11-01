import { Link } from "react-router";
import {
    Info,
    Heart,
    ShieldCheck,
    Eye,
    Layers,
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { HomeCatalogProductCardProps } from "~/types";

export function HomeCatalogProductCard({
    item,
    isWishlisted,
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
                            "w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B1D99]",
                            isWishlisted
                                ? "bg-rose-50 text-rose-700"
                                : "text-slate-600 hover:bg-slate-100 hover:text-rose-600",
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

                <div className="bg-[#F2F0FF] text-[#4A148C] text-xs font-bold px-4 py-1.5 rounded-bl-2xl max-w-[62%] truncate">
                    {item.category}
                </div>
            </div>

            <div className="px-6 pt-3 pb-6 flex-1 flex flex-col justify-between gap-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1 min-w-0">
                        <Link
                            to={`/product/${item.id}`}
                            className="block group-hover:text-[#5B1D99] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B1D99] rounded-md"
                        >
                            <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2">
                                {item.title}
                            </h3>
                        </Link>
                        <div className="space-y-0.5 text-xs text-slate-600 font-medium">
                            <p>Ketersediaan: {item.stockLabel}</p>
                            <p>Material: {item.materialGroup}</p>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-0.5">
                            {item.description}
                        </p>
                    </div>

                    <div className="relative shrink-0">
                        <Link
                            to={`/product/${item.id}`}
                            aria-label={`Lihat detail ${item.title}`}
                            className="block w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200/80 overflow-hidden p-1 relative group/img focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B1D99]"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover rounded-xl group-hover/img:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        "/images/jersey_hero.webp";
                                }}
                            />
                            <span className="absolute inset-0 bg-slate-900/45 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                                <Eye className="w-5 h-5 text-white" />
                            </span>
                        </Link>
                        <span
                            className={cn(
                                "absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs whitespace-nowrap",
                                !item.isAvailable
                                    ? "bg-rose-700"
                                    : item.isLowStock
                                      ? "bg-amber-700"
                                      : "bg-[#5B1D99]",
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
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold",
                                !item.isAvailable
                                    ? "bg-rose-50 text-rose-800 border border-rose-200"
                                    : "bg-purple-50 text-[#4A148C] border border-purple-200",
                            )}
                        >
                            <Layers className="w-3.5 h-3.5" />
                            <span>{item.badgeLabel}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold">
                            <span>Bisa Custom Desain Tim</span>
                            <Info className="w-3.5 h-3.5 text-emerald-700" />
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                        <div>
                            <span className="text-[11px] font-semibold text-slate-600 block">
                                Kode Bahan
                            </span>
                            <span className="text-sm font-extrabold text-slate-900">
                                {item.sku}
                            </span>
                        </div>
                        <div>
                            <span className="text-[11px] font-semibold text-slate-600 block">
                                Stok Gudang
                            </span>
                            <span className="text-sm font-extrabold text-slate-900">
                                {item.stockLabel}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <Link
                            to={`/product/${item.id}`}
                            className="min-h-[48px] px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B1D99]"
                        >
                            <Eye className="w-4 h-4 shrink-0" />
                            <span>View Detail</span>
                        </Link>

                        <Link
                            to={`/customer/custom-jersey/detail/${item.id}`}
                            className="min-h-[48px] px-3 rounded-xl bg-[#240B36] hover:bg-[#3B1258] text-white text-xs sm:text-sm font-bold flex items-center justify-center text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B1D99]"
                        >
                            Pesan Jersey
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
