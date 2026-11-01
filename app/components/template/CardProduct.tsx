import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Eye, Shirt } from "lucide-react";

interface Product {
    id: number;
    title: string;
    price?: number | string;
    image: string;
    category: string;
    stock?: number;
    status?: string;
    kuantitasKg?: number;
    rasioKonversi?: number;
    description?: string;
}

interface CardProductProps {
    product: Product;
    onCustomize?: (product: any) => void;
    onPreview?: (product: any) => void;
    className?: string;
    onAdd?: (product: any) => void;
}

export function CardProduct({
    product,
    onCustomize,
    onPreview,
    onAdd,
    className,
}: CardProductProps) {
    const [imgSrc, setImgSrc] = useState(
        product.image || "/images/GambarBaju.png",
    );

    useEffect(() => {
        setImgSrc(product.image || "/images/GambarBaju.png");
    }, [product.image]);

    const getStatusConfig = () => {
        const statusLower = (product.status || "").toLowerCase().trim();
        if (
            statusLower === "habis" ||
            (product.kuantitasKg !== undefined && product.kuantitasKg <= 0)
        ) {
            return {
                label: "HABIS",
                isOutOfStock: true,
                badgeClass: "text-red-800 bg-red-50 border-red-200",
            };
        }
        if (statusLower === "menipis") {
            return {
                label: "MENIPIS",
                isOutOfStock: false,
                badgeClass: "text-amber-900 bg-amber-50 border-amber-200",
            };
        }
        return {
            label: "TERSEDIA",
            isOutOfStock: false,
            badgeClass: "text-emerald-900 bg-emerald-50 border-emerald-200",
        };
    };

    const statusConfig = getStatusConfig();

    return (
        <Card
            className={cn(
                "overflow-hidden group flex flex-col h-full border-neutral-200/80 shadow-xs hover:shadow-md hover:border-neutral-300 transition-all duration-300 rounded-3xl bg-white pt-0",
                className,
            )}
        >
            <div className="relative aspect-square overflow-hidden bg-neutral-100 shrink-0">
                <img
                    src={imgSrc}
                    alt={product.title}
                    onError={() => setImgSrc("/images/GambarBaju.png")}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Status Badge */}
                <div
                    className={cn(
                        "absolute top-2.5 right-2.5 sm:top-3 sm:right-3 px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-bold border flex items-center gap-1",
                        statusConfig.badgeClass,
                    )}
                >
                    <span>{statusConfig.label}</span>
                    {product.kuantitasKg !== undefined && (
                        <span className="font-semibold hidden sm:inline">
                            ({product.kuantitasKg} kg)
                        </span>
                    )}
                </div>

                {/* Overlay on Hover for Quick View */}
                {onPreview && (
                    <div className="absolute inset-0 bg-slate-900/55 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
                        <button
                            type="button"
                            aria-label={`Lihat detail produk ${product.title}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onPreview(product);
                            }}
                            className="min-h-[44px] px-4 py-2 rounded-2xl bg-white text-slate-900 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:bg-[#B83B14] hover:text-white active:scale-95 transition-all shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B83B14]"
                        >
                            <Eye className="w-4 h-4 stroke-[2.2]" />
                            <span>View Detail</span>
                        </button>
                    </div>
                )}
            </div>

            <CardHeader className="p-3 sm:p-4 pb-0 flex-none bg-transparent gap-0.5 sm:gap-1">
                <div className="text-[9px] sm:text-[10px] uppercase font-extrabold tracking-wider text-[#B83B14]">
                    {product.category}
                </div>
                {onPreview ? (
                    <button
                        type="button"
                        onClick={() => onPreview(product)}
                        className="text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B83B14] rounded-md cursor-pointer"
                    >
                        <CardTitle className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-[#B83B14] line-clamp-1 transition-colors leading-snug uppercase tracking-tight">
                            {product.title}
                        </CardTitle>
                    </button>
                ) : (
                    <CardTitle className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-1 leading-snug uppercase tracking-tight">
                        {product.title}
                    </CardTitle>
                )}
            </CardHeader>

            <CardContent className="px-3 sm:px-4 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3 flex-1 flex flex-col justify-between gap-2">
                <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                    {product.description ||
                        "Bahan kain jersey pilihan dari katalog resmi FCSV Apparel untuk seragam tim olahraga."}
                </p>
            </CardContent>

            <CardFooter className="p-3 sm:p-4 pt-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2">
                {onPreview && (
                    <Button
                        type="button"
                        variant={onCustomize ? "outline" : "default"}
                        onClick={(e) => {
                            e.stopPropagation();
                            onPreview(product);
                        }}
                        className={cn(
                            "min-h-[44px] px-3 rounded-xl text-[11px] font-extrabold uppercase tracking-wider gap-1.5 cursor-pointer transition-all active:scale-95 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B83B14]",
                            onCustomize
                                ? "border-slate-300 text-slate-800 hover:bg-slate-100 hover:text-slate-950"
                                : "flex-1 bg-slate-900 hover:bg-[#B83B14] text-white shadow-xs",
                        )}
                    >
                        <Eye className="w-3.5 h-3.5 shrink-0" />
                        <span>View</span>
                    </Button>
                )}

                {onCustomize ? (
                    <Button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onCustomize(product);
                        }}
                        disabled={statusConfig.isOutOfStock}
                        className={cn(
                            "flex-1 min-h-[44px] px-3 rounded-xl text-[11px] font-extrabold transition-all uppercase tracking-wider gap-1.5 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B83B14]",
                            statusConfig.isOutOfStock
                                ? "bg-neutral-200 text-neutral-600 cursor-not-allowed shadow-none"
                                : "bg-[#B83B14] hover:bg-slate-900 text-white shadow-xs active:scale-95",
                        )}
                    >
                        <Shirt className="w-3.5 h-3.5 shrink-0" />
                        <span>
                            {statusConfig.isOutOfStock ? "Habis" : "Custom"}
                        </span>
                    </Button>
                ) : !onPreview && onAdd ? (
                    <Button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAdd(product);
                        }}
                        disabled={statusConfig.isOutOfStock}
                        className={cn(
                            "flex-1 min-h-[44px] rounded-xl text-xs font-extrabold transition-all uppercase tracking-wider cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900",
                            statusConfig.isOutOfStock
                                ? "bg-neutral-200 text-neutral-600 cursor-not-allowed"
                                : "bg-slate-900 hover:bg-black text-white shadow-xs active:scale-95",
                        )}
                    >
                        {statusConfig.isOutOfStock ? "Stok Habis" : "Pilih Bahan"}
                    </Button>
                ) : null}
            </CardFooter>
        </Card>
    );
}
