import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { adminApi } from "~/api/admin";
import { UPLOADS_URL } from "~/api/client";

export function InfoSection() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<number[]>([]);

    useEffect(() => {
        adminApi.getBahanBaju().then(res => {
            if (res.status === "success") {
                const mapped = res.data.map((bahan: any) => ({
                    id: bahan.id,
                    title: bahan.nama,
                    price: bahan.harga || 150000,
                    image: bahan.imageUrl ? `${UPLOADS_URL}${bahan.imageUrl}` : "https://via.placeholder.com/300?text=No+Image",
                    description: bahan.deskripsi
                }));
                setProducts(mapped);

                // Load favorites from localStorage and match
                const stored = localStorage.getItem("wishlist_ids");
                if (stored) {
                    try {
                        const ids = JSON.parse(stored);
                        setFavorites(ids);
                        const favoriteProducts = ids.map((id: number) => mapped.find(p => p.id === id)).filter(Boolean);
                        window.dispatchEvent(new CustomEvent('wishlist_update', { detail: favoriteProducts }));
                    } catch (e) {
                        console.error("Failed to parse wishlist from localStorage", e);
                    }
                }
            }
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const toggleFavorite = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newFavs = favorites.includes(id) 
            ? favorites.filter(favId => favId !== id)
            : [...favorites, id];
        
        setFavorites(newFavs);
        localStorage.setItem("wishlist_ids", JSON.stringify(newFavs));
        
        const favoriteProducts = newFavs.map(favId => products.find(p => p.id === favId)).filter(Boolean);
        window.dispatchEvent(new CustomEvent('wishlist_update', { detail: favoriteProducts }));
    };

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    return (
        <section className="w-full flex justify-center py-16 px-[1.85rem] font-['Inter']">
            <div className="flex flex-col justify-start items-center gap-1 w-full max-w-[1240px]">
                <div className="self-stretch flex flex-col justify-start items-start gap-1 w-full">
                    <div className="w-full py-6 border-t-[0.49px] border-black/10 flex flex-col justify-start items-start gap-6">
                        {/* Header & Filters */}
                        <div className="self-stretch flex justify-between items-center flex-wrap gap-4">
                            <div className="justify-start text-neutral-900 text-[1.5rem] font-bold leading-none tracking-tight">Trending</div>
                            <div className="flex justify-start items-center gap-[0.5rem] flex-wrap">
                                {["SHORTS", "HAT", "JACKETS"].map(cat => (
                                    <div key={cat} className="px-[1rem] py-[0.5rem] rounded-full outline outline-[0.49px] outline-offset-[-0.49px] outline-neutral-200 flex justify-center items-center cursor-pointer hover:bg-neutral-50 transition-colors">
                                        <div className="text-center justify-start text-neutral-900/80 text-[0.75rem] font-bold tracking-widest">{cat}</div>
                                    </div>
                                ))}
                                <div className="px-[1rem] py-[0.5rem] bg-neutral-900 rounded-full outline outline-[0.49px] outline-offset-[-0.49px] flex justify-center items-center cursor-pointer">
                                    <div className="text-center justify-start text-white text-[0.75rem] font-bold tracking-widest">SHOES</div>
                                </div>
                                <div className="px-[1rem] py-[0.5rem] rounded-full outline outline-[0.49px] outline-offset-[-0.49px] outline-neutral-200 flex justify-center items-center cursor-pointer hover:bg-neutral-50 transition-colors">
                                    <div className="text-center justify-start text-neutral-900/80 text-[0.75rem] font-bold tracking-widest">T-SHIRT</div>
                                </div>
                            </div>
                        </div>

                        {/* Grid Produk */}
                        {loading ? (
                            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="aspect-[4/5] bg-neutral-100 rounded-[2.5rem] animate-pulse"></div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
                                {products.map((product) => (
                                    <motion.div 
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        onClick={() => navigate(`/product/${product.id}`)}
                                        className="flex flex-col gap-4 group cursor-pointer w-full"
                                    >
                                        <div className="relative aspect-[4/5] rounded-[2.5rem] bg-neutral-50 overflow-hidden shadow-sm ring-1 ring-black/5">
                                            <img 
                                                src={product.image} 
                                                alt={product.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            {/* Favorit button */}
                                            <div 
                                                onClick={(e) => toggleFavorite(product.id, e)}
                                                className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full overflow-hidden transition-all z-10 shadow-sm ${
                                                    favorites.includes(product.id) ? "bg-red-500 shadow-red-200" : "bg-neutral-900/20 backdrop-blur-md hover:bg-neutral-900/40"
                                                }`}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill={favorites.includes(product.id) ? "white" : "white"} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5 px-3">
                                            <div className="text-neutral-900 text-[1.125rem] font-bold leading-tight tracking-tight hover:text-[#D25026] transition-colors">{product.title}</div>
                                            <div className="text-neutral-500 text-[0.95rem] font-semibold">{formatRupiah(product.price)}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full py-16 text-center text-neutral-400 font-medium italic">
                                Belum ada bahan baju tersedia
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
