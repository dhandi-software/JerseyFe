import { Link, useLocation, useNavigate } from "react-router";
import { ShoppingCart, Menu, Search, Heart, User, X, Home, Shirt, Compass, Info, HelpCircle, PhoneCall, ChevronRight, LogIn, ExternalLink } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useState, useEffect } from "react";
import { products } from "~/data/catalog";
import { useCart } from "~/context/CartContext";
import { useAuth } from "~/context/AuthContext";
import { adminApi } from "~/api/admin";
import { UPLOADS_URL } from "~/api/client";

export default function HeaderMobile() {
    const { totalCount, cart, subtotal } = useCart();
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [wishlist, setWishlist] = useState<any[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    // Close drawers when route changes
    useEffect(() => {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setIsWishlistOpen(false);
        setIsCartOpen(false);
    }, [location.pathname]);

    // Prevent background scrolling when drawer/modal is open
    useEffect(() => {
        if (isMenuOpen || isSearchOpen || isWishlistOpen || isCartOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMenuOpen, isSearchOpen, isWishlistOpen, isCartOpen]);

    useEffect(() => {
        const loadWishlist = async () => {
            let allProducts = [...products];
            try {
                const res = await adminApi.getBahanBaju();
                if (res.status === "success" && Array.isArray(res.data)) {
                    const dynamicMapped = res.data.map((bahan: any) => ({
                        id: bahan.id,
                        title: bahan.nama,
                        price: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(bahan.harga || 0),
                        image: bahan.imageUrl ? `${UPLOADS_URL}${bahan.imageUrl}` : "/images/mockup-jersey.jpg"
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
                    console.error("Failed to load wishlist in HeaderMobile", e);
                }
            }
        };

        loadWishlist();

        const handleWishlistUpdate = (e: any) => {
            setWishlist(e.detail);
        };
        window.addEventListener('wishlist_update', handleWishlistUpdate);
        return () => window.removeEventListener('wishlist_update', handleWishlistUpdate);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/category?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery("");
        }
    };

    const navItems = [
        { label: "Beranda", href: "/", icon: Home },
        { label: "Koleksi Jersey", href: "/category", icon: Shirt },
        { label: "Lacak Pesanan", href: "/tracking", icon: Compass },
        { label: "Tentang Kami", href: "/about", icon: Info },
        { label: "Visi & Misi", href: "/visi-misi", icon: Compass },
        { label: "Bantuan & FAQ", href: "/faq", icon: HelpCircle },
        { label: "Hubungi Kami", href: "/contact", icon: PhoneCall },
    ];

    return (
        <>
            {/* Top Navigation Bar */}
            <header className="w-full h-15 bg-white border-b border-neutral-100 px-3 flex items-center justify-between font-sans shadow-2xs">
                {/* Left: Hamburger & Brand */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        aria-label="Buka Menu Navigasi"
                        onClick={() => setIsMenuOpen(true)}
                        className="w-10 h-10 flex items-center justify-center text-neutral-800 hover:bg-neutral-100 rounded-xl transition-colors active:scale-95 cursor-pointer"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <Link to="/" className="flex items-center gap-2 py-1">
                        <div className="w-7 h-7 rounded-lg bg-neutral-900 p-1 flex items-center justify-center shrink-0 shadow-xs">
                            <img
                                src="/images/FCSV.png"
                                alt="FCSV"
                                className="h-4.5 w-auto object-contain"
                            />
                        </div>
                        <span className="text-base font-black text-neutral-900 tracking-tight uppercase leading-none">
                            FCSV
                        </span>
                    </Link>
                </div>

                {/* Right: Search, Wishlist, Cart */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        aria-label="Cari Jersey"
                        onClick={() => setIsSearchOpen(true)}
                        className="w-10 h-10 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors active:scale-95 cursor-pointer"
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    <button
                        type="button"
                        aria-label="Wishlist"
                        onClick={() => setIsWishlistOpen(true)}
                        className="w-10 h-10 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors relative active:scale-95 cursor-pointer"
                    >
                        <Heart className={cn("w-5 h-5 transition-colors", wishlist.length > 0 && "text-red-500 fill-red-500")} />
                        {wishlist.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] font-black border-2 border-white">
                                {wishlist.length}
                            </span>
                        )}
                    </button>

                    <button
                        type="button"
                        aria-label="Keranjang Belanja"
                        onClick={() => setIsCartOpen(true)}
                        className="w-10 h-10 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors relative active:scale-95 cursor-pointer"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {totalCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#D25026] text-white rounded-full flex items-center justify-center text-[9px] font-black border-2 border-white">
                                {totalCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* Slide-over Mobile Navigation Drawer */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[100] flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative w-[85vw] max-w-[320px] bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
                        {/* Drawer Header */}
                        <div>
                            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                                <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-neutral-900 p-1 flex items-center justify-center">
                                        <img src="/images/FCSV.png" alt="FCSV" className="h-5 w-auto object-contain" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-neutral-900 uppercase tracking-tight leading-none">FCSV</span>
                                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">Apparel Indonesia</span>
                                    </div>
                                </Link>
                                <button
                                    type="button"
                                    aria-label="Tutup Menu"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-9 h-9 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* User Profile Card */}
                            <div className="p-4 bg-neutral-50/80 border-b border-neutral-100">
                                {isAuthenticated && user ? (
                                    <Link
                                        to={user.role === "admin" ? "/admin/dashboard" : "/customer/profile"}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-neutral-200/60 shadow-2xs"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-9 h-9 rounded-full bg-neutral-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                                                {user.username?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-neutral-900 truncate">{user.username}</p>
                                                <p className="text-[10px] text-neutral-400 capitalize">{user.role || "Pelanggan"}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-neutral-400" />
                                    </Link>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-neutral-900 text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        <span>Masuk / Daftar Akun</span>
                                    </Link>
                                )}
                            </div>

                            {/* Navigation List */}
                            <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={cn(
                                                "w-full min-h-[46px] px-3.5 rounded-xl flex items-center justify-between text-xs font-bold transition-all cursor-pointer",
                                                isActive
                                                    ? "bg-[#D25026]/10 text-[#D25026] shadow-2xs font-extrabold"
                                                    : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-[#D25026]" : "text-neutral-400")} />
                                                <span>{item.label}</span>
                                            </div>
                                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#D25026]" />}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Drawer Bottom Actions */}
                        <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 space-y-2">
                            <Link
                                to="/customer/custom-jersey"
                                onClick={() => setIsMenuOpen(false)}
                                className="w-full h-11 bg-[#D25026] hover:bg-[#B3411A] text-white rounded-xl font-black text-xs uppercase italic tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                            >
                                <Shirt className="w-4 h-4" />
                                <span>Pesan Custom Jersey</span>
                            </Link>

                            <a
                                href="https://wa.me/6285892720034?text=Halo%20FCSV,%20saya%20ingin%20konsultasi%20jersey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-95"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Chat WhatsApp Admin</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Search Overlay */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in duration-200">
                    <div className="p-4 border-b border-neutral-100 flex items-center gap-3">
                        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input
                                autoFocus
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari bahan atau model jersey..."
                                className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 border border-neutral-200/60 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D25026]/20 focus:border-[#D25026] text-neutral-900"
                            />
                        </form>
                        <button
                            type="button"
                            onClick={() => setIsSearchOpen(false)}
                            className="text-xs font-bold text-neutral-500 hover:text-neutral-900 px-2 py-2"
                        >
                            Batal
                        </button>
                    </div>

                    <div className="p-4 space-y-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                            Pencarian Populer
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {["Dri-Fit Premium", "Polyester Cool-Tech", "Hyper Mesh", "Koleksi Jersey"].map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => {
                                        navigate(`/category?q=${encodeURIComponent(tag)}`);
                                        setIsSearchOpen(false);
                                    }}
                                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-medium text-neutral-700 transition-colors"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Wishlist Modal */}
            {isWishlistOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200" onClick={() => setIsWishlistOpen(false)}>
                    <div
                        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-5 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-900 text-white">
                            <span className="text-xs font-bold uppercase tracking-wider">Wishlist ({wishlist.length})</span>
                            <button onClick={() => setIsWishlistOpen(false)} className="text-white/70 hover:text-white p-1">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto divide-y divide-neutral-100 flex-1">
                            {wishlist.length > 0 ? (
                                wishlist.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                        <div className="w-14 h-14 rounded-xl bg-neutral-100 overflow-hidden shrink-0">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-neutral-900 text-xs font-bold truncate leading-tight">{item.title}</div>
                                            <div className="text-[#D25026] text-xs font-bold mt-0.5">{item.price}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center text-neutral-400 text-xs">Wishlist Anda masih kosong</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Cart Modal */}
            {isCartOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200" onClick={() => setIsCartOpen(false)}>
                    <div
                        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-5 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-900 text-white">
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4 text-[#D25026]" />
                                <span className="text-xs font-bold uppercase tracking-wider">Keranjang ({totalCount})</span>
                            </div>
                            <button onClick={() => setIsCartOpen(false)} className="text-white/70 hover:text-white p-1">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto divide-y divide-neutral-100 flex-1">
                            {cart.length > 0 ? (
                                cart.map((item) => (
                                    <div key={item.product.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                        <div className="w-14 h-14 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-100">
                                            <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-neutral-900 text-xs font-bold truncate leading-tight">{item.product.title}</div>
                                            <div className="text-neutral-500 text-[11px] font-medium mt-0.5">
                                                {item.quantity} x {formatRupiah(item.product.price)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center text-neutral-400 text-xs">Keranjang Anda masih kosong</div>
                            )}
                        </div>
                        {cart.length > 0 && (
                            <div className="p-4 bg-neutral-50 border-t border-neutral-100 space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-neutral-500">Subtotal</span>
                                    <span className="font-black text-neutral-900 text-sm">{formatRupiah(subtotal)}</span>
                                </div>
                                <Link to="/category" onClick={() => setIsCartOpen(false)}>
                                    <Button className="w-full h-11 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer">
                                        LIHAT KERANJANG LENGKAP
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
