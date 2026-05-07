import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Trash2, ShoppingCart, Filter, CreditCard, Upload, User, Hash, Ruler, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useCart } from "~/context/CartContext";
import { CardProduct } from "~/components/template/CardProduct";
import { Card, CardHeader, CardContent, CardFooter, CardDescription } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { chatService } from "~/services/chatService";

const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

const jerseyProducts = [
    {
        id: 101,
        title: "Jersey Home 2024",
        category: "Jersey",
        price: 150000,
        stock: 50,
        image: "https://images.unsplash.com/photo-1580087444194-035520a40ca9?q=80&w=1000&auto=format&fit=crop",
    },
    {
        id: 102,
        title: "Jersey Away 2024",
        category: "Jersey",
        price: 150000,
        stock: 50,
        image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=1000&auto=format&fit=crop",
    },
    {
        id: 103,
        title: "Jersey Third Kit",
        category: "Jersey",
        price: 165000,
        stock: 30,
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000&auto=format&fit=crop",
    },
    {
        id: 104,
        title: "Jersey Training",
        category: "Jersey",
        price: 120000,
        stock: 100,
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop",
    },
    {
        id: 105,
        title: "Jersey Goalkeeper Home",
        category: "Jersey",
        price: 175000,
        stock: 20,
        image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=1000&auto=format&fit=crop",
    },
    {
        id: 106,
        title: "Jersey Goalkeeper Away",
        category: "Jersey",
        price: 175000,
        stock: 20,
        image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1000&auto=format&fit=crop",
    }
];

export function CustomJerseyDesktop({ title }: { title: string }) {
    const navigate = useNavigate();
    const { cart, addToCart, removeFromCart, updateQuantity, subtotal } = useCart();
    const [searchQuery, setSearchQuery] = useState("");
    
    const filteredProducts = jerseyProducts.filter(p => {
        return p.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleCheckout = () => {
        if (cart.length === 0) return;
        navigate("/customer/custom-jersey/checkout");
    };

    return (
        <div className="min-h-[calc(100vh-100px)] bg-[#FAFAFA] p-6 md:p-8 font-['Inter'] flex flex-col gap-8 max-w-[1600px] mx-auto w-full">
            {/* Page Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tighter italic uppercase">{title}</h1>
                    <p className="text-neutral-500 text-sm font-medium mt-1">Custom Jersey Professional FSCV</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-neutral-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#D25026] animate-pulse"></div>
                        <span className="text-xs font-bold text-neutral-600">Customizer Active</span>
                    </div>
                </div>
            </div>

            <div className="flex items-start gap-8">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col gap-8">
                    {/* Search */}
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 relative w-full group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-black transition-colors" />
                            <input 
                                type="text"
                                placeholder="Cari Model Jersey..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-neutral-200 transition-all placeholder:text-neutral-300"
                            />
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <CardProduct 
                                    key={product.id} 
                                    product={product as any} 
                                    onAdd={addToCart} 
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-neutral-200 flex flex-col items-center justify-center gap-4">
                                <Filter className="w-12 h-12 text-neutral-200" />
                                <span className="text-neutral-400 font-medium">Model tidak ditemukan</span>
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
                                Your Selection
                            </h2>
                            <div className="bg-neutral-900 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                {cart.length < 10 ? `0${cart.length}` : cart.length} Types
                            </div>
                        </div>
                        <p className="text-neutral-400 text-xs font-medium">Siap untuk dikustomisasi</p>
                    </div>

                    <div className={cn("flex-1 overflow-y-auto min-h-0", cart.length > 2 && "scrollbar-thick")}>
                        <div className="px-6 py-4 flex flex-col gap-4">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center text-center gap-4 opacity-30 pt-16 pb-32">
                                    <div className="p-8 bg-neutral-50 rounded-full border border-neutral-100 shadow-inner">
                                        <ShoppingCart className="w-16 h-16 text-neutral-300" />
                                    </div>
                                    <p className="text-neutral-400 text-[13px] font-black uppercase italic tracking-tighter">Pilih Jersey Terlebih Dahulu</p>
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

                        <Button 
                            onClick={handleCheckout}
                            className="w-full h-12 rounded-2xl text-[14px] font-black bg-[#D25026] hover:bg-[#B34320] text-white uppercase tracking-tighter shadow-lg shadow-[#D25026]/10 transition-all active:scale-95 disabled:grayscale"
                            disabled={cart.length === 0}
                        >
                            <CreditCard className="w-4 h-4 mr-2" />
                            CUSTOMIZE & ORDER
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
}
