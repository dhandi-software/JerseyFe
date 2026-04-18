import { Search, Heart, User, ShoppingCart, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { products } from "~/data/catalog";
import { useCart } from "~/context/CartContext";
import { cn } from "~/lib/utils";

export function NavbarDesktop() {
    const { totalCount, cart, subtotal } = useCart();
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const wishlistRef = useRef<HTMLDivElement>(null);
    const cartRef = useRef<HTMLDivElement>(null);

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
                console.error("Failed to load wishlist in Navbar", e);
            }
        }

        const handleWishlistUpdate = (e: any) => {
            setWishlist(e.detail);
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (wishlistRef.current && !wishlistRef.current.contains(event.target as Node)) {
                setIsWishlistOpen(false);
            }
            if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
                setIsCartOpen(false);
            }
        };

        window.addEventListener('wishlist_update', handleWishlistUpdate);
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            window.removeEventListener('wishlist_update', handleWishlistUpdate);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="w-full px-[1.85rem] py-[1rem] bg-white border-b border-black/5 flex justify-between items-center font-['Inter'] shadow-sm sticky top-0 z-[100]">
            {/* Logo Section */}
            <div className="flex items-center gap-[0.75rem] shrink-0">
                <img src="/images/FSCV.jpeg" alt="FSCV Logo" className="h-[2.5rem] w-auto rounded-md shadow-sm" />
                <div className="text-neutral-900 text-[1.25rem] font-black leading-none tracking-tight">ECOMMERCE</div>
            </div>

            {/* Center Section: Search & Links */}
            <div className="flex-1 flex justify-center items-center gap-[2rem] px-4">
                {/* Search Bar */}
                <div className="w-full max-w-[20rem] h-[2.5rem] px-[1.25rem] rounded-full border border-neutral-200 flex justify-between items-center bg-neutral-50 shadow-inner hover:bg-neutral-100 transition-colors focus-within:ring-2 focus-within:ring-neutral-200">
                    <input 
                        type="text" 
                        placeholder="Search here..." 
                        className="bg-transparent border-none outline-none w-full text-neutral-700 text-[0.875rem] font-medium placeholder:text-neutral-400"
                    />
                    <Search className="w-[1.1rem] h-[1.1rem] text-neutral-400" />
                </div>

                {/* Primary Links */}
                <div className="flex items-center gap-[1.5rem]">
                    <Link to="/category" className="flex items-center gap-1 cursor-pointer group">
                        <span className="text-neutral-600 group-hover:text-black text-[0.9375rem] font-semibold transition-colors">All Category</span>
                        <ChevronDown className="w-[1rem] h-[1rem] text-neutral-400 group-hover:text-black transition-colors" />
                    </Link>
                    <div className="flex items-center cursor-pointer group">
                        <span className="text-neutral-600 group-hover:text-black text-[0.9375rem] font-semibold transition-colors">About Us</span>
                    </div>
                    <div className="flex items-center cursor-pointer group">
                        <span className="text-neutral-600 group-hover:text-black text-[0.9375rem] font-semibold transition-colors">Visi Misi Perusahaan</span>
                    </div>
                    <div className="flex items-center cursor-pointer group">
                        <span className="text-neutral-600 group-hover:text-black text-[0.9375rem] font-semibold transition-colors">Tracking Pemesanan</span>
                    </div>
                </div>
            </div>

            {/* Right Section: Icons */}
            <div className="flex items-center gap-[1.5rem] shrink-0">
                <div 
                    ref={wishlistRef}
                    className="relative p-2 hover:bg-neutral-100 rounded-full cursor-pointer transition-colors group"
                    onClick={() => setIsWishlistOpen(!isWishlistOpen)}
                >
                    <Heart className={`w-[1.25rem] h-[1.25rem] transition-colors ${isWishlistOpen ? "text-red-500 fill-red-500" : "text-neutral-700"}`} />
                    {wishlist.length > 0 && (
                        <>
                            <div className="absolute -top-1 -right-1 w-[1.1rem] h-[1.1rem] bg-red-500 rounded-full flex items-center justify-center text-[0.6rem] text-white font-bold border-2 border-white box-content">
                                {wishlist.length}
                            </div>
                            
                            {/* Wishlist Dropdown */}
                            {isWishlistOpen && (
                                <div 
                                    className="absolute top-full right-0 mt-2 w-[20rem] bg-white border border-neutral-100 rounded-[1rem] shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="px-4 py-3 bg-neutral-50/50 border-b border-neutral-100">
                                        <span className="text-neutral-900 text-sm font-bold lowercase first-letter:uppercase italic font-serif">Wishlist Collections ({wishlist.length})</span>
                                    </div>
                                    <div className="max-h-[24rem] overflow-y-auto">
                                        {wishlist.map((item) => (
                                            <div key={item.id} className="flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-none">
                                                <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden shrink-0">
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-neutral-900 text-xs font-bold truncate">{item.title}</div>
                                                    <div className="text-neutral-500 text-[10px] font-medium">{item.price}</div>
                                                </div>
                                                <button className="text-red-500 hover:text-red-600 p-1">
                                                    <Heart className="w-3.5 h-3.5 fill-current" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 bg-neutral-50/50">
                                        <Button className="w-full h-10 bg-neutral-900 border-none hover:bg-neutral-800 text-white text-[10px] font-bold rounded-full transition-colors drop-shadow-md">
                                            VIEW ALL COLLECTIONS
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <Link to="/login" className="p-2 hover:bg-neutral-100 rounded-full cursor-pointer transition-colors">
                    <User className="w-[1.25rem] h-[1.25rem] text-neutral-700" />
                </Link>

                <div 
                    ref={cartRef}
                    className="relative p-2 hover:bg-neutral-100 rounded-full cursor-pointer transition-colors group"
                    onClick={() => setIsCartOpen(!isCartOpen)}
                >
                    <ShoppingCart className={cn("w-[1.25rem] h-[1.25rem] transition-colors", isCartOpen ? "text-neutral-900" : "text-neutral-700")} />
                    <div className="absolute -top-1 -right-1 w-[1.1rem] h-[1.1rem] bg-black rounded-full flex items-center justify-center text-[0.6rem] text-white font-bold border-2 border-white box-content">
                        {totalCount}
                    </div>

                    {/* Cart Dropdown */}
                    {isCartOpen && (
                        <div 
                            className="absolute top-full right-0 mt-2 w-[22rem] bg-white border border-neutral-100 rounded-[1rem] shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="px-4 py-3 bg-neutral-50/50 border-b border-neutral-100 flex justify-between items-center">
                                <span className="text-neutral-900 text-sm font-bold">Keranjang Belanja ({totalCount})</span>
                                <span className="text-neutral-900 text-sm font-black">{formatRupiah(subtotal)}</span>
                            </div>
                            <div className="max-h-[24rem] overflow-y-auto">
                                {cart.length > 0 ? (
                                    cart.map((item) => (
                                        <div key={item.product.id} className="flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-none">
                                            <div className="w-14 h-14 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-100">
                                                <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-neutral-900 text-[13px] font-bold truncate">{item.product.title}</div>
                                                <div className="text-neutral-500 text-[11px] font-medium mt-0.5">
                                                    {item.quantity} x {formatRupiah(item.product.price)}
                                                </div>
                                            </div>
                                            <div className="text-neutral-900 text-[13px] font-bold">
                                                {formatRupiah(item.product.price * item.quantity)}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-neutral-400 text-sm">Keranjang kosong</div>
                                )}
                            </div>
                            <div className="p-4 bg-neutral-50/50 flex gap-2">
                                <Link to="/category" className="flex-1">
                                    <Button className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white text-[12px] font-bold rounded-xl transition-all shadow-sm">
                                        PROSES CHECKOUT
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
