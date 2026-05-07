import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Trash2, ShoppingCart, Filter, CreditCard, Upload, User, Hash, Ruler, FileText, CheckCircle2, ChevronLeft, Plus, Minus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useCart } from "~/context/CartContext";
import { CardProduct } from "~/components/template/CardProduct";
import { Card, CardHeader, CardContent, CardFooter, CardDescription } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerTrigger } from "~/components/ui/drawer";
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
    }
];

export function CustomJerseyMobile({ title }: { title: string }) {
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
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-['Inter']">
            {/* Header */}
            <div className="bg-white px-6 pt-12 pb-6 flex flex-col gap-4 border-b border-neutral-100 sticky top-0 z-20">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-neutral-900 tracking-tighter italic uppercase">{title}</h1>
                        <p className="text-neutral-400 text-xs font-medium">Custom Jersey Shop</p>
                    </div>
                    <div className="relative">
                        <div className="bg-[#D25026] text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-[#D25026]/20 ring-4 ring-[#D25026]/5">
                            <ShoppingCart size={20} />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white animate-in zoom-in duration-300">
                                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input 
                        type="text"
                        placeholder="Cari model jersey..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D25026]/5 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* Catalog Grid */}
            <div className="p-6 pb-32 flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 gap-6">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-neutral-100 flex gap-4 group">
                            <div className="w-32 h-32 rounded-2xl bg-neutral-50 overflow-hidden shrink-0 relative p-2 flex items-center justify-center">
                                <img src={product.image} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <h3 className="font-black text-neutral-900 italic uppercase tracking-tighter leading-tight text-lg">{product.title}</h3>
                                    <p className="text-[#D25026] font-black text-lg mt-1">{formatRupiah(product.price)}</p>
                                </div>
                                <Button 
                                    onClick={() => addToCart(product as any)}
                                    className="w-full h-10 rounded-xl bg-neutral-900 text-white text-xs font-black uppercase tracking-widest italic"
                                >
                                    <Plus size={14} className="mr-2" /> Select
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sticky Bottom Bar */}
            {cart.length > 0 && (
                <div className="fixed bottom-0 inset-x-0 bg-white border-t border-neutral-100 p-6 flex items-center justify-between shadow-[0_-20px_40px_rgba(0,0,0,0.05)] z-30 rounded-t-[2.5rem] animate-in slide-in-from-bottom-full duration-500">
                    <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">Total Estimasi</p>
                        <p className="text-xl font-black text-neutral-900 tracking-tighter">{formatRupiah(subtotal)}</p>
                    </div>
                    <Button 
                        onClick={handleCheckout}
                        className="bg-[#D25026] text-white px-8 h-12 rounded-2xl font-black uppercase tracking-tighter text-sm italic shadow-lg shadow-[#D25026]/20 active:scale-95 transition-all"
                    >
                        Checkout Order
                    </Button>
                </div>
            )}

        </div>
    );
}
