import { Link } from "react-router";
import { ShoppingCart, Menu, Search, Heart, User } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useState, useEffect } from "react";
import { products } from "~/data/catalog";
import { useCart } from "~/context/CartContext";

export default function HeaderMobile() {
    const { totalCount, cart, subtotal } = useCart();
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    useEffect(() => {
        // Initial load from localStorage on mount
        const stored = localStorage.getItem("wishlist_ids");
        if (stored) {
            try {
                const ids = JSON.parse(stored);
                const favoriteProducts = ids.map((id: number) => products.find(p => p.id === id)).filter(Boolean);
                setWishlist(favoriteProducts);
            } catch (e) {
                console.error("Failed to load wishlist in HeaderMobile", e);
            }
        }

        const handleWishlistUpdate = (e: any) => {
            setWishlist(e.detail);
        };
        window.addEventListener('wishlist_update', handleWishlistUpdate);
        return () => window.removeEventListener('wishlist_update', handleWishlistUpdate);
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-neutral-100 px-4 h-16 flex items-center justify-between font-['Inter']">
            <div className="flex items-center gap-4 shrink-0">
                <Button variant="ghost" size="icon" className="text-slate-700 -ml-2">
                    <Menu className="w-6 h-6" />
                </Button>
                <Search className="w-5 h-5 text-slate-700" />
            </div>

            <Link to="/" className="flex items-center gap-2 max-w-[50%] justify-center">
                 <img
                    src="/images/FSCV.jpeg"
                    alt="Logo FSCV"
                    className="h-8 md:h-10 w-auto rounded-sm"
                />
                <span className="text-[1rem] md:text-[1.125rem] font-black text-black tracking-tighter uppercase whitespace-nowrap leading-tight">ECOMMERCE</span>
            </Link>

            <div className="flex items-center shrink-0">
                <Link to="/login" className="p-2">
                    <User className="w-5 h-5 text-slate-700" />
                </Link>

                <div className="relative p-2">
                    <button 
                        onClick={() => setIsWishlistOpen(!isWishlistOpen)}
                        className="relative"
                    >
                        <Heart className={cn("w-5 h-5 transition-colors", isWishlistOpen ? "text-red-500 fill-red-500" : "text-slate-700")} />
                        {wishlist.length > 0 && (
                            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[0.61rem] text-white font-black border-2 border-white box-content">
                                {wishlist.length}
                            </div>
                        )}
                    </button>

                    {/* Mobile Wishlist Modal */}
                    {isWishlistOpen && (
                        <div className="fixed inset-0 bg-black/20 z-[100]" onClick={() => setIsWishlistOpen(false)}>
                            <div className="absolute top-16 right-4 w-[85vw] max-w-[20rem] bg-white border border-neutral-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right" onClick={(e) => e.stopPropagation()}>
                                <div className="px-4 py-3 bg-neutral-900 flex justify-between items-center">
                                    <span className="text-white text-xs font-bold uppercase tracking-wider">Wishlist ({wishlist.length})</span>
                                    <button onClick={() => setIsWishlistOpen(false)} className="text-white/60 hover:text-white">
                                        <Menu className="w-4 h-4 rotate-45" />
                                    </button>
                                </div>
                                <div className="max-h-[60vh] overflow-y-auto">
                                    {wishlist.length > 0 ? (
                                        wishlist.map((item) => (
                                            <div key={item.id} className="flex items-center gap-3 p-4 border-b border-neutral-50 last:border-none">
                                                <div className="w-14 h-14 rounded-xl bg-neutral-100 overflow-hidden shrink-0">
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-neutral-900 text-[13px] font-bold truncate leading-tight">{item.title}</div>
                                                    <div className="text-neutral-500 text-[11px] font-medium mt-0.5">{item.price}</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-neutral-400 text-xs">Your wishlist is empty</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative p-2">
                    <button 
                        onClick={() => setIsCartOpen(!isCartOpen)}
                        className="relative"
                    >
                        <ShoppingCart className={cn("w-5 h-5 transition-colors", isCartOpen ? "text-neutral-900" : "text-slate-700")} />
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-black rounded-full flex items-center justify-center text-[0.61rem] text-white font-black border-2 border-white box-content">
                            {totalCount}
                        </div>
                    </button>

                    {/* Mobile Cart Modal */}
                    {isCartOpen && (
                        <div className="fixed inset-0 bg-black/20 z-[100]" onClick={() => setIsCartOpen(false)}>
                            <div className="absolute top-16 right-4 w-[85vw] max-w-[20rem] bg-white border border-neutral-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right" onClick={(e) => e.stopPropagation()}>
                                <div className="px-4 py-3 bg-neutral-50/50 border-b border-neutral-100 flex justify-between items-center">
                                    <span className="text-neutral-900 text-xs font-bold uppercase tracking-wider">Cart ({totalCount})</span>
                                    <span className="text-neutral-900 text-xs font-black">{formatRupiah(subtotal)}</span>
                                </div>
                                <div className="max-h-[60vh] overflow-y-auto">
                                    {cart.length > 0 ? (
                                        cart.map((item) => (
                                            <div key={item.product.id} className="flex items-center gap-3 p-4 border-b border-neutral-50 last:border-none">
                                                <div className="w-14 h-14 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-100">
                                                    <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-neutral-900 text-[13px] font-bold truncate leading-tight">{item.product.title}</div>
                                                    <div className="text-neutral-500 text-[11px] font-medium mt-0.5">
                                                        {item.quantity} x {formatRupiah(item.product.price)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-neutral-400 text-xs">Keranjang kosong</div>
                                    )}
                                </div>
                                <div className="p-4 bg-neutral-50/50 border-t border-neutral-100">
                                    <Link to="/category" onClick={() => setIsCartOpen(false)}>
                                        <Button className="w-full h-10 bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-bold rounded-xl shadow-sm">
                                            VIEW CART
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
