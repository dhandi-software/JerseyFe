import { useState, useEffect } from "react";
import { Search, Trash2, ShoppingCart, CreditCard, ChevronUp, Loader2, Filter } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useCart } from "~/context/CartContext";
import { CardProduct } from "~/components/template/CardProduct";
import { adminApi } from "~/api/admin";
import { UPLOADS_URL } from "~/api/client";
import { cn } from "~/lib/utils";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "~/components/ui/sheet";

const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

export function ListCategoryMobile() {
    const { cart, addToCart, removeFromCart, updateQuantity, subtotal } = useCart();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua");
    const [uangDiterima, setUangDiterima] = useState("");
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [materials, setMaterials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const categories = ["Semua", "Jersey"];

    useEffect(() => {
        adminApi.getBahanBaju().then(res => {
            if (res.status === "success" && res.data.length > 0) {
                const mapped = res.data.map((m: any) => ({
                    id: m.id,
                    title: m.nama,
                    price: m.harga || 150000,
                    image: m.imageUrl ? `${UPLOADS_URL}${m.imageUrl}` : "https://via.placeholder.com/300?text=Jersey",
                    category: "Jersey",
                    status: m.status,
                    kuantitasKg: m.kuantitasKg,
                    rasioKonversi: m.rasioKonversi,
                    description: m.deskripsi || "Bahan jersey premium."
                }));
                setMaterials(mapped);
            }
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const filteredProducts = materials.filter(p => {
        const matchesCategory = selectedCategory === "Semua" || p.category === selectedCategory;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleCheckout = () => {
        if (cart.length === 0) return;

        const waNumber = "6285892720034";
        let message = "Halo FCSV, saya ingin memesan barang berikut:\n\n";
        
        cart.forEach(item => {
            message += `- ${item.product.title} (x${item.quantity}) - ${formatRupiah(item.product.price * item.quantity)}\n`;
        });

        message += `\n*Total: ${formatRupiah(subtotal)}*`;
        if (uangDiterima) {
            message += `\nUang Diterima: ${formatRupiah(Number(uangDiterima))}`;
        }

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, "_blank");
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] p-4 font-['Inter'] flex flex-col gap-6 pb-24">
            <div className="px-1 mb-2">
                <h1 className="text-3xl font-black text-neutral-900 tracking-tighter italic uppercase">List Category</h1>
                <div className="w-12 h-1.5 bg-neutral-900 mt-2 rounded-full"></div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-black transition-colors" />
                    <input 
                        type="text"
                        placeholder="Cari Koleksi Jersey..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-neutral-100 rounded-[1.25rem] text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer",
                                selectedCategory === cat 
                                    ? "bg-neutral-900 text-white shadow-md shadow-black/10" 
                                    : "bg-white border border-neutral-100 text-neutral-400"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
                    <p className="text-xs font-bold text-neutral-400">Memuat Koleksi...</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 mt-2">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <CardProduct 
                                key={product.id} 
                                product={product} 
                                onAdd={addToCart}
                                className="rounded-[1.25rem]"
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-neutral-200 flex flex-col items-center justify-center gap-4">
                            <Filter className="w-10 h-10 text-neutral-200" />
                            <span className="text-neutral-400 font-medium">Koleksi tidak ditemukan</span>
                        </div>
                    )}
                </div>
            )}

            {/* Permanent Bottom Cart Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-100 p-4 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                    <SheetTrigger asChild>
                        <button 
                            className={cn(
                                "w-full p-4 rounded-2xl flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer",
                                cart.length > 0 
                                    ? "bg-neutral-900 text-white shadow-xl shadow-black/20" 
                                    : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                            )}
                            disabled={cart.length === 0}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "p-2 rounded-xl",
                                    cart.length > 0 ? "bg-white/10" : "bg-neutral-200"
                                )}>
                                    <ShoppingCart className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col items-start translate-y-0.5">
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 opacity-60">
                                        {cart.length > 0 ? "Review Order" : "Belum Ada Pesanan"}
                                    </span>
                                    <span className="text-sm font-black italic uppercase tracking-tighter leading-none">
                                        {cart.length > 0 ? `${cart.length} Items Selected` : "Pilih Jersey Kamu"}
                                    </span>
                                </div>
                            </div>
                            {cart.length > 0 && (
                                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <span className="text-lg font-black tracking-tighter italic">{formatRupiah(subtotal)}</span>
                                    <div className="bg-white/10 p-1 rounded-full">
                                        <ChevronUp className="w-4 h-4" />
                                    </div>
                                </div>
                            )}
                        </button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="rounded-t-[2.5rem] p-0 h-[90vh] border-none shadow-2xl">
                        <div className="w-full h-full flex flex-col bg-white">
                            <div className="w-12 h-1.5 bg-neutral-200 mx-auto mt-4 rounded-full mb-2"></div>
                            <SheetHeader className="p-8 pb-4 border-b border-neutral-50 flex-none flex flex-row items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <SheetTitle className="text-2xl font-black text-neutral-900 tracking-tight italic uppercase flex items-center gap-2">
                                        <ShoppingCart className="w-6 h-6" />
                                        My Cart
                                    </SheetTitle>
                                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">{cart.length} Items in List</span>
                                </div>
                            </SheetHeader>

                            <div className={cn("flex-1 overflow-y-auto min-h-0 px-8 py-6 flex flex-col gap-8", cart.length > 2 && "scrollbar-thick")}>
                                {cart.map(item => (
                                    <div key={item.product.id} className="flex gap-5 items-start">
                                        <div className="w-24 h-24 rounded-2xl bg-neutral-50 overflow-hidden shrink-0 border border-neutral-100 p-2 flex items-center justify-center">
                                            <img src={item.product.image} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1 min-h-[96px]">
                                            <div>
                                                <div className="text-[14px] font-black text-neutral-900 leading-tight uppercase italic tracking-tighter">{item.product.title}</div>
                                                <div className="text-sm font-black text-[#D25026] mt-1">{formatRupiah(item.product.price)}</div>
                                            </div>
                                            <div className="flex justify-between items-center mt-auto">
                                                <div className="flex items-center gap-4 bg-[#FAFAFA] rounded-xl px-4 py-2 border border-neutral-100">
                                                    <button onClick={() => updateQuantity(item.product.id, -1)} className="text-neutral-400 font-bold">-</button>
                                                    <span className="text-[13px] font-black w-4 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.product.id, 1)} className="text-neutral-400 font-bold">+</button>
                                                </div>
                                                <button onClick={() => removeFromCart(item.product.id)} className="w-10 h-10 flex items-center justify-center text-neutral-200 hover:text-red-500 rounded-xl transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-8 pb-10 border-t border-neutral-50 bg-[#FAFAFA]/50 flex flex-col gap-6 flex-none">
                                <div className="w-full space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-neutral-400 font-black text-[10px] uppercase tracking-widest italic">Subtotal</span>
                                        <span className="font-bold text-neutral-600 text-sm">{formatRupiah(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
                                        <span className="text-neutral-900 font-black text-lg uppercase italic tracking-tighter">Total Amount</span>
                                        <span className="font-black text-neutral-900 text-2xl tracking-tighter">{formatRupiah(subtotal)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm transition-all focus-within:ring-2 ring-neutral-100">
                                    <div className="flex flex-col flex-1">
                                        <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic leading-none mb-1">Uang Diterima</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-neutral-300">Rp</span>
                                            <input 
                                                type="number" 
                                                value={uangDiterima}
                                                onChange={(e) => setUangDiterima(e.target.value)}
                                                placeholder="0"
                                                className="w-full bg-transparent border-none p-0 text-lg font-black text-neutral-900 focus:outline-none placeholder:text-neutral-100"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button 
                                    onClick={handleCheckout}
                                    className="w-full h-16 rounded-[1.5rem] text-[16px] font-black uppercase tracking-tighter shadow-xl shadow-black/10 active:scale-95 transition-all cursor-pointer"
                                    disabled={cart.length === 0}
                                >
                                    <CreditCard className="w-5 h-5 mr-3" />
                                    PROCEED CHECKOUT
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}

