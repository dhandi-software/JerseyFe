import { Link } from "react-router";
import { Search, Heart, User, ShoppingCart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { products } from "~/data/catalog";
import { useCart } from "~/context/CartContext";
import { cn } from "~/lib/utils";
import { adminApi } from "~/api/admin";
import { UPLOADS_URL } from "~/api/client";

export default function HeaderDesktop() {
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
        const loadWishlist = async () => {
            let allProducts = [...products];
            try {
                const res = await adminApi.getBahanBaju();
                if (res.status === "success") {
                    const dynamicMapped = res.data.map((bahan: any) => ({
                        id: bahan.id,
                        title: bahan.nama,
                        price: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(bahan.harga || 150000),
                        image: bahan.imageUrl ? `${UPLOADS_URL}${bahan.imageUrl}` : "https://via.placeholder.com/300?text=No+Image"
                    }));
                    allProducts = [...allProducts, ...dynamicMapped];
                }
            } catch (err) {
                console.error("Failed to fetch dynamic materials for wishlist", err);
            }

            const stored = localStorage.getItem("wishlist_ids");
            if (stored) {
                try {
                    const ids = JSON.parse(stored);
                    const favoriteProducts = ids.map((id: number) => allProducts.find(p => p.id === id)).filter(Boolean);
                    setWishlist(favoriteProducts);
                } catch (e) {
                    console.error("Failed to load wishlist in HeaderDesktop", e);
                }
            }
        };

        loadWishlist();

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
        <header className="w-full h-20 bg-white border-b border-neutral-100 flex items-center justify-between px-[1.85rem] font-['Inter']">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
                <div className="bg-slate-900 p-2 rounded-xl shadow-lg flex items-center justify-center transition-transform group-hover:scale-105">
                    <img src="/images/FSCV.png" alt="FSCV Logo" className="h-8 w-auto" />
                </div>
                <div className="flex flex-col">
                    <span className="text-neutral-900 text-[1.25rem] font-black leading-none tracking-tight">FSCV</span>
                    <span className="text-neutral-400 text-[0.65rem] font-bold tracking-[0.2em] uppercase mt-1">Custom Jersey</span>
                </div>
            </Link>

            {/* Search Section */}
            <div className="flex-1 max-w-[32rem] px-8">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-neutral-400 group-focus-within:text-[#D25026] transition-colors" />
                    </div>
                    <input 
                        suppressHydrationWarning
                        type="text" 
                        placeholder="Cari desain jersey impianmu..." 
                        className="w-full h-11 pl-11 pr-4 bg-neutral-50 border border-neutral-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D25026]/20 focus:border-[#D25026] transition-all"
                    />
                </div>
            </div>

            {/* Icons Section */}
            <div className="flex items-center gap-2 shrink-0">
                {/* Wishlist */}
                <div ref={wishlistRef} className="relative">
                    <button 
                        onClick={() => setIsWishlistOpen(!isWishlistOpen)}
                        className={cn(
                            "p-3 rounded-full transition-all hover:bg-neutral-50",
                            isWishlistOpen ? "bg-neutral-50 text-red-500" : "text-neutral-600"
                        )}
                    >
                        <Heart className={cn("w-5 h-5", isWishlistOpen && "fill-current")} />
                        {wishlist.length > 0 && (
                            <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold border-2 border-white">
                                {wishlist.length}
                            </span>
                        )}
                    </button>

                    {isWishlistOpen && (
                        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-neutral-100 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                            <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-100 flex justify-between items-center">
                                <span className="text-neutral-900 text-xs font-bold uppercase tracking-wider">Wishlist ({wishlist.length})</span>
                                <Link to="/wishlist" className="text-[10px] font-bold text-[#D25026] hover:underline">LIHAT SEMUA</Link>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {wishlist.length > 0 ? (
                                    wishlist.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-none">
                                            <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-100">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-neutral-900 text-xs font-bold truncate leading-tight">{item.title}</div>
                                                <div className="text-neutral-500 text-[10px] font-medium mt-1">{item.price}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-neutral-400 text-xs italic">Belum ada item favorit</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User */}
                <Link to="/login" className="p-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-full transition-all">
                    <User className="w-5 h-5" />
                </Link>

                {/* Cart */}
                <div ref={cartRef} className="relative ml-1">
                    <button 
                        onClick={() => setIsCartOpen(!isCartOpen)}
                        className={cn(
                            "flex items-center gap-3 px-4 h-11 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-all shadow-md active:scale-95",
                            isCartOpen && "ring-2 ring-neutral-900 ring-offset-2"
                        )}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-wider">{totalCount} ITEM</span>
                        <div className="w-px h-4 bg-white/20" />
                        <span className="text-xs font-bold">{formatRupiah(subtotal)}</span>
                    </button>

                    {isCartOpen && (
                        <div className="absolute top-full right-0 mt-2 w-96 bg-white border border-neutral-100 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                            <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-100 flex justify-between items-center">
                                <span className="text-neutral-900 text-xs font-bold uppercase tracking-wider">Keranjang ({totalCount})</span>
                                <span className="text-neutral-900 text-xs font-black">{formatRupiah(subtotal)}</span>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {cart.length > 0 ? (
                                    cart.map((item) => (
                                        <div key={item.product.id} className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-none">
                                            <div className="w-14 h-14 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-100">
                                                <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-neutral-900 text-xs font-bold truncate leading-tight">{item.product.title}</div>
                                                <div className="text-neutral-500 text-[10px] font-medium mt-1">
                                                    {item.quantity} x {formatRupiah(item.product.price)}
                                                </div>
                                            </div>
                                            <div className="text-neutral-900 text-xs font-black">
                                                {formatRupiah(item.product.price * item.quantity)}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-neutral-400 text-xs italic">Keranjang belanja kosong</div>
                                )}
                            </div>
                            <div className="p-4 bg-neutral-50 border-t border-neutral-100">
                                <Link to="/category" onClick={() => setIsCartOpen(false)}>
                                    <Button className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow-lg transition-all">
                                        PROSES PEMESANAN
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
