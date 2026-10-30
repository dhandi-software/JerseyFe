import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "~/lib/utils";
import { useCategoryStripScroll } from "~/hooks";
import type { HomeCategoryStripSectionProps } from "~/types";

export function HomeCategoryStripSection({
    categories,
    activeCategoryId,
    onSelectCategory,
    variant = "desktop",
}: HomeCategoryStripSectionProps) {
    const isMobile = variant === "mobile";
    const {
        scrollRef,
        hasOverflow,
        canScrollLeft,
        canScrollRight,
        handleScrollLeft,
        handleScrollRight,
    } = useCategoryStripScroll(categories.length);

    return (
        <section aria-label="Kategori Katalog" className="w-full relative">
            {!isMobile && hasOverflow && canScrollLeft && (
                <button
                    type="button"
                    onClick={handleScrollLeft}
                    aria-label="Geser kategori ke kiri"
                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-[#2B2738] hover:bg-[#191C1F] text-white items-center justify-center shadow-md cursor-pointer transition-transform active:scale-95"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            )}

            <div
                ref={scrollRef}
                className={cn(
                    "flex items-stretch gap-3.5 overflow-x-auto py-1 scroll-smooth",
                    hasOverflow && canScrollRight && "pr-12",
                    hasOverflow && canScrollLeft && "pl-12",
                )}
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {categories.map((cat) => {
                    const IconComponent = cat.icon;
                    const isActive = activeCategoryId === cat.id;

                    return (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => onSelectCategory(cat.id)}
                            className={cn(
                                "group shrink-0 rounded-2xl p-4 flex flex-col justify-between text-left transition-all cursor-pointer",
                                isMobile
                                    ? "w-[155px] h-[110px]"
                                    : "w-[184px] h-[120px]",
                                isActive
                                    ? "bg-white border-2 border-[#5B1D99] shadow-sm"
                                    : "bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-xs",
                            )}
                        >
                            <div className="flex items-start justify-between gap-2 w-full">
                                <span
                                    className={cn(
                                        "text-xs sm:text-sm font-semibold leading-snug line-clamp-2",
                                        isActive
                                            ? "text-slate-950 font-bold"
                                            : "text-slate-800 group-hover:text-purple-900",
                                    )}
                                >
                                    {cat.label}
                                </span>
                                <span
                                    className={cn(
                                        "text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0",
                                        isActive
                                            ? "bg-purple-100 text-purple-900"
                                            : "bg-slate-100 text-slate-600",
                                    )}
                                >
                                    {cat.count}
                                </span>
                            </div>

                            <div className="flex items-center justify-between w-full pt-2">
                                <div
                                    className={cn(
                                        "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                                        isActive
                                            ? "bg-purple-50 text-[#5B1D99]"
                                            : "bg-slate-50 text-[#5B1D99] group-hover:bg-purple-50",
                                    )}
                                >
                                    <IconComponent className="w-5 h-5 stroke-[1.8]" />
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {!isMobile && hasOverflow && canScrollRight && (
                <button
                    type="button"
                    onClick={handleScrollRight}
                    aria-label="Geser kategori ke kanan"
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-[#2B2738] hover:bg-[#191C1F] text-white items-center justify-center shadow-md cursor-pointer transition-transform active:scale-95"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            )}
        </section>
    );
}
