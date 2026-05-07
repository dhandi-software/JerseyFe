import { useState } from "react";
import { kasirProducts } from "~/data/kasirData";
import { Search, Trash2, ShoppingCart, Filter, CreditCard } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useCart } from "~/context/CartContext";
import { CardProduct } from "~/components/template/CardProduct";
import { Card, CardHeader, CardContent, CardFooter, CardDescription } from "~/components/ui/card";
import { cn } from "~/lib/utils";

const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

export function ListCategoryDesktop() {
    const { cart, addToCart, removeFromCart, updateQuantity, subtotal } = useCart();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua");
    const [uangDiterima, setUangDiterima] = useState("");

    const categories = ["Semua", "Kaos", "Kemeja", "Celana", "Jaket"];

    const filteredProducts = kasirProducts.filter(p => {
        const matchesCategory = selectedCategory === "Semua" || p.category === selectedCategory;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleCheckout = () => {
        if (cart.length === 0) return;

        const waNumber = "6285892720034";
        let message = "Halo FSCV, saya ingin memesan barang berikut:\n\n";
        
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
        <div className="min-h-[calc(100vh-100px)] bg-[#FAFAFA] p-6 md:p-8 font-['Inter'] flex flex-col gap-8 max-w-[1600px] mx-auto w-full">
            {/* Page Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tighter italic uppercase">List Category</h1>
                    <p className="text-neutral-500 text-sm font-medium mt-1">Sistem Point of Sale FSCV</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-neutral-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-neutral-600">Terminal 01</span>
                    </div>
                </div>
            </div>

            <div className="flex items-start gap-8">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col gap-8">
                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 relative w-full group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-black transition-colors" />
                            <input 
                                type="text"
                                placeholder="Cari Koleksi Jersey..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-200 transition-all placeholder:text-neutral-300"
                            />
                        </div>
                        
                        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-neutral-100 flex gap-2 w-full md:w-auto">
                            {categories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={cn(
                                        "px-6 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider",
                                        selectedCategory === cat 
                                            ? "bg-neutral-900 text-white shadow-md shadow-black/10" 
                                            : "text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <CardProduct 
                                    key={product.id} 
                                    product={product} 
                                    onAdd={addToCart} 
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-neutral-200 flex flex-col items-center justify-center gap-4">
                                <Filter className="w-12 h-12 text-neutral-200" />
                                <span className="text-neutral-400 font-medium">Baju tidak ditemukan</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Cart */}
                <div className="w-[400px] border border-neutral-100 shadow-[0_20px_60px_rgba(0,0,0,0.04)] rounded-[2.5rem] flex flex-col shrink-0 sticky top-24 self-start bg-white h-[calc(100vh-10rem)] overflow-hidden ring-1 ring-black/5">
                    <div className="p-6 pb-2 border-b border-neutral-50 flex-none flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-2 italic uppercase">
                                <ShoppingCart className="w-5 h-5 text-[#D25026]" />
                                My Cart
                            </h2>
                            <div className="bg-neutral-900 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                {cart.length < 10 ? `0${cart.length}` : cart.length} Items
                            </div>
                        </div>
                        <p className="text-neutral-400 text-xs font-medium">Lengkapi pesanan Anda di bawah ini</p>
                    </div>

                    <div className={cn("flex-1 overflow-y-auto min-h-0", cart.length > 2 && "scrollbar-thick")}>
                        <div className="px-6 py-4 flex flex-col gap-4">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center text-center gap-4 opacity-30 pt-16 pb-32">
                                    <div className="p-8 bg-neutral-50 rounded-full border border-neutral-100 shadow-inner">
                                        <ShoppingCart className="w-16 h-16 text-neutral-300" />
                                    </div>
                                    <p className="text-neutral-400 text-[13px] font-black uppercase italic tracking-tighter">Keranjang Kosong</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.product.id} className="flex gap-4 group animate-in slide-in-from-right-2 duration-300">
                                        <div className="w-20 h-20 rounded-2xl bg-neutral-50 overflow-hidden shrink-0 ring-1 ring-black/5 shadow-sm p-1.5 flex items-center justify-center">
                                            <img src={item.product.image} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-0.5">
                                            <div>
                                                <div className="text-[14px] font-black text-neutral-900 leading-tight line-clamp-1 italic uppercase tracking-tighter">{item.product.title}</div>
                                                <div className="text-sm font-black text-[#D25026] mt-0.5">{formatRupiah(item.product.price)}</div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4 bg-white rounded-xl px-3 py-1.5 border border-neutral-100 shadow-sm">
                                                    <button 
                                                        onClick={() => updateQuantity(item.product.id, -1)} 
                                                        className="w-4 h-4 flex items-center justify-center hover:bg-neutral-100 rounded-full transition-colors text-neutral-400 font-bold"
                                                    >-</button>
                                                    <span className="text-[13px] font-black w-4 text-center">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.product.id, 1)} 
                                                        className="w-4 h-4 flex items-center justify-center hover:bg-neutral-100 rounded-full transition-colors text-neutral-400 font-bold"
                                                    >+</button>
                                                </div>
                                                <button 
                                                    onClick={() => removeFromCart(item.product.id)} 
                                                    className="w-10 h-10 flex items-center justify-center text-neutral-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="p-5 border-t border-neutral-50 bg-[#FAFAFA]/50 flex flex-col gap-3 flex-none">
                        <div className="w-full space-y-1.5 px-1">
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400 font-black text-[10px] uppercase tracking-widest italic">Subtotal</span>
                                <span className="font-bold text-neutral-600 text-sm">{formatRupiah(subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-1.5 border-t border-neutral-100">
                                <span className="text-neutral-900 font-black text-lg uppercase italic tracking-tighter">Total Amount</span>
                                <span className="font-black text-neutral-900 text-2xl tracking-tighter">{formatRupiah(subtotal)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-neutral-100 shadow-sm group-focus-within:ring-2 ring-neutral-100 transition-all">
                            <div className="flex flex-col flex-1">
                                <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic leading-none mb-1">Uang Diterima</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-neutral-300">Rp</span>
                                    <input 
                                        type="number" 
                                        value={uangDiterima}
                                        onChange={(e) => setUangDiterima(e.target.value)}
                                        placeholder="0"
                                        className="w-full bg-transparent border-none p-0 text-base font-black text-neutral-900 focus:outline-none placeholder:text-neutral-100"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button 
                            onClick={handleCheckout}
                            className="w-full h-12 rounded-2xl text-[14px] font-black uppercase tracking-tighter shadow-lg shadow-black/5 hover:shadow-black/10 transition-all active:scale-95 disabled:grayscale"
                            disabled={cart.length === 0}
                        >
                            <CreditCard className="w-4 h-4 mr-2" />
                            PURCHASE ORDER
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
