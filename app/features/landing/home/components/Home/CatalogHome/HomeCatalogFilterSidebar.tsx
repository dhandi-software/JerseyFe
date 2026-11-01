import {
    PackageCheck,
    Sparkles,
    Info,
    RotateCcw,
    Check,
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { HomeFilterSidebarProps } from "~/types";

export function HomeCatalogFilterSidebar({
    totalMatched,
    onlyAvailable,
    onToggleOnlyAvailable,
    onlyFeatured,
    onToggleOnlyFeatured,
    bulkOrderReady,
    onToggleBulkOrderReady,
    categoryOptions,
    selectedCategories,
    onToggleCategory,
    materialOptions,
    selectedMaterials,
    onToggleMaterial,
    onResetFilters,
}: HomeFilterSidebarProps) {
    return (
        <aside
            aria-label="Filter Katalog Produk"
            className="w-full lg:w-[280px] shrink-0 flex flex-col gap-2"
        >
            <div className="bg-[#F6F6F9] border border-slate-200/80 rounded-3xl p-4 space-y-5">
                <div className="space-y-3">
                    <div className="bg-white rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs border border-slate-100 min-h-[52px]">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center shrink-0">
                                <PackageCheck className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-semibold text-slate-800 truncate">
                                Ready Stock
                            </span>
                            <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={onlyAvailable}
                            aria-label="Filter Ready Stock"
                            onClick={onToggleOnlyAvailable}
                            className={cn(
                                "w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B1D99]",
                                onlyAvailable ? "bg-[#5B1D99]" : "bg-slate-300",
                            )}
                        >
                            <span
                                className={cn(
                                    "w-5 h-5 rounded-full bg-white shadow-xs transition-transform",
                                    onlyAvailable
                                        ? "translate-x-5"
                                        : "translate-x-0",
                                )}
                            />
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs border border-slate-100 min-h-[52px]">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-[#240B36] text-white flex items-center justify-center shrink-0">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-semibold text-slate-800 truncate">
                                Produk Unggulan
                            </span>
                            <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={onlyFeatured}
                            aria-label="Filter Produk Unggulan"
                            onClick={onToggleOnlyFeatured}
                            className={cn(
                                "w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B1D99]",
                                onlyFeatured ? "bg-[#5B1D99]" : "bg-slate-300",
                            )}
                        >
                            <span
                                className={cn(
                                    "w-5 h-5 rounded-full bg-white shadow-xs transition-transform",
                                    onlyFeatured
                                        ? "translate-x-5"
                                        : "translate-x-0",
                                )}
                            />
                        </button>
                    </div>
                </div>

                {categoryOptions.length > 0 && (
                    <>
                        <div className="h-px bg-slate-200/80" />

                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-900 tracking-wide">
                                Kategori Jersey
                            </h3>
                            <div className="space-y-2">
                                {categoryOptions.map((opt) => {
                                    const checked = selectedCategories.includes(
                                        opt.label,
                                    );
                                    return (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() =>
                                                onToggleCategory(opt.label)
                                            }
                                            className="w-full min-h-[40px] flex items-center gap-2.5 text-left group cursor-pointer py-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B1D99]"
                                        >
                                            <span
                                                className={cn(
                                                    "w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0",
                                                    checked
                                                        ? "bg-[#5B1D99] border-[#5B1D99] text-white"
                                                        : "bg-white border-slate-300 group-hover:border-[#5B1D99]",
                                                )}
                                            >
                                                {checked && (
                                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                                )}
                                            </span>
                                            <span className="text-xs font-medium text-slate-800 group-hover:text-slate-950 truncate">
                                                {opt.label}
                                            </span>
                                            <span className="text-xs text-slate-600 font-semibold shrink-0">
                                                ({opt.count})
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}

                {materialOptions.length > 0 && (
                    <>
                        <div className="h-px bg-slate-200/80" />

                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-slate-900 tracking-wide">
                                Jenis Bahan Kain
                            </h3>
                            <div className="space-y-2">
                                {materialOptions.map((opt) => {
                                    const checked = selectedMaterials.includes(
                                        opt.label,
                                    );
                                    return (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() =>
                                                onToggleMaterial(opt.label)
                                            }
                                            className="w-full min-h-[40px] flex items-center gap-2.5 text-left group cursor-pointer py-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B1D99]"
                                        >
                                            <span
                                                className={cn(
                                                    "w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0",
                                                    checked
                                                        ? "bg-[#5B1D99] border-[#5B1D99] text-white"
                                                        : "bg-white border-slate-300 group-hover:border-[#5B1D99]",
                                                )}
                                            >
                                                {checked && (
                                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                                )}
                                            </span>
                                            <span className="text-xs font-medium text-slate-800 group-hover:text-slate-950 truncate">
                                                {opt.label}
                                            </span>
                                            <span className="text-xs text-slate-600 font-semibold shrink-0">
                                                ({opt.count})
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}

                <div className="h-px bg-slate-200/80" />

                <div className="flex items-center justify-between gap-2 py-1">
                    <span className="text-xs font-medium text-slate-800">
                        Stok Partai Besar (min. 10 kg)
                    </span>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={bulkOrderReady}
                        aria-label="Filter Stok Partai Besar"
                        onClick={onToggleBulkOrderReady}
                        className={cn(
                            "w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B1D99]",
                            bulkOrderReady ? "bg-[#5B1D99]" : "bg-slate-300",
                        )}
                    >
                        <span
                            className={cn(
                                "w-5 h-5 rounded-full bg-white shadow-xs transition-transform",
                                bulkOrderReady
                                    ? "translate-x-5"
                                    : "translate-x-0",
                            )}
                        />
                    </button>
                </div>

                <div className="h-px bg-slate-200/80" />

                <button
                    type="button"
                    onClick={onResetFilters}
                    className="w-full min-h-[44px] flex items-center justify-center gap-2 text-xs font-bold text-[#5B1D99] hover:text-[#240B36] transition-colors cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B1D99]"
                >
                    <span>Reset semua filter</span>
                    <RotateCcw className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="bg-[#EAECEF] text-slate-800 font-bold text-xs sm:text-sm rounded-2xl py-3.5 px-4 text-center">
                Ditemukan {totalMatched} produk
            </div>
        </aside>
    );
}
