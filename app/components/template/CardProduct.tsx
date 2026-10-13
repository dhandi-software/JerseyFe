import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Eye, CreditCard } from "lucide-react";

interface Product {
    id: number;
    title: string;
    price: number | string;
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

const formatRupiah = (number: number | string) => {
    const value = typeof number === "string" ? parseInt(number.replace(/[^0-9]/g, ""), 10) : number;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0);
};

export function CardProduct({ product, onCustomize, onPreview, onAdd, className }: CardProductProps) {
    const [imgSrc, setImgSrc] = useState(product.image || "/images/mockup-jersey.jpg");

    useEffect(() => {
        setImgSrc(product.image || "/images/mockup-jersey.jpg");
    }, [product.image]);

    const getStatusConfig = () => {
        const statusLower = (product.status || "").toLowerCase().trim();
        if (statusLower === "habis" || (product.kuantitasKg !== undefined && product.kuantitasKg <= 0)) {
            return {
                label: "HABIS",
                isOutOfStock: true,
                badgeClass: "text-red-700 bg-red-50 border-red-200"
            };
        }
        if (statusLower === "menipis") {
            return {
                label: "MENIPIS",
                isOutOfStock: false,
                badgeClass: "text-amber-800 bg-amber-50 border-amber-200"
            };
        }
        return {
            label: "TERSEDIA",
            isOutOfStock: false,
            badgeClass: "text-emerald-800 bg-emerald-50 border-emerald-200"
        };
    };

    const statusConfig = getStatusConfig();

    return (
        <Card className={cn("overflow-hidden group flex flex-col h-full border-neutral-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-neutral-200/50 transition-all duration-500 rounded-[2.5rem] bg-white pt-0", className)}>
            <div className="relative aspect-square overflow-hidden bg-neutral-50 shrink-0">
                <img 
                    src={imgSrc} 
                    alt={product.title} 
                    onError={() => setImgSrc("/images/mockup-jersey.jpg")}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                
                {/* Status Badge */}
                <div className={cn(
                    "absolute top-4 right-4 backdrop-blur-md px-3 py-1.5 rounded-2xl text-[10px] font-black shadow-sm border flex items-center gap-1.5",
                    statusConfig.badgeClass
                )}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span>{statusConfig.label}</span>
                    {product.kuantitasKg !== undefined && (
                        <span className="font-semibold opacity-80 ml-0.5">
                            ({product.kuantitasKg} kg{product.rasioKonversi ? ` • ~${(product.kuantitasKg * product.rasioKonversi).toFixed(1)}m` : ""})
                        </span>
                    )}
                </div>
                
                {/* Overlay on Hover */}
                {onPreview && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <button 
                            type="button"
                            aria-label={`Lihat detail ${product.title}`}
                            onClick={(e) => { e.stopPropagation(); onPreview(product); }}
                            className="w-16 h-16 rounded-[1.75rem] bg-white flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-xl"
                        >
                            <Eye className="w-8 h-8 text-neutral-900" strokeWidth={2.5} />
                        </button>
                    </div>
                )}
            </div>
            
            <CardHeader className="p-6 pb-0 flex-none bg-transparent gap-0">
                <div className="text-[10px] uppercase font-black tracking-widest text-[#D25026] mb-1 italic">
                    {product.category}
                </div>
                <CardTitle className="text-[15px] font-black text-slate-900 group-hover:text-black line-clamp-1 transition-colors leading-tight italic uppercase tracking-tighter">
                    {product.title}
                </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6 pt-2 flex-1 flex flex-col justify-end">
                <div className="text-[18px] font-black text-slate-900 tracking-tighter italic">
                    {typeof product.price === "number" ? formatRupiah(product.price) : product.price}
                </div>
            </CardContent>
            
            <CardFooter className="p-6 pt-0 flex gap-3">
                {onCustomize ? (
                    <Button 
                        onClick={(e) => { e.stopPropagation(); onCustomize(product); }}
                        disabled={statusConfig.isOutOfStock}
                        className={cn(
                            "flex-1 rounded-2xl text-[11px] font-black h-12 transition-all shadow-xl uppercase italic tracking-widest gap-2 cursor-pointer",
                            statusConfig.isOutOfStock
                                ? "bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none"
                                : "bg-[#D25026] hover:bg-neutral-900 text-white shadow-[#D25026]/10 active:scale-95"
                        )}
                    >
                        <CreditCard className="w-4 h-4" />
                        {statusConfig.isOutOfStock ? "Stok Habis" : "Order Now"}
                    </Button>
                ) : onAdd ? (
                    <Button 
                        onClick={(e) => { e.stopPropagation(); onAdd(product); }}
                        disabled={statusConfig.isOutOfStock}
                        className={cn(
                            "flex-1 rounded-2xl text-[11px] font-black h-12 transition-all uppercase italic tracking-widest cursor-pointer",
                            statusConfig.isOutOfStock
                                ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                                : "bg-neutral-900 hover:bg-black text-white shadow-md active:scale-95"
                        )}
                    >
                        {statusConfig.isOutOfStock ? "Stok Habis" : "Add to Cart"}
                    </Button>
                ) : null}
            </CardFooter>
        </Card>
    );
}
