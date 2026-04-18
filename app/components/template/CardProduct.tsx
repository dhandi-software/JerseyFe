import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface Product {
    id: number;
    title: string;
    price: number | string;
    image: string;
    category: string;
    stock: number;
}

interface CardProductProps {
    product: Product;
    onAdd: (product: any) => void;
    className?: string;
}

const formatRupiah = (number: number | string) => {
    const value = typeof number === "string" ? parseInt(number.replace(/[^0-9]/g, "")) : number;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

export function CardProduct({ product, onAdd, className }: CardProductProps) {
    return (
        <Card className={cn("overflow-hidden group flex flex-col h-full border-neutral-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-neutral-200/50 transition-all duration-500 rounded-[2rem] bg-white pt-0", className)}>
            <div className="relative aspect-square overflow-hidden bg-neutral-50 shrink-0">
                <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold text-neutral-900 shadow-sm border border-neutral-100">
                    Stok: {product.stock}
                </div>
            </div>
            
            <CardHeader className="p-5 pb-0 flex-none bg-transparent gap-0">
                <div className="text-[10px] uppercase font-black tracking-widest text-[#D25026] mb-1 italic">
                    {product.category}
                </div>
                <CardTitle className="text-[14px] font-bold text-neutral-900 group-hover:text-black line-clamp-1 transition-colors leading-tight">
                    {product.title}
                </CardTitle>
            </CardHeader>
            
            <CardContent className="p-4 flex-1 flex flex-col justify-end">
                <div className="text-[16px] font-black text-neutral-900 tracking-tight">
                    {typeof product.price === "number" ? formatRupiah(product.price) : product.price}
                </div>
            </CardContent>
            
            <CardFooter className="p-4 pt-0">
                <Button 
                    onClick={() => onAdd(product)}
                    className="w-full bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold h-10 transition-all shadow-md active:scale-95"
                >
                    ADD TO CART
                </Button>
            </CardFooter>
        </Card>
    );
}
