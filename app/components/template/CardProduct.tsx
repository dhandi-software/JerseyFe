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
}

interface CardProductProps {
    product: Product;
    onCustomize?: (product: any) => void;
    onPreview?: (product: any) => void;
    className?: string;
    // Legacy support for other pages
    onAdd?: (product: any) => void;
}

const formatRupiah = (number: number | string) => {
    const value = typeof number === "string" ? parseInt(number.replace(/[^0-9]/g, "")) : number;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

export function CardProduct({ product, onCustomize, onPreview, onAdd, className }: CardProductProps) {
    return (
        <Card className={cn("overflow-hidden group flex flex-col h-full border-neutral-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-neutral-200/50 transition-all duration-500 rounded-[2.5rem] bg-white pt-0", className)}>
            <div className="relative aspect-square overflow-hidden bg-neutral-50 shrink-0">
                <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className={cn(
                    "absolute top-5 right-5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl text-[10px] font-black shadow-sm border border-white/50 flex items-center gap-1",
                    product.status === "Habis" ? "text-red-500" : "text-emerald-600"
                )}>
                    {product.status ? (product.status === "Habis" ? "HABIS" : "TERSEDIA") : `${product.stock ?? 0} STOK`}
                    {product.kuantitasKg !== undefined && product.rasioKonversi !== undefined && (
                        <span className="text-slate-400 font-bold ml-1">
                            (~{(product.kuantitasKg * product.rasioKonversi).toFixed(1)}m)
                        </span>
                    )}
                </div>
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-3">
                    {onPreview && (
                        <div 
                            onClick={(e) => { e.stopPropagation(); onPreview(product); }}
                            className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center cursor-pointer hover:scale-110 active:scale-90 transition-all shadow-2xl border-4 border-white/20"
                        >
                            <Eye className="w-10 h-10 text-slate-900" strokeWidth={2.5} />
                        </div>
                    )}
                </div>
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
                        className="flex-1 bg-[#D25026] hover:bg-slate-900 text-white rounded-2xl text-[11px] font-black h-12 transition-all shadow-xl shadow-[#D25026]/10 active:scale-95 uppercase italic tracking-widest gap-2"
                    >
                        <CreditCard className="w-4 h-4" />
                        Order Now
                    </Button>
                ) : onAdd ? (
                    <Button 
                        onClick={(e) => { e.stopPropagation(); onAdd(product); }}
                        className="flex-1 bg-neutral-900 hover:bg-black text-white rounded-2xl text-[11px] font-black h-12 transition-all shadow-md active:scale-95 uppercase italic tracking-widest"
                    >
                        Add to Cart
                    </Button>
                ) : null}
            </CardFooter>
        </Card>
    );
}
